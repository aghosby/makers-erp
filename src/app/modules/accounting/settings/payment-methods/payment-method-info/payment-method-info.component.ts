import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MODAL_DATA, ModalRef } from 'src/app/shared/models/modal.models';
import { FormFields } from 'src/app/shared/models/form-fields';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-payment-method-info',
  templateUrl: './payment-method-info.component.html',
  styleUrls: ['./payment-method-info.component.scss']
})
export class PaymentMethodInfoComponent implements OnInit {

  paymentForm!: FormGroup;
  fieldData: FormFields[];
  apiLoading = false;

  get rowFields(): FormFields[] {
    return (this.fieldData ?? [])
      .filter(f => f.controlType !== 'switch')
      .sort((a, b) => a.order - b.order);
  }

  get switchFields(): FormFields[] {
    return (this.fieldData ?? [])
      .filter(f => f.controlType === 'switch')
      .sort((a, b) => a.order - b.order);
  }

  constructor(
    @Inject(MODAL_DATA) public data: any,
    private modalRef: ModalRef,
    private accountingService: AccountingService,
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const d = this.data.isExisting ? this.data.modalInfo : {};

    const accountOptions = (this.data.linkedAccounts ?? []).reduce((acc: any, a: any) => {
      acc[a._id] = a.label;
      return acc;
    }, {});

    this.fieldData = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Payment Method Name',
        controlWidth: '100%',
        initialValue: d.name ?? '',
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'code',
        controlType: 'text',
        controlLabel: 'Code',
        controlWidth: '100%',
        initialValue: d.code ?? '',
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'defaultAccountId',
        controlType: 'select',
        controlLabel: 'Default Bank / Cash Account',
        controlWidth: '100%',
        initialValue: d.defaultAccountId ?? null,
        selectOptions: accountOptions,
        validators: null,
        order: 3
      },
      {
        controlName: 'status',
        controlType: 'select',
        controlLabel: 'Status',
        controlWidth: '100%',
        initialValue: d.status ?? 'Active',
        selectOptions: { Active: 'Active', Inactive: 'Inactive' },
        validators: null,
        order: 4
      },
      {
        controlName: 'requiresBankReference',
        controlType: 'switch',
        controlLabel: 'Requires Bank Reference',
        controlWidth: '100%',
        initialValue: d.requiresBankReference ?? false,
        validators: null,
        order: 5
      },
      {
        controlName: 'requiresChequeNumber',
        controlType: 'switch',
        controlLabel: 'Requires Cheque Number',
        controlWidth: '100%',
        initialValue: d.requiresChequeNumber ?? false,
        validators: null,
        order: 6
      },
      {
        controlName: 'requiresAttachment',
        controlType: 'switch',
        controlLabel: 'Requires Attachment',
        controlWidth: '100%',
        initialValue: d.requiresAttachment ?? false,
        validators: null,
        order: 7
      },
    ];

    this.paymentForm = this.fb.group({});
    this.fieldData.forEach(field => {
      this.paymentForm.addControl(field.controlName, this.fb.control(field.initialValue, field.validators));
    });
  }

  onSubmit(): void {
    if (!this.paymentForm.valid) return;

    this.apiLoading = true;
    const payload = this.paymentForm.value;

    const request$ = this.data.isExisting
      ? this.accountingService.updatePaymentMethod(payload, this.data.id)
      : this.accountingService.createPaymentMethod(payload);

    request$.subscribe({
      next: res => {
        if (res.status === 200) {
          const msg = this.data.isExisting ? 'Payment method updated successfully' : 'Payment method created successfully';
          this.notifyService.showSuccess(msg);
          this.apiLoading = false;
          this.modalRef.dismiss();
        }
      },
      error: err => {
        this.apiLoading = false;
        this.notifyService.showError(err.error?.error ?? 'Something went wrong');
      }
    });
  }
}
