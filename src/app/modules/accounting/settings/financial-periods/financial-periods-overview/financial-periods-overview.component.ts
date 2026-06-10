import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { AccountingService } from 'src/app/shared/services/accounting/accounting.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { FinancialPeriodInfoComponent } from '../financial-period-info/financial-period-info.component';

@Component({
  selector: 'app-financial-periods-overview',
  templateUrl: './financial-periods-overview.component.html',
  styleUrls: ['./financial-periods-overview.component.scss']
})
export class FinancialPeriodsOverviewComponent implements OnInit {

  periodList: any[] = [];
  branchList: any[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];

  tableColumns: TableColumn[] = [
    { key: 'periodName',    label: 'Period',         order: 1, columnWidth: '22%', cellStyle: '', sortable: false },
    { key: 'financialYear', label: 'Financial Year', order: 2, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'startDate',     label: 'Start Date',     order: 3, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'endDate',       label: 'End Date',       order: 4, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'branch',        label: 'Branch',         order: 5, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'status',        label: 'Status',         order: 6, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'actions',       label: 'Actions',        order: 7, columnWidth: '5%',  cellStyle: '', sortable: false },
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
      periods:  this.accountingService.getFinancialPeriods(),
      branches: this.hrService.getBranches().pipe(catchError(() => of({ data: [] }))),
    }).subscribe(({ periods, branches }) => {
      this.periodList = periods.data ?? [];
      this.branchList = branches.data ?? [];
      this.dataSource = new MatTableDataSource(this.periodList);
    });
  }

  createPeriod(): void {
    this.modal.open(FinancialPeriodInfoComponent, {
      title: 'Create Financial Period',
      icon: 'calendar',
      size: 'md',
      data: { isExisting: false, branches: this.branchList },
    }).afterClosed().subscribe(() => this.loadData());
  }

  editPeriod(row: any): void {
    this.modal.open(FinancialPeriodInfoComponent, {
      title: 'Edit Financial Period',
      icon: 'calendar',
      size: 'md',
      data: { isExisting: true, id: row._id, modalInfo: row, branches: this.branchList },
    }).afterClosed().subscribe(() => this.loadData());
  }

  deletePeriod(row: any): void {
    this.notifyService.confirmAction({
      title: 'Remove ' + row.periodName,
      message: 'Are you sure you want to remove this financial period?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (confirmed) {
        this.accountingService.deleteFinancialPeriod(row._id).subscribe({
          next: res => {
            if (res.status === 200) {
              this.notifyService.showInfo('Financial period removed successfully');
            }
            this.loadData();
          },
          error: err => this.notifyService.showError(err.error?.error ?? 'Something went wrong')
        });
      }
    });
  }
}
