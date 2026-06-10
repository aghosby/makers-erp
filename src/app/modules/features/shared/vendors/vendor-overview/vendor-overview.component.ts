import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { VendorInfoComponent } from '../vendor-info/vendor-info.component';

@Component({
  selector: 'app-vendor-overview',
  templateUrl: './vendor-overview.component.html',
  styleUrls: ['./vendor-overview.component.scss']
})
export class VendorOverviewComponent implements OnInit {

  vendorId: string = '';
  vendorDetails: any;
  isLoading = false;

  tabMenu = [
    { routeLink: 'details',       label: 'Vendor Information' },
    { routeLink: 'order-history', label: 'Order History' },
  ];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.vendorId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadVendor();
  }

  loadVendor(): void {
    this.isLoading = true;
    this.ordersService.getSupplier(this.vendorId).subscribe({
      next: res => { this.vendorDetails = res.data; this.isLoading = false; },
      error: () => { this.isLoading = false; },
    });
  }

  editVendor(): void {
    this.modal.open(VendorInfoComponent, {
      title: 'Edit Vendor',
      icon: 'building',
      size: 'md',
      data: { isExisting: true, id: this.vendorId, modalInfo: this.vendorDetails },
    }).afterClosed().subscribe(() => this.loadVendor());
  }

  goBack(): void {
    this.location.back();
  }
}
