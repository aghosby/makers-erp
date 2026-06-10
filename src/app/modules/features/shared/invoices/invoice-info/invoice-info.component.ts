import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MODAL_DATA, ModalRef } from 'src/app/shared/models/modal.models';
import { InvoiceService } from 'src/app/shared/services/invoice/invoice.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { DEFAULT_CURRENCY } from 'src/app/core/constants/general-data';

@Component({
  selector: 'app-invoice-info',
  templateUrl: './invoice-info.component.html',
  styleUrls: ['./invoice-info.component.scss']
})
export class InvoiceInfoComponent implements OnInit {

  invoiceForm!: FormGroup;
  apiLoading = false;
  currency = DEFAULT_CURRENCY;
  today = new Date().toISOString().split('T')[0];
  nextInvoiceNumber = '';

  readonly entities = ['Head Office', 'Lagos', 'Abuja', 'Port Harcourt'];

  get lines(): FormArray {
    return this.invoiceForm.get('lines') as FormArray;
  }

  getLineAmount(i: number): number {
    const line = this.lines.at(i);
    return (Number(line.get('quantity')?.value) || 0) * (Number(line.get('unitPrice')?.value) || 0);
  }

  get subtotal(): number {
    return this.lines.controls.reduce((sum, _, i) => sum + this.getLineAmount(i), 0);
  }

  get taxAmount(): number {
    return this.subtotal * ((Number(this.invoiceForm.get('taxRate')?.value) || 0) / 100);
  }

  get total(): number {
    return this.subtotal + this.taxAmount;
  }

  constructor(
    @Inject(MODAL_DATA) public data: any,
    private modalRef: ModalRef,
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit(): void {
    const d = this.data.isExisting ? this.data.modalInfo : {};

    this.invoiceForm = this.fb.group({
      invoiceNumber: [{ value: d.invoiceNumber ?? '', disabled: true }],
      customer:      [d.customer   ?? '',         Validators.required],
      date:          [d.date       ?? this.today, Validators.required],
      dueDate:       [d.dueDate    ?? '',         Validators.required],
      entity:        [d.entity     ?? this.entities[0]],
      taxRate:       [d.taxRate    ?? 7.5],
      notes:         [d.notes      ?? ''],
      lines:         this.fb.array(
        d.items?.length
          ? d.items.map((item: any) => this.newLine(item))
          : [this.newLine(), this.newLine()]
      ),
    });

    if (!this.data.isExisting) {
      this.invoiceService.getNextInvoiceNumber().subscribe(res => {
        this.invoiceForm.get('invoiceNumber')?.setValue(res.data);
        this.nextInvoiceNumber = res.data;
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

  onSubmit(asDraft = false): void {
    if (!this.invoiceForm.valid) return;
    this.apiLoading = true;

    const payload = {
      ...this.invoiceForm.getRawValue(),
      subtotal:   this.subtotal,
      taxAmount:  this.taxAmount,
      total:      this.total,
      status:     asDraft ? 'Draft' : 'Sent',
      items:      this.lines.value
        .filter((l: any) => l.description)
        .map((l: any, i: number) => ({ ...l, amount: this.getLineAmount(i) })),
    };

    const request$ = this.data.isExisting
      ? this.invoiceService.updateInvoice(payload, this.data.id)
      : this.invoiceService.createInvoice(payload);

    request$.subscribe({
      next: res => {
        if (res.status === 200) {
          const msg = asDraft ? 'Invoice saved as draft' : 'Invoice issued successfully';
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

  dismiss(): void {
    this.modalRef.dismiss();
  }
}
