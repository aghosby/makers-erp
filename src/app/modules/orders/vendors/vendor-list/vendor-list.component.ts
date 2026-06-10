import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { VendorInfoComponent } from '../vendor-info/vendor-info.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: any[];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);

  vendorList: any[] = [];

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
      key: "logo",
      label: "Logo",
      order: 2,
      columnWidth: "5%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "vendorName",
      label: "Vendor",
      order: 4,
      columnWidth: "11%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "email",
      label: "Contact Email",
      order: 6,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "address",
      label: "Location",
      order: 7,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "activeOrders",
      label: "Active Orders",
      order: 8,
      columnWidth: "13%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "fulfilledOrders",
      label: "Fulfilled Orders",
      order: 9,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "actions",
      label: "Actions",
      order: 10,
      columnWidth: "5%",
      cellStyle: "width: 100%",
      sortable: true
    }

  ]

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private ordersService: OrdersService,
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map(column => column.label);
    this.getPageData();
  }

  getPageData = async () => {
    this.vendorList = await this.ordersService.getSuppliers().toPromise();
    console.log(this.vendorList)

    this.dataSource = new MatTableDataSource(this.vendorList['data']);
    this.dataSource.sort = this.sort;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  addNewVendor() {
    let dialogRef = this.dialog.open(VendorInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        isExisting: false
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  viewVendor(info) {
    this.router.navigateByUrl(`app/orders/vendors/${info._id}`);
  }

  deleteVendor(info) {

  }

  addBulkVendors() {

  }

}
