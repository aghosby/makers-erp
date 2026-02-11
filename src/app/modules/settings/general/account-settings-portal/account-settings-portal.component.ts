import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-settings-portal',
  templateUrl: './account-settings-portal.component.html',
  styleUrls: ['./account-settings-portal.component.scss']
})
export class AccountSettingsPortalComponent implements OnInit {

  tabMenu = [
    {
      routeLink: 'account-info',
      label: 'Account Information',
    },
    {
      routeLink: 'roles-permissions',
      label: 'Modules, Roles & Permissions',
    },
    // {
    //   routeLink: 'subscription/history',
    //   label: 'Subscriptions',
    // },
    // {
    //   routeLink: 'billing',
    //   label: 'Billing',
    // },
    {
      routeLink: 'audit-trails',
      label: 'Audit Trail',
    },
    // {
    //   routeLink: 'expenses',
    //   label: 'Expenses',
    // },
    // {
    //   routeLink: 'appraisal',
    //   label: 'Appraisal',
    // }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  goTo(link) {
    console.log(link)
  }

}
