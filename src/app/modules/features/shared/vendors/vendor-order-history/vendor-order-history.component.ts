import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';

@Component({
  selector: 'app-vendor-order-history',
  templateUrl: './vendor-order-history.component.html',
  styleUrls: ['./vendor-order-history.component.scss']
})
export class VendorOrderHistoryComponent implements OnInit {

  vendorId: string = '';
  orderList: any[] = [];
  isLoading = false;

  tableColumns: TableColumn[] = [
    { key: 'orderNumber', label: 'Order #',     order: 1, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'date',        label: 'Date',         order: 2, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'items',       label: 'Items',        order: 3, columnWidth: '20%', cellStyle: '', sortable: false },
    { key: 'total',       label: 'Total',        order: 4, columnWidth: '14%', cellStyle: '', sortable: false },
    { key: 'status',      label: 'Status',       order: 5, columnWidth: '12%', cellStyle: '', sortable: false },
  ];

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
  ) {}

  ngOnInit(): void {
    this.vendorId = this.route.parent?.snapshot.paramMap.get('id') ?? '';
    // Load vendor order history when endpoint is available
    // this.ordersService.getVendorOrders(this.vendorId).subscribe(...)
  }

  getStatusClass(status: string): string {
    const map: { [k: string]: string } = {
      Delivered: 'approved', Processing: 'pending',
      Cancelled: 'declined', Pending: 'inactive',
    };
    return map[status] ?? 'inactive';
  }
}
