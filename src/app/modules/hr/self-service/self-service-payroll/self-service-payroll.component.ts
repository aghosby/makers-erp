import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { MatTableDataSource } from '@angular/material/table';
import * as Highcharts from 'highcharts';
import { DatePipe } from '@angular/common';
import { PayrollSummary } from 'src/app/shared/models/payroll-data';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { SharedService } from 'src/app/shared/services/utils/shared.service';
import { PaymentInfoComponent } from 'src/app/shared/components/payment-info/payment-info.component';
import { PayslipComponent } from '../../payroll/payslip/payslip.component';


@Component({
  selector: 'app-self-service-payroll',
  templateUrl: './self-service-payroll.component.html',
  styleUrls: ['./self-service-payroll.component.scss']
})
export class SelfServicePayrollComponent implements OnInit {

  employeeId: string;
  employeeDetails: any;
  selectedPeriod: any;
  payrollDebitList: any[] = [];
  payrollCreditList: any[] = [];

  payrollPeriods: any[] = [];
  payrollYears:any;
  currentPayrollYear:any;
  payrollGraphData: any[] = [];

  displayedColumns: any[];
  dataSource: MatTableDataSource<PayrollSummary>;

  //Payroll Summary Table Column Names

  tableColumns: TableColumn[] = [
    {
      key: "reference",
      label: "Reference",
      order: 1,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "payrollPeriodName",
      label: "Payroll Name",
      order: 2,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "payPeriod",
      label: "Pay Period",
      order: 3,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "totalEarnings",
      label: "Total Earnings",
      order: 6,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "deductions",
      label: "Deductions",
      order: 9,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "netEarnings",
      label: "Net Earnings",
      order: 10,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      order: 11,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "actions",
      label: "Actions",
      order: 12,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    }

  ]

  // tableData: PayrollSummary[] = [
  //   {
  //     id: 1,
  //     "Reference": "OCT-0345-211",
  //     "Payroll Name": "October 1st Period",
  //     "Pay Period": "Oct 1, 2022 - Oct 15, 2022",
  //     "Employee Count": 43,
  //     "Gross Pay": "£34,590.45",
  //     "Deductions": "£5,890.00",
  //     "Net Pay": "£29,344.50",
  //     "Status": "Completed"
  //   },
  //   {
  //     id: 2,
  //     "Reference": "OCT-0335-251",
  //     "Payroll Name": "October 2nd Period",
  //     "Pay Period": "Oct 16, 2022 - Oct 31, 2022",
  //     "Employee Count": 46,
  //     "Gross Pay": "£37,790.45",
  //     "Deductions": "£4,990.00",
  //     "Net Pay": "£33,484.50",
  //     "Status": "Completed"
  //   },
  //   {
  //     id: 3,
  //     "Reference": "NOV-0325-211",
  //     "Payroll Name": "November Period",
  //     "Pay Period": "Nov 1, 2022 - Nov 30, 2022",
  //     "Employee Count": 56,
  //     "Gross Pay": "£57,590.45",
  //     "Deductions": "£7,290.00",
  //     "Net Pay": "£50,344.00",
  //     "Status": "Processing"
  //   },
  //   {
  //     id: 4,
  //     "Reference": "DEC-0745-211",
  //     "Payroll Name": "December Period",
  //     "Pay Period": "Dec 1, 2022 - Dec 31, 2022",
  //     "Employee Count": 51,
  //     "Gross Pay": "£53,590.45",
  //     "Deductions": "£4,100.00",
  //     "Net Pay": "£49,344.35",
  //     "Status": "Completed"
  //   },
  // ]

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

  constructor(
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private authService: AuthenticationService,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private sharedService: SharedService,
  ) {
    this.getPageData();
  }

  ngOnInit(): void {
    
  }

  getPageData = async () => {
    this.employeeDetails = this.authService.loggedInUser.data;
    this.payrollPeriods = await this.hrService.getPayrollPeriods().toPromise();
    this.payrollCreditList = await this.hrService.getPayrollCredits().toPromise();
    this.payrollDebitList = await this.hrService.getPayrollDebits().toPromise();

    this.tableColumns.sort((a,b) => (a.order - b.order));
    this.displayedColumns = this.tableColumns.map(column => column.label);
    this.dataSource = new MatTableDataSource(this.payrollPeriods['data']);
  }

  //Open payment info modal
  editPaymentInfo() {
    this.dialog.open(PaymentInfoComponent, {
      width: '35%',
      height: 'auto',
      data: {
        // name: details.name,
        // id: details._id,
        isExisting: true,
        modalInfo: this.employeeDetails
      },
    }).afterClosed().subscribe(() => {
      this.employeeDetails = this.authService.loggedInUser.data;
    });
  }

  changePayrollYear(year:any) {
    this.currentPayrollYear = year;
    this.hrService.getPayrollGraph(year).subscribe(res => this.payrollGraphData = res.data);
  }


  strToDate(dateVal: string, key:string) {
    // console.log(dateVal);
    if(key == 'startDate' || key == 'endDate') {
      let newFormat = new Date(dateVal);
      // const [month, day, year] = dateVal.split('/');
      // let newFormat = new Date(+year, +month - 1, +day);
      // console.log(newFormat.toDateString());
      return this.datePipe.transform(newFormat, 'd MMM, y')
    }
    else {
      const [day, month, year] = dateVal.split('/');
      let newFormat = new Date(+year, +month - 1, +day);
      // console.log(newFormat.toDateString());
      return this.datePipe.transform(newFormat, 'd MMMM, y')
    }    
  }

  getPayrollDetails = async (info) =>  {
    this.selectedPeriod = await this.hrService.getPayrollDetails(info._id).toPromise();
    console.log(this.selectedPeriod);

    this.viewPayslip();
  }

  //Show payslip
  viewPayslip() {
    console.log(this.payrollCreditList);
    let dialogRef = this.dialog.open(PayslipComponent, {
      width: '40%',
      height: 'auto',
      data: {
        isExisting: false,
        payrollCredits: this.payrollCreditList['data'],
        payrollDebits: this.payrollDebitList['data'],
        modalInfo: this.selectedPeriod['data']
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      //this.getPageData();
    });
  }

}
