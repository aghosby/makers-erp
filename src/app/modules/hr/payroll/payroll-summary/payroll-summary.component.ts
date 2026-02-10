import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { TableColumn } from 'src/app/shared/models/table-columns';
import { MatTableDataSource } from '@angular/material/table';
import * as Highcharts from 'highcharts';
import { DatePipe } from '@angular/common';
import { PayrollSummary } from 'src/app/shared/models/payroll-data';
import { MatDialog } from '@angular/material/dialog';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { SharedService } from 'src/app/shared/services/utils/shared.service';
import { PayrollUploadComponent } from '../payroll-upload/payroll-upload.component';


@Component({
  selector: 'app-payroll-summary',
  templateUrl: './payroll-summary.component.html',
  styleUrls: ['./payroll-summary.component.scss']
})
export class PayrollSummaryComponent implements OnInit {

  payrollPeriods: any[] = [];
  periodInView: any;
  payrollSummary: any[] = [];
  employees:any[] = [];
  teamMembers:any[] = [];
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
      label: "Payroll Period",
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

  tableData: PayrollSummary[] = []

  AreaHighcharts: typeof Highcharts = Highcharts;
  areaChartOptions: Highcharts.Options = {
    title: {
      text: "Gross Pay"
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
        text:"Naira"
      },
      labels: {
        formatter: function () {
          return 'NGN' + this.axis.defaultLabelFormatter.call(this) + 'K';
        }            
      }
    },
    tooltip: {
      valuePrefix:"NGN",
      valueSuffix:"K",
    },
    //colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
    colors: ['#4db1ff'],
    series: [
      {
        type: 'areaspline',
        name: 'Gross Pay',
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

  PieHighcharts: typeof Highcharts = Highcharts;
  pieChartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      plotShadow: false
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      pie: {
        innerSize: '99%',
        borderWidth: 20,
        borderColor: null,
        slicedOffset: 5,
        dataLabels: {
          connectorWidth: 0,
          enabled: false
        }
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px; letter-spacing: 0.03rem; font-family: Roboto">{series.name}</span><br>',
      pointFormat: '<span style="font-size:11px; letter-spacing: 0.03rem; font-family: Roboto; color:{point.color}">{point.name}</span>: <b>{point.value}days</b> <br/>'
    },
    title: {
      verticalAlign: 'middle',
      floating: false,
      text: ''
    },
    legend: {
      enabled: false
    },
    series: [
      {
        type: 'pie',
        name: 'Leave Days',
        data: [
          {name: 'Days Used', y: 60, value: 21, color: '#f08585'},
          {name: 'Days Left', y: 40, value: 14, color: '#4dc781'},
        ]
      }
    ]
  }
  constructor(
    public dialog: MatDialog,
    private route: Router,
    private datePipe: DatePipe,
    @Inject(HumanResourcesService) private hrService: HumanResourcesService, 
    @Inject(SharedService) private sharedService: SharedService,     
    @Inject(NotificationService) private notifyService: NotificationService,
  ) {
    this.getPageData();
  }

  ngOnInit(): void {
    
  }

  addNewPayrollFile() {
    this.route.navigateByUrl('/app/human-resources/payroll/payroll-details');
  }

  getPageData = async () => {
    this.payrollPeriods = await this.hrService.getPayrollPeriods().toPromise();
    console.log(this.payrollPeriods);
    const employees$ = this.hrService.getEmployees().subscribe(res => {
      this.employees = res.data;
    });
    
    if(this.payrollPeriods['data'].length > 0) {
      this.periodInView = this.payrollPeriods['data'][0];

      this.periodInView = await this.hrService.getPayrollDetails(this.periodInView._id).toPromise();
      this.periodInView = this.periodInView['data'][0]; 
      console.log(this.periodInView); 

      this.payrollSummary = [
        {
          id: 1,
          value: this.periodInView.payrollPeriodData.length,
          percentChange: "5%",
          name: "Employees",
          colorDark: "rgb(54,171,104)",
          colorLight: "rgba(54,171,104,0.2)",
          icon: "bi bi-arrow-up-right",
          symbol: "users"
        },
        {
          id: 2,
          value: `NGN ${this.periodInView?.totalEarnings}`,
          percentChange: "21%",
          name: "Gross Salary",
          colorDark: "rgb(235, 87, 87)",
          colorLight: "rgba(235, 87, 87, 0.2)",
          icon: "bi bi-arrow-down-right",
          symbol: "cash"
        },
        {
          id: 3,
          value: `NGN ${this.periodInView?.netEarnings}`,
          percentChange: "14%",
          name: "Net Salary",
          colorDark: "rgb(235, 87, 87)",
          colorLight: "rgba(235, 87, 87, 0.2)",
          icon: "bi bi-arrow-down-right",
          symbol: "layer"
        }
      ]
    }
    else {
      
      this.hrService.getEmployees().subscribe(res => {
        this.employees = res.data;
        this.payrollSummary = [
          {
            id: 1,
            value: this.employees.length,
            percentChange: "5%",
            name: "Employees",
            colorDark: "rgb(54,171,104)",
            colorLight: "rgba(54,171,104,0.2)",
            icon: "bi bi-arrow-up-right",
            symbol: "users"
          },
          {
            id: 2,
            value: `NGN 0`,
            percentChange: "0%",
            name: "Gross Salary",
            colorDark: "rgb(235, 87, 87)",
            colorLight: "rgba(235, 87, 87, 0.2)",
            icon: "bi bi-arrow-down-right",
            symbol: "cash"
          },
          {
            id: 3,
            value: `NGN 0`,
            percentChange: "0%",
            name: "Net Salary",
            colorDark: "rgb(235, 87, 87)",
            colorLight: "rgba(235, 87, 87, 0.2)",
            icon: "bi bi-arrow-down-right",
            symbol: "layer"
          }
        ]
      })
      
    }

    this.tableColumns.sort((a,b) => (a.order - b.order));
    this.displayedColumns = this.tableColumns.map(column => column.label);
    this.dataSource = new MatTableDataSource(this.payrollPeriods['data']);  
    
    console.log(this.payrollSummary)
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
      const [day, month, year] = dateVal.split('-');
      let newFormat = new Date(+year, +month - 1, +day);
      // console.log(newFormat.toDateString());
      return this.datePipe.transform(newFormat, 'd MMMM, y')
    }    
  }

  viewPayrollDetails(info: any) {
    this.route.navigateByUrl(`/app/human-resources/payroll/payroll-details/${info._id}`);
    // this.sharedService.setData(info);
  }

  //Delete a Payroll Period
  deletePayrollPeriod(info: any) {
    this.notifyService.confirmAction({
      title: 'Delete ' + info.payrollPeriodName,
      message: 'Are you sure you want to remove this payroll period?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deletePayrollPeriod(info._id).subscribe({
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



}

