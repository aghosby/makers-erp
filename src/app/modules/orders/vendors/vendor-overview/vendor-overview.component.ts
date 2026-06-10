import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '@services/orders/orders.service';
import { NotificationService } from '@services/utils/notification.service';

@Component({
  selector: 'app-vendor-overview',
  templateUrl: './vendor-overview.component.html',
  styleUrls: ['./vendor-overview.component.scss']
})
export class VendorOverviewComponent implements OnInit {

  vendorId: string;
  vendorDetails: any;

  tabMenu = [
    {
      routeLink: 'details',
      label: 'Vendor Information',
    },
    {
      routeLink: 'order-history',
      label: 'Order History',
    }
  ]

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    this.vendorId = this.activatedRoute.snapshot.params["id"];

    this.ordersService.getSupplier(this.vendorId).subscribe(res => {
      this.vendorDetails = res.data;
      console.log(this.vendorDetails)
    })
  }

  goBack() {
    this.location.back();
  }

}
