import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { FilterConfig } from 'src/app/shared/models/table-filter';
import { InvoiceService } from 'src/app/shared/services/invoice/invoice.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { DEFAULT_CURRENCY } from 'src/app/core/constants/general-data';
import { InvoiceInfoComponent } from '../invoice-info/invoice-info.component';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {

  currency = DEFAULT_CURRENCY;
  invoiceList: any[] = [];
  isLoading = false;
  invoiceFilters: FilterConfig[] = [];
  activeFilters: { [k: string]: any } = {};

  get filteredInvoices(): any[] {
    return this.invoiceList.filter(inv => {
      for (const key of Object.keys(this.activeFilters)) {
        const val = this.activeFilters[key];
        if (!val) continue;
        if (key === 'dateRange') {
          const d = new Date(inv.date);
          if (val.start && d < new Date(val.start)) return false;
          if (val.end   && d > new Date(val.end))   return false;
        } else {
          if (inv[key] !== val) return false;
        }
      }
      return true;
    });
  }

  tableColumns: TableColumn[] = [
    { key: 'invoiceNumber', label: 'Invoice #',   order: 1, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'customer',      label: 'Customer',     order: 2, columnWidth: '22%', cellStyle: '', sortable: false },
    { key: 'date',          label: 'Date',         order: 3, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'dueDate',       label: 'Due Date',     order: 4, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'total',         label: 'Total (₦)',    order: 5, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'status',        label: 'Status',       order: 6, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'actions',       label: 'Actions',      order: 7, columnWidth: '10%', cellStyle: '', sortable: false },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalService,
    private invoiceService: InvoiceService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.invoiceService.getInvoices().subscribe(res => {
      this.invoiceList = res.data ?? [];
      this.buildFilters();
      this.isLoading = false;
    });
  }

  buildFilters(): void {
    const customerOptions = [...new Set(this.invoiceList.map(i => i.customer).filter(Boolean))]
      .reduce((acc: any, c: any) => { acc[c] = c; return acc; }, {});

    const entityOptions = [...new Set(this.invoiceList.map(i => i.entity).filter(Boolean))]
      .reduce((acc: any, e: any) => { acc[e] = e; return acc; }, {});

    this.invoiceFilters = [
      { key: 'dateRange', label: 'Date Range', type: 'daterange', options: {}, includeIfEmpty: false },
      { key: 'status',    label: 'Status',     type: 'select', options: { Draft: 'Draft', Sent: 'Sent', Paid: 'Paid', Overdue: 'Overdue', Cancelled: 'Cancelled' }, includeIfEmpty: false },
      { key: 'customer',  label: 'Customer',   type: 'select', options: customerOptions, includeIfEmpty: false },
      { key: 'entity',    label: 'Entity',     type: 'select', options: entityOptions,  includeIfEmpty: false },
    ];
  }

  onFiltersChange(filters: { [k: string]: any }): void {
    this.activeFilters = filters;
  }

  viewInvoice(row: any): void {
    this.router.navigate([row._id], { relativeTo: this.route });
  }

  createInvoice(): void {
    this.modal.open(InvoiceInfoComponent, {
      title: 'New Invoice',
      icon: 'card',
      size: 'lg',
      data: { isExisting: false },
    }).afterClosed().subscribe(() => this.loadData());
  }

  getStatusClass(status: string): string {
    const map: { [k: string]: string } = {
      Paid: 'approved', Sent: 'pending', Draft: 'inactive', Overdue: 'declined', Cancelled: 'inactive'
    };
    return map[status] ?? 'inactive';
  }

  editInvoice(row: any): void {
    this.modal.open(InvoiceInfoComponent, {
      title: 'Edit Invoice',
      icon: 'card',
      size: 'lg',
      data: { isExisting: true, id: row._id, modalInfo: row },
    }).afterClosed().subscribe(() => this.loadData());
  }
}
