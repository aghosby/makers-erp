import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';

import { TableColumn } from '@shared/models/table-columns';
import { FilterConfig } from '@shared/models/table-filter';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { SharedService } from '@services/utils/shared.service';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';

import { CreateSingleInfoComponent } from 'src/app/shared/components/create-single-info/create-single-info.component';
import { BulkUploadComponent } from '../bulk-upload/bulk-upload.component';
import { AssignManagerApproversComponent } from '../assign-manager-approvers/assign-manager-approvers.component';
import { AssignSalaryScalesComponent } from '../assign-salary-scales/assign-salary-scales.component';


@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeesListComponent implements OnInit {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  tableColumns: TableColumn[] = [
    { key: 'image',               label: 'Image',       order: 1,  columnWidth: '4%',  sortable: false, hideLabel: true },
    { key: 'name',                label: 'Name',        order: 2,  columnWidth: '10%', sortable: true },
    { key: 'employmentType',      label: 'Job Type',    order: 3,  columnWidth: '8%',  sortable: true },
    { key: 'employmentStartDate', label: 'Start Date',  order: 4,  columnWidth: '8%',  sortable: true },
    { key: 'department',          label: 'Department',  order: 5,  columnWidth: '12%', sortable: true },
    { key: 'designationName',     label: 'Designation', order: 6,  columnWidth: '10%', sortable: true },
    { key: 'activeStatus',        label: 'Status',      order: 7,  columnWidth: '8%',  sortable: false },
    { key: 'actions',             label: 'Actions',     order: 8,  columnWidth: '5%',  sortable: false, hideLabel: true },
  ];

  employeeList: any[] = [];
  departmentList: any = null;
  designationList: any = null;
  salaryScales: any[] = [];
  employeeFilters: FilterConfig[];
  selectedEmployees: any[] = [];

  totalItems: number = 0;
  pageSize: number = 10;
  apiLoading: boolean = false;

  public search$ = new BehaviorSubject<string>('');
  public page$ = new BehaviorSubject<number>(1);
  public size$ = new BehaviorSubject<number>(10);
  public filters$ = new BehaviorSubject<{ [k: string]: any }>({});

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService,
    private hrService: HumanResourcesService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.size$.subscribe(val => this.pageSize = val);

    const employees$ = combineLatest([
      this.search$.pipe(debounceTime(300), distinctUntilChanged()),
      this.page$,
      this.size$,
      this.filters$.pipe(debounceTime(250))
    ]).pipe(
      tap(() => this.apiLoading = true),
      switchMap(([search, page, size, filters]) =>
        this.hrService.getEmployees(page, size, search, filters)
      )
    );

    employees$.pipe(
      tap(res => {
        this.totalItems = res.totalRecords;
        this.employeeList = res.data;
        this.apiLoading = false;
      }),
      finalize(() => this.apiLoading = false)
    ).subscribe();

    this.getPageData();
  }

  getPageData = async () => {
    this.departmentList = await this.hrService.getDepartments().toPromise();
    this.designationList = await this.hrService.getDesignations().toPromise();
    this.hrService.getSalaryScales().subscribe(res => this.salaryScales = res.data);

    this.employeeFilters = [
      {
        key: 'department', label: 'Department', type: 'select',
        options: this.sharedService.arrayToObject(this.departmentList['data'], 'departmentName') || {},
        includeIfEmpty: false
      },
      {
        key: 'designation', label: 'Designation', type: 'select',
        options: this.sharedService.arrayToObject(this.designationList['data'], 'designationName') || {},
        includeIfEmpty: false
      },
      {
        key: 'employmentStatus', label: 'Employment Status', type: 'select',
        options: { Active: 'Active', Inactive: 'Inactive' },
        includeIfEmpty: false
      },
      {
        key: 'employmentType', label: 'Employment Type', type: 'select',
        options: { Contract: 'Contract', Permanent: 'Permanent' },
        includeIfEmpty: false
      },
    ];
  };

  // --- Event handlers from DataTableComponent ---

  updateSearch(term: string): void {
    this.search$.next(term);
  }

  onPageChange(event: { page: number; size: number }): void {
    this.apiLoading = true;
    this.page$.next(event.page);
    this.size$.next(event.size);
  }

  onFiltersChange(filters: { [k: string]: any }): void {
    this.filters$.next(filters);
  }

  onSelectionChange(selected: any[]): void {
    this.selectedEmployees = selected;
  }

  // --- Employee actions ---

  viewEmployee(info: any): void {
    this.router.navigateByUrl(`app/human-resources/employees/${info._id}`);
  }

  addNewEmployee(): void {
    this.dialog.open(CreateSingleInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        departmentList: this.departmentList['data'],
        designationList: this.designationList['data'],
        isExisting: false
      },
    });
  }

  addBulkEmployees(): void {
    const ref = this.dialog.open(BulkUploadComponent, {
      width: '35%',
      height: 'auto',
      data: {
        departmentList: this.departmentList['data'],
        designationList: this.designationList['data'],
        isExisting: false
      },
    });
    ref.afterClosed().subscribe(() => this.getPageData());
  }

  deleteEmployee(info: any): void {
    this.notifyService.confirmAction({
      title: 'Remove Employee',
      message: `Are you sure you want to remove ${info.firstName + ' ' + info.lastName} as an employee?`,
      confirmText: 'Remove Employee',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (confirmed) {
        this.hrService.deleteEmployee(info._id).subscribe({
          next: res => {
            if (res.status === 200) {
              this.notifyService.showInfo('The employee has been deleted successfully');
            }
          },
          error: err => this.notifyService.showError(err.error.error)
        });
      }
    });
  }

  assignManager(assignType: string, count: string, row?: any): void {
    const selections = row
      ? [...this.selectedEmployees, row]
      : [...this.selectedEmployees];

    const ref = this.dialog.open(AssignManagerApproversComponent, {
      width: '35%',
      height: 'auto',
      data: { assignmentType: assignType, employeeList: this.employeeList, selections, isExisting: false },
    });
    ref.afterClosed().subscribe(() => {
      this.selectedEmployees = [];
      this.dataTable?.clearSelection();
      this.getPageData();
    });
  }

  assignSalaryScale(row?: any): void {
    const selections = row
      ? [...this.selectedEmployees, row]
      : [...this.selectedEmployees];

    const ref = this.dialog.open(AssignSalaryScalesComponent, {
      width: '35%',
      height: 'auto',
      data: { salaryScales: this.salaryScales, selections, isExisting: false },
    });
    ref.afterClosed().subscribe(() => {
      this.selectedEmployees = [];
      this.dataTable?.clearSelection();
    });
  }
}
