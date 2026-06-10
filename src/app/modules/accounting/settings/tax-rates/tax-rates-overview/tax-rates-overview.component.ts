import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { TaxRateInfoComponent } from '../tax-rate-info/tax-rate-info.component';

@Component({
  selector: 'app-tax-rates-overview',
  templateUrl: './tax-rates-overview.component.html',
  styleUrls: ['./tax-rates-overview.component.scss']
})
export class TaxRatesOverviewComponent implements OnInit {

  taxRateList: any[] = [];
  accountList: any[] = [];
  branchList: any[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];

  tableColumns: TableColumn[] = [
    { key: 'name',      label: 'Tax Name',  order: 1, columnWidth: '22%', cellStyle: '', sortable: false },
    { key: 'taxType',   label: 'Tax Type',  order: 2, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'rate',      label: 'Rate',      order: 3, columnWidth: '8%',  cellStyle: '', sortable: false },
    { key: 'method',    label: 'Method',    order: 4, columnWidth: '13%', cellStyle: '', sortable: false },
    { key: 'appliesTo', label: 'Applies To',order: 5, columnWidth: '13%', cellStyle: '', sortable: false },
    { key: 'status',    label: 'Status',    order: 6, columnWidth: '11%', cellStyle: '', sortable: false },
    { key: 'actions',   label: 'Actions',   order: 7, columnWidth: '5%',  cellStyle: '', sortable: false },
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
      rates:    this.accountingService.getTaxRates(),
      accounts: this.accountingService.getChartOfAccounts(),
      branches: this.hrService.getBranches().pipe(catchError(() => of({ data: [] }))),
    }).subscribe(({ rates, accounts, branches }) => {
      this.taxRateList = rates.data ?? [];
      this.accountList = accounts.data ?? [];
      this.branchList = branches.data ?? [];
      this.dataSource = new MatTableDataSource(this.taxRateList);
    });
  }

  createTaxRate(): void {
    this.modal.open(TaxRateInfoComponent, {
      title: 'Create Tax Rate',
      icon: 'cash',
      size: 'lg',
      data: { isExisting: false, accounts: this.accountList, branches: this.branchList },
    }).afterClosed().subscribe(() => this.loadData());
  }

  editTaxRate(row: any): void {
    this.modal.open(TaxRateInfoComponent, {
      title: 'Edit Tax Rate',
      icon: 'cash',
      size: 'lg',
      data: { isExisting: true, id: row._id, modalInfo: row, accounts: this.accountList, branches: this.branchList },
    }).afterClosed().subscribe(() => this.loadData());
  }

  deleteTaxRate(row: any): void {
    this.notifyService.confirmAction({
      title: 'Remove ' + row.name,
      message: 'Are you sure you want to remove this tax rate?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (confirmed) {
        this.accountingService.deleteTaxRate(row._id).subscribe({
          next: res => {
            if (res.status === 200) {
              this.notifyService.showInfo('Tax rate removed successfully');
            }
            this.loadData();
          },
          error: err => this.notifyService.showError(err.error?.error ?? 'Something went wrong')
        });
      }
    });
  }
}
