import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MODAL_DATA, ModalRef } from 'src/app/shared/models/modal.models';
import { FormFields } from 'src/app/shared/models/form-fields';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-account-type-info',
  templateUrl: './account-type-info.component.html',
  styleUrls: ['./account-type-info.component.scss']
})
export class AccountTypeInfoComponent implements OnInit {

  accountTypeForm!: FormGroup;
  fieldData: FormFields[];
  apiLoading = false;

  get rowFields(): FormFields[] {
    return this.fieldData?.filter(f => f.controlType !== 'textarea') ?? [];
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

    this.fieldData = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Account Type Name',
        controlWidth: '100%',
        initialValue: d.name ?? '',
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'code',
        controlType: 'text',
        controlLabel: 'Code / Short Code',
        controlWidth: '100%',
        initialValue: d.code ?? '',
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'normalBalance',
        controlType: 'select',
        controlLabel: 'Normal Balance',
        controlWidth: '100%',
        initialValue: d.normalBalance ?? null,
        selectOptions: { Debit: 'Debit', Credit: 'Credit' },
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'reportSection',
        controlType: 'select',
        controlLabel: 'Report Section',
        controlWidth: '100%',
        initialValue: d.reportSection ?? null,
        selectOptions: { 'Balance Sheet': 'Balance Sheet', 'Income Statement': 'Income Statement' },
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: d.description ?? '',
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
    ];

    this.accountTypeForm = this.fb.group({});
    this.fieldData.forEach(field => {
      this.accountTypeForm.addControl(field.controlName, this.fb.control(field.initialValue, field.validators));
    });
  }

  onSubmit(): void {
    if (!this.accountTypeForm.valid) return;

    this.apiLoading = true;
    const payload = this.accountTypeForm.value;

    const request$ = this.data.isExisting
      ? this.accountingService.updateAccountType(payload, this.data.id)
      : this.accountingService.createAccountType(payload);

    request$.subscribe({
      next: res => {
        if (res.status === 200) {
          const msg = this.data.isExisting
            ? 'Account type updated successfully'
            : 'Account type created successfully';
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
