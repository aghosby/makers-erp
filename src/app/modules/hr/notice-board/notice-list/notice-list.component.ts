import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SharedService } from '@services/utils/shared.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormFields } from '@shared/models/form-fields';
import { HumanResourcesService } from '@services/hr/human-resources.service';
import { MatDialog } from '@angular/material/dialog';
import { NoticeInfoComponent } from '../notice-info/notice-info.component';
import { NotificationService } from '@services/utils/notification.service';

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.scss']
})
export class NoticeListComponent implements OnInit {
  noticeInView:any;
  notices:any = [];
  form!: FormGroup;
  formInfoFields: FormFields[];

  employees: any[] = [];
  departmentList: any[] = [];

  apiLoading:boolean = false;

  imgFile: File;
  imgFileName: string;
  imgPic: string | SafeUrl;
  imgUploadError:string;

  constructor(
    private dialog: MatDialog,
    private notifyService: NotificationService,
    private hrService: HumanResourcesService,
    private sharedService: SharedService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({})
  }

  ngOnInit(): void {
    this.getPageData();
  }

  goBack() {
    this.sharedService.goBack();
  }

  getPageData() {
    this.setUpForm()
    this.getNotices();
    this.getDepartments();
    this.getEmployees();
  }

  getNotices() {
    this.hrService.getNotices().subscribe(res => {
      if(res.success) {
        this.notices = res.data
      }
    })
  }

