import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { FilterConfig } from 'src/app/shared/models/table-filter';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { DEFAULT_CURRENCY } from 'src/app/core/constants/general-data';

@Component({
  selector: 'app-general-ledger',
  templateUrl: './general-ledger.component.html',
  styleUrls: ['./general-ledger.component.scss']
})
export class GeneralLedgerComponent implements OnInit {

  currency = DEFAULT_CURRENCY;
  ledgerList: any[] = [];
  branchList: string[] = [];
  selectedBranch = 'All Branches';
  isLoading = false;
  ledgerFilters: FilterConfig[] = [];
  activeFilters: { [k: string]: any } = {};

  get totalDebits(): number {
    return this.filteredEntries.reduce((sum, e) => sum + (e.debit || 0), 0);
  }

  get totalCredits(): number {
    return this.filteredEntries.reduce((sum, e) => sum + (e.credit || 0), 0);
  }

  get netBalance(): number {
    return this.totalDebits - this.totalCredits;
  }

  get transactionCount(): number {
    return this.filteredEntries.length;
  }

  get filteredEntries(): any[] {
    return this.ledgerList.filter(entry => {
      if (this.selectedBranch !== 'All Branches' && entry.branch !== this.selectedBranch) return false;
      for (const key of Object.keys(this.activeFilters)) {
        const val = this.activeFilters[key];
        if (!val) continue;
        if (key === 'dateRange') {
          const entryDate = new Date(entry.date);
          if (val.start && entryDate < new Date(val.start)) return false;
          if (val.end && entryDate > new Date(val.end)) return false;
        } else {
          if (entry[key] !== val) return false;
        }
      }
      return true;
    });
  }

  tableColumns: TableColumn[] = [
    { key: 'date',            label: 'Date',             order: 1, columnWidth: '10%', cellStyle: '', sortable: false },
    { key: 'reference',       label: 'Reference',        order: 2, columnWidth: '10%', cellStyle: '', sortable: false },
    { key: 'accountName',     label: 'Account',          order: 3, columnWidth: '18%', cellStyle: '', sortable: false },
    { key: 'description',     label: 'Description',      order: 4, columnWidth: '22%', cellStyle: '', sortable: false },
    { key: 'branch',          label: 'Branch',           order: 5, columnWidth: '10%', cellStyle: '', sortable: false },
    { key: 'transactionType', label: 'Type',             order: 6, columnWidth: '10%', cellStyle: '', sortable: false },
    { key: 'debit',           label: 'Debit (₦)',        order: 7, columnWidth: '10%', cellStyle: '', sortable: false },
    { key: 'credit',          label: 'Credit (₦)',       order: 8, columnWidth: '10%', cellStyle: '', sortable: false },
  ];

  constructor(private accountingService: AccountingService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    forkJoin({
      ledger:   this.accountingService.getGeneralLedger(),
      accounts: this.accountingService.getChartOfAccounts(),
    }).subscribe(({ ledger }) => {
      this.ledgerList = ledger.data ?? [];
      this.buildFilters();
      this.isLoading = false;
    });
  }

  buildFilters(): void {
    const accountOptions = [...new Map(
      this.ledgerList.map(e => [e.accountName, e.accountName] as [string, string])
    )].reduce((acc: any, [k, v]) => { acc[k] = v; return acc; }, {});

    const branchSet = [...new Set(this.ledgerList.map(e => e.branch).filter(Boolean))];
    this.branchList = branchSet;
    const branchOptions = branchSet.reduce((acc: any, b: any) => { acc[b] = b; return acc; }, {});

    const txTypeSet = [...new Set(this.ledgerList.map(e => e.transactionType).filter(Boolean))];
    const txTypeOptions = txTypeSet.reduce((acc: any, t: any) => { acc[t] = t; return acc; }, {});

    this.ledgerFilters = [
      { key: 'dateRange',       label: 'Date Range',       type: 'daterange', options: {},             includeIfEmpty: false },
      { key: 'accountName',     label: 'Account',          type: 'select',    options: accountOptions, includeIfEmpty: false },
      { key: 'branch',          label: 'Branch',           type: 'select',    options: branchOptions,  includeIfEmpty: false },
      { key: 'transactionType', label: 'Transaction Type', type: 'select',    options: txTypeOptions,  includeIfEmpty: false },
    ];
  }

  onFiltersChange(filters: { [k: string]: any }): void {
    this.activeFilters = filters;
  }

  selectBranch(branch: string): void {
    this.selectedBranch = branch;
  }
}
