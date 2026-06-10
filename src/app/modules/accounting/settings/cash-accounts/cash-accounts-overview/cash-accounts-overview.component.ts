import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { CashAccountInfoComponent } from '../cash-account-info/cash-account-info.component';

@Component({
  selector: 'app-cash-accounts-overview',
  templateUrl: './cash-accounts-overview.component.html',
  styleUrls: ['./cash-accounts-overview.component.scss']
})
export class CashAccountsOverviewComponent implements OnInit {

  cashAccountList: any[] = [];
  accountList: any[] = [];
  branchList: any[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];

  tableColumns: TableColumn[] = [
    { key: 'cashAccountName', label: 'Account Name', order: 1, columnWidth: '22%', cellStyle: '', sortable: false },
    { key: 'custodian',       label: 'Custodian',    order: 2, columnWidth: '18%', cellStyle: '', sortable: false },
    { key: 'branch',          label: 'Branch',        order: 3, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'currency',        label: 'Currency',      order: 4, columnWidth: '9%',  cellStyle: '', sortable: false },
    { key: 'cashLimit',       label: 'Cash Limit',    order: 5, columnWidth: '13%', cellStyle: '', sortable: false },
    { key: 'openingBalance',  label: 'Opening Bal.',  order: 6, columnWidth: '13%', cellStyle: '', sortable: false },
    { key: 'status',          label: 'Status',        order: 7, columnWidth: '9%',  cellStyle: '', sortable: false },
    { key: 'actions',         label: 'Actions',       order: 8, columnWidth: '5%',  cellStyle: '', sortable: false },
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
      cash:     this.accountingService.getCashAccounts(),
      accounts: this.accountingService.getChartOfAccounts(),
      branches: this.hrService.getBranches().pipe(catchError(() => of({ data: [] }))),
    }).subscribe(({ cash, accounts, branches }) => {
      this.cashAccountList = cash.data ?? [];
      this.accountList = accounts.data ?? [];
      this.branchList = branches.data ?? [];
      this.dataSource = new MatTableDataSource(this.cashAccountList);
    });
  }

  createCashAccount(): void {
    this.modal.open(CashAccountInfoComponent, {
      title: 'Create Cash Account',
      icon: 'card',
      size: 'lg',
      data: { isExisting: false, accounts: this.accountList, branches: this.branchList },
    }).afterClosed().subscribe(() => this.loadData());
  }

  editCashAccount(row: any): void {
    this.modal.open(CashAccountInfoComponent, {
      title: 'Edit Cash Account',
      icon: 'card',
      size: 'lg',
      data: { isExisting: true, id: row._id, modalInfo: row, accounts: this.accountList, branches: this.branchList },
    }).afterClosed().subscribe(() => this.loadData());
  }

  deleteCashAccount(row: any): void {
    this.notifyService.confirmAction({
      title: 'Remove ' + row.cashAccountName,
      message: 'Are you sure you want to remove this cash account?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (confirmed) {
        this.accountingService.deleteCashAccount(row._id).subscribe({
          next: res => {
            if (res.status === 200) {
              this.notifyService.showInfo('Cash account removed successfully');
            }
            this.loadData();
          },
          error: err => this.notifyService.showError(err.error?.error ?? 'Something went wrong')
        });
      }
    });
  }
}
