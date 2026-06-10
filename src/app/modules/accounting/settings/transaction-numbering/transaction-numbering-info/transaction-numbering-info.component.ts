import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MODAL_DATA, ModalRef } from 'src/app/shared/models/modal.models';
import { FormFields } from 'src/app/shared/models/form-fields';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-transaction-numbering-info',
  templateUrl: './transaction-numbering-info.component.html',
  styleUrls: ['./transaction-numbering-info.component.scss']
})
export class TransactionNumberingInfoComponent implements OnInit {

  txnForm!: FormGroup;
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

  get sampleFormat(): string {
    if (!this.txnForm) return '—';
    const { prefix, branchCodeIncluded, yearIncluded, nextNumber, numberLength } = this.txnForm.value;
    if (!prefix) return '—';
    const parts: string[] = [prefix];
    if (branchCodeIncluded) parts.push('BR');
    if (yearIncluded) parts.push(new Date().getFullYear().toString());
    parts.push(String(nextNumber ?? 1).padStart(numberLength ?? 4, '0'));
    return parts.join('-');
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

    const branchOptions = (this.data.branches ?? []).reduce((acc: any, b: any) => {
      acc[b.branchName] = b.branchName;
      return acc;
    }, { All: 'All' });

    this.fieldData = [
      {
        controlName: 'documentType',
        controlType: 'select',
        controlLabel: 'Document Type',
        controlWidth: '100%',
        initialValue: d.documentType ?? null,
        selectOptions: {
          Invoice:  'Invoice',
          Bill:     'Bill',
          Payment:  'Payment',
          Receipt:  'Receipt',
          Journal:  'Journal',
        },
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'prefix',
        controlType: 'text',
        controlLabel: 'Prefix',
        controlWidth: '100%',
        initialValue: d.prefix ?? '',
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'nextNumber',
        controlType: 'number',
        controlLabel: 'Next Number',
        controlWidth: '100%',
        initialValue: d.nextNumber ?? 1,
        validators: [Validators.required, Validators.min(1)],
        order: 3
      },
      {
        controlName: 'numberLength',
        controlType: 'number',
        controlLabel: 'Number Length (digits)',
        controlWidth: '100%',
        initialValue: d.numberLength ?? 4,
        validators: [Validators.required, Validators.min(1)],
        order: 4
      },
      {
        controlName: 'branch',
        controlType: 'select',
        controlLabel: 'Branch / Company',
        controlWidth: '100%',
        initialValue: d.branch ?? 'All',
        selectOptions: branchOptions,
        validators: null,
        order: 5
      },
      {
        controlName: 'status',
        controlType: 'select',
        controlLabel: 'Status',
        controlWidth: '100%',
        initialValue: d.status ?? 'Active',
        selectOptions: { Active: 'Active', Inactive: 'Inactive' },
        validators: null,
        order: 6
      },
      {
        controlName: 'branchCodeIncluded',
        controlType: 'switch',
        controlLabel: 'Branch Code Included',
        controlWidth: '100%',
        initialValue: d.branchCodeIncluded ?? false,
        validators: null,
        order: 7
      },
      {
        controlName: 'yearIncluded',
        controlType: 'switch',
        controlLabel: 'Year Included',
        controlWidth: '100%',
        initialValue: d.yearIncluded ?? true,
        validators: null,
        order: 8
      },
    ];

    this.txnForm = this.fb.group({});
    this.fieldData.forEach(field => {
      this.txnForm.addControl(field.controlName, this.fb.control(field.initialValue, field.validators));
    });
  }

  onSubmit(): void {
    if (!this.txnForm.valid) return;

    this.apiLoading = true;
    const payload = this.txnForm.value;

    const request$ = this.data.isExisting
      ? this.accountingService.updateTransactionNumbering(payload, this.data.id)
      : this.accountingService.createTransactionNumbering(payload);

    request$.subscribe({
      next: res => {
        if (res.status === 200) {
          const msg = this.data.isExisting ? 'Transaction numbering updated' : 'Transaction numbering created';
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
