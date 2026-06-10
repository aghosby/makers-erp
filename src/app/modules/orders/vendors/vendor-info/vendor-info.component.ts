import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FormFields } from 'src/app/shared/models/form-fields';
import { Countries } from 'src/app/core/constants/country-list';

@Component({
  selector: 'app-vendor-info',
  templateUrl: './vendor-info.component.html',
  styleUrls: ['./vendor-info.component.scss']
})
export class VendorInfoComponent implements OnInit {

  vendorInfoForm!: FormGroup;
  vendorInfoFields: FormFields[];

  imgFile: File;
  imgFileName: string;
  imgPic: string | SafeUrl;
  imgUploadError: string;

  apiLoading: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private ordersService: OrdersService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<VendorInfoComponent>,
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.vendorInfoForm = this.fb.group({})
    this.setUpForm();
  }

  setUpForm = async () => {
    this.vendorInfoFields = [
      {
        controlName: 'vendorName',
        controlType: 'text',
        controlLabel: 'Vendor Name',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'contactPersonName',
        controlType: 'text',
        controlLabel: 'Contact Person Name',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'email',
        controlType: 'text',
        controlLabel: 'Email Address',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required, Validators.email],
        order: 3
      },
      {
        controlName: 'phoneNo',
        controlType: 'text',
        controlLabel: 'Phone Number',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'address',
        controlType: 'text',
        controlLabel: 'Shipping Address',
        controlWidth: '100%',
        initialValue: '',
        validators: [],
        order: 7
      },
      {
        controlName: 'state',
        controlType: 'text',
        controlLabel: 'State',
        controlWidth: '48%',
        initialValue: '',
        validators: [],
        order: 8
      },
      {
        controlName: 'city',
        controlType: 'text',
        controlLabel: 'City',
        controlWidth: '48%',
        initialValue: '',
        validators: [],
        order: 9
      },
      {
        controlName: 'country',
        controlType: 'select',
        controlLabel: 'Country',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.createCountryOptions(),
        validators: [],
        order: 10
      },
      {
        controlName: 'zipCode',
        controlType: 'text',
        controlLabel: 'Zip Code',
        controlWidth: '48%',
        initialValue: '',
        validators: [],
        order: 11
      },
      {
        controlName: 'logoUpload',
        controlType: 'file',
        controlLabel: '',
        controlWidth: '100%',
        initialValue: null,
        validators: [],
        order: 12
      },
    ]

    this.vendorInfoFields.sort((a, b) => (a.order - b.order));

    this.vendorInfoFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.vendorInfoForm.addControl(field.controlName, formControl)
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  createCountryOptions() {
    let reqObj = {}
    reqObj = Countries.reduce((agg, item, index) => {
      agg[item['label']] = item['label'];
      return agg;
    }, {})
    return reqObj;
  }

  vendorLogoUpload(event) {
    this.imgFile = event.target.files[0];
    const img = new Image();
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

  onSubmit() {
    this.apiLoading = true
    if (this.vendorInfoForm.valid) {
      const formData = new FormData();

      formData.append('logo', this.imgFile);
      formData.append('vendorName', this.vendorInfoForm.value.vendorName);
      formData.append('contactPersonName', this.vendorInfoForm.value.contactPersonName);
      formData.append('email', this.vendorInfoForm.value.email);
      formData.append('phone', this.vendorInfoForm.value.phone);
      let address = {
        street: this.vendorInfoForm.value.address,
        city: this.vendorInfoForm.value.city,
        state: this.vendorInfoForm.value.state,
        country: this.vendorInfoForm.value.country,
        zipCode: this.vendorInfoForm.value.zipCode
      }
      formData.append('address', JSON.stringify(address));

      this.ordersService.createSupplier(formData).subscribe({
        next: res => {
          if (res.status == 200) {
            this.notifyService.showSuccess('This vendor has been created successfully');
            this.apiLoading = false
            this.dialogRef.close();
          }
        },
        error: err => {
          console.log(err)
          this.apiLoading = false
        }
      })
    }
    else {
      this.notifyService.showError('Please check that all fields have been filled in')
    }
  }

}
