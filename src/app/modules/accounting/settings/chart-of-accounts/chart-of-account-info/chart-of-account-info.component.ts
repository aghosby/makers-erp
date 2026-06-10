import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MODAL_DATA, ModalRef } from 'src/app/shared/models/modal.models';
import { FormFields } from 'src/app/shared/models/form-fields';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-chart-of-account-info',
  templateUrl: './chart-of-account-info.component.html',
  styleUrls: ['./chart-of-account-info.component.scss']
})
export class ChartOfAccountInfoComponent implements OnInit {

  accountForm!: FormGroup;
  fieldData: FormFields[];
  apiLoading = false;

  get rowFields(): FormFields[] {
    return this.fieldData?.filter(f => f.controlType !== 'textarea' && f.controlType !== 'switch') ?? [];
  }

  get switchFields(): FormFields[] {
    return this.fieldData?.filter(f => f.controlType === 'switch') ?? [];
  }

  get descriptionField(): FormFields | null {
    return this.fieldData?.find(f => f.controlType === 'textarea') ?? null;
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

    const typeOptions = (this.data.accountTypes ?? []).reduce((acc: any, t: any) => {
      acc[t._id] = t.name;
      return acc;
    }, {});

    const groupOptions = (this.data.accountGroups ?? []).reduce((acc: any, g: any) => {
      acc[g._id] = g.name;
      return acc;
    }, {});

    const accountOptions = (this.data.accounts ?? [])
      .filter((a: any) => !this.data.isExisting || a._id !== this.data.id)
      .reduce((acc: any, a: any) => {
        acc[a._id] = `${a.code} — ${a.name}`;
        return acc;
      }, {});

    this.fieldData = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Account Name',
        controlWidth: '100%',
        initialValue: d.name ?? '',
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'code',
        controlType: 'text',
        controlLabel: 'Account Code',
        controlWidth: '100%',
        initialValue: d.code ?? '',
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'accountTypeId',
        controlType: 'select',
        controlLabel: 'Account Type',
        controlWidth: '100%',
        initialValue: d.accountTypeId ?? null,
        selectOptions: typeOptions,
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'accountGroupId',
        controlType: 'select',
        controlLabel: 'Account Group',
        controlWidth: '100%',
        initialValue: d.accountGroupId ?? null,
        selectOptions: groupOptions,
        validators: null,
        order: 4
      },
      {
        controlName: 'parentAccountId',
        controlType: 'select',
        controlLabel: 'Parent Account',
        controlWidth: '100%',
        initialValue: d.parentAccountId ?? null,
        selectOptions: accountOptions,
        validators: null,
        order: 5
      },
      {
        controlName: 'normalBalance',
        controlType: 'select',
        controlLabel: 'Normal Balance',
        controlWidth: '100%',
        initialValue: d.normalBalance ?? null,
        selectOptions: { Debit: 'Debit', Credit: 'Credit' },
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'currency',
        controlType: 'text',
        controlLabel: 'Currency',
        controlWidth: '100%',
        initialValue: d.currency ?? '',
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
      {
        controlName: 'isBankAccount',
        controlType: 'switch',
        controlLabel: 'Is Bank Account?',
        controlWidth: '100%',
        initialValue: d.isBankAccount ?? false,
        validators: null,
        order: 9
      },
      {
        controlName: 'isCashAccount',
        controlType: 'switch',
        controlLabel: 'Is Cash Account?',
        controlWidth: '100%',
        initialValue: d.isCashAccount ?? false,
        validators: null,
        order: 10
      },
      {
        controlName: 'isControlAccount',
        controlType: 'switch',
        controlLabel: 'Is Control Account?',
        controlWidth: '100%',
        initialValue: d.isControlAccount ?? false,
        validators: null,
        order: 11
      },
      {
        controlName: 'allowManualPosting',
        controlType: 'switch',
        controlLabel: 'Allow Manual Posting?',
        controlWidth: '100%',
        initialValue: d.allowManualPosting ?? false,
        validators: null,
        order: 12
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: d.description ?? '',
        validators: null,
        order: 13
      },
    ];

    this.accountForm = this.fb.group({});
    this.fieldData.forEach(field => {
      this.accountForm.addControl(field.controlName, this.fb.control(field.initialValue, field.validators));
    });
  }

  onSubmit(): void {
    if (!this.accountForm.valid) return;

    this.apiLoading = true;
    const payload = this.accountForm.value;

    const request$ = this.data.isExisting
      ? this.accountingService.updateAccount(payload, this.data.id)
      : this.accountingService.createAccount(payload);

    request$.subscribe({
      next: res => {
        if (res.status === 200) {
          const msg = this.data.isExisting ? 'Account updated successfully' : 'Account created successfully';
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
