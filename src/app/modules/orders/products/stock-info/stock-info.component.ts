import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FormFields } from 'src/app/shared/models/form-fields';
import { CURRENCY } from 'src/app/core/constants/general-data';

@Component({
  selector: 'app-stock-info',
  templateUrl: './stock-info.component.html',
  styleUrls: ['./stock-info.component.scss']
})
export class StockInfoComponent implements OnInit {

  stockInfoForm!: FormGroup;
  stockInfoFields: FormFields[];

  productsList:any[] = [];
  currencyOptions:any[] = CURRENCY;

  apiLoading:boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<StockInfoComponent>,
    private ordersService: OrdersService,
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.stockInfoForm = this.fb.group({})
    // this.industriesList = this.dialogData.industries;
    // console.log(this.industriesList)
    this.setUpForm();
  }

  setUpForm = async () => {
    this.stockInfoFields = [
      {
        controlName: 'productId',
        controlType: 'select',
        controlLabel: 'Product',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.arrayToObject(this.dialogData.productInfo, 'name'),
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'quantity',
        controlType: 'number',
        controlLabel: 'Quantity',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'unitCostPrice',
        controlType: 'number',
        controlLabel: 'Unit Cost Price',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'costPriceCurrency',
        controlType: 'select',
        controlLabel: 'Cost Price Currency',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.arrayToObject(this.currencyOptions, 'name'),
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'unitSellingPrice',
        controlType: 'number',
        controlLabel: 'Unit Selling Price',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'sellingPriceCurrency',
        controlType: 'select',
        controlLabel: 'Selling Price Currency',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.arrayToObject(this.currencyOptions, 'name'),
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'priceMarkup',
        controlType: 'number',
        controlLabel: 'Price Markup',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 7
      },      
      {
        controlName: 'supplier',
        controlType: 'select',
        controlLabel: 'Vendor',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.arrayToObject(this.dialogData.suppliers, 'supplierName'),
        validators: [Validators.required],
        order: 8
      }
    ]

    this.stockInfoFields.sort((a,b) => (a.order - b.order));

    this.stockInfoFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.stockInfoForm.addControl(field.controlName, formControl);
    });

    this.stockInfoForm.controls['productId'].setValue(this.dialogData.productInfo._id)
  }

  onSubmit() {
    this.apiLoading = true
    if(this.stockInfoForm.valid) {
      const payload = this.stockInfoForm.value
      console.log(payload);
      this.ordersService.createStock(payload).subscribe({
        next: res => {
          console.log(res);
          if(res.success) {
            this.notifyService.showSuccess('This product stock has been created successfully');
            this.dialogRef.close();
            this.apiLoading = false;
          }
          //this.getPageData();
        },
        error: err => {
          console.log(err);
          this.apiLoading = false;
          this.notifyService.showError(err.error.error);
        } 
      })
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  //Converts an array to an Object of key value pairs
  arrayToObject(arrayVar, key:string) {
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      agg[item['_id']] = item[key];
      return agg;
    }, {})
    // console.log(reqObj);
    return reqObj;
  }

}
