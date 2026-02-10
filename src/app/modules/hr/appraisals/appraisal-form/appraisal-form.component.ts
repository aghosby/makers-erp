import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { ActivatedRoute } from '@angular/router';
import { CreateKpiComponent } from '../create-kpi/create-kpi.component';

@Component({
  selector: 'app-appraisal-form',
  templateUrl: './appraisal-form.component.html',
  styleUrls: ['./appraisal-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppraisalFormComponent implements OnInit {

  @ViewChild('commentsField') myDiv: ElementRef;

  activeTab:number = -1;
  appraisalPending: boolean = true;
  employeeDetails: any;
  employeeInViewId: string;
  appraisalInfo: any = {};
  ratingScale: any[] = [];
  appraisalFormFields: FormFields[];
  kpiRatingFormFields: FormFields[];
  appraisalForm!: FormGroup;
  kpiRatingForm!: FormGroup;
  matrixSelectOptions: any;

  employees:any[] = [];

  appraisalPeriods: any[];
  currentPeriodId: string;
  periodInView: any;

  kpiCriteria: any[] = [];

  displayedColumns: any[];
  dataSource: MatTableDataSource<any>;

  //KPI Ratings Table Column Names
  tableColumns: TableColumn[] = [
    // {
    //   key: "kpiName",
    //   label: "KPI Name",
    //   order: 1,
    //   columnWidth: "16%",
    //   cellStyle: "width: 100%",
    //   sortable: false
    // },
    {
      key: "kpiDescription",
      label: "KPI Description",
      order: 2,
      columnWidth: "20%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "employeeRating",
      label: "Employee Rating",
      order: 3,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "employeeComments",
      label: "Employee Comments",
      order: 4,
      columnWidth: "22%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "managerRating",
      label: "Manager Rating",
      order: 5,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "managerComments",
      label: "Manager Comments",
      order: 6,
      columnWidth: "22%",
      cellStyle: "width: 100%",
      sortable: true
    },

  ]

  constructor(
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private authService: AuthenticationService,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.getInitialData();
    this.appraisalForm = this.fb.group({});

    this.matrixSelectOptions = {
      0: 'Low',
      1: 'Moderate',
      2: 'High'
    }

    this.appraisalFormFields = [
      {
        controlName: 'employeeName',
        controlType: 'text',
        controlLabel: 'Employee Name',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 1
      },
      {
        controlName: 'employeeSignature',
        controlType: 'text',
        controlLabel: 'Employee Signature',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 1
      },
      {
        controlName: 'employeeSignDate',
        controlType: 'text',
        controlLabel: 'Employee Signature Date',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 2
      },
      {
        controlName: 'employeePotential',
        controlType: 'select',
        controlLabel: 'Employee Potential',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: {
          0: 'Low',
          1: 'Moderate',
          2: 'High'
        },
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'employeePerformance',
        controlType: 'select',
        controlLabel: 'Employee Performance',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: {
          0: 'Low',
          1: 'Moderate',
          2: 'High'
        },
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'managerSummary',
        controlType: 'text',
        controlLabel: 'Manager Summary',
        controlWidth: '100%',
        initialValue: '',
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'managerName',
        controlType: 'text',
        controlLabel: 'Manager Name',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 4
      },
      {
        controlName: 'managerSignature',
        controlType: 'text',
        controlLabel: 'Manager Signature',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 5
      },
      {
        controlName: 'managerSignDate',
        controlType: 'text',
        controlLabel: 'Manager Signature Date',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 6
      }
    ]

    this.kpiRatingFormFields = [
      {
        controlName: 'employeeRating',
        controlType: 'text',
        controlLabel: 'Employee Rating',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 1
      },
      {
        controlName: 'employeeComments',
        controlType: 'text',
        controlLabel: 'Employee Comments',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 2
      },
      {
        controlName: 'managerRating',
        controlType: 'text',
        controlLabel: 'Manager Rating',
        controlWidth: '100%',
        initialValue: '',
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'managerComments',
        controlType: 'text',
        controlLabel: 'Manager Comments',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 4
      },
    ]

    //Final form details fields generation
    this.appraisalFormFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.appraisalForm.addControl(field.controlName, formControl)
    })

  }

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.tableColumns.sort((a,b) => (a.order - b.order));
    this.displayedColumns = this.tableColumns.map(column => column.label);
    const employees$ = this.hrService.getEmployees().subscribe(res => this.employees = res.data)       
  }

  getInitialData = async () => {
    this.employeeInViewId = this.activatedRoute.snapshot.params["id"];
    this.employeeDetails = this.authService.loggedInUser.data;

    if(this.employeeInViewId) {
      this.appraisalPending = false;
    }
    else {
      this.employeeInViewId = this.employeeDetails._id;
    }
    console.log(this.employeeInViewId);
    const appraisalPeriods$ = this.hrService.getAppraisalPeriods().subscribe(res => {
      this.appraisalPeriods = res.data;
      if(this.appraisalPeriods.length > 0) {
        this.currentPeriodId = this.appraisalPeriods[0]._id;
        if(this.currentPeriodId) this.getPageData();
      } 
    }) 
  }

  getPageData = async () => {
    // KPI Rating Form Declaration
    this.kpiRatingForm = this.fb.group({
      kpiGroups: this.fb.array([])
    });

    const periodinView$ = this.hrService.getEmployeeAppraisalDetails(this.employeeInViewId, this.currentPeriodId).subscribe(res => {
      this.periodInView = res.data;
      console.log(this.periodInView)
      this.appraisalPending = this.periodInView?.status == 'Pending';
      this.kpiCriteria = this.periodInView.kpiGroups;

      if(this.periodInView.appraisalPeriodProgress > 1) {
        this.displayKpiRatings();
        this.populateGrps();
      }

      if(this.periodInView.status !== 'Pending') {
        this.appraisalForm.get('employeeName').setValue(this.periodInView.fullName);
        this.appraisalForm.get('employeeSignature').setValue(this.periodInView.fullName);
        this.appraisalForm.get('employeeSignDate').setValue(this.strToDate(this.periodInView.employeeSubmissionDate, 'startDate'));
      }
      if(this.periodInView.status == 'Manager reviewed') {
        this.appraisalForm.get('managerName').setValue(this.periodInView.managerName);
        this.appraisalForm.get('managerSignature').setValue(this.periodInView.managerName);
        this.appraisalForm.get('managerSignDate').setValue(this.strToDate(this.periodInView.managerSubmissionDate, 'endDate'));
        this.appraisalForm.get('managerSummary').setValue(this.periodInView.managerOverallComment);
        this.appraisalForm.get('employeePerformance').setValue(String(this.periodInView.matrixScore[0]));
        this.appraisalForm.get('employeePotential').setValue(String(this.periodInView.matrixScore[1]));
      }
    })
    
  }

  populateGrps() {
    this.kpiCriteria.forEach((item, index) => {
      item.groupKpis.forEach(kpi => {
        this.createKpis(item.groupName, index, kpi);
      })
    })
  }

  // Get form controls of KPI Rating Form
  // get kpiGroupsArray() {
  //   return <FormArray>this.kpiRatingForm.get('kpiGroups');
  // }
  groups(): FormArray {
    return <FormArray>this.kpiRatingForm.get('kpiGroups');
    // return this.kpiRatingForm.get("kpiGroups") as FormArray
  }

  // Generate form view with initial values from KPI Group array
  displayKpiRatings() {
    let kpiInfo = this.kpiCriteria.map((grp: any, grpIndex: number) =>
      this.initKpiGroups(grp, grpIndex)
    );
    this.kpiRatingForm.setControl('kpiGroups', this.fb.array(kpiInfo));
  }

  // Initialize form group for each KPI Group
  initKpiGroups(kpiGroup: any, grpIndex:number): FormGroup {
    return this.fb.group({
      [kpiGroup.groupName]: this.fb.array([])
    })
  }

  // Generate dynamic kpi arrays for each kpi group 
  // generateKpisArray(grpName: string, grpIndex: number, grpKpis: any) {
  //   return grpKpis.map(kpi => {
  //     this.initKpis(kpi);
  //   });
  // }

  // Set kpi rating controls after form group generation
  grpKpis(grpIndex:number, grpName: string,) : FormArray {
    return this.groups().at(grpIndex).get(grpName) as FormArray
  }

  // Initialize form group of each KPI entry
  initKpis(kpi: any) {
    return this.fb.group({
      [kpi.kpiName]: this.fb.group({
        employeeRating: [kpi.remarks?.employeeRating, this.appraisalPending ? Validators.required : ''],
        employeeComments: [kpi.remarks?.employeeComment],
        managerRating: [kpi.remarks?.managerRating, this.appraisalPending ? '' : Validators.required],
        managerComments: [kpi.remarks?.managerComment]
      })
    })
  }

  // Push each created form group into the kpi array
  createKpis(groupName: string, groupIndex:number, kpi: any) {
    this.grpKpis(groupIndex, groupName).push(this.initKpis(kpi));
  }

  rateEmployee(val) {
    console.log(val);
  }

  submit() {
    console.log(this.kpiRatingForm.value);
  }

  setAppraisalData = async (details) => {
    console.log(details);
    this.periodInView = details;
    this.currentPeriodId = details._id;
    this.getPageData();
  }

  ratingByEmployee(i, grpName, j, kpiName, ratingVal) {
    let employeeCtrl = this.kpiRatingForm.get(['kpiGroups', i, grpName, j, kpiName]) as FormGroup;
    employeeCtrl.get('employeeRating').setValue(ratingVal);
  }

  ratingByManager(i, grpName, j, kpiName, ratingVal) {
    let employeeCtrl = this.kpiRatingForm.get(['kpiGroups', i, grpName, j, kpiName]) as FormGroup;
    employeeCtrl.get('managerRating').setValue(ratingVal);
  }

  strToDate(dateVal: string, key:string) {
    // console.log(dateVal);
    if(key == 'startDate' || key == 'endDate') {
      let newFormat = new Date(dateVal);
      return this.datePipe.transform(newFormat, 'd MMMM, y')
    }
    else {
      const [day, month, year] = dateVal.split('/');
      let newFormat = new Date(+year, +month - 1, +day);
      // console.log(newFormat.toDateString());
      return this.datePipe.transform(newFormat, 'd MMMM, y')
    }    
  }

  submitAppraisalEntry(finished: boolean) {
    console.log(finished);

    if(this.kpiRatingForm.valid) {
      let data = {
        appraisalPeriodId: this.currentPeriodId,
        employeeSignStatus: finished,
        kpiGroups: this.generateKpiGrpValues()
      }
      console.log(data);
      this.hrService.submitAppraisalEntry(data).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('Your appraisal entry has been sent successfully');
            this.getPageData();
          }
        },
        error: err => {
          console.log(err)
          this.notifyService.showError(err.error.error);
        } 
      })
    }

  }

  submitAppraisalReview(finished: boolean) {
    console.log(finished);

    if(this.kpiRatingForm.valid) {
      let data = {
        appraisalPeriodId: this.currentPeriodId,
        managerSignStatus: finished,
        matrixScore: [Number(this.appraisalForm.controls['employeePerformance'].value), Number(this.appraisalForm.controls['employeePotential'].value)],
        managerOverallComment: this.appraisalForm.controls['managerSummary'].value,
        kpiGroups: this.generateKpiGrpValues()
      }
      console.log(data);
      this.hrService.submitAppraisalReview(data, this.periodInView.employeeId).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('Your appraisal review has been sent successfully');
            this.getPageData();
          }
        },
        error: err => {
          console.log(err)
          this.notifyService.showError(err.error.error);
        } 
      })
    }

  }

  generateKpiGrpValues() {
    let grpRatings = [];
    this.kpiCriteria.map((kpiGrp, i) => {
      let grpValues = {};
      let kpiRatings = [];

      grpValues['groupId'] = kpiGrp.groupId;
      grpValues['groupName'] = kpiGrp.groupName;
      grpValues['description'] = kpiGrp.description;
      kpiGrp.groupKpis.map((kpi, j) => {
        let kpiValues = {};
        let remarksObj = {}
        let formCtrl = this.kpiRatingForm.get(['kpiGroups', i, kpiGrp.groupName, j, kpi.kpiName]) as FormGroup;
        kpiValues['kpiId'] = kpi.kpiId;
        kpiValues['kpiName'] = kpi.kpiName;
        kpiValues['kpiDescription'] = kpi.kpiDescription;
        remarksObj['employeeComment'] = formCtrl.controls['employeeComments'].value;
        remarksObj['employeeRating'] = formCtrl.controls['employeeRating'].value;
        if(!this.appraisalPending) {
          remarksObj['managerComment'] = formCtrl.controls['managerComments'].value;
          remarksObj['managerRating'] = formCtrl.controls['managerRating'].value;
        }
        kpiValues['remarks'] = remarksObj;
        kpiRatings.push(kpiValues);
      })
      grpValues['groupKpis'] = kpiRatings;
      grpRatings.push(grpValues);
    })
    console.log(grpRatings);

    return grpRatings;
  }


  toggleAccordionInfo(index:number) {
    this.activeTab == index ? this.activeTab = -1 : this.activeTab = index;
  }
  
  
  /* KPI Functions */
  
  // Create a KPI
  createKpi(info: any) {
    this.dialog.open(CreateKpiComponent, {
      width: '35%',
      height: 'auto',
      data: {
        groupId: info._id,
        modalInfo: info,
        employees: this.employees,
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  // Update a KPI
  updateKpi(details) {
    this.dialog.open(CreateKpiComponent, {
      width: '35%',
      height: 'auto',
      data: {
        groupId: details.kpiGroupId,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  //Delete a KPI
  deleteKpi(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.kpiName + ' KPI',
      message: 'Are you sure you want to remove this kpi?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteKpi(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('This KPI has been deleted successfully');
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
