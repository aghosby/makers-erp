import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { FormFields } from '../../../../../shared/models/form-fields';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { Router } from '@angular/router';
import { LeaveAssignmentComponent } from 'src/app/modules/hr/leave-management/leave-assignment/leave-assignment.component';
import { LeaveReviewComponent } from 'src/app/modules/hr/leave-management/leave-review/leave-review.component';

@Component({
  selector: 'app-employee-absence',
  templateUrl: './employee-absence.component.html',
  styleUrls: ['./employee-absence.component.scss']
})
export class EmployeeAbsenceComponent implements OnInit {

  employeeDetails: any;
  employeeId: string;
  leaveTypes:any[] = [];
  totalLeaveDays: number = 0;
  leaveDaysUsed: number;
  leaveRecords: any[] = [];
  displayedColumns: any[];
  dataSource: MatTableDataSource<any>;
  currentPeriod:string;
  dataPeriods:any[] = ['2025', '2024', '2023', '2022']

  leaveSummary: any[] = [];
  leaveRequestFields: FormFields[];
  leaveForm!: FormGroup

  leaveBreakdown: any[] = [];
  leaveAttr: any[] = [
    {
      colorDark: "#4285f4",
      colorLight: "rgba(66, 133, 244, 0.2)",
      icon: "bi bi-cash"
    },
    {
      colorDark: "rgb(235, 87, 87)",
      colorLight: "rgba(235, 87, 87, 0.2)",
      icon: "bi bi-exclamation-diamond"
    },
    {
      colorDark: "rgb(191,148,60)",
      colorLight: "rgba(191,148,60, 0.2)",
      icon: "bi bi-bandaid"
    },
    {
      colorDark: "rgb(235, 87, 87)",
      colorLight: "rgba(235, 87, 87, 0.2)",
      icon: "bi bi-exclamation-diamond"
    },
    {
      colorDark: "rgb(235, 87, 87)",
      colorLight: "rgba(235, 87, 87, 0.2)",
      icon: "bi bi-exclamation-diamond"
    },
    {
      colorDark: "rgb(191,148,60)",
      colorLight: "rgba(191,148,60, 0.2)",
      icon: "bi bi-bandaid"
    },
  ]

  //Leave Request Table Column Names
  tableColumns: TableColumn[] = [
    {
      key: "leaveTypeName",
      label: "Leave Type",
      order: 1,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "requestDate",
      label: "Date Submitted",
      order: 8,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "leaveStartDate",
      label: "Start Date",
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "leaveEndDate",
      label: "End Date",
      order: 5,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "approver",
      label: "Approver",
      order: 6,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      order: 9,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    // {
    //   key: "dateOfBirth",
    //   label: "Date of Birth",
    //   order: 8,
    //   columnWidth: "8%",
    //   cellStyle: "width: 100%",
    //   sortable: true
    // },
    {
      key: "actions",
      label: "Actions",
      order: 10,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    }

  ]

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.employeeId=this.router.url.split('/')[4];
    const leaveTypes$ = this.hrService.getLeaveTypes().subscribe(res => this.leaveTypes = res.data);
    this.getPageData();
  }

  setupLeaveBreakdown() {
    this.leaveSummary = this.employeeDetails?.leaveAssignment;
    this.totalLeaveDays = this.leaveSummary.reduce((n, {noOfLeaveDays}) => n + noOfLeaveDays, 0);
    this.leaveDaysUsed = this.leaveSummary.reduce((n, {daysUsed}) => n + daysUsed, 0);
    console.log(this.leaveSummary);
    this.leaveBreakdown = this.leaveSummary.map((item, index) => {
      let data = {
        id: index + 1,
        leaveTypeId: item.leaveTypeId,
        daysUsed: item.daysUsed,
        totalDays: item.noOfLeaveDays,
        name: item.leaveName,
        colorDark: this.leaveAttr[index]?.colorDark ?? '',
        colorLight: this.leaveAttr[index]?.colorLight ?? '',
        icon: this.leaveAttr[index]?.icon
      }
      return data;
    });
    console.log(this.leaveSummary);
  }

  getPageData() {
    const employeeDetails$ = this.hrService.getEmployeeDetails(this.employeeId).subscribe(res => {
      this.employeeDetails = res.data;
      this.setupLeaveBreakdown();
    })
  }

  assignLeaveDays(leaveInfo:any) {
    let dialogRef = this.dialog.open(LeaveAssignmentComponent, {
      width: '30%',
      height: 'auto',
      data: {
        leaveTypes: this.leaveTypes,
        leaveType: leaveInfo.leaveTypeId,
        leaveDays: leaveInfo.totalDays,
        employeeId: this.employeeId,
        employeeName: this.employeeDetails.fullName
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      //this.selection.clear()
      this.getPageData();
    }); 
  }

  actionRequest(details: any) {
    this.dialog.open(LeaveReviewComponent, {
      width: '40%',
      height: 'auto',
      data: {
        id: details._id,
        isExisting: true,
        modalInfo: details,
        forApproval: true
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  strToDate(dateVal: string) {
    let reqDate:any = new Date(dateVal)
    if(reqDate == 'Invalid Date') {
      const [day, month, year] = dateVal.split('-');
      let newFormat = new Date(+year, +month - 1, +day);
      reqDate = newFormat;
    }
    return reqDate;
  }

}
