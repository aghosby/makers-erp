import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountingDashboardComponent } from './components/accounting-dashboard/accounting-dashboard.component';
import { AccountingSettingsComponent } from './settings/accounting-settings/accounting-settings.component';
import { AccountTypesOverviewComponent } from './settings/account-types/account-types-overview/account-types-overview.component';
import { AccountGroupsOverviewComponent } from './settings/account-groups/account-groups-overview/account-groups-overview.component';
import { ChartOfAccountsOverviewComponent } from './settings/chart-of-accounts/chart-of-accounts-overview/chart-of-accounts-overview.component';
import { FinancialPeriodsOverviewComponent } from './settings/financial-periods/financial-periods-overview/financial-periods-overview.component';
import { TaxRatesOverviewComponent } from './settings/tax-rates/tax-rates-overview/tax-rates-overview.component';
import { BankAccountsOverviewComponent } from './settings/bank-accounts/bank-accounts-overview/bank-accounts-overview.component';
import { CashAccountsOverviewComponent } from './settings/cash-accounts/cash-accounts-overview/cash-accounts-overview.component';
import { PaymentMethodsOverviewComponent } from './settings/payment-methods/payment-methods-overview/payment-methods-overview.component';
import { TransactionNumberingOverviewComponent } from './settings/transaction-numbering/transaction-numbering-overview/transaction-numbering-overview.component';
import { ChartOfAccountDetailsComponent } from './settings/chart-of-accounts/chart-of-account-details/chart-of-account-details.component';
import { GeneralLedgerComponent } from './general-ledger/general-ledger.component';
import { JournalEntriesComponent } from './journal-entries/journal-entries.component';
import { InvoiceListComponent } from '../features/shared/invoices/invoice-list/invoice-list.component';
import { InvoiceDetailsComponent } from '../features/shared/invoices/invoice-details/invoice-details.component';
import { BillsListComponent } from './bills/bills-list/bills-list.component';
import { VendorListComponent } from '../features/shared/vendors/vendor-list/vendor-list.component';
import { VendorOverviewComponent } from '../features/shared/vendors/vendor-overview/vendor-overview.component';
import { VendorDetailsComponent } from '../features/shared/vendors/vendor-details/vendor-details.component';
import { VendorOrderHistoryComponent } from '../features/shared/vendors/vendor-order-history/vendor-order-history.component';
import { FinancialReportsComponent } from './reports/financial-reports.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: AccountingDashboardComponent
  },
  {
    path: 'chart-of-accounts',
    component: ChartOfAccountsOverviewComponent
  },
  {
    path: 'chart-of-accounts/:id',
    component: ChartOfAccountDetailsComponent
  },
  {
    path: 'general-ledger',
    component: GeneralLedgerComponent
  },
  {
    path: 'journal-entries',
    component: JournalEntriesComponent
  },
  {
    path: 'invoices',
    component: InvoiceListComponent
  },
  {
    path: 'invoices/:id',
    component: InvoiceDetailsComponent
  },
  {
    path: 'bills',
    component: BillsListComponent
  },
  {
    path: 'vendors',
    component: VendorListComponent
  },
  {
    path: 'vendors/:id',
    component: VendorOverviewComponent,
    children: [
      { path: '',              redirectTo: 'details', pathMatch: 'full' },
      { path: 'details',       component: VendorDetailsComponent },
      { path: 'order-history', component: VendorOrderHistoryComponent },
    ]
  },
  {
    path: 'reports',
    component: FinancialReportsComponent
  },
  {
    path: 'accounting-settings',
    component: AccountingSettingsComponent,
    children: [
      { path: '', redirectTo: 'account-types', pathMatch: 'full' },
      { path: 'account-types', component: AccountTypesOverviewComponent },
      { path: 'account-groups', component: AccountGroupsOverviewComponent },
      { path: 'financial-periods', component: FinancialPeriodsOverviewComponent },
      { path: 'tax-rates', component: TaxRatesOverviewComponent },
      { path: 'bank-accounts', component: BankAccountsOverviewComponent },
      { path: 'cash-accounts', component: CashAccountsOverviewComponent },
      { path: 'payment-methods', component: PaymentMethodsOverviewComponent },
      { path: 'transaction-numbering', component: TransactionNumberingOverviewComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