  setUpForm = async () => {
    this.formInfoFields = [
      {
        controlName: 'title',
        controlType: 'text',
        controlLabel: 'Title',
        controlWidth: '100%',
        initialValue: null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'priority',
        controlType: 'select',
        controlLabel: 'Priority',
        controlWidth: '48%',
        initialValue: null,
        selectOptions: {
          low: "Low",
          medium: "Medium",
          high: "High"
        },
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'announcementType',
        controlType: 'select',
        controlLabel: 'Announcement Type',
        controlWidth: '48%',
        initialValue: 'All',
        selectOptions: {
          all: 'All',
          departments: 'Departments',
          employees: 'Specific Employees'
        },
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'expiryDate',
        controlType: 'date',
        controlLabel: 'Expiry Date',
        controlWidth: '48%',
        initialValue: null,
        validators: [],
        order: 5
      },
      {
        controlName: 'imageType',
        controlType: 'select',
        controlLabel: 'Image Type',
        controlWidth: '48%',
        initialValue: null,
        selectOptions: {
          Portrait: "Portrait",
          Landscape: "Landscape"
        },
        validators: [],
        order: 6
      },
      {
        controlName: 'content',
        controlType: 'quillEditor',
        controlLabel: 'Announcement',
        controlWidth: '100%',
        initialValue: this.noticeInView ? this.noticeInView.content : null,
        validators: [Validators.required],
        order: 7
      },
      {
        controlName: 'attachments',
        controlType: 'file',
        controlLabel: '',
        controlWidth: '100%',
        initialValue: null,
        validators: [],
        order: 8
      }
    ]
    this.formInfoFields.sort((a,b) => (a.order - b.order));

    this.formInfoFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.form.addControl(field.controlName, formControl)
    });

    this.form.controls['announcementType'].valueChanges.subscribe(val => {
      if(val === 'departments') {
        const field = {
          controlName: 'departments',
          controlType: 'departmentSelect',
          controlLabel: 'Departments',
          controlWidth: '100%',
          initialValue: this.noticeInView ? this.noticeInView.departments.filter(x => x.departmentName).map(y => y._id) : null,
          selectOptions: this.arrayToObject(this.departmentList, 'departmentName'),
          validators: [Validators.required],
          order: 4
        }
        console.log(field)
        this.addFormFieldControl(field);
        this.removeFormFieldControl('targetEmployees');
      }
      else if(val === 'employees') {
        const field = {
          controlName: 'targetEmployees',
          controlType: 'employeeSelect',
          controlLabel: 'Employees',
          controlWidth: '100%',
          initialValue: this.noticeInView ? this.noticeInView.employees.filter(x => x.fullName).map(y => y._id) : null,
          selectOptions: this.arrayToObject(this.employees, 'fullName'),
          validators: [Validators.required],
          order: 4
        }
        this.addFormFieldControl(field);
        this.removeFormFieldControl('departments');
      }
      else {
        this.removeFormFieldControl('targetEmployees');
        this.removeFormFieldControl('departments');
      }
    })

  }

  onSubmit() {
    this.form.markAllAsTouched();
    if(this.form.valid) {
      this.apiLoading = true;
      const formData = new FormData();

      formData.append('title', this.form.value.title);
      formData.append('priority', this.form.value.priority);
      formData.append('announcementType', this.form.value.announcementType);
      formData.append('expiryDate', this.form.value.expiryDate);
      formData.append('content', this.form.value.content);
      formData.append('attachments', this.imgFile);

      if(this.form.value.announcementType == 'departments') {
        this.form.value.departments.forEach(id => { formData.append('departments[]', id); });
      }
      else if(this.form.value.announcementType == 'employees') {
        this.form.value.departments.forEach(id => { formData.append('targetEmployees[]', id); });
      }

      this.hrService.createNotice(formData).subscribe({
        next: res => {
          if(res.status == 200) {
            this.notifyService.showSuccess('This announcement has been created successfully');
            this.apiLoading = false;
          }
        },
        error: err => {
          this.apiLoading = false
        } 
      })
    }
    else {
      this.notifyService.showError("Please fill all required fields")
    }
  }

  addFormFieldControl(field) {
    this.formInfoFields.push(field);
    this.formInfoFields.sort((a,b) => (a.order - b.order));
    const formControl = this.fb.control(field.initialValue, field.validators)
    this.form.addControl(field.controlName, formControl)
  }

  removeFormFieldControl(controlName: string) {
    // Remove metadata entry
    this.formInfoFields = this.formInfoFields.filter(
      f => f.controlName !== controlName
    );

    // Remove the control from the form group
    if (this.form.contains(controlName)) {
      this.form.removeControl(controlName);
    }
    this.formInfoFields.sort((a,b) => (a.order - b.order));
  }

  imgFileUpload(event) {
    this.imgFile = event.target.files[0];
    const img = new Image();
    let imgWidth;
    let imgHeight;
    let imgRatio;
    img.src = window.URL.createObjectURL(event.target.files[0]);
    img.onload = () => {
      if (this.imgFile.size > 1000000) {
        this.imgUploadError = 'Please check that your image size is not more than 1MB';
        this.imgFileName = '';
        this.imgFile = null
      }
      else {
        this.imgUploadError = '';
        this.imgFileName = this.imgFile.name;
        this.imgPic = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(this.imgFile)
        );
      }
    }
  }

  arrayToObject(arrayVar, key:string) {
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      agg[item['_id']] = item[key];
      return agg;
    }, {})
    return reqObj;
  }

  removeDept(deptName: string) {
    const selectedDepts = this.form.value['departments'] as string[];
    this.removeFirst(selectedDepts, deptName);
    this.form.get['departments'].setValue(selectedDepts); // To trigger change detection
  }

  removeEmployee(fullName: string) {
    const selectedEmployees = this.form.value['targetEmployees'] as string[];
    this.removeFirst(selectedEmployees, fullName);
    this.form.get['targetEmployees'].setValue(selectedEmployees); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  //Get all Departments
  getDepartments() {
    this.hrService.getDepartments().subscribe((res:any) => {
      this.departmentList = res.data;
    });
  }

  //Get all Employees
  getEmployees() {
    this.hrService.getEmployees().subscribe((res:any) => {
      this.employees = res.data;
    });
  }

  viewNotice(data:any) {
    this.noticeInView = data;
    this.dialog.open(NoticeInfoComponent, {
      width: '40%',
      height: 'auto',
      data: this.noticeInView,
    });
  }

}
