import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { AccountGroupInfoComponent } from '../account-group-info/account-group-info.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-account-groups-overview',
  templateUrl: './account-groups-overview.component.html',
  styleUrls: ['./account-groups-overview.component.scss']
})
export class AccountGroupsOverviewComponent implements OnInit {

  accountGroupList: any[] = [];
  accountTypeList: any[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];

  tableColumns: TableColumn[] = [
    { key: 'name',            label: 'Name',          order: 1, columnWidth: '22%', cellStyle: '', sortable: false },
    { key: 'accountTypeName', label: 'Account Type',  order: 2, columnWidth: '18%', cellStyle: '', sortable: false },
    { key: 'parentGroupName', label: 'Parent Group',  order: 3, columnWidth: '18%', cellStyle: '', sortable: false },
    { key: 'code',            label: 'Code',           order: 4, columnWidth: '10%', cellStyle: '', sortable: false },
    { key: 'status',          label: 'Status',         order: 5, columnWidth: '13%', cellStyle: '', sortable: false },
    { key: 'actions',         label: 'Actions',        order: 6, columnWidth: '10%', cellStyle: '', sortable: false },
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
      types: this.accountingService.getAccountTypes(),
      groups: this.accountingService.getAccountGroups(),
    }).subscribe(({ types, groups }) => {
      this.accountTypeList = types.data ?? [];
      this.accountGroupList = groups.data ?? [];
      this.dataSource = new MatTableDataSource(this.accountGroupList);
    });
  }

  createAccountGroup(): void {
    this.modal.open(AccountGroupInfoComponent, {
      title: 'Create Account Group',
      icon: 'layer',
      size: 'md',
      data: { isExisting: false, accountTypes: this.accountTypeList, accountGroups: this.accountGroupList },
    }).afterClosed().subscribe(() => this.loadData());
  }

  editAccountGroup(row: any): void {
    this.modal.open(AccountGroupInfoComponent, {
      title: 'Edit Account Group',
      icon: 'layer',
      size: 'md',
      data: { isExisting: true, id: row._id, modalInfo: row, accountTypes: this.accountTypeList, accountGroups: this.accountGroupList },
    }).afterClosed().subscribe(() => this.loadData());
  }

  deleteAccountGroup(row: any): void {
    this.notifyService.confirmAction({
      title: 'Remove ' + row.name,
      message: 'Are you sure you want to remove this account group?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (confirmed) {
        this.accountingService.deleteAccountGroup(row._id).subscribe({
          next: res => {
            if (res.status === 200) {
              this.notifyService.showInfo('Account group removed successfully');
            }
            this.loadData();
          },
          error: err => this.notifyService.showError(err.error?.error ?? 'Something went wrong')
        });
      }
    });
  }
}
