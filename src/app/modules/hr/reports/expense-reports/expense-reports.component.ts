import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';
import { EmployeeData, EmployeeTable } from 'src/app/shared/models/employee-data';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Icons } from '../../../../core/constants/icons';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { FilterConfig } from '@shared/models/table-filter';
import { SharedService } from '@services/utils/shared.service';
import { TableColumn } from '@shared/models/table-columns';
import { ExpenseRequestReviewComponent } from '../../expense-management/expense-request-review/expense-request-review.component';

@Component({
  selector: 'app-expense-reports',
  templateUrl: './expense-reports.component.html',
  styleUrls: ['./expense-reports.component.scss']
})
export class ExpenseReportsComponent implements OnInit {

  icons = Icons;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static:true}) sort: MatSort;

  displayedColumns: any[];
  dataSource: MatTableDataSource<EmployeeData>;
  selection = new SelectionModel<EmployeeData>(true, []);

  totalItems:number;
  pageSize:number;
  apiLoading:boolean = false;

  tableData: any[];
  tableFilters: FilterConfig[];
  showFilters:boolean = true;

  branchList:any[] = [];
  departmentList: any[] = [];
  designationList: any[] = [];
  expenseTypesList:any[] = [];

  //Expense Request Table Column Names
  tableColumns: TableColumn[] = [
    {
      key: "image",
      label: "Image",
      order: 1,
      columnWidth: "6%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "employeeName",
      label: "Name",
      order: 2,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "department",
      label: "Department",
      order: 2,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "attachment",
      label: "Attachment",
      order: 3,
      columnWidth: "2%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "expenseTypeName",
      label: "Expense Type",
      order: 4,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "expenseDate",
      label: "Expense Date",
      order: 4,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "amount",
      label: "Amount",
      order: 5,
      columnWidth: "6%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "dateRequested",
      label: "Date Requested",
      order: 6,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "approver",
      label: "Approver",
      order: 7,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      order: 8,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    // {
    //   key: "dateRemitted",
    //   label: "Date Remitted",
    //   order: 9,
    //   columnWidth: "10%",
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

  public search$ = new BehaviorSubject<string>('');
  public page$ = new BehaviorSubject<number>(1);
  public size$ = new BehaviorSubject<number>(10);
  public filters$ = new BehaviorSubject<{[k:string]: any}>({});

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map(column => column.label);
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;

    this.size$.subscribe(val => this.pageSize = val);

    const tableData$ = combineLatest([
      this.search$.pipe(debounceTime(300), distinctUntilChanged()),
      this.page$,
      this.size$,
      this.filters$.pipe(debounceTime(250))
    ]).pipe(
      tap(() => this.apiLoading = true),
      switchMap(([search, page, size, filters]) => this.hrService.getRequestedExpenseApprovals(page, size, search, filters))
    );

    tableData$.pipe(
      tap(res => {
        this.totalItems = res.totalRecords;
        this.tableData = res.data;
        console.log(res);
        this.dataSource = new MatTableDataSource(this.tableData);
        this.paginator._intl.getRangeLabel = this.sharedService.getRangeDisplayText;
        this.apiLoading = false;
      }),
      finalize(() => this.apiLoading = false)
    ).subscribe()

    this.getPageData();

  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      console.log(this.paginator)
      this.updatePage(this.paginator.pageIndex + 1);
      this.updateSize(this.paginator.pageSize);
      this.paginator._intl.getRangeLabel = this.sharedService.getRangeDisplayText;
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  actionRequest(details: any) {
    this.dialog.open(ExpenseRequestReviewComponent, {
      width: '40%',
      height: 'auto',
      data: {
        id: details._id,
        isExisting: true,
        modalInfo: details,
        forApproval: true
      },
    }).afterClosed().subscribe(() => {
      this.search$.next('');
    });
  }

  getPageData = async () => {
    this.branchList = await this.hrService.getBranches().toPromise();
    this.departmentList = await this.hrService.getDepartments().toPromise();
    this.designationList = await this.hrService.getDesignations().toPromise();
    this.expenseTypesList = await this.hrService.getExpenseTypes().toPromise();

    this.tableFilters = [
      { 
        key: 'department', 
        label: 'Department', 
        type: 'select', 
        options: this.sharedService.arrayToObject(this.departmentList['data'], 'departmentName') || {}, 
        includeIfEmpty: false 
      },
      { 
        key: 'branch', 
        label: 'Branch', 
        type: 'select', 
        options: this.sharedService.arrayToObject(this.branchList['data'], 'branchName') || {},
        includeIfEmpty: false 
      },
      // { 
      //   key: 'designation', 
      //   label: 'Designation', 
      //   type: 'select', 
      //   options: this.sharedService.arrayToObject(this.designationList['data'], 'designationName') || {}, 
      //   includeIfEmpty: false 
      // },
      // { 
      //   key: 'employmentStatus', 
      //   label: 'Employment Status', 
      //   type: 'select', 
      //   options: {
      //     Active: 'Active',
      //     Inactive: 'Inactive'
      //   }, 
      //   includeIfEmpty: false 
      // },
      { 
        key: 'requested', 
        label: 'Requested Date', 
        type: 'daterange', 
        includeIfEmpty: false 
      },
      { 
        key: 'expensePeriod', 
        label: 'Expense Date', 
        type: 'daterange', 
        includeIfEmpty: false 
      },
      { 
        key: 'expenseType', 
        label: 'Expense Type', 
        type: 'select', 
        options: this.sharedService.arrayToObject(this.expenseTypesList['data'], 'expenseType') || {},
        includeIfEmpty: false 
      },
      { 
        key: 'approvalStatus', 
        label: 'Approval Status', 
        type: 'select', 
        options: {
          Approved: 'Approved',
          Declined: 'Declined',
          Pending: 'Pending'
        }, 
        includeIfEmpty: false 
      },
    ];
  }

  updateSearch(term: string) {
    this.search$.next(term);
  }

  updatePage(page: number) {
    this.apiLoading = true
    this.page$.next(page);
  }

  updateSize(size: number) {
    this.apiLoading = true
    this.size$.next(size);
  }

  onFiltersChange(newFilters: {[k:string]: any}) {
    console.log(newFilters);
    this.filters$.next(newFilters);
  }

}
