import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports-portal',
  templateUrl: './reports-portal.component.html',
  styleUrls: ['./reports-portal.component.scss']
})
export class ReportsPortalComponent implements OnInit {

  tabMenu = [
    // {
    //   routeLink: 'dashboard',
    //   label: 'Dashboard',
    // },
    {
      routeLink: 'employees',
      label: 'Employees',
    },
    {
      routeLink: 'absence',
      label: 'Absence',
    },
    // {
    //   routeLink: 'payroll',
    //   label: 'Payroll',
    // },
    // {
    //   routeLink: 'appraisal',
    //   label: 'Appraisal',
    // },
    {
      routeLink: 'expense',
      label: 'Expense',
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
