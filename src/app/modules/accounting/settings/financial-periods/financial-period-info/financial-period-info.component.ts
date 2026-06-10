import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MODAL_DATA, ModalRef } from 'src/app/shared/models/modal.models';
import { FormFields } from 'src/app/shared/models/form-fields';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-financial-period-info',
  templateUrl: './financial-period-info.component.html',
  styleUrls: ['./financial-period-info.component.scss']
})
export class FinancialPeriodInfoComponent implements OnInit {

  periodForm!: FormGroup;
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

    const branchOptions = (this.data.branches ?? []).reduce((acc: any, b: any) => {
      acc[b.branchName] = b.branchName;
      return acc;
    }, { All: 'All' });

    this.fieldData = [
      {
        controlName: 'financialYear',
        controlType: 'number',
        controlLabel: 'Financial Year',
        controlWidth: '100%',
        initialValue: d.financialYear ?? new Date().getFullYear(),
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'periodName',
        controlType: 'text',
        controlLabel: 'Period Name',
        controlWidth: '100%',
        initialValue: d.periodName ?? '',
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'startDate',
        controlType: 'date',
        controlLabel: 'Start Date',
        controlWidth: '100%',
        initialValue: d.startDate ? new Date(d.startDate) : null,
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'endDate',
        controlType: 'date',
        controlLabel: 'End Date',
        controlWidth: '100%',
        initialValue: d.endDate ? new Date(d.endDate) : null,
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'status',
        controlType: 'select',
        controlLabel: 'Status',
        controlWidth: '100%',
        initialValue: d.status ?? 'Open',
        selectOptions: { Open: 'Open', Closed: 'Closed', Locked: 'Locked' },
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
        controlName: 'closedBy',
        controlType: 'text',
        controlLabel: 'Closed By',
        controlWidth: '100%',
        initialValue: d.closedBy ?? '',
        validators: null,
        order: 7
      },
      {
        controlName: 'closedDate',
        controlType: 'date',
        controlLabel: 'Closed Date',
        controlWidth: '100%',
        initialValue: d.closedDate ? new Date(d.closedDate) : null,
        validators: null,
        order: 8
      },
      {
        controlName: 'reopenReason',
        controlType: 'textarea',
        controlLabel: 'Reopen Reason',
        controlWidth: '100%',
        initialValue: d.reopenReason ?? '',
        validators: null,
        order: 9
      },
    ];

    this.periodForm = this.fb.group({});
    this.fieldData.forEach(field => {
      this.periodForm.addControl(field.controlName, this.fb.control(field.initialValue, field.validators));
    });
  }

  onSubmit(): void {
    if (!this.periodForm.valid) return;

    this.apiLoading = true;
    const payload = this.periodForm.value;

    const request$ = this.data.isExisting
      ? this.accountingService.updateFinancialPeriod(payload, this.data.id)
      : this.accountingService.createFinancialPeriod(payload);

    request$.subscribe({
      next: res => {
        if (res.status === 200) {
          const msg = this.data.isExisting ? 'Financial period updated successfully' : 'Financial period created successfully';
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
