import { Component, OnInit } from '@angular/core';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { MatTableDataSource } from '@angular/material/table';
import * as Highcharts from 'highcharts';
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ReimbursementTable } from 'src/app/shared/models/reimbursement-data';
import { FormFields } from '../../../../shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { ExpenseRequestReviewComponent } from '../expense-request-review/expense-request-review.component';



@Component({
  selector: 'app-expense-management',
  templateUrl: './expense-management.component.html',
  styleUrls: ['./expense-management.component.scss']
})
export class ExpenseManagementComponent implements OnInit {

  displayedColumns: any[];
  dataSource: MatTableDataSource<ReimbursementTable>;
  requestedApprovals: any[] = [];
  expenseTypeList: any[] = [];
  approvedRequests: any[] = [];

  AreaHighcharts: typeof Highcharts = Highcharts;
  areaChartOptions: Highcharts.Options = {
    title: {
      text: ""
    },
    credits: {
      enabled: false
    },
    xAxis:{
      categories:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      //labels: {enabled:false}
    },
    yAxis: {          
      title:{
        text:""
      },
      labels: {
        formatter: function () {
          return '₦ ' + this.axis.defaultLabelFormatter.call(this) + 'K';
        }            
      }
    },
    tooltip: {
      valuePrefix:"₦",
      valueSuffix:"K",
    },
    //colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
    colors: ['#4db1ff'],
    series: [
      {
        type: 'areaspline',
        name: 'Revenue',
        showInLegend: false,
        data: [7.9, 10.2, 13.7, 16.5, 17.9, 15.2, 17.0, 20.6, 22.2, 26.3, 29.6, 27.8],
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, '#4db1ff'],
            [1, Highcharts.color('#4db1ff').setOpacity(0).get('rgba') as string],
          ],
        },
      },
    ],
  };

  //Expense Request Table Column Names
  tableColumns: TableColumn[] = [
    // {
    //   key: "image",
    //   label: "Image",
    //   order: 1,
    //   columnWidth: "6%",
    //   cellStyle: "width: 100%",
    //   sortable: false
    // },
    {
      key: "employeeName",
      label: "Name",
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

  // tableData: ReimbursementTable[] = [
  //   {
  //     id: 1,
  //     "Employee ID": "EMP-2021-MB45",
  //     "Expense Type": "Transport Fare",
  //     "First Name": "Mellie",
  //     "Last Name": "Gabbott",
  //     "Date Used": "Jan 10, 2023",
  //     "Amount": "£ 100",
  //     "Attachment": "transportReceipt.pdf",
  //     "Date Requested": "Jan 12, 2023",
  //     "Decision Date": "",
  //     "Date Remitted": "",
  //     "Approver": "Thomas Jefferson",
  //     "Status": "Pending"
  //   },
  //   {
  //     id: 2,
  //     "Employee ID": "EMP-2020-MB25",
  //     "Expense Type": "Conference Fees",
  //     "First Name": "Mellie",
  //     "Last Name": "Gabbott",
  //     "Date Used": "Feb 4, 2023",
  //     "Amount": "£ 700",
  //     "Attachment": "receipt.pdf",
  //     "Date Requested": "Feb 10, 2023",
  //     "Decision Date": "Mar 12, 2023",
  //     "Date Remitted": "Apr 10, 2023",
  //     "Approver": "Thomas Jefferson",
  //     "Status": "Completed"
  //   },
  //   {
  //     id: 3,
  //     "Employee ID": "EMP-2019-MB03",
  //     "Expense Type": "Goods Purchase",
  //     "First Name": "Mellie",
  //     "Last Name": "Gabbott",
  //     "Date Used": "Dec 2, 2023",
  //     "Amount": "£ 350",
  //     "Attachment": "invoice.pdf",
  //     "Date Requested": "Dec 2, 2023",
  //     "Decision Date": "Dec 12, 2023",
  //     "Date Remitted": "Dec 17, 2023",
  //     "Approver": "Rita Smak",
  //     "Status": "Completed"
  //   },
  //   {
  //     id: 4,
  //     "Employee ID": "EMP-2021-MB45",
  //     "Expense Type": "Transport",
  //     "First Name": "Mellie",
  //     "Last Name": "Gabbott",
  //     "Date Used": "Nov 10, 2022",
  //     "Amount": "£ 50",
  //     "Attachment": "print.pdf",
  //     "Date Requested": "Nov 10, 2022",
  //     "Decision Date": "Nov 12, 2022",
  //     "Date Remitted": "",
  //     "Approver": "Rita Smak",
  //     "Status": "Declined"
  //   },
  // ]

  constructor(
    private hrService: HumanResourcesService,
    private notifyService: NotificationService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) {
    this.getPageData();
  }

  ngOnInit(): void {
    this.tableColumns.sort((a,b) => (a.order - b.order));
    this.displayedColumns = this.tableColumns.map(column => column.label);
    //this.dataSource = new MatTableDataSource(this.tableData);
  }

  getPageData = async () => {
    this.requestedApprovals = await this.hrService.getRequestedExpenseApprovals().toPromise();
    this.expenseTypeList = await this.hrService.getExpenseTypes().toPromise();
    // console.log(this.leaveTypeList);
    this.approvedRequests = this.requestedApprovals['data'].filter(item => {
      return item.status === 'Approved';
    })
    this.dataSource = new MatTableDataSource(this.requestedApprovals['data']);
    console.log(this.requestedApprovals);
  }


  strToDate(dateVal: string, key:string) {
    if(key == 'dateRequested') {
      // const [day, month, year] = dateVal.split('/');
      let newFormat = new Date(dateVal);
      // console.log(newFormat.toDateString());
      return this.datePipe.transform(newFormat, 'd MMMM, y')
    }
    else {
      const [day, month, year] = dateVal.split('/');
      let newFormat = new Date(+year, +month - 1, +day);
      // console.log(newFormat.toDateString());
      return this.datePipe.transform(newFormat, 'd MMMM, y')
    }    
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
      this.getPageData();
    });
  }

}
