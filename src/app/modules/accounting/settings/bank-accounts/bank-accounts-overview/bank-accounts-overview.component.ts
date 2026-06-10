import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { BankAccountInfoComponent } from '../bank-account-info/bank-account-info.component';

@Component({
  selector: 'app-bank-accounts-overview',
  templateUrl: './bank-accounts-overview.component.html',
  styleUrls: ['./bank-accounts-overview.component.scss']
})
export class BankAccountsOverviewComponent implements OnInit {

  bankAccountList: any[] = [];
  accountList: any[] = [];
  branchList: any[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];

  tableColumns: TableColumn[] = [
    { key: 'bankName',     label: 'Bank Name',      order: 1, columnWidth: '18%', cellStyle: '', sortable: false },
    { key: 'accountName',  label: 'Account Name',   order: 2, columnWidth: '20%', cellStyle: '', sortable: false },
    { key: 'accountNumber',label: 'Account Number', order: 3, columnWidth: '16%', cellStyle: '', sortable: false },
    { key: 'currency',     label: 'Currency',        order: 4, columnWidth: '9%',  cellStyle: '', sortable: false },
    { key: 'branch',       label: 'Branch',          order: 5, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'isDefault',    label: 'Default',         order: 6, columnWidth: '9%',  cellStyle: '', sortable: false },
    { key: 'status',       label: 'Status',          order: 7, columnWidth: '9%',  cellStyle: '', sortable: false },
    { key: 'actions',      label: 'Actions',         order: 8, columnWidth: '5%',  cellStyle: '', sortable: false },
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
      banks:    this.accountingService.getBankAccounts(),
      accounts: this.accountingService.getChartOfAccounts(),
      branches: this.hrService.getBranches().pipe(catchError(() => of({ data: [] }))),
    }).subscribe(({ banks, accounts, branches }) => {
      this.bankAccountList = banks.data ?? [];
      this.accountList = accounts.data ?? [];
      this.branchList = branches.data ?? [];
      this.dataSource = new MatTableDataSource(this.bankAccountList);
    });
  }

  createBankAccount(): void {
    this.modal.open(BankAccountInfoComponent, {
      title: 'Create Bank Account',
      icon: 'card',
      size: 'lg',
      data: { isExisting: false, accounts: this.accountList, branches: this.branchList },
    }).afterClosed().subscribe(() => this.loadData());
  }

  editBankAccount(row: any): void {
    this.modal.open(BankAccountInfoComponent, {
      title: 'Edit Bank Account',
      icon: 'card',
      size: 'lg',
      data: { isExisting: true, id: row._id, modalInfo: row, accounts: this.accountList, branches: this.branchList },
    }).afterClosed().subscribe(() => this.loadData());
  }

  deleteBankAccount(row: any): void {
    this.notifyService.confirmAction({
      title: 'Remove ' + row.bankName,
      message: 'Are you sure you want to remove this bank account?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (confirmed) {
        this.accountingService.deleteBankAccount(row._id).subscribe({
          next: res => {
            if (res.status === 200) {
              this.notifyService.showInfo('Bank account removed successfully');
            }
            this.loadData();
          },
          error: err => this.notifyService.showError(err.error?.error ?? 'Something went wrong')
        });
      }
    });
  }
}
