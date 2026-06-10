import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { FilterConfig } from 'src/app/shared/models/table-filter';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { VendorInfoComponent } from '../vendor-info/vendor-info.component';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {

  vendorList: any[] = [];
  isLoading = false;
  vendorFilters: FilterConfig[] = [];
  activeFilters: { [k: string]: any } = {};

  get filteredVendors(): any[] {
    return this.vendorList.filter(v => {
      for (const key of Object.keys(this.activeFilters)) {
        const val = this.activeFilters[key];
        if (!val) continue;
        if (key === 'location') {
          const city = v.address?.city?.toLowerCase() ?? '';
          const state = v.address?.state?.toLowerCase() ?? '';
          if (!city.includes(val.toLowerCase()) && !state.includes(val.toLowerCase())) return false;
        } else {
          if (v[key] !== val) return false;
        }
      }
      return true;
    });
  }

  tableColumns: TableColumn[] = [
    { key: 'vendorName',      label: 'Vendor',           order: 1, columnWidth: '20%', cellStyle: '', sortable: false },
    { key: 'email',           label: 'Email',            order: 2, columnWidth: '20%', cellStyle: '', sortable: false },
    { key: 'location',        label: 'Location',         order: 3, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'phone',           label: 'Phone',            order: 4, columnWidth: '12%', cellStyle: '', sortable: false },
    { key: 'activeOrders',    label: 'Active Orders',    order: 5, columnWidth: '10%', cellStyle: '', sortable: false },
    { key: 'fulfilledOrders', label: 'Fulfilled',        order: 6, columnWidth: '10%', cellStyle: '', sortable: false },
    { key: 'actions',         label: 'Actions',          order: 7, columnWidth: '10%', cellStyle: '', sortable: false },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalService,
    private ordersService: OrdersService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.ordersService.getSuppliers().subscribe({
      next: res => {
        this.vendorList = res.data ?? [];
        this.buildFilters();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  buildFilters(): void {
    this.vendorFilters = [
      { key: 'location', label: 'Location', type: 'text', options: {}, includeIfEmpty: false },
    ];
  }

  onFiltersChange(filters: { [k: string]: any }): void {
    this.activeFilters = filters;
  }

  viewVendor(row: any): void {
    this.router.navigate([row._id], { relativeTo: this.route });
  }

  openCreate(): void {
    this.modal.open(VendorInfoComponent, {
      title: 'Add Vendor',
      icon: 'building',
      size: 'md',
      data: { isExisting: false },
    }).afterClosed().subscribe(() => this.loadData());
  }

  openEdit(row: any): void {
    this.modal.open(VendorInfoComponent, {
      title: 'Edit Vendor',
      icon: 'building',
      size: 'md',
      data: { isExisting: true, id: row._id, modalInfo: row },
    }).afterClosed().subscribe(() => this.loadData());
  }

  deleteVendor(row: any): void {
    this.notifyService.confirmAction({
      title: 'Delete Vendor',
      message: `Remove ${row.vendorName} from vendors?`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.ordersService.deleteSupplier(row._id).subscribe({
        next: () => {
          this.notifyService.showSuccess('Vendor deleted successfully');
          this.loadData();
        },
        error: err => this.notifyService.showError(err.error?.error ?? 'Something went wrong'),
      });
    });
  }
}
