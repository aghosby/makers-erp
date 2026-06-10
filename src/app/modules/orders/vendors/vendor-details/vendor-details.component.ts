import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, Location } from '@angular/common';
import { OrdersService } from '@services/orders/orders.service';
import { NotificationService } from '@services/utils/notification.service';
import { VendorInfoComponent } from '../vendor-info/vendor-info.component';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss']
})
export class VendorDetailsComponent implements OnInit {

  vendorId: string;
  vendorDetails: any;

  industriesList: any = [];

  constructor(
    private location: Location,
    public dialog: MatDialog,
    private router: Router,
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    this.vendorId = this.router.url.split('/')[4];
    this.getPageData();
  }

  goBack() {
    this.location.back();
  }

  getPageData = async () => {
    this.ordersService.getSupplier(this.vendorId).subscribe(res => this.vendorDetails = res.data);
    this.ordersService.getIndustries().subscribe(res => this.industriesList = res.data);
  }

  editVendorInfo() {
    let dialogRef = this.dialog.open(VendorInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        vendorDetails: this.vendorDetails,
        industries: this.industriesList,
        isExisting: true
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

}
