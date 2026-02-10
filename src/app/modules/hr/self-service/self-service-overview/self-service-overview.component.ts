import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, Options } from 'highcharts';
import * as Highcharts from 'highcharts';
import { DatePipe, Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { EditEmployeeComponent } from '../../employees/edit-employee/edit-employee.component';
import { EmployeeDocumentsComponent } from '../../employees/employee-info/employee-documents/employee-documents.component';


@Component({
  selector: 'app-self-service-overview',
  templateUrl: './self-service-overview.component.html',
  styleUrls: ['./self-service-overview.component.scss']
})
export class SelfServiceOverviewComponent implements OnInit {
  employeeId: string;
  employeeDetails: any;
  departmentList: any[];
  designationList: any[];
  userDetails: any;
  managerImage:string;
  managerRole:string;

  totalLeaveDays: number;
  leaveDaysUsed: number;
  leaveSummary: any[] = [];
  leaveBreakdown: any[] = [];
  leaveAttr: any[] = [
    {
      colorDark: "rgba(54,171,104, 0.5)",
      colorLight: "rgba(66, 133, 244, 0.2)",
      icon: "bi bi-cash"
    },
    {
      colorDark: "rgba(235,87,87, 0.5)",
      colorLight: "rgba(235, 87, 87, 0.2)",
      icon: "bi bi-exclamation-diamond"
    },
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
  ]


  constructor(
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private auth: AuthenticationService,
    private hrService: HumanResourcesService, 
  ) {
    this.userDetails = this.auth.loggedInUser.data;
    //console.log(this.userDetails);
    this.employeeId = this.userDetails._id;
  }

  ngOnInit(): void {
    this.getPageData();
  }

  chartOptions: Options;
  Highcharts: typeof Highcharts;

  getPageData = async () => {
    const employeeInfo$ = this.hrService.getEmployeeDetails(this.employeeId)
    employeeInfo$.subscribe(res => {
      this.employeeDetails = res.data;
      console.log(this.employeeDetails)
      this.getManagerImg(this.employeeDetails.managerId)
    })
    
    this.departmentList = await this.hrService.getDepartments().toPromise();
    this.designationList = await this.hrService.getDesignations().toPromise();

    this.getManagerImg(this.employeeId)

    if(this.employeeDetails.leaveAssignment) {
      this.leaveSummary = this.employeeDetails?.leaveAssignment;
      this.totalLeaveDays = this.leaveSummary.reduce((n, {noOfLeaveDays}) => n + noOfLeaveDays, 0);
      this.leaveDaysUsed = this.leaveSummary.reduce((n, {daysUsed}) => n + daysUsed, 0);
      this.leaveBreakdown = this.leaveSummary.map((item, index) => {
        let data = {
          id: index + 1,
          daysUsed: item.daysUsed,
          totalDays: item.noOfLeaveDays,
          name: item.leaveName,
          colorDark: this.leaveAttr[index].colorDark,
          colorLight: this.leaveAttr[index].colorLight,
          icon: this.leaveAttr[index].icon
        }
        return data;
      });
      console.log(this.employeeDetails);
    }

    

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
        departmentList: this.departmentList && this.departmentList['data'],
        designationList: this.designationList && this.designationList['data'],
        employeeDetails: this.employeeDetails,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  getManagerImg(id:string) {
    this.hrService.getEmployeeDetails(id).subscribe(res => {
      this.managerImage = res.data.profilePic;
      this.managerRole = res.data.companyRole;
    })
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
