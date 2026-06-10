import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxGaugeModule } from 'ngx-gauge';

import { AccountingRoutingModule } from './accounting-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { AccountingDashboardComponent } from './components/accounting-dashboard/accounting-dashboard.component';
import { AccountingSettingsComponent } from './settings/accounting-settings/accounting-settings.component';
import { AccountTypesOverviewComponent } from './settings/account-types/account-types-overview/account-types-overview.component';
import { AccountTypeInfoComponent } from './settings/account-types/account-type-info/account-type-info.component';
import { AccountGroupsOverviewComponent } from './settings/account-groups/account-groups-overview/account-groups-overview.component';
import { AccountGroupInfoComponent } from './settings/account-groups/account-group-info/account-group-info.component';
import { ChartOfAccountsOverviewComponent } from './settings/chart-of-accounts/chart-of-accounts-overview/chart-of-accounts-overview.component';
import { ChartOfAccountInfoComponent } from './settings/chart-of-accounts/chart-of-account-info/chart-of-account-info.component';
import { FinancialPeriodsOverviewComponent } from './settings/financial-periods/financial-periods-overview/financial-periods-overview.component';
import { FinancialPeriodInfoComponent } from './settings/financial-periods/financial-period-info/financial-period-info.component';
import { TaxRatesOverviewComponent } from './settings/tax-rates/tax-rates-overview/tax-rates-overview.component';
import { TaxRateInfoComponent } from './settings/tax-rates/tax-rate-info/tax-rate-info.component';
import { BankAccountsOverviewComponent } from './settings/bank-accounts/bank-accounts-overview/bank-accounts-overview.component';
import { BankAccountInfoComponent } from './settings/bank-accounts/bank-account-info/bank-account-info.component';
import { CashAccountsOverviewComponent } from './settings/cash-accounts/cash-accounts-overview/cash-accounts-overview.component';
import { CashAccountInfoComponent } from './settings/cash-accounts/cash-account-info/cash-account-info.component';
import { PaymentMethodsOverviewComponent } from './settings/payment-methods/payment-methods-overview/payment-methods-overview.component';
import { PaymentMethodInfoComponent } from './settings/payment-methods/payment-method-info/payment-method-info.component';
import { TransactionNumberingOverviewComponent } from './settings/transaction-numbering/transaction-numbering-overview/transaction-numbering-overview.component';
import { TransactionNumberingInfoComponent } from './settings/transaction-numbering/transaction-numbering-info/transaction-numbering-info.component';
import { ChartOfAccountDetailsComponent } from './settings/chart-of-accounts/chart-of-account-details/chart-of-account-details.component';
import { GeneralLedgerComponent } from './general-ledger/general-ledger.component';
import { SharedFeaturesModule } from '../features/shared/shared-features.module';
import { JournalEntriesComponent } from './journal-entries/journal-entries.component';
import { JournalEntryInfoComponent } from './journal-entries/journal-entry-info/journal-entry-info.component';
import { BillsListComponent } from './bills/bills-list/bills-list.component';
import { BillInfoComponent } from './bills/bill-info/bill-info.component';
import { BillDetailsComponent } from './bills/bill-details/bill-details.component';
import { FinancialReportsComponent } from './reports/financial-reports.component';

@NgModule({
  declarations: [
    AccountingDashboardComponent,
    AccountingSettingsComponent,
    AccountTypesOverviewComponent,
    AccountTypeInfoComponent,
    AccountGroupsOverviewComponent,
    AccountGroupInfoComponent,
    ChartOfAccountsOverviewComponent,
    ChartOfAccountInfoComponent,
    FinancialPeriodsOverviewComponent,
    FinancialPeriodInfoComponent,
    TaxRatesOverviewComponent,
    TaxRateInfoComponent,
    BankAccountsOverviewComponent,
    BankAccountInfoComponent,
    CashAccountsOverviewComponent,
    CashAccountInfoComponent,
    PaymentMethodsOverviewComponent,
    PaymentMethodInfoComponent,
    TransactionNumberingOverviewComponent,
    TransactionNumberingInfoComponent,
    ChartOfAccountDetailsComponent,
    GeneralLedgerComponent,
    JournalEntriesComponent,
    JournalEntryInfoComponent,
    BillsListComponent,
    BillInfoComponent,
    BillDetailsComponent,
    FinancialReportsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedFeaturesModule,
    AccountingRoutingModule,
    HighchartsChartModule,
    NgxChartsModule,
    NgxGaugeModule,
  ]
})
export class AccountingModule { }
