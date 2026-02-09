import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  CalendarEvent,
  CalendarView,
  CalendarEventAction,
} from 'angular-calendar';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  startOfDay,
  endOfDay,
} from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { MeetingInfoComponent } from '../meeting-info/meeting-info.component';
import { PublicHolidayInfoComponent } from 'src/app/modules/settings/human-resources/absence/public-holiday-info/public-holiday-info.component';

interface CalendarMappedEvent extends CalendarEvent {
  raw: any;
  type: 'meeting' | 'holiday' | 'leave' | 'birthday';
}

const colors = {
  meeting: { primary: '#1e90ff', secondary: '#D1E8FF' },
  holiday: { primary: '#ad2121', secondary: '#FAE3E3' },
  leave: { primary: '#e3bc08', secondary: '#FDF1BA' },
  birthday: { primary: '#8e44ad', secondary: '#f5e6ff' },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @ViewChild('eventTemplate', { static: true }) eventTemplate: TemplateRef<any>;
  @ViewChild('monthCellTemplate', { static: true }) monthCellTemplate: TemplateRef<any>;
  @ViewChild('weekEventTemplate', { static: true }) weekEventTemplate: TemplateRef<any>;
  @ViewChild('dayEventTemplate', { static: true }) dayEventTemplate: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate = new Date();

  events: CalendarMappedEvent[] = [];
  allEvents: CalendarMappedEvent[] = [];

  refresh = new Subject<void>();
  activeDayIsOpen = false;

  filterForm: FormGroup;

  employeeList: any[] = []; 
  calendarDetails: any; 

  eventFilters = [
    { id: 'meeting', name: 'Meetings', icon: 'alarm' },
    { id: 'holiday', name: 'Holidays', icon: 'building' },
    { id: 'leave', name: 'Leave Days', icon: 'userMinus' },
    { id: 'birthday', name: 'Birthdays', icon: 'wand' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private modal: NgbModal,
    private auth: AuthenticationService,
    private hr: HumanResourcesService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.buildFilterForm();
    this.loadCalendarData();
    this.filterChange();
  }

  buildFilterForm() {
    this.filterForm = this.fb.group({
      selectAll: new FormControl(true),
      eventFilters: new FormArray(
        this.eventFilters.map(() => new FormControl(true))
      ),
    });

    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  }

  async loadCalendarData() {
    const [employeesRes, calendarRes] = await Promise.all([ this.hr.getEmployees().toPromise(), this.hr.getCalendar().toPromise(), ]); 
    this.employeeList = employeesRes.data; 
    this.calendarDetails = calendarRes.data;

    this.allEvents = [
      ...this.mapMeetings(this.calendarDetails.meetings),
      ...this.mapHolidays(this.calendarDetails.holidays),
      ...this.mapLeave(this.calendarDetails.leaveRecords),
      ...this.mapBirthdays(this.calendarDetails.birthdays),
    ];

    this.applyFilters();
  }

  // -----------------------------
  // EVENT MAPPERS
  // -----------------------------

  mapMeetings(list: any[]): CalendarMappedEvent[] {
    return list.map((m) => ({
      title: m.title || 'Meeting',
      start: new Date(m.meetingStartTime),
      end: new Date(m.meetingEndTime),
      color: colors.meeting,
      type: 'meeting',
      raw: m,
    }));
  }

  mapHolidays(list: any[]): CalendarMappedEvent[] {
    return list.map((h) => ({
      title: h.holidayName,
      start: startOfDay(new Date(h.date)),
      end: endOfDay(new Date(h.date)),
      color: colors.holiday,
      allDay: true,
      type: 'holiday',
      raw: h,
    }));
  }

  mapLeave(list: any[]): CalendarMappedEvent[] {
    return list.map((l) => ({
      title: `${l.fullName} - ${l.leaveTypeName}`,
      start: this.parseDMY(l.leaveStartDate),
      end: this.parseDMY(l.leaveEndDate),
      color: colors.leave,
      type: 'leave',
      raw: l,
    }));
  }

  mapBirthdays(list: any[]): CalendarMappedEvent[] {
    return list.map((b) => {
      const [day, month] = b.employeeBirthday.split('-');
      const date = new Date(new Date().getFullYear(), +month - 1, +day);

      return {
        title: `${b.employeeName}'s Birthday`,
        start: startOfDay(date),
        end: endOfDay(date),
        color: colors.birthday,
        allDay: true,
        type: 'birthday',
        raw: b,
      };
    });
  }

  parseDMY(str: string): Date {
    const [d, m, y] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  // -----------------------------
  // FILTERING
  // -----------------------------

  applyFilters() {
    const selected = this.filterForm.value.eventFilters
      .map((checked, i) => (checked ? this.eventFilters[i].id : null))
      .filter(Boolean);

    this.events = this.allEvents.filter((e) => selected.includes(e.type));

    this.refresh.next();
  }

  // -----------------------------
  // EVENT CLICK HANDLING
  // -----------------------------

  handleEvent(event: CalendarMappedEvent) {
    switch (event.type) {
      case 'meeting':
        this.dialog.open(MeetingInfoComponent, {
          width: '40%',
          data: { modalInfo: event.raw, isExisting: true },
        });
        break;

      case 'holiday':
        this.dialog.open(PublicHolidayInfoComponent, {
          width: '30%',
          data: { modalInfo: event.raw, isExisting: true },
        });
        break;

      case 'leave':
        this.notify.showInfo('Leave details coming soon');
        break;

      case 'birthday':
        this.notify.showInfo('Birthday details coming soon');
        break;
    }
  }


  createNewMeeting() {
    if (!this.employeeList || !this.employeeList.length) {
      this.notify.showError(
        'All data needed to create a meeting is not available yet. Please try again.'
      );
      return;
    }

    const dialogRef = this.dialog.open(MeetingInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        isExisting: false,
        employeeList: this.employeeList,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadCalendarData();
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void { 
    if (date.getMonth() === this.viewDate.getMonth()) { 
      if ( (date.getDate() === this.viewDate.getDate() && this.activeDayIsOpen) || events.length === 0 ) { 
        this.activeDayIsOpen = false; 
      } 
      else { 
        this.activeDayIsOpen = true; 
      } 
      this.viewDate = date; 
    } 
  } 

  closeOpenMonthViewDay() { 
    this.activeDayIsOpen = false; 
  }

  eventTimesChanged({ event, newStart, newEnd }: any): void { 
    this.allEvents = this.allEvents.map((e) => e === event ? { ...e, start: newStart, end: newEnd, } : e ); 
    this.applyFilters(); 
  }

  setView(view: CalendarView) { 
    this.view = view; 
  }

  filterEvents() { 
    this.applyFilters(); 
  }

  filterChange(): void { 
    // When "Select All" changes → update all filters 
    this.filterForm.get('selectAll').valueChanges.subscribe((checked: boolean) => { 
      this.filterForm.get('eventFilters').patchValue( Array(this.eventFilters.length).fill(checked), { emitEvent: false } ); 
      this.applyFilters(); 
    }); 
    // When any individual filter changes → update "Select All" 
    this.filterForm.get('eventFilters').valueChanges.subscribe((values: boolean[]) => { 
      const allSelected = values.every(v => v === true); 
      if (this.filterForm.get('selectAll').value !== allSelected) { 
        this.filterForm.get('selectAll').patchValue(allSelected, { emitEvent: false }); 
      } 
      this.applyFilters(); 
    }); 
  }
}
