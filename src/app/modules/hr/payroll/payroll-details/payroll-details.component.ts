import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { SharedService } from 'src/app/shared/services/utils/shared.service';
import { PayrollPeriodDetailsComponent } from '../payroll-period-details/payroll-period-details.component';
import { PayrollCalculatorComponent } from '../payroll-calculator/payroll-calculator.component';
import { PayrollUploadComponent } from '../payroll-upload/payroll-upload.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-payroll-details',
  templateUrl: './payroll-details.component.html',
  styleUrls: ['./payroll-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PayrollDetailsComponent implements OnInit {

  apiLoading:boolean = false;
  tableColumns: TableColumn[];
  tableData: any[] = [];
  columnsCount: number = 3;

  payrollPeriods: any[] = [];
  payrollCreditList: any[] = [];
  payrollDebitList:any[] = [];
  employees: any[] = [];
  payrollRunSteps:any[] = [];

  periodInView: any;
  payrollPeriodData:any;
  currentPeriodId: string;
  payrollPeriodName: string;
  payrollCurrentStep:number;

  displayedColumns: any[];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);

  private unsubscribe = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private location: Location,
    private router: Router,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.currentPeriodId = this.activatedRoute.snapshot.params["id"];
    // this.sharedService.getData$().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
    //   this.periodInView = data;
    // });
    this.payrollPeriodData = {
      isExisting: false
    }
    this.getPageData();
    this.payrollCurrentStep = 0;
    this.payrollRunSteps = [
      {
        icon: 'calendarTime',
        iconSize: 30,
        stepName: 'Create Period'
      },
      {
        icon: 'clipboard',
        iconSize: 26,
        stepName: 'Generate Payroll'
      },
      {
        icon: 'badgeCheck',
        iconSize: 30,
        stepName: 'Payroll Approval'
      },
      {
        icon: 'layer',
        iconSize: 30,
        stepName: 'Disburse Payment'
      },
      {
        icon: 'folderAi',
        iconSize: 26,
        stepName: 'Close Period'
      }
    ]
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  goBack() {
    this.location.back();
  }

  getPageData = async () => {
    this.payrollPeriods = await this.hrService.getPayrollPeriods().toPromise();
    if(this.currentPeriodId) {
      this.periodInView = await this.hrService.getPayrollDetails(this.currentPeriodId).toPromise();
      this.periodInView = this.periodInView['data'][0];
      console.log(this.periodInView);
    }    
    this.employees = await this.hrService.getEmployees().toPromise();
    this.payrollCreditList = await this.hrService.getPayrollCredits().toPromise();
    this.payrollDebitList = await this.hrService.getPayrollDebits().toPromise();

    this.generateTableColumns();

    if(!this.periodInView) {
      this.periodInView = this.payrollPeriods['data'][0];
      if(this.payrollPeriods['data'].length > 0) {
        this.currentPeriodId = this.periodInView._id;
        this.periodInView = await this.hrService.getPayrollDetails(this.periodInView._id).toPromise();
        this.periodInView = this.periodInView['data'][0];
        console.log(this.periodInView);

        this.payrollPeriodName = this.periodInView.payrollPeriodName;
        this.tableData = this.periodInView['payrollPeriodData'];
      }
      
      //this.openPayrollModal();

      this.tableColumns.sort((a,b) => (a.order - b.order));
      this.displayedColumns = this.tableColumns.map(column => column.label);
      if(this.tableData) {
        this.dataSource = new MatTableDataSource(this.tableData);
      }
      else {
        this.generateTableData();
      }
    }
    else {
      this.tableColumns.sort((a,b) => (a.order - b.order));
      this.displayedColumns = this.tableColumns.map(column => column.label);
      this.payrollPeriodName = this.periodInView.payrollPeriodName;
      this.dataSource = this.periodInView.payrollPeriodData;
      // this.dataSource = new MatTableDataSource(this.tableData);
    }
    // console.log(this.payrollCreditList);
    // console.log(this.payrollDebitList);
    // console.log(this.employees);
  }

  //Convert string to camel case
  toCamelCase(str:string){
    return str.split(' ').map(function(word,index){
      // If it is the first word make sure to lowercase all the chars.
      if(index == 0){
        return word.toLowerCase();
      }
      // If it is not the first word only upper case the first char and lowercase the rest.
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
  }

  generateTableColumns() {
    this.tableColumns = [
      {
        key: "select",
        label: "Select",
        order: 1,
        columnWidth: "",
        cellStyle: "width: 100%",
        sortable: false,
        isSticky: true
      },
      {
        key: "image",
        label: "Image",
        order: 2,
        columnWidth: '',
        cellStyle: "width: 100%",
        sortable: false,
        isSticky: true
      },
      {
        key: "name",
        label: "Name",
        order: 3,
        columnWidth: '',
        cellStyle: "width: 100%",
        sortable: false,
        isSticky: true
      },
    ];

    if(this.payrollCreditList) {
      this.payrollCreditList['data'].map( item => {
        this.columnsCount = this.columnsCount + 1;
        let columnObject = {
          key: this.toCamelCase(item.name),
          label: item.name,
          order: this.columnsCount,
          columnWidth: 10,
          // columnWidth: String((100-45)/(this.payrollCreditList['data'].length + this.payrollDebitList['data'].length)) + '%',
          cellStyle: "green",
          sortable: true
        }
        this.tableColumns.push(columnObject);
      })
    }
    
    if(this.payrollDebitList) {
      this.payrollDebitList['data'].map( item => {
        this.columnsCount = this.columnsCount + 1;
        let columnObject = {
          key: this.toCamelCase(item.name),
          label: item.name,
          order: this.columnsCount,
          columnWidth: 10,
          // columnWidth: String((100-45)/(this.payrollCreditList['data'].length + this.payrollDebitList['data'].length)) + '%',
          cellStyle: "red",
          sortable: true,
          isSticky: false
        }
        this.tableColumns.push(columnObject);
      });

      let otherColumns = ['Net Earnings', 'Status', 'Actions'];
      otherColumns.map(item => {
        this.columnsCount = this.columnsCount + 1;
        let columnObject = {
          key: this.toCamelCase(item),
          label: item,
          order: this.columnsCount,
          columnWidth: '',
          cellStyle: "width: 100%",
          sortable: false,
          isSticky: item == 'Status' || item == 'Actions'
        }
        this.tableColumns.push(columnObject);
      })

      console.log(this.tableColumns);
    }
  }

  generateTableData() {
    this.employees['data'].map(item => {
      let dataEntry= {};
      dataEntry['name'] = item.fullName;
      dataEntry['companyRole'] = item.companyRole;
      dataEntry['department'] = item.department;
      dataEntry['designationName'] = item.designationName;
      dataEntry['email'] = item.email;
      dataEntry['employmentType'] = item.employmentType;
      dataEntry['image'] = item.profilePic;
      dataEntry['status'] = 'Pending';

      this.tableColumns.map(columnName => {
        if(!(columnName.key == 'select' || columnName.key == 'image' || columnName.key == 'name' || columnName.key == 'status' || columnName.key == 'actions')) {
          dataEntry[columnName.key] = '-';
        }
      })

      this.tableData.push(dataEntry);
    });
    this.dataSource = new MatTableDataSource(this.tableData);
    // console.log(this.tableData);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if(this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /*************** PAYROLL PERIOD RELATED ACTIONS ***************/

  //Open payroll period modal
  openPayrollModal() {
    this.dialog.open(PayrollPeriodDetailsComponent, {
      width: '35%',
      height: 'auto',
      data: {
        // name: details.name,
        // id: details._id,
        isExisting: false,
        disableClose: true,
        // modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  //Edit a Payroll Period
  openEditModal() {
    this.dialog.open(PayrollPeriodDetailsComponent, {
      width: '35%',
      height: 'auto',
      data: {
        name: this.periodInView.payrollPeriodName,
        id: this.periodInView._id,
        isExisting: true,
        modalInfo: this.periodInView
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });;
  }

  //Delete a Payroll Period
  deletePayrollPeriod() {
    console.log(this.periodInView);
    this.notifyService.confirmAction({
      title: 'Delete ' + this.periodInView.payrollPeriodName,
      message: 'Are you sure you want to remove this payroll period?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deletePayrollPeriod(this.periodInView._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The period has been deleted successfully');
            }
            this.getPageData();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  //Set the data of the period in view on change of the dropdown option
  setPayrollData = async (periodData) => {
    console.log(periodData);
    this.currentPeriodId = periodData._id;
    this.periodInView = await this.hrService.getPayrollDetails(this.currentPeriodId).toPromise();
    this.periodInView = this.periodInView['data'][0];
    // this.periodInView = periodData.payrollPeriodData;

    this.payrollPeriodName = this.periodInView.payrollPeriodName;
    this.dataSource = new MatTableDataSource(this.periodInView.payrollPeriodData);
    // console.log(periodData);
  }

  //Open payroll calculator modal
  openPayrollCalculator(details) {
    this.dialog.open(PayrollCalculatorComponent, {
      width: '40%',
      height: 'auto',
      data: {
        isExisting: false,
        payrollCredits: this.payrollCreditList['data'],
        payrollDebits: this.payrollDebitList['data'],
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  //Import bulk payroll sheet
  payrollBulkImport() {
    let dialogRef = this.dialog.open(PayrollUploadComponent, {
      width: '35%',
      height: 'auto',
      data: {
        isExisting: false
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      //this.getPageData();
    });
  }

  switchStep(evt:any) {
    console.log(evt);
    this.payrollCurrentStep = evt
  }

}
