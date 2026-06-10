import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MODAL_DATA, ModalRef } from 'src/app/shared/models/modal.models';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { DEFAULT_CURRENCY } from 'src/app/core/constants/general-data';

@Component({
  selector: 'app-journal-entry-info',
  templateUrl: './journal-entry-info.component.html',
  styleUrls: ['./journal-entry-info.component.scss']
})
export class JournalEntryInfoComponent implements OnInit {

  journalForm!: FormGroup;
  apiLoading = false;
  currency = DEFAULT_CURRENCY;
  today = new Date().toISOString().split('T')[0];

  get lines(): FormArray {
    return this.journalForm.get('lines') as FormArray;
  }

  get debitTotal(): number {
    return this.lines.controls.reduce((sum, c) => sum + (Number(c.get('debit')?.value) || 0), 0);
  }

  get creditTotal(): number {
    return this.lines.controls.reduce((sum, c) => sum + (Number(c.get('credit')?.value) || 0), 0);
  }

  get imbalance(): number {
    return Math.abs(this.debitTotal - this.creditTotal);
  }

  get isBalanced(): boolean {
    return this.debitTotal > 0 && this.creditTotal > 0 && this.debitTotal === this.creditTotal;
  }

  constructor(
    @Inject(MODAL_DATA) public data: any,
    private modalRef: ModalRef,
    private fb: FormBuilder,
    private accountingService: AccountingService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.journalForm = this.fb.group({
      date:        [this.today, Validators.required],
      entity:      [this.data.entities?.[0] ?? null, Validators.required],
      description: [''],
      lines:       this.fb.array([this.newLine(), this.newLine()]),
    });
  }

  private newLine(): FormGroup {
    return this.fb.group({
      accountId: [null],
      debit:     [null],
      credit:    [null],
    });
  }

  addLine(): void {
    this.lines.push(this.newLine());
  }

  removeLine(i: number): void {
    if (this.lines.length > 2) this.lines.removeAt(i);
  }

  onSubmit(): void {
    if (!this.isBalanced) return;
    this.apiLoading = true;
    const payload = {
      ...this.journalForm.value,
      lines: this.lines.value.filter((l: any) => l.accountId),
    };
    this.accountingService.createJournalEntry(payload).subscribe({
      next: res => {
        if (res.status === 200) {
          this.notifyService.showSuccess('Journal entry posted successfully');
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

  dismiss(): void {
    this.modalRef.dismiss();
  }
}
