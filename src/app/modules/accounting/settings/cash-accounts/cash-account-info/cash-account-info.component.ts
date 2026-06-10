import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MODAL_DATA, ModalRef } from 'src/app/shared/models/modal.models';
import { FormFields } from 'src/app/shared/models/form-fields';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-cash-account-info',
  templateUrl: './cash-account-info.component.html',
  styleUrls: ['./cash-account-info.component.scss']
})
export class CashAccountInfoComponent implements OnInit {

  cashForm!: FormGroup;
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
        controlName: 'cashAccountName',
        controlType: 'text',
        controlLabel: 'Cash Account Name',
        controlWidth: '100%',
        initialValue: d.cashAccountName ?? '',
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'custodian',
        controlType: 'text',
        controlLabel: 'Custodian',
        controlWidth: '100%',
        initialValue: d.custodian ?? '',
        validators: null,
        order: 2
      },
      {
        controlName: 'branch',
        controlType: 'select',
        controlLabel: 'Branch / Company',
        controlWidth: '100%',
        initialValue: d.branch ?? 'All',
        selectOptions: branchOptions,
        validators: null,
        order: 3
      },
      {
        controlName: 'linkedGLAccountId',
        controlType: 'select',
        controlLabel: 'Linked GL Account',
        controlWidth: '100%',
        initialValue: d.linkedGLAccountId ?? null,
        selectOptions: accountOptions,
        validators: null,
        order: 4
      },
      {
        controlName: 'currency',
        controlType: 'text',
        controlLabel: 'Currency',
        controlWidth: '100%',
        initialValue: d.currency ?? '',
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'cashLimit',
        controlType: 'number',
        controlLabel: 'Cash Limit',
        controlWidth: '100%',
        initialValue: d.cashLimit ?? 0,
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
        controlName: 'status',
        controlType: 'select',
        controlLabel: 'Status',
        controlWidth: '100%',
        initialValue: d.status ?? 'Active',
        selectOptions: { Active: 'Active', Inactive: 'Inactive' },
        validators: null,
        order: 8
      },
    ];

    this.cashForm = this.fb.group({});
    this.fieldData.forEach(field => {
      this.cashForm.addControl(field.controlName, this.fb.control(field.initialValue, field.validators));
    });
  }

  onSubmit(): void {
    if (!this.cashForm.valid) return;

    this.apiLoading = true;
    const payload = this.cashForm.value;

    const request$ = this.data.isExisting
      ? this.accountingService.updateCashAccount(payload, this.data.id)
      : this.accountingService.createCashAccount(payload);

    request$.subscribe({
      next: res => {
        if (res.status === 200) {
          const msg = this.data.isExisting ? 'Cash account updated successfully' : 'Cash account created successfully';
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
