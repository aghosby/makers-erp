import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { PaymentMethodInfoComponent } from '../payment-method-info/payment-method-info.component';

@Component({
  selector: 'app-payment-methods-overview',
  templateUrl: './payment-methods-overview.component.html',
  styleUrls: ['./payment-methods-overview.component.scss']
})
export class PaymentMethodsOverviewComponent implements OnInit {

  paymentMethodList: any[] = [];
  linkedAccounts: any[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];

  tableColumns: TableColumn[] = [
    { key: 'name',                 label: 'Method Name',      order: 1, columnWidth: '22%', cellStyle: '', sortable: false },
    { key: 'code',                 label: 'Code',              order: 2, columnWidth: '10%', cellStyle: '', sortable: false },
    { key: 'requiresBankReference',label: 'Bank Reference',   order: 3, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'requiresChequeNumber', label: 'Cheque Number',    order: 4, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'requiresAttachment',   label: 'Attachment',       order: 5, columnWidth: '13%', cellStyle: '', sortable: false },
    { key: 'status',               label: 'Status',            order: 6, columnWidth: '11%', cellStyle: '', sortable: false },
    { key: 'actions',              label: 'Actions',           order: 7, columnWidth: '5%',  cellStyle: '', sortable: false },
  ];

  constructor(
    private modal: ModalService,
    private accountingService: AccountingService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.sort((a, b) => a.order - b.order).map(c => c.label);
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      methods:  this.accountingService.getPaymentMethods(),
      banks:    this.accountingService.getBankAccounts(),
      cash:     this.accountingService.getCashAccounts(),
    }).subscribe(({ methods, banks, cash }) => {
      this.paymentMethodList = methods.data ?? [];
      this.linkedAccounts = [
        ...(banks.data ?? []).map((b: any) => ({ _id: b._id, label: `${b.bankName} — ${b.accountName}` })),
        ...(cash.data ?? []).map((c: any) => ({ _id: c._id, label: `Cash: ${c.cashAccountName}` })),
      ];
      this.dataSource = new MatTableDataSource(this.paymentMethodList);
    });
  }

  createPaymentMethod(): void {
    this.modal.open(PaymentMethodInfoComponent, {
      title: 'Create Payment Method',
      icon: 'walletCard',
      size: 'md',
      data: { isExisting: false, linkedAccounts: this.linkedAccounts },
    }).afterClosed().subscribe(() => this.loadData());
  }

  editPaymentMethod(row: any): void {
    this.modal.open(PaymentMethodInfoComponent, {
      title: 'Edit Payment Method',
      icon: 'walletCard',
      size: 'md',
      data: { isExisting: true, id: row._id, modalInfo: row, linkedAccounts: this.linkedAccounts },
    }).afterClosed().subscribe(() => this.loadData());
  }

  deletePaymentMethod(row: any): void {
    this.notifyService.confirmAction({
      title: 'Remove ' + row.name,
      message: 'Are you sure you want to remove this payment method?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (confirmed) {
        this.accountingService.deletePaymentMethod(row._id).subscribe({
          next: res => {
            if (res.status === 200) {
              this.notifyService.showInfo('Payment method removed successfully');
            }
            this.loadData();
          },
          error: err => this.notifyService.showError(err.error?.error ?? 'Something went wrong')
        });
      }
    });
  }
}
