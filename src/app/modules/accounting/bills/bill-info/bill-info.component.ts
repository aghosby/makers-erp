import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MODAL_DATA, ModalRef } from 'src/app/shared/models/modal.models';
import { BillService } from 'src/app/shared/services/bills/bill.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { DEFAULT_CURRENCY } from 'src/app/core/constants/general-data';

@Component({
  selector: 'app-bill-info',
  templateUrl: './bill-info.component.html',
  styleUrls: ['./bill-info.component.scss']
})
export class BillInfoComponent implements OnInit {

  billForm!: FormGroup;
  apiLoading = false;
  currency = DEFAULT_CURRENCY;
  today = new Date().toISOString().split('T')[0];

  selectedFile: File | null = null;
  existingAttachment: { name: string; url: string; size: string } | null = null;

  readonly categories = ['Utilities', 'Office Supplies', 'Travel', 'Equipment', 'Services', 'Other'];

  get lines(): FormArray {
    return this.billForm.get('lines') as FormArray;
  }

  getLineAmount(i: number): number {
    const line = this.lines.at(i);
    return (Number(line.get('quantity')?.value) || 0) * (Number(line.get('unitPrice')?.value) || 0);
  }

  get subtotal(): number {
    return this.lines.controls.reduce((sum, _, i) => sum + this.getLineAmount(i), 0);
  }

  get taxAmount(): number {
    return this.subtotal * ((Number(this.billForm.get('taxRate')?.value) || 0) / 100);
  }

  get total(): number {
    return this.subtotal + this.taxAmount;
  }

  get attachmentLabel(): string {
    if (this.selectedFile) return this.selectedFile.name;
    if (this.existingAttachment) return this.existingAttachment.name;
    return '';
  }

  constructor(
    @Inject(MODAL_DATA) public data: any,
    private modalRef: ModalRef,
    private fb: FormBuilder,
    private billService: BillService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit(): void {
    const d = this.data.isExisting ? this.data.modalInfo : {};

    if (d.attachment) {
      this.existingAttachment = d.attachment;
    }

    this.billForm = this.fb.group({
      billNumber:       [{ value: d.billNumber ?? '', disabled: true }],
      vendor:           [d.vendor      ?? '', Validators.required],
      category:         [d.category    ?? this.categories[0], Validators.required],
      date:             [d.date        ?? this.today, Validators.required],
      dueDate:          [d.dueDate     ?? '', Validators.required],
      taxRate:          [d.taxRate     ?? 0],
      description:      [d.description ?? ''],
      requiresApproval: [d.requiresApproval ?? false],
      notes:            [d.notes       ?? ''],
      lines: this.fb.array(
        d.items?.length
          ? d.items.map((item: any) => this.newLine(item))
          : [this.newLine(), this.newLine()]
      ),
    });

    if (!this.data.isExisting) {
      this.billService.getNextBillNumber().subscribe(res => {
        this.billForm.get('billNumber')?.setValue(res.data);
      });
    }
  }

  private newLine(item?: any): FormGroup {
    return this.fb.group({
      description: [item?.description ?? ''],
      quantity:    [item?.quantity    ?? null],
      unitPrice:   [item?.unitPrice   ?? null],
    });
  }

  addLine(): void {
    this.lines.push(this.newLine());
  }

  removeLine(i: number): void {
    if (this.lines.length > 1) this.lines.removeAt(i);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.existingAttachment = null;
    }
  }

  removeAttachment(): void {
    this.selectedFile = null;
    this.existingAttachment = null;
  }

  onSubmit(asDraft = false): void {
    if (!this.billForm.valid) return;
    this.apiLoading = true;

    const payload: any = {
      ...this.billForm.getRawValue(),
      subtotal:   this.subtotal,
      taxAmount:  this.taxAmount,
      total:      this.total,
      status:     asDraft ? 'Draft' : (this.billForm.get('requiresApproval')?.value ? 'Pending Approval' : 'Approved'),
      items:      this.lines.value
        .filter((l: any) => l.description)
        .map((l: any, i: number) => ({ ...l, amount: this.getLineAmount(i) })),
      attachment: this.existingAttachment ?? (this.selectedFile
        ? { name: this.selectedFile.name, url: '#', size: this.formatFileSize(this.selectedFile.size) }
        : null),
    };

    const request$ = this.data.isExisting
      ? this.billService.updateBill(payload, this.data.id)
      : this.billService.createBill(payload);

    request$.subscribe({
      next: res => {
        if (res.status === 200) {
          this.notifyService.showSuccess(asDraft ? 'Bill saved as draft' : 'Bill submitted successfully');
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

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  dismiss(): void {
    this.modalRef.dismiss();
  }
}
