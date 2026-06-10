import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { FilterConfig } from 'src/app/shared/models/table-filter';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { ChartOfAccountInfoComponent } from '../chart-of-account-info/chart-of-account-info.component';
import { DEFAULT_CURRENCY } from 'src/app/core/constants/general-data';

@Component({
  selector: 'app-chart-of-accounts-overview',
  templateUrl: './chart-of-accounts-overview.component.html',
  styleUrls: ['./chart-of-accounts-overview.component.scss']
})
export class ChartOfAccountsOverviewComponent implements OnInit {

  currency = DEFAULT_CURRENCY;
  accountList: any[] = [];
  accountTypeList: any[] = [];
  accountGroupList: any[] = [];
  accountFilters: FilterConfig[] = [];
  activeFilters: { [k: string]: any } = {};
  isLoading = false;

  get filteredList(): any[] {
    return this.accountList.filter(acc => {
      for (const key of Object.keys(this.activeFilters)) {
        const val = this.activeFilters[key];
        if (!val) continue;
        if (acc[key] !== val) return false;
      }
      return true;
    });
  }

  tableColumns: TableColumn[] = [
    { key: 'name',            label: 'Name',                    order: 1, columnWidth: '28%', cellStyle: '', sortable: false },
    { key: 'accountTypeName', label: 'Account Type',            order: 2, columnWidth: '22%', cellStyle: '', sortable: false },
    { key: 'branch',          label: 'Branch',                  order: 3, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'currentBalance',  label: 'Current Balance (₦)',     order: 4, columnWidth: '18%', cellStyle: '', sortable: false },
    { key: 'status',          label: 'Status',                  order: 5, columnWidth: '10%', cellStyle: '', sortable: false },
    { key: 'actions',         label: 'Actions',                 order: 6, columnWidth: '10%', cellStyle: '', sortable: false },
  ];

  constructor(
    private router: Router,
    private modal: ModalService,
    private accountingService: AccountingService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    forkJoin({
      types:    this.accountingService.getAccountTypes(),
      groups:   this.accountingService.getAccountGroups(),
      accounts: this.accountingService.getChartOfAccounts(),
    }).subscribe(({ types, groups, accounts }) => {
      this.accountTypeList  = types.data ?? [];
      this.accountGroupList = groups.data ?? [];
      this.accountList      = accounts.data ?? [];
      this.buildFilters();
      this.isLoading = false;
    });
  }

  buildFilters(): void {
    const typeOptions = this.accountTypeList.reduce((acc: any, t: any) => {
      acc[t.name] = t.name;
      return acc;
    }, {});

    const groupOptions = this.accountGroupList.reduce((acc: any, g: any) => {
      acc[g.name] = g.name;
      return acc;
    }, {});

    const branchOptions = [...new Set(
      this.accountList.map((a: any) => a.branch).filter(Boolean)
    )].reduce((acc: any, b: any) => { acc[b] = b; return acc; }, {});

    this.accountFilters = [
      {
        key: 'accountTypeName', label: 'Account Type', type: 'select',
        options: typeOptions, includeIfEmpty: false
      },
      {
        key: 'accountGroupName', label: 'Account Group', type: 'select',
        options: groupOptions, includeIfEmpty: false
      },
      {
        key: 'branch', label: 'Branch', type: 'select',
        options: branchOptions, includeIfEmpty: false
      },
      {
        key: 'status', label: 'Status', type: 'select',
        options: { Active: 'Active', Inactive: 'Inactive' }, includeIfEmpty: false
      },
    ];
  }

  onFiltersChange(filters: { [k: string]: any }): void {
    this.activeFilters = filters;
  }

  viewAccount(row: any): void {
    this.router.navigate(['/app/accounting/chart-of-accounts', row._id]);
  }

  createAccount(): void {
    this.modal.open(ChartOfAccountInfoComponent, {
      title: 'Create Account',
      icon: 'register',
      size: 'lg',
      data: {
        isExisting: false,
        accountTypes: this.accountTypeList,
        accountGroups: this.accountGroupList,
        accounts: this.accountList,
      },
    }).afterClosed().subscribe(() => this.loadData());
  }

  editAccount(row: any): void {
    this.modal.open(ChartOfAccountInfoComponent, {
      title: 'Edit Account',
      icon: 'register',
      size: 'lg',
      data: {
        isExisting: true,
        id: row._id,
        modalInfo: row,
        accountTypes: this.accountTypeList,
        accountGroups: this.accountGroupList,
        accounts: this.accountList,
      },
    }).afterClosed().subscribe(() => this.loadData());
  }

  deleteAccount(row: any): void {
    this.notifyService.confirmAction({
      title: 'Remove ' + row.name,
      message: 'Are you sure you want to remove this account?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (confirmed) {
        this.accountingService.deleteAccount(row._id).subscribe({
          next: res => {
            if (res.status === 200) {
              this.notifyService.showInfo('Account removed successfully');
            }
            this.loadData();
          },
          error: err => this.notifyService.showError(err.error?.error ?? 'Something went wrong')
        });
      }
    });
  }
}
