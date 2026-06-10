import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { TableColumn } from 'src/app/shared/models/table-columns';
import { MatTableDataSource } from '@angular/material/table';
import * as Highcharts from 'highcharts';
import { DatePipe } from '@angular/common';
import { PayrollSummary } from 'src/app/shared/models/payroll-data';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { SharedService } from 'src/app/shared/services/utils/shared.service';
import { ModalService } from 'src/app/shared/services/utils/modal.service';
import { DepartmentInfoComponent } from '../department-info/department-info.component';

@Component({
  selector: 'app-departments-overview',
  templateUrl: './departments-overview.component.html',
  styleUrls: ['./departments-overview.component.scss']
})
export class DepartmentsOverviewComponent implements OnInit {

  employees: any[] = [];
  departmentList: any[] = [];
  displayedColumns: any[];
  dataSource: MatTableDataSource<any>;

  //Department Table Column Names
  tableColumns: TableColumn[] = [
    {
      key: "departmentName",
      label: "Name",
      order: 1,
      columnWidth: "30%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "managerName",
      label: "Manager",
      order: 2,
      columnWidth: "30%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "noOfEmployees",
      label: "Employee Count",
      order: 3,
      columnWidth: "30%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "actions",
      label: "Actions",
      order: 12,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    }

  ]

  constructor(
    private modal: ModalService,
    private route: Router,
    private datePipe: DatePipe,
    @Inject(HumanResourcesService) private hrService: HumanResourcesService,
    @Inject(SharedService) private sharedService: SharedService,
    @Inject(NotificationService) private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    const employees$ = this.hrService.getEmployees().subscribe((res:any) => {
      this.employees = res.data;
    });
    this.tableColumns.sort((a,b) => (a.order - b.order));
    this.displayedColumns = this.tableColumns.map(column => column.label);
    this.getDepartments()
  }


  /*************** DEPARTMENT RELATED ACTIONS ***************/
  
  //Get all Departments
  getDepartments() {
    this.hrService.getDepartments().subscribe((res:any) => {
      this.departmentList = res.data;
      console.log(this.departmentList)
      this.dataSource = new MatTableDataSource(this.departmentList);
    });
  }
  
  //Create a new department
  createDepartment() {
    this.modal.open(DepartmentInfoComponent, {
      title: 'Create Department',
      icon: 'layer',
      size: 'sm',
      data: {
        name: '',
        staff: this.employees,
        isExisting: false,
      },
    }).afterClosed().subscribe(() => {
      this.getDepartments();
    });
  }

  editDepartment(details: any) {
    this.modal.open(DepartmentInfoComponent, {
      title: 'Edit Department',
      icon: 'layer',
      size: 'sm',
      data: {
        name: details.departmentName,
        id: details._id,
        isExisting: true,
        modalInfo: details,
        staff: this.employees,
      },
    }).afterClosed().subscribe(() => {
      this.getDepartments();
    });
  }

  //Delete a department
  deleteDepartment(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.departmentName + ' Department',
      message: 'Are you sure you want to remove this department?',
      confirmText: 'Remove Department',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteDepartment(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The department has been deleted successfully');
            }
            this.getDepartments();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

}
