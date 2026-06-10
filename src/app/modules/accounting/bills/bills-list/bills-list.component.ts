import { Component, OnInit } from '@angular/core';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { FilterConfig } from 'src/app/shared/models/table-filter';
import { BillService } from 'src/app/shared/services/bills/bill.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { DEFAULT_CURRENCY } from 'src/app/core/constants/general-data';
import { BillInfoComponent } from '../bill-info/bill-info.component';
import { BillDetailsComponent } from '../bill-details/bill-details.component';

@Component({
  selector: 'app-bills-list',
  templateUrl: './bills-list.component.html',
  styleUrls: ['./bills-list.component.scss']
})
export class BillsListComponent implements OnInit {

  currency = DEFAULT_CURRENCY;
  billList: any[] = [];
  isLoading = false;
  billFilters: FilterConfig[] = [];
  activeFilters: { [k: string]: any } = {};

  get filteredBills(): any[] {
    return this.billList.filter(bill => {
      for (const key of Object.keys(this.activeFilters)) {
        const val = this.activeFilters[key];
        if (val === null || val === undefined || val === '') continue;
        if (key === 'dateRange') {
          const d = new Date(bill.date);
          if (val.start && d < new Date(val.start)) return false;
          if (val.end   && d > new Date(val.end))   return false;
        } else if (key === 'requiresApproval') {
          if (bill.requiresApproval !== (val === 'Yes')) return false;
        } else {
          if (bill[key] !== val) return false;
        }
      }
      return true;
    });
  }

  tableColumns: TableColumn[] = [
    { key: 'billNumber',       label: 'Bill #',            order: 1, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'vendor',           label: 'Vendor',            order: 2, columnWidth: '18%', cellStyle: '', sortable: false },
    { key: 'date',             label: 'Date',              order: 3, columnWidth: '10%', cellStyle: '', sortable: false },
    { key: 'dueDate',          label: 'Due Date',          order: 4, columnWidth: '10%', cellStyle: '', sortable: false },
    { key: 'total',            label: 'Total (₦)',         order: 5, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'requiresApproval', label: 'Approval',          order: 6, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'status',           label: 'Status',            order: 7, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'actions',          label: 'Actions',           order: 8, columnWidth: '10%', cellStyle: '', sortable: false },
  ];

  constructor(
    private modal: ModalService,
    private billService: BillService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.billService.getBills().subscribe(res => {
      this.billList = res.data ?? [];
      this.buildFilters();
      this.isLoading = false;
    });
  }

  buildFilters(): void {
    const vendorOptions = [...new Set(this.billList.map(b => b.vendor).filter(Boolean))]
      .reduce((acc: any, v: any) => { acc[v] = v; return acc; }, {});

    this.billFilters = [
      { key: 'dateRange',        label: 'Date Range',       type: 'daterange',  options: {}, includeIfEmpty: false },
      { key: 'status',           label: 'Status',           type: 'select',     options: { Draft: 'Draft', 'Pending Approval': 'Pending Approval', Approved: 'Approved', Paid: 'Paid', Overdue: 'Overdue', Rejected: 'Rejected' }, includeIfEmpty: false },
      { key: 'category',         label: 'Category',         type: 'select',     options: { Utilities: 'Utilities', 'Office Supplies': 'Office Supplies', Travel: 'Travel', Equipment: 'Equipment', Services: 'Services', Other: 'Other' }, includeIfEmpty: false },
      { key: 'requiresApproval', label: 'Requires Approval', type: 'select',   options: { Yes: 'Yes', No: 'No' }, includeIfEmpty: false },
      { key: 'vendor',           label: 'Vendor',           type: 'select',     options: vendorOptions, includeIfEmpty: false },
    ];
  }

  onFiltersChange(filters: { [k: string]: any }): void {
    this.activeFilters = filters;
  }

  openView(row: any): void {
    this.modal.open(BillDetailsComponent, {
      title: row.billNumber,
      icon: 'cash',
      size: 'lg',
      data: { id: row._id },
    }).afterClosed().subscribe(() => this.loadData());
  }

  openCreate(): void {
    this.modal.open(BillInfoComponent, {
      title: 'New Bill',
      icon: 'cash',
      size: 'lg',
      data: { isExisting: false },
    }).afterClosed().subscribe(() => this.loadData());
  }

  openEdit(row: any): void {
    this.modal.open(BillInfoComponent, {
      title: 'Edit Bill',
      icon: 'cash',
      size: 'lg',
      data: { isExisting: true, id: row._id, modalInfo: row },
    }).afterClosed().subscribe(() => this.loadData());
  }

  deleteBill(row: any): void {
    this.notifyService.confirmAction({
      title: 'Delete Bill',
      message: `Delete ${row.billNumber}? This cannot be undone.`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.billService.deleteBill(row._id).subscribe({
        next: () => {
          this.notifyService.showSuccess('Bill deleted successfully');
          this.loadData();
        },
        error: err => this.notifyService.showError(err.error?.error ?? 'Something went wrong'),
      });
    });
  }

  getStatusClass(status: string): string {
    const map: { [k: string]: string } = {
      Draft: 'inactive', 'Pending Approval': 'pending',
      Approved: 'approved', Paid: 'approved',
      Overdue: 'declined', Rejected: 'declined',
    };
    return map[status] ?? 'inactive';
  }
}
