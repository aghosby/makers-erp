import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MODAL_DATA, ModalRef } from 'src/app/shared/models/modal.models';
import { FormFields } from 'src/app/shared/models/form-fields';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-tax-rate-info',
  templateUrl: './tax-rate-info.component.html',
  styleUrls: ['./tax-rate-info.component.scss']
})
export class TaxRateInfoComponent implements OnInit {

  taxForm!: FormGroup;
  fieldData: FormFields[];
  apiLoading = false;

  constructor(
    @Inject(MODAL_DATA) public data: any,
    private modalRef: ModalRef,
    private accountingService: AccountingService,
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const d = this.data.isExisting ? this.data.modalInfo : {};

    const branchOptions = (this.data.branches ?? []).reduce((acc: any, b: any) => {
      acc[b.branchName] = b.branchName;
      return acc;
    }, { All: 'All' });

    const accountOptions = (this.data.accounts ?? []).reduce((acc: any, a: any) => {
      acc[a._id] = `${a.code} — ${a.name}`;
      return acc;
    }, {});

    this.fieldData = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Tax Name',
        controlWidth: '100%',
        initialValue: d.name ?? '',
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'taxType',
        controlType: 'select',
        controlLabel: 'Tax Type',
        controlWidth: '100%',
        initialValue: d.taxType ?? null,
        selectOptions: { VAT: 'VAT', WHT: 'Withholding Tax', 'Sales Tax': 'Sales Tax', 'Service Tax': 'Service Tax' },
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'rate',
        controlType: 'number',
        controlLabel: 'Tax Rate (%)',
        controlWidth: '100%',
        initialValue: d.rate ?? '',
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'method',
        controlType: 'select',
        controlLabel: 'Tax Method',
        controlWidth: '100%',
        initialValue: d.method ?? null,
        selectOptions: { Inclusive: 'Inclusive', Exclusive: 'Exclusive' },
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'appliesTo',
        controlType: 'select',
        controlLabel: 'Applies To',
        controlWidth: '100%',
        initialValue: d.appliesTo ?? null,
        selectOptions: { Sales: 'Sales', Purchases: 'Purchases', Both: 'Both' },
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'branch',
        controlType: 'select',
        controlLabel: 'Branch / Company',
        controlWidth: '100%',
        initialValue: d.branch ?? 'All',
        selectOptions: branchOptions,
        validators: null,
        order: 6
      },
      {
        controlName: 'taxPayableAccountId',
        controlType: 'select',
        controlLabel: 'Tax Payable Account',
        controlWidth: '100%',
        initialValue: d.taxPayableAccountId ?? null,
        selectOptions: accountOptions,
        validators: null,
        order: 7
      },
      {
        controlName: 'taxReceivableAccountId',
        controlType: 'select',
        controlLabel: 'Tax Receivable Account',
        controlWidth: '100%',
        initialValue: d.taxReceivableAccountId ?? null,
        selectOptions: accountOptions,
        validators: null,
        order: 8
      },
      {
        controlName: 'withholdingAccountId',
        controlType: 'select',
        controlLabel: 'Withholding Account',
        controlWidth: '100%',
        initialValue: d.withholdingAccountId ?? null,
        selectOptions: accountOptions,
        validators: null,
        order: 9
      },
      {
        controlName: 'startDate',
        controlType: 'date',
        controlLabel: 'Effective Start Date',
        controlWidth: '100%',
        initialValue: d.startDate ? new Date(d.startDate) : null,
        validators: null,
        order: 10
      },
      {
        controlName: 'endDate',
        controlType: 'date',
        controlLabel: 'Effective End Date',
        controlWidth: '100%',
        initialValue: d.endDate ? new Date(d.endDate) : null,
        validators: null,
        order: 11
      },
      {
        controlName: 'status',
        controlType: 'select',
        controlLabel: 'Status',
        controlWidth: '100%',
        initialValue: d.status ?? 'Active',
        selectOptions: { Active: 'Active', Inactive: 'Inactive' },
        validators: null,
        order: 12
      },
    ];

    this.taxForm = this.fb.group({});
    this.fieldData.forEach(field => {
      this.taxForm.addControl(field.controlName, this.fb.control(field.initialValue, field.validators));
    });
  }

  onSubmit(): void {
    if (!this.taxForm.valid) return;

    this.apiLoading = true;
    const payload = this.taxForm.value;

    const request$ = this.data.isExisting
      ? this.accountingService.updateTaxRate(payload, this.data.id)
      : this.accountingService.createTaxRate(payload);

    request$.subscribe({
      next: res => {
        if (res.status === 200) {
          const msg = this.data.isExisting ? 'Tax rate updated successfully' : 'Tax rate created successfully';
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
