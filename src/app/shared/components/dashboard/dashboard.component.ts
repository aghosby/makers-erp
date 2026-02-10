import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
// import { TableColumn } from 'src/app/shared/models/table-columns';
import { MatTableDataSource } from '@angular/material/table';
import * as Highcharts from 'highcharts';
import { DatePipe } from '@angular/common';
// import { PayrollSummary } from 'src/app/shared/models/payroll-data';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { SharedService } from 'src/app/shared/services/utils/shared.service';
import { concat, forkJoin, of } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { LeaveReviewComponent } from 'src/app/modules/hr/leave-management/leave-review/leave-review.component';
import { ExpenseRequestReviewComponent } from 'src/app/modules/hr/expense-management/expense-request-review/expense-request-review.component';
import { NoticeInfoComponent } from 'src/app/modules/hr/notice-board/notice-info/notice-info.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  userDetails: any;
  dateTime: Date;

  selectedIndex = 0;
  slideInterval = 5000;

  dashboardSummary: any[] = [];
  departmentList: any[] = [];
  employeeList: any[] = [];
  teamMembers:any[] = []
  payrollPeriods: any[] = [];
  payrollGraphData: any[] = [];
  payrollYears:any;
  currentPayrollYear:any;

  cardTriggerVal:string = 'birthdays';
  leaveRequests:any[];
  expenseRequests:any[];
  approvalRequests:any[];

  birthdays:any[];
  workAnniversaries:any[];
  notices:any = [];


  carouselItems = [
    {
      label: "HR",
      image: "https://greenpegacademy.com/wp-content/uploads/2022/10/sebastian-svenson-d2w-_1LJioQ-unsplash-1-scaled.jpg",
      caption: ""
    },
    // {
    //   label: "Project Management",
    //   image: "https://silo-inc.com/wp-content/uploads/2023/05/flat-lay-people-working-office-scaled.jpg",
    //   caption: "Empowering Project Management Excellence"
    // },
    // {
    //   label: "Supply Chain",
    //   image: "https://silo-inc.com/wp-content/uploads/2023/05/hand-with-support-gears-isolated-white-background-1-scaled.jpg",
    //   caption: "Optimizing Your Supply Chain Management Processes"
    // },
    // {
    //   label: "CRM",
    //   image: "https://silo-inc.com/wp-content/uploads/2023/05/cheerful-call-center-operators-during-working-process-1-scaled.jpg",
    //   caption: "Streamline Customer Relationship with Our CRM Module"
    // }
  ]

  view: any[] = [620, 320];
  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };

  contactsVsLeadsScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };
  contactsVsLeads = [
    {
      "name": "Payroll Earnings",
      "status": "contacts"
    },
    {
      "name": "Expenses",
      "status": "leads"
    },
  ]

  contactsVsLeadsData = [
    {
      "name": "Jan",
      "series": [
        {
          "name": "contacts",
          "value": 27
        },
        {
          "name": "leads",
          "value": 100
        }
      ]
    },
    {
      "name": "Feb",
      "series": [
        {
          "name": "contacts",
          "value": 45
        },
        {
          "name": "leads",
          "value": 85
        }
      ]
    },
    {
      "name": "Mar",
      "series": [
        {
          "name": "contacts",
          "value": 36
        },
        {
          "name": "leads",
          "value": 76
        }
      ]
    },
    {
      "name": "Apr",
      "series": [
        {
          "name": "contacts",
          "value": 32
        },
        {
          "name": "leads",
          "value": 60
        }
      ]
    },
    {
      "name": "May",
      "series": [
        {
          "name": "contacts",
          "value": 21
        },
        {
          "name": "leads",
          "value": 124
        }
      ]
    },
    {
      "name": "Jun",
      "series": [
        {
          "name": "contacts",
          "value": 36
        },
        {
          "name": "leads",
          "value": 58
        }
      ]
    }
  ];

  pieChartColorScheme = {
    domain: ['rgba(54, 171, 104, 0.7)', 'rgba(229, 166, 71, 0.7)', 'rgba(235, 87, 87, 0.7)']
  };
  invoiceStatus = [
    {
      "name": "Paid",
      "value": 22770,
      "status": "complete"
    },
    {
      "name": "Partially Paid",
      "value": 22070,
      "status": "pending"
    },
    {
      "name": "Pending",
      "value": 40770,
      "status": "warning"
    },
  ]

  constructor(
    public dialog: MatDialog,
    private route: Router,
    private datePipe: DatePipe,
    private authService: AuthenticationService,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private sharedService: SharedService,
  ) {
    setInterval(() => {
      this.dateTime = new Date()
    }, 1000)

    this.userDetails = this.authService.loggedInUser.data;
    console.log(this.userDetails);
  }

  ngOnInit(): void {
    this.getPageData();
  }

  getPageData = async () => {
    this.departmentList = await this.hrService.getDepartments().toPromise();
    //this.departmentList = await this.sharedService.getDepartments();
    const employees$ = this.hrService.getEmployees().subscribe(res => {
      this.employeeList = res.data;
      if(!this.userDetails.isSuperAdmin) {
        this.employeeList.map(x => {
          if(x.department == this.userDetails.department) this.teamMembers.push(x);
        })
        //console.log('Team', this.teamMembers)
      }
      this.generateUpcomingBithdays();
      this.generateUpcomingAnniversaries();
    });

    this.getNotices();

    const payrollYears$ = this.hrService.getPayrollYears().subscribe({
      next: res => {
        this.payrollYears = res.data;
        this.currentPayrollYear = this.payrollYears ? this.payrollYears[0] : 2025;
      },
      error: err => {}
    })    
    // console.log(this.payrollYears);
    const payrollGraphData$ = this.hrService.getPayrollGraph(this.currentPayrollYear).subscribe(res => this.payrollGraphData = res.data)
    //console.log(this.payrollGraphData);
    this.getPayrollPeriods();
    // console.log(this.employeeList)

    const leaveRequests$ = this.hrService.getRequestedLeaveApprovals();
    const expenseRequests$ = this.userDetails.isManager ? this.hrService.getRequestedExpenseApprovals() : of({data:[]});
    forkJoin([leaveRequests$, expenseRequests$]).pipe(
      map((res) => {
        const reqs = res[0]['data'].map(x => {return {...x, type:'leave'}}).concat(res[1]['data'].map(x => {return {...x, type:'expense'}}));
        const pendingReqs = reqs.filter((x) => {
          return x.status === 'Pending'
        })
        return this.userDetails.isSuperAdmin || this.userDetails.isManager ? pendingReqs : reqs
      })
    ).subscribe(res => {
      this.approvalRequests = res
      //console.log('Requests', this.approvalRequests)
    })

    

    this.dashboardSummary = [
      {
        id: 1,
        value: this.employeeList['data']?.length,
        percentChange: "5%",
        name: "Employees",
        colorDark: "rgb(54,171,104)",
        colorLight: "rgba(54,171,104,0.2)",
        icon: "bi bi-arrow-up-right",
        symbol: "users"
      },
      {
        id: 2,
        value: this.departmentList['data']?.length,
        percentChange: "",
        name: "Departments",
        colorDark: "rgb(235, 87, 87)",
        colorLight: "rgba(235, 87, 87, 0.2)",
        icon: "bi bi-arrow-down-right",
        symbol: "layer"
      },
      {
        id: 3,
        value: `NGN ${this.payrollPeriods[0]?.netEarnings ? this.payrollPeriods[0]?.netEarnings : 0}`,
        percentChange: "14%",
        name: "Net Salary",
        colorDark: "rgb(235, 87, 87)",
        colorLight: "rgba(235, 87, 87, 0.2)",
        icon: "bi bi-arrow-down-right",
        symbol: "cash"
      }
    ]
  }

  getPayrollPeriods() {
    this.hrService.getPayrollPeriods().subscribe({
      next:(res) => {
        if(res.success) {
          this.payrollPeriods = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  changePayrollYear(year:any) {
    this.currentPayrollYear = year;
    this.hrService.getPayrollGraph(year).subscribe(res => this.payrollGraphData = res.data);
  }

  generateUpcomingBithdays() {
    this.birthdays = this.orderByUpcoming(this.employeeList, 'dateOfBirth')
  }

  generateUpcomingAnniversaries() {
    this.workAnniversaries = this.orderByUpcoming(this.employeeList, 'employmentStartDate')
  }

  orderByUpcoming(items, dateKey:string) {
    const now = new Date();
    const nowMonth = now.getMonth(); // 0-indexed
    const nowDate = now.getDate();

    return items.slice().sort((a, b) => {
      const dA = new Date(a[dateKey]);
      const dB = new Date(b[dateKey]);

      const aMonthDay = { month: dA.getMonth(), day: dA.getDate() };
      const bMonthDay = { month: dB.getMonth(), day: dB.getDate() };

      const isAFuture = aMonthDay.month > nowMonth || (aMonthDay.month === nowMonth && aMonthDay.day >= nowDate);
      const isBFuture = bMonthDay.month > nowMonth || (bMonthDay.month === nowMonth && bMonthDay.day >= nowDate);

      if (isAFuture && !isBFuture) return -1;
      if (!isAFuture && isBFuture) return 1;

      // Compare month and day
      if (aMonthDay.month !== bMonthDay.month) {
        return aMonthDay.month - bMonthDay.month;
      }
      return aMonthDay.day - bMonthDay.day;
    });
  }

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

  strToDate(dateVal: string) {
    //console.log(dateVal)
    if(dateVal != 'undefined') {
      let reqDate:any = new Date(dateVal)
      //console.log(reqDate)
      if(reqDate == 'Invalid Date' && dateVal != 'undefined') {
        const [day, month, year] = dateVal.split('-');
        let newFormat = new Date(+year, +month - 1, +day);
        reqDate = newFormat;
      }
      return reqDate;
    }
  }

  //CAROUSEL SLIDE FUNCTIONS
  selectSlide(index: number): void {
    this.selectedIndex = index;
  }

  onPrevClick(): void {
    if(this.selectedIndex === 0) {
      this.selectedIndex = this.carouselItems.length - 1;
    }
    else {
      this.selectedIndex--;
    }
  }

  onNextClick(): void {
    if(this.selectedIndex === this.carouselItems.length - 1) {
      this.selectedIndex = 0;
    }
    else {
      this.selectedIndex++;
    }
  }

  autoSlideImages(): void {
    setInterval(() => {
      this.onNextClick();
    }, this.slideInterval)
  }

  actionRequest(details: any, actionType:string) {
    if(this.userDetails.isSuperAdmin || this.userDetails.isManager) {
      if(actionType == 'leave') {
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
          //this.getPageData();
        });
      }
      else {
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
          //this.getPageData();
        });
      }
    }    
  }

  viewNotice(data?:any) {
    this.dialog.open(NoticeInfoComponent, {
      width: '40%',
      height: 'auto',
      data: data,
    });
  }

  getNotices() {
    this.hrService.getNotices().subscribe(res => {
      if(res.success) {
        this.notices = res.data
      }
    })
  }

}
