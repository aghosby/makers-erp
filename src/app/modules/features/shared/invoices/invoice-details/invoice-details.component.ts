import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from 'src/app/shared/services/invoice/invoice.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { DEFAULT_CURRENCY } from 'src/app/core/constants/general-data';
import { InvoiceInfoComponent } from '../invoice-info/invoice-info.component';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {

  currency = DEFAULT_CURRENCY;
  invoiceId: string;
  invoice: any;
  isLoading = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private modal: ModalService,
    private notifyService: NotificationService,
    private invoiceService: InvoiceService,
  ) {}

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadInvoice();
  }

  loadInvoice(): void {
    this.isLoading = true;
    this.invoiceService.getInvoice(this.invoiceId).subscribe(res => {
      this.invoice = res.data ?? null;
      this.isLoading = false;
    });
  }

  goBack(): void {
    this.location.back();
  }

  editInvoice(): void {
    this.modal.open(InvoiceInfoComponent, {
      title: 'Edit Invoice',
      icon: 'card',
      size: 'lg',
      data: { isExisting: true, id: this.invoiceId, modalInfo: this.invoice },
    }).afterClosed().subscribe(() => this.loadInvoice());
  }

  markAsPaid(): void {
    this.notifyService.confirmAction({
      title: 'Mark as Paid',
      message: 'Mark this invoice as fully paid?',
      confirmText: 'Yes, Mark Paid',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (confirmed) {
        this.invoiceService.updateInvoice({ status: 'Paid' }, this.invoiceId).subscribe({
          next: () => {
            this.notifyService.showSuccess('Invoice marked as paid');
            this.loadInvoice();
          },
          error: err => this.notifyService.showError(err.error?.error ?? 'Something went wrong')
        });
      }
    });
  }

  getStatusClass(status: string): string {
    const map: { [k: string]: string } = {
      Paid: 'approved', Sent: 'pending', Draft: 'inactive',
      Overdue: 'declined', Cancelled: 'inactive',
    };
    return map[status] ?? 'pending';
  }
}
