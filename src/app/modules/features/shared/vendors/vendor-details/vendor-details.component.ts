import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss']
})
export class VendorDetailsComponent implements OnInit {

  vendorDetails: any;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
  ) {}

  ngOnInit(): void {
    const vendorId = this.route.parent?.snapshot.paramMap.get('id') ?? '';
    this.isLoading = true;
    this.ordersService.getSupplier(vendorId).subscribe({
      next: res => { this.vendorDetails = res.data; this.isLoading = false; },
      error: () => { this.isLoading = false; },
    });
  }
}
