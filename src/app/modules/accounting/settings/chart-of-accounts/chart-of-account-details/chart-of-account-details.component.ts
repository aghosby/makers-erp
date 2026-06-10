import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { ChartOfAccountInfoComponent } from '../chart-of-account-info/chart-of-account-info.component';
import { DEFAULT_CURRENCY } from 'src/app/core/constants/general-data';

@Component({
  selector: 'app-chart-of-account-details',
  templateUrl: './chart-of-account-details.component.html',
  styleUrls: ['./chart-of-account-details.component.scss']
})
export class ChartOfAccountDetailsComponent implements OnInit {

  currency = DEFAULT_CURRENCY;
  accountId: string;
  accountDetails: any;
  ledgerEntries: any[] = [];
  accountTypeList: any[] = [];
  accountGroupList: any[] = [];
  accountList: any[] = [];
  isLoading = true;
  isLedgerLoading = true;

  get openingBalance(): number {
    return this.ledgerEntries.length ? this.ledgerEntries[0]?.balance - this.ledgerEntries[0]?.debit + this.ledgerEntries[0]?.credit : 0;
  }

  get debitTotal(): number {
    return this.ledgerEntries.reduce((sum, e) => sum + (e.debit ?? 0), 0);
  }

  get creditTotal(): number {
    return this.ledgerEntries.reduce((sum, e) => sum + (e.credit ?? 0), 0);
  }

  get currentBalance(): number {
    if (!this.ledgerEntries.length) return this.accountDetails?.currentBalance ?? 0;
    return this.ledgerEntries[this.ledgerEntries.length - 1]?.balance ?? 0;
  }

  ledgerColumns: TableColumn[] = [
    { key: 'date',            label: 'Date',             order: 1, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'reference',       label: 'Reference',        order: 2, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'description',     label: 'Description',      order: 3, columnWidth: '30%', cellStyle: '', sortable: false },
    { key: 'transactionType', label: 'Type',             order: 4, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'debit',           label: 'Debit (₦)',        order: 5, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'credit',          label: 'Credit (₦)',       order: 6, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'balance',         label: 'Balance (₦)',      order: 7, columnWidth: '6%',  cellStyle: '', sortable: false },
  ];

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private accountingService: AccountingService,
    private modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.accountId = this.activatedRoute.snapshot.params['id'];
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.isLedgerLoading = true;

    forkJoin({
      account: this.accountingService.getAccount(this.accountId),
      ledger:  this.accountingService.getAccountLedger(this.accountId),
      types:   this.accountingService.getAccountTypes(),
      groups:  this.accountingService.getAccountGroups(),
      accounts: this.accountingService.getChartOfAccounts(),
    }).subscribe(({ account, ledger, types, groups, accounts }) => {
      this.accountDetails  = account.data;
      this.ledgerEntries   = ledger.data ?? [];
      this.accountTypeList = types.data ?? [];
      this.accountGroupList = groups.data ?? [];
      this.accountList     = accounts.data ?? [];
      this.isLoading = false;
      this.isLedgerLoading = false;
    });
  }

  goBack(): void {
    this.location.back();
  }

  editAccount(): void {
    this.modal.open(ChartOfAccountInfoComponent, {
      title: 'Edit Account',
      icon: 'register',
      size: 'lg',
      data: {
        isExisting: true,
        id: this.accountId,
        modalInfo: this.accountDetails,
        accountTypes: this.accountTypeList,
        accountGroups: this.accountGroupList,
        accounts: this.accountList,
      },
    }).afterClosed().subscribe(() => this.loadData());
  }
}
