import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: any[];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);

  productList: any[] = [];
  productCategoryList: any[] = [];

  //Product Table Column Names
  tableColumns: any[] = [
    {
      key: "select",
      label: "Select",
      order: 1,
      columnWidth: "3%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "image",
      label: "Image",
      order: 2,
      columnWidth: "5%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "productName",
      label: "Name",
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "partNumber",
      label: "Part Number",
      order: 6,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "price",
      label: "Price",
      order: 7,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "productType",
      label: "Type",
      order: 8,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "supplier",
      label: "Vendor",
      order: 8,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "stock",
      label: "Stock",
      order: 9,
      columnWidth: "13%",
      cellStyle: "width: 100%",
      sortable: true
    },
    // {
    //   key: "activeStatus",
    //   label: "Status",
    //   order: 10,
    //   columnWidth: "8%",
    //   cellStyle: "width: 100%",
    //   sortable: true
    // },
    {
      key: "actions",
      label: "Actions",
      order: 11,
      columnWidth: "5%",
      cellStyle: "width: 100%",
      sortable: true
    }

  ]

  constructor(
    private route: Router, 
    public dialog: MatDialog,
    private ordersService: OrdersService,
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map(column => column.label);
    this.getPageData();
  }

  getPageData = async () =>  {
    this.productList = await this.ordersService.getProducts().toPromise();

    // this.customerList = await this.ordersService.getCustomers().toPromise();
    // console.log(this.customerList)

    this.dataSource = new MatTableDataSource(this.productList['data']);
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  addNewProduct() {
    this.route.navigate(['app/orders/products/new']);
  }

  addBulkProducts() {

  }

  viewProduct(info: any) {
    this.route.navigateByUrl(`app/orders/products/${info._id}/details`);
  }

  deleteProduct(info:any) {

  }

}
