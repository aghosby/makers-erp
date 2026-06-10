import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { TransactionNumberingInfoComponent } from '../transaction-numbering-info/transaction-numbering-info.component';

@Component({
  selector: 'app-transaction-numbering-overview',
  templateUrl: './transaction-numbering-overview.component.html',
  styleUrls: ['./transaction-numbering-overview.component.scss']
})
export class TransactionNumberingOverviewComponent implements OnInit {

  txnList: any[] = [];
  branchList: any[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];

  tableColumns: TableColumn[] = [
    { key: 'documentType', label: 'Document Type', order: 1, columnWidth: '18%', cellStyle: '', sortable: false },
    { key: 'prefix',       label: 'Prefix',         order: 2, columnWidth: '10%', cellStyle: '', sortable: false },
    { key: 'sample',       label: 'Sample Format',  order: 3, columnWidth: '22%', cellStyle: '', sortable: false },
    { key: 'nextNumber',   label: 'Next No.',        order: 4, columnWidth: '10%', cellStyle: '', sortable: false },
    { key: 'branch',       label: 'Branch',          order: 5, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'status',       label: 'Status',          order: 6, columnWidth: '10%', cellStyle: '', sortable: false },
    { key: 'actions',      label: 'Actions',         order: 7, columnWidth: '5%',  cellStyle: '', sortable: false },
  ];

  constructor(
    private modal: ModalService,
    private accountingService: AccountingService,
    private hrService: HumanResourcesService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.sort((a, b) => a.order - b.order).map(c => c.label);
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      txn:      this.accountingService.getTransactionNumbering(),
      branches: this.hrService.getBranches().pipe(catchError(() => of({ data: [] }))),
    }).subscribe(({ txn, branches }) => {
      this.txnList = txn.data ?? [];
      this.branchList = branches.data ?? [];
      this.dataSource = new MatTableDataSource(this.txnList);
    });
  }

  buildSample(row: any): string {
    if (!row.prefix) return '—';
    const parts: string[] = [row.prefix];
    if (row.branchCodeIncluded) parts.push('BR');
    if (row.yearIncluded) parts.push(new Date().getFullYear().toString());
    parts.push(String(row.nextNumber ?? 1).padStart(row.numberLength ?? 4, '0'));
    return parts.join('-');
  }

  createTxnNumbering(): void {
    this.modal.open(TransactionNumberingInfoComponent, {
      title: 'Create Transaction Numbering',
      icon: 'register',
      size: 'md',
      data: { isExisting: false, branches: this.branchList },
    }).afterClosed().subscribe(() => this.loadData());
  }

  editTxnNumbering(row: any): void {
    this.modal.open(TransactionNumberingInfoComponent, {
      title: 'Edit Transaction Numbering',
      icon: 'register',
      size: 'md',
      data: { isExisting: true, id: row._id, modalInfo: row, branches: this.branchList },
    }).afterClosed().subscribe(() => this.loadData());
  }

  deleteTxnNumbering(row: any): void {
    this.notifyService.confirmAction({
      title: 'Remove ' + row.documentType + ' numbering',
      message: 'Are you sure you want to remove this transaction numbering?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (confirmed) {
        this.accountingService.deleteTransactionNumbering(row._id).subscribe({
          next: res => {
            if (res.status === 200) {
              this.notifyService.showInfo('Transaction numbering removed successfully');
            }
            this.loadData();
          },
          error: err => this.notifyService.showError(err.error?.error ?? 'Something went wrong')
        });
      }
    });
  }
}
