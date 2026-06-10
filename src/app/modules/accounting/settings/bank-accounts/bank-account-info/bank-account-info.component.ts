import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MODAL_DATA, ModalRef } from 'src/app/shared/models/modal.models';
import { FormFields } from 'src/app/shared/models/form-fields';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-bank-account-info',
  templateUrl: './bank-account-info.component.html',
  styleUrls: ['./bank-account-info.component.scss']
})
export class BankAccountInfoComponent implements OnInit {

  bankForm!: FormGroup;
  fieldData: FormFields[];
  apiLoading = false;

  constructor(
    @Inject(MODAL_DATA) public data: any,
    private modalRef: ModalRef,
    private accountingService: AccountingService,
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {}

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
        controlName: 'bankName',
        controlType: 'text',
        controlLabel: 'Bank Name',
        controlWidth: '100%',
        initialValue: d.bankName ?? '',
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'accountName',
        controlType: 'text',
        controlLabel: 'Account Name',
        controlWidth: '100%',
        initialValue: d.accountName ?? '',
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'accountNumber',
        controlType: 'text',
        controlLabel: 'Account Number',
        controlWidth: '100%',
        initialValue: d.accountNumber ?? '',
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'currency',
        controlType: 'text',
        controlLabel: 'Currency',
        controlWidth: '100%',
        initialValue: d.currency ?? '',
        validators: [Validators.required],
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
        controlName: 'linkedGLAccountId',
        controlType: 'select',
        controlLabel: 'Linked GL Account',
        controlWidth: '100%',
        initialValue: d.linkedGLAccountId ?? null,
        selectOptions: accountOptions,
        validators: null,
        order: 6
      },
      {
        controlName: 'openingBalance',
        controlType: 'number',
        controlLabel: 'Opening Balance',
        controlWidth: '100%',
        initialValue: d.openingBalance ?? 0,
        validators: null,
        order: 7
      },
      {
        controlName: 'openingBalanceDate',
        controlType: 'date',
        controlLabel: 'Opening Balance Date',
        controlWidth: '100%',
        initialValue: d.openingBalanceDate ? new Date(d.openingBalanceDate) : null,
        validators: null,
        order: 8
      },
      {
        controlName: 'sortCodeSwift',
        controlType: 'text',
        controlLabel: 'Bank Sort Code / Swift Code',
        controlWidth: '100%',
        initialValue: d.sortCodeSwift ?? '',
        validators: null,
        order: 9
      },
      {
        controlName: 'status',
        controlType: 'select',
        controlLabel: 'Status',
        controlWidth: '100%',
        initialValue: d.status ?? 'Active',
        selectOptions: { Active: 'Active', Inactive: 'Inactive' },
        validators: null,
        order: 10
      },
      {
        controlName: 'isDefaultAccount',
        controlType: 'switch',
        controlLabel: 'Is Default Account',
        controlWidth: '100%',
        initialValue: d.isDefaultAccount ?? false,
        validators: null,
        order: 11
      },
    ];

    this.bankForm = this.fb.group({});
    this.fieldData.forEach(field => {
      this.bankForm.addControl(field.controlName, this.fb.control(field.initialValue, field.validators));
    });
  }

  onSubmit(): void {
    if (!this.bankForm.valid) return;

    this.apiLoading = true;
    const payload = this.bankForm.value;

    const request$ = this.data.isExisting
      ? this.accountingService.updateBankAccount(payload, this.data.id)
      : this.accountingService.createBankAccount(payload);

    request$.subscribe({
      next: res => {
        if (res.status === 200) {
          const msg = this.data.isExisting ? 'Bank account updated successfully' : 'Bank account created successfully';
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
