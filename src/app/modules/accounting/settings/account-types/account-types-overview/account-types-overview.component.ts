import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { AccountTypeInfoComponent } from '../account-type-info/account-type-info.component';

@Component({
  selector: 'app-account-types-overview',
  templateUrl: './account-types-overview.component.html',
  styleUrls: ['./account-types-overview.component.scss']
})
export class AccountTypesOverviewComponent implements OnInit {

  accountTypeList: any[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];

  tableColumns: TableColumn[] = [
    { key: 'name',          label: 'Name',           order: 1, columnWidth: '22%', cellStyle: '', sortable: false },
    { key: 'code',          label: 'Code',            order: 2, columnWidth: '10%', cellStyle: '', sortable: false },
    { key: 'normalBalance', label: 'Normal Balance',  order: 3, columnWidth: '15%', cellStyle: '', sortable: false },
    { key: 'reportSection', label: 'Report Section',  order: 4, columnWidth: '20%', cellStyle: '', sortable: false },
    { key: 'status',        label: 'Status',          order: 5, columnWidth: '13%', cellStyle: '', sortable: false },
    { key: 'actions',       label: 'Actions',         order: 6, columnWidth: '10%', cellStyle: '', sortable: false },
  ];

  constructor(
    private modal: ModalService,
    private accountingService: AccountingService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.sort((a, b) => a.order - b.order).map(c => c.label);
    this.getAccountTypes();
  }

  getAccountTypes(): void {
    this.accountingService.getAccountTypes().subscribe((res: any) => {
      this.accountTypeList = res.data;
      this.dataSource = new MatTableDataSource(this.accountTypeList);
    });
  }

  createAccountType(): void {
    this.modal.open(AccountTypeInfoComponent, {
      title: 'Create Account Type',
      icon: 'walletCard',
      size: 'md',
      data: { isExisting: false },
    }).afterClosed().subscribe(() => this.getAccountTypes());
  }

  editAccountType(row: any): void {
    this.modal.open(AccountTypeInfoComponent, {
      title: 'Edit Account Type',
      icon: 'walletCard',
      size: 'md',
      data: { isExisting: true, id: row._id, modalInfo: row },
    }).afterClosed().subscribe(() => this.getAccountTypes());
  }

  deleteAccountType(row: any): void {
    this.notifyService.confirmAction({
      title: 'Remove ' + row.name,
      message: 'Are you sure you want to remove this account type?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (confirmed) {
        this.accountingService.deleteAccountType(row._id).subscribe({
          next: res => {
            if (res.status === 200) {
              this.notifyService.showInfo('Account type removed successfully');
            }
            this.getAccountTypes();
          },
          error: err => this.notifyService.showError(err.error?.error ?? 'Something went wrong')
        });
      }
    });
  }
}
