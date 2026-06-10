import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accounting-settings',
  templateUrl: './accounting-settings.component.html',
  styleUrls: ['./accounting-settings.component.scss']
})
export class AccountingSettingsComponent implements OnInit {

  tabMenu: { routeLink: string; label: string }[] = [
    { routeLink: 'account-types', label: 'Account Types' },
    { routeLink: 'account-groups', label: 'Account Groups' },
    { routeLink: 'financial-periods', label: 'Financial Periods' },
    { routeLink: 'tax-rates', label: 'Tax Rates' },
    { routeLink: 'bank-accounts', label: 'Bank Accounts' },
    { routeLink: 'cash-accounts', label: 'Cash Accounts' },
    { routeLink: 'payment-methods', label: 'Payment Methods' },
    { routeLink: 'transaction-numbering', label: 'Numbering' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
