import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { FilterConfig } from 'src/app/shared/models/table-filter';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { DEFAULT_CURRENCY } from 'src/app/core/constants/general-data';
import { JournalEntryInfoComponent } from './journal-entry-info/journal-entry-info.component';

@Component({
  selector: 'app-journal-entries',
  templateUrl: './journal-entries.component.html',
  styleUrls: ['./journal-entries.component.scss']
})
export class JournalEntriesComponent implements OnInit {

  currency = DEFAULT_CURRENCY;
  entryList: any[] = [];
  accountList: any[] = [];
  isLoading = false;
  journalFilters: FilterConfig[] = [];
  activeFilters: { [k: string]: any } = {};

  get filteredEntries(): any[] {
    return this.entryList.filter(entry => {
      for (const key of Object.keys(this.activeFilters)) {
        const val = this.activeFilters[key];
        if (!val) continue;
        if (key === 'dateRange') {
          const d = new Date(entry.date);
          if (val.start && d < new Date(val.start)) return false;
          if (val.end && d > new Date(val.end)) return false;
        } else {
          if (entry[key] !== val) return false;
        }
      }
      return true;
    });
  }

  tableColumns: TableColumn[] = [
    { key: 'date',        label: 'Date',        order: 1, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'entity',      label: 'Entity',      order: 2, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'description', label: 'Description', order: 3, columnWidth: '26%', cellStyle: '', sortable: false },
    { key: 'source',      label: 'Source',      order: 4, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'createdBy',   label: 'Created By',  order: 5, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'amount',      label: 'Amount (₦)',  order: 6, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'status',      label: 'Status',      order: 7, columnWidth: '10%', cellStyle: '', sortable: false },
  ];

  constructor(
    private modal: ModalService,
    private accountingService: AccountingService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    forkJoin({
      entries:  this.accountingService.getJournalEntries(),
      accounts: this.accountingService.getChartOfAccounts(),
    }).subscribe(({ entries, accounts }) => {
      this.entryList   = entries.data ?? [];
      this.accountList = accounts.data ?? [];
      this.buildFilters();
      this.isLoading = false;
    });
  }

  buildFilters(): void {
    const sourceSet = [...new Set(this.entryList.map(e => e.source).filter(Boolean))];
    const sourceOptions = sourceSet.reduce((acc: any, s: any) => { acc[s] = s; return acc; }, {});

    const entitySet = [...new Set(this.entryList.map(e => e.entity).filter(Boolean))];
    const entityOptions = entitySet.reduce((acc: any, e: any) => { acc[e] = e; return acc; }, {});

    this.journalFilters = [
      { key: 'dateRange', label: 'Date Range',      type: 'daterange', options: {},            includeIfEmpty: false },
      { key: 'source',    label: 'Source',           type: 'select',    options: sourceOptions, includeIfEmpty: false },
      { key: 'entity',    label: 'Entity',           type: 'select',    options: entityOptions, includeIfEmpty: false },
      { key: 'status',    label: 'Status',           type: 'select',    options: { Posted: 'Posted', Draft: 'Draft' }, includeIfEmpty: false },
    ];
  }

  onFiltersChange(filters: { [k: string]: any }): void {
    this.activeFilters = filters;
  }

  createEntry(): void {
    this.modal.open(JournalEntryInfoComponent, {
      title: 'New journal entry',
      icon: 'register',
      size: 'lg',
      data: {
        accounts: this.accountList,
        entities: [...new Set(this.entryList.map(e => e.entity).filter(Boolean))],
      },
    }).afterClosed().subscribe(() => this.loadData());
  }
}
