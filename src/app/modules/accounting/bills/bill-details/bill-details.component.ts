import { Component, Inject, OnInit } from '@angular/core';
import { MODAL_DATA, ModalRef } from 'src/app/shared/models/modal.models';
import { BillService } from 'src/app/shared/services/bills/bill.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { DEFAULT_CURRENCY } from 'src/app/core/constants/general-data';
import { BillInfoComponent } from '../bill-info/bill-info.component';

@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.scss']
})
export class BillDetailsComponent implements OnInit {

  currency = DEFAULT_CURRENCY;
  bill: any;
  isLoading = false;

  constructor(
    @Inject(MODAL_DATA) public data: any,
    private modalRef: ModalRef,
    private billService: BillService,
    private modal: ModalService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadBill();
  }

  loadBill(): void {
    this.isLoading = true;
    this.billService.getBill(this.data.id).subscribe(res => {
      this.bill = res.data ?? null;
      this.isLoading = false;
    });
  }

  editBill(): void {
    this.modal.open(BillInfoComponent, {
      title: 'Edit Bill',
      icon: 'cash',
      size: 'lg',
      data: { isExisting: true, id: this.data.id, modalInfo: this.bill },
    }).afterClosed().subscribe(() => this.loadBill());
  }

  approveBill(): void {
    this.notifyService.confirmAction({
      title: 'Approve Bill',
      message: `Approve ${this.bill?.billNumber}?`,
      confirmText: 'Yes, Approve',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.billService.updateBill({ status: 'Approved', approvedBy: 'admin' }, this.data.id).subscribe({
        next: () => {
          this.notifyService.showSuccess('Bill approved');
          this.loadBill();
        },
        error: err => this.notifyService.showError(err.error?.error ?? 'Something went wrong'),
      });
    });
  }

  rejectBill(): void {
    this.notifyService.confirmAction({
      title: 'Reject Bill',
      message: `Reject ${this.bill?.billNumber}?`,
      confirmText: 'Yes, Reject',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.billService.updateBill({ status: 'Rejected' }, this.data.id).subscribe({
        next: () => {
          this.notifyService.showSuccess('Bill rejected');
          this.loadBill();
        },
        error: err => this.notifyService.showError(err.error?.error ?? 'Something went wrong'),
      });
    });
  }

  markAsPaid(): void {
    this.notifyService.confirmAction({
      title: 'Mark as Paid',
      message: 'Mark this bill as fully paid?',
      confirmText: 'Yes, Mark Paid',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.billService.updateBill({ status: 'Paid' }, this.data.id).subscribe({
        next: () => {
          this.notifyService.showSuccess('Bill marked as paid');
          this.loadBill();
        },
        error: err => this.notifyService.showError(err.error?.error ?? 'Something went wrong'),
      });
    });
  }

  downloadAttachment(): void {
    if (!this.bill?.attachment?.url) return;
    const a = document.createElement('a');
    a.href = this.bill.attachment.url;
    a.download = this.bill.attachment.name;
    a.click();
  }

  getStatusClass(status: string): string {
    const map: { [k: string]: string } = {
      Draft: 'inactive', 'Pending Approval': 'pending',
      Approved: 'approved', Paid: 'approved',
      Overdue: 'declined', Rejected: 'declined',
    };
    return map[status] ?? 'inactive';
  }

  dismiss(): void {
    this.modalRef.dismiss();
  }
}
