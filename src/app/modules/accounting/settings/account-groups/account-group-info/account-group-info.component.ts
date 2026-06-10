import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MODAL_DATA, ModalRef } from 'src/app/shared/models/modal.models';
import { FormFields } from 'src/app/shared/models/form-fields';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-account-group-info',
  templateUrl: './account-group-info.component.html',
  styleUrls: ['./account-group-info.component.scss']
})
export class AccountGroupInfoComponent implements OnInit {

  accountGroupForm!: FormGroup;
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

    const typeOptions = (this.data.accountTypes ?? []).reduce((acc: any, t: any) => {
      acc[t._id] = t.name;
      return acc;
    }, {});

    const groupOptions = (this.data.accountGroups ?? []).reduce((acc: any, g: any) => {
      acc[g._id] = g.name;
      return acc;
    }, {});

    this.fieldData = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Group Name',
        controlWidth: '100%',
        initialValue: d.name ?? '',
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'code',
        controlType: 'text',
        controlLabel: 'Group Code',
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
        controlName: 'reportOrder',
        controlType: 'number',
        controlLabel: 'Report Order',
        controlWidth: '100%',
        initialValue: d.reportOrder ?? '',
        validators: null,
        order: 4
      },
      {
        controlName: 'parentGroupId',
        controlType: 'select',
        controlLabel: 'Parent Group',
        controlWidth: '100%',
        initialValue: d.parentGroupId ?? null,
        selectOptions: groupOptions,
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
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: d.description ?? '',
        validators: null,
        order: 7
      },
    ];

    this.accountGroupForm = this.fb.group({});
    this.fieldData.forEach(field => {
      this.accountGroupForm.addControl(field.controlName, this.fb.control(field.initialValue, field.validators));
    });
  }

  onSubmit(): void {
    if (!this.accountGroupForm.valid) return;

    this.apiLoading = true;
    const payload = this.accountGroupForm.value;

    const request$ = this.data.isExisting
      ? this.accountingService.updateAccountGroup(payload, this.data.id)
      : this.accountingService.createAccountGroup(payload);

    request$.subscribe({
      next: res => {
        if (res.status === 200) {
          const msg = this.data.isExisting ? 'Account group updated successfully' : 'Account group created successfully';
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
