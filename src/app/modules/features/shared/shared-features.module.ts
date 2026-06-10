import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { InvoiceListComponent } from './invoices/invoice-list/invoice-list.component';
import { InvoiceInfoComponent } from './invoices/invoice-info/invoice-info.component';
import { InvoiceDetailsComponent } from './invoices/invoice-details/invoice-details.component';

import { VendorListComponent } from './vendors/vendor-list/vendor-list.component';
import { VendorInfoComponent } from './vendors/vendor-info/vendor-info.component';
import { VendorOverviewComponent } from './vendors/vendor-overview/vendor-overview.component';
import { VendorDetailsComponent } from './vendors/vendor-details/vendor-details.component';
import { VendorOrderHistoryComponent } from './vendors/vendor-order-history/vendor-order-history.component';

@NgModule({
  declarations: [
    InvoiceListComponent,
    InvoiceInfoComponent,
    InvoiceDetailsComponent,
    VendorListComponent,
    VendorInfoComponent,
    VendorOverviewComponent,
    VendorDetailsComponent,
    VendorOrderHistoryComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  exports: [
    InvoiceListComponent,
    InvoiceInfoComponent,
    InvoiceDetailsComponent,
    VendorListComponent,
    VendorInfoComponent,
    VendorOverviewComponent,
    VendorDetailsComponent,
    VendorOrderHistoryComponent,
  ],
})
export class SharedFeaturesModule { }
