import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrdersRoutingModule } from './orders-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxGaugeModule } from 'ngx-gauge';
import { OrdersDashboardComponent } from './components/orders-dashboard/orders-dashboard.component';
import { PurchaseOrdersInfoComponent } from './purchase-orders/purchase-orders-info/purchase-orders-info.component';
import { PurchaseOrdersHistoryComponent } from './purchase-orders/purchase-orders-history/purchase-orders-history.component';
import { PurchaseOrdersDetailsComponent } from './purchase-orders/purchase-orders-details/purchase-orders-details.component';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { CustomerInfoComponent } from './customers/customer-info/customer-info.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductInfoComponent } from './products/product-info/product-info.component';
import { FreightCarrierListComponent } from './logistics/freight-carrier-list/freight-carrier-list.component';
import { FreightCarrierInfoComponent } from './logistics/freight-carrier-info/freight-carrier-info.component';
import { CustomerDetailsComponent } from './customers/customer-details/customer-details.component';
import { StockInfoComponent } from './products/stock-info/stock-info.component';
import { ProductCategoryComponent } from './products/product-category/product-category.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { CustomerOverviewComponent } from './customers/customer-overview/customer-overview.component';
import { CustomerSalesComponent } from './customers/customer-sales/customer-sales.component';
import { ProductOverviewComponent } from './products/product-overview/product-overview.component';
import { ProductStockHistoryComponent } from './products/product-stock-history/product-stock-history.component';
import { ProductSalesComponent } from './products/product-sales/product-sales.component';
import { CourierListComponent } from './couriers/courier-list/courier-list.component';
import { CourierInfoComponent } from './couriers/courier-info/courier-info.component';
import { CourierOverviewComponent } from './couriers/courier-overview/courier-overview.component';
import { CourierDetailsComponent } from './couriers/courier-details/courier-details.component';
import { CourierDeliveryHistoryComponent } from './couriers/courier-delivery-history/courier-delivery-history.component';
import { OrdersSettingsComponent } from './settings/orders-settings/orders-settings.component';
import { SharedFeaturesModule } from '../features/shared/shared-features.module';


@NgModule({
  declarations: [
    OrdersDashboardComponent,
    PurchaseOrdersInfoComponent,
    PurchaseOrdersHistoryComponent,
    PurchaseOrdersDetailsComponent,
    CustomerListComponent,
    CustomerInfoComponent,
    ProductListComponent,
    ProductInfoComponent,
    ProductDetailsComponent,
    FreightCarrierListComponent,
    FreightCarrierInfoComponent,
    CustomerDetailsComponent,
    StockInfoComponent,
    ProductCategoryComponent,
    CustomerOverviewComponent,
    CustomerSalesComponent,
    ProductOverviewComponent,
    ProductStockHistoryComponent,
    ProductSalesComponent,
    CourierListComponent,
    CourierInfoComponent,
    CourierOverviewComponent,
    CourierDetailsComponent,
    CourierDeliveryHistoryComponent,
    OrdersSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedFeaturesModule,
    NgxGaugeModule,
    NgxChartsModule,
    HighchartsChartModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
