import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, Location } from '@angular/common';
import { Chart, Options } from 'highcharts';
import * as Highcharts from 'highcharts';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { EditEmployeeComponent } from '../../edit-employee/edit-employee.component';
import { EmployeeDocumentsComponent } from '../employee-documents/employee-documents.component';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {

  employeeId: string;
  employeeDetails: any;
  departmentList: any[] = [];
  designationList: any[] = [];

  chartOptions: Options;
  Highcharts: typeof Highcharts;

  totalLeaveDays: number;
  leaveDaysUsed: number;
  leaveSummary: any[] = [];
  leaveBreakdown: any[] = [];
  leaveAttr: any[] = [
    {
      colorDark: "rgb(191,148,60)",
      colorLight: "rgba(191,148,60, 0.2)",
      icon: "bi bi-bandaid"
    },
    {
      colorDark: "rgba(235,87,87, 0.5)",
      colorLight: "rgba(235, 87, 87, 0.2)",
      icon: "bi bi-exclamation-diamond"
    },
    {
      colorDark: "rgba(54,171,104, 0.5)",
      colorLight: "rgba(66, 133, 244, 0.2)",
      icon: "bi bi-cash"
    },
    {
      colorDark: "rgba(54,171,104, 0.5)",
      colorLight: "rgba(66, 133, 244, 0.2)",
      icon: "bi bi-cash"
    },
    
  ]

  // @ViewChild('doughnutCanvas') doughnutCanvas: ElementRef | undefined;
  // doughnutChart: any;

  constructor(
    private activatedRoute:ActivatedRoute, 
    private location: Location,
    public dialog: MatDialog,
    private router: Router,
    private datePipe: DatePipe,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.employeeId=this.router.url.split('/')[4];
    this.getPageData();
  }

  // ngAfterViewInit() {
  //   this.doughnutChartMethod();
  // }

  goBack() {
    this.location.back();
  }

  // doughnutChartMethod() {
  //   this.doughnutChart = new Chart(this.doughnutCanvas?.nativeElement, {
  //     type: 'doughnut',
  //     data: {
  //       labels: ['BJP', 'Congress'],
  //       datasets: [
  //         {
  //           //label: '# of Votes',
  //           data: [50, 50],
  //           borderJoinStyle: 'round',
  //           backgroundColor: [
  //             'rgba(255, 159, 64, 0.2)',
  //             'rgba(255, 99, 132, 0.2)',
  //           ],
  //           hoverBackgroundColor: [
  //             '#FFCE56',
  //             '#FF6384',
  //           ],
  //           borderWidth: 0
  //         },
  //       ],
  //     },
  //     options: {
  //       plugins: {
  //         legend: {
  //           display: false
  //         }
  //       },
  //       cutout: 100,
  //       responsive: true,
  //       //aspectRatio: 1,
  //       maintainAspectRatio: false,
  //       radius: 60
  //     }
  //   });
  // }


  getPageData = async () => {
    const employeeDetails$ = this.hrService.getEmployeeDetails(this.employeeId).subscribe(res => this.employeeDetails = res.data)
    this.departmentList = await this.hrService.getDepartments().toPromise();
    this.designationList = await this.hrService.getDesignations().toPromise();

    //console.log(this.departmentList);

    this.leaveSummary = this.employeeDetails.leaveAssignment;
    this.totalLeaveDays = this.leaveSummary.reduce((n, {noOfLeaveDays}) => n + noOfLeaveDays, 0);
    this.leaveDaysUsed = this.leaveSummary.reduce((n, {daysUsed}) => n + daysUsed, 0);
    // this.leaveBreakdown = this.leaveSummary.map((item, index) => {
    //   let data = {
    //     id: index + 1,
    //     daysUsed: item.daysUsed,
    //     totalDays: item.noOfLeaveDays,
    //     name: item.leaveName,
    //     colorDark: this.leaveAttr[index].colorDark,
    //     colorLight: this.leaveAttr[index].colorLight,
    //     icon: this.leaveAttr[index].icon
    //   }
    //   return data;
    // });
    // console.log(this.leaveBreakdown);

    this.Highcharts = Highcharts;
    this.chartOptions = {
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
            {
              name: 'Days Used', 
              y: this.leaveDaysUsed*100/this.totalLeaveDays, 
              value: this.leaveDaysUsed, 
              color: '#f08585'
            },
            {
              name: 'Days Left', 
              y: ((this.totalLeaveDays - this.leaveDaysUsed)*100)/this.totalLeaveDays, 
              value: this.totalLeaveDays - this.leaveDaysUsed, 
              color: '#4dc781'
            },
          ]
        }
      ]
    }

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

  editEmployeeInfo() {
    let dialogRef = this.dialog.open(EditEmployeeComponent, {
      width: '40%',
      height: 'auto',
      data: {
        departmentList: this.departmentList['data'],
        designationList: this.designationList['data'],
        employeeDetails: this.employeeDetails,
        isExisting: false
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  //Upload a new document
  uploadDocument() {
    this.dialog.open(EmployeeDocumentsComponent, {
      width: '40%',
      height: 'auto',
      data: {
        isExisting: false
      },
    });
  }


}
