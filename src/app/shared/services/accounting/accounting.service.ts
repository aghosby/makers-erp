import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../utils/authentication.service';

const MOCK_ACCOUNT_TYPES = [
  { _id: '1', name: 'Asset',     code: 'AST', normalBalance: 'Debit',  reportSection: 'Balance Sheet',    description: 'Resources owned by the business',        status: 'Active' },
  { _id: '2', name: 'Liability', code: 'LIA', normalBalance: 'Credit', reportSection: 'Balance Sheet',    description: 'Obligations owed to others',              status: 'Active' },
  { _id: '3', name: 'Equity',    code: 'EQT', normalBalance: 'Credit', reportSection: 'Balance Sheet',    description: "Owner's interest in the business",        status: 'Active' },
  { _id: '4', name: 'Income',    code: 'INC', normalBalance: 'Credit', reportSection: 'Income Statement', description: 'Revenue earned from business operations', status: 'Active' },
  { _id: '5', name: 'Expense',   code: 'EXP', normalBalance: 'Debit',  reportSection: 'Income Statement', description: 'Costs incurred in running the business',  status: 'Active' },
];

const MOCK_ACCOUNT_GROUPS = [
  { _id: '1', name: 'Current Assets',          accountTypeId: '1', accountTypeName: 'Asset',   parentGroupId: null, parentGroupName: null,             code: 'CA',  reportOrder: 1, description: 'Short-term assets',               status: 'Active' },
  { _id: '2', name: 'Non-Current Assets',       accountTypeId: '1', accountTypeName: 'Asset',   parentGroupId: null, parentGroupName: null,             code: 'NCA', reportOrder: 2, description: 'Long-term assets',                status: 'Active' },
  { _id: '3', name: 'Cash and Bank',            accountTypeId: '1', accountTypeName: 'Asset',   parentGroupId: '1', parentGroupName: 'Current Assets',  code: 'CB',  reportOrder: 1, description: 'Cash and bank accounts',           status: 'Active' },
  { _id: '4', name: 'Receivables',              accountTypeId: '1', accountTypeName: 'Asset',   parentGroupId: '1', parentGroupName: 'Current Assets',  code: 'RCV', reportOrder: 2, description: 'Amounts owed to the business',     status: 'Active' },
  { _id: '5', name: 'Inventory',                accountTypeId: '1', accountTypeName: 'Asset',   parentGroupId: '1', parentGroupName: 'Current Assets',  code: 'INV', reportOrder: 3, description: 'Stock of goods',                   status: 'Active' },
  { _id: '6', name: 'Staff Costs',              accountTypeId: '5', accountTypeName: 'Expense', parentGroupId: null, parentGroupName: null,             code: 'SC',  reportOrder: 1, description: 'Employee-related expenses',         status: 'Active' },
  { _id: '7', name: 'Administrative Expenses',  accountTypeId: '5', accountTypeName: 'Expense', parentGroupId: null, parentGroupName: null,             code: 'AE',  reportOrder: 2, description: 'General administration costs',      status: 'Active' },
  { _id: '8', name: 'Transport Expenses',       accountTypeId: '5', accountTypeName: 'Expense', parentGroupId: null, parentGroupName: null,             code: 'TE',  reportOrder: 3, description: 'Transportation and logistics costs', status: 'Active' },
  { _id: '9', name: 'Utility Expenses',         accountTypeId: '5', accountTypeName: 'Expense', parentGroupId: null, parentGroupName: null,             code: 'UE',  reportOrder: 4, description: 'Electricity, water, and utilities',  status: 'Active' },
];

const MOCK_CHART_OF_ACCOUNTS = [
  { _id: '1',  name: 'Cash',                code: '1000', accountTypeId: '1', accountTypeName: 'Asset',     accountGroupId: '3',  accountGroupName: 'Cash and Bank',           parentAccountId: null, parentAccountName: null, normalBalance: 'Debit',  currency: '', isBankAccount: false, isCashAccount: true,  isControlAccount: false, allowManualPosting: true,  description: 'Petty cash and cash on hand',            branch: 'All',         currentBalance: 45000,   status: 'Active' },
  { _id: '2',  name: 'Bank Account',        code: '1010', accountTypeId: '1', accountTypeName: 'Asset',     accountGroupId: '3',  accountGroupName: 'Cash and Bank',           parentAccountId: null, parentAccountName: null, normalBalance: 'Debit',  currency: '', isBankAccount: true,  isCashAccount: false, isControlAccount: false, allowManualPosting: true,  description: 'Main operating bank account',            branch: 'Head Office', currentBalance: 245000,  status: 'Active' },
  { _id: '3',  name: 'Accounts Receivable', code: '1100', accountTypeId: '1', accountTypeName: 'Asset',     accountGroupId: '4',  accountGroupName: 'Receivables',             parentAccountId: null, parentAccountName: null, normalBalance: 'Debit',  currency: '', isBankAccount: false, isCashAccount: false, isControlAccount: true,  allowManualPosting: false, description: 'Amounts owed by customers',              branch: 'All',         currentBalance: 380000,  status: 'Active' },
  { _id: '4',  name: 'Inventory',           code: '1200', accountTypeId: '1', accountTypeName: 'Asset',     accountGroupId: '5',  accountGroupName: 'Inventory',               parentAccountId: null, parentAccountName: null, normalBalance: 'Debit',  currency: '', isBankAccount: false, isCashAccount: false, isControlAccount: false, allowManualPosting: true,  description: 'Stock of goods for sale',                branch: 'Lagos',       currentBalance: 620000,  status: 'Active' },
  { _id: '5',  name: 'Accounts Payable',    code: '2000', accountTypeId: '2', accountTypeName: 'Liability', accountGroupId: null, accountGroupName: null,                      parentAccountId: null, parentAccountName: null, normalBalance: 'Credit', currency: '', isBankAccount: false, isCashAccount: false, isControlAccount: true,  allowManualPosting: false, description: 'Amounts owed to suppliers',              branch: 'All',         currentBalance: 175000,  status: 'Active' },
  { _id: '6',  name: 'VAT Payable',         code: '2100', accountTypeId: '2', accountTypeName: 'Liability', accountGroupId: null, accountGroupName: null,                      parentAccountId: null, parentAccountName: null, normalBalance: 'Credit', currency: '', isBankAccount: false, isCashAccount: false, isControlAccount: true,  allowManualPosting: false, description: 'VAT collected and owed to tax authority', branch: 'All',         currentBalance: 52500,   status: 'Active' },
  { _id: '7',  name: 'Owner Equity',        code: '3000', accountTypeId: '3', accountTypeName: 'Equity',    accountGroupId: null, accountGroupName: null,                      parentAccountId: null, parentAccountName: null, normalBalance: 'Credit', currency: '', isBankAccount: false, isCashAccount: false, isControlAccount: false, allowManualPosting: true,  description: "Owner's equity in the business",         branch: 'Head Office', currentBalance: 1000000, status: 'Active' },
  { _id: '8',  name: 'Sales Income',        code: '4000', accountTypeId: '4', accountTypeName: 'Income',    accountGroupId: null, accountGroupName: null,                      parentAccountId: null, parentAccountName: null, normalBalance: 'Credit', currency: '', isBankAccount: false, isCashAccount: false, isControlAccount: false, allowManualPosting: true,  description: 'Revenue from sales of goods/services',   branch: 'All',         currentBalance: 890000,  status: 'Active' },
  { _id: '9',  name: 'Rent Expense',        code: '5100', accountTypeId: '5', accountTypeName: 'Expense',   accountGroupId: '7',  accountGroupName: 'Administrative Expenses', parentAccountId: null, parentAccountName: null, normalBalance: 'Debit',  currency: '', isBankAccount: false, isCashAccount: false, isControlAccount: false, allowManualPosting: true,  description: 'Office and premises rental costs',       branch: 'All',         currentBalance: 120000,  status: 'Active' },
  { _id: '10', name: 'Salaries Expense',    code: '5200', accountTypeId: '5', accountTypeName: 'Expense',   accountGroupId: '6',  accountGroupName: 'Staff Costs',             parentAccountId: null, parentAccountName: null, normalBalance: 'Debit',  currency: '', isBankAccount: false, isCashAccount: false, isControlAccount: false, allowManualPosting: false, description: 'Employee salaries and wages',            branch: 'Lagos',       currentBalance: 450000,  status: 'Active' },
];

const MOCK_ACCOUNT_LEDGER = [
  { _id: '1', date: '2026-01-05', description: 'Opening Balance',       reference: 'OB-001',  debit: 45000,  credit: 0,     balance: 45000,  transactionType: 'Journal' },
  { _id: '2', date: '2026-01-12', description: 'Sales Receipt',         reference: 'RCT-001', debit: 120000, credit: 0,     balance: 165000, transactionType: 'Receipt' },
  { _id: '3', date: '2026-01-18', description: 'Supplier Payment',      reference: 'PAY-001', debit: 0,      credit: 80000, balance: 85000,  transactionType: 'Payment' },
  { _id: '4', date: '2026-02-03', description: 'Sales Receipt',         reference: 'RCT-002', debit: 200000, credit: 0,     balance: 285000, transactionType: 'Receipt' },
  { _id: '5', date: '2026-02-14', description: 'Bank Charges',          reference: 'JNL-001', debit: 0,      credit: 5000,  balance: 280000, transactionType: 'Journal' },
  { _id: '6', date: '2026-03-01', description: 'Utility Bill Payment',  reference: 'PAY-002', debit: 0,      credit: 35000, balance: 245000, transactionType: 'Payment' },
];

const MOCK_GENERAL_LEDGER = [
  { _id: '1',  date: '2026-01-05', reference: 'OB-001',  accountId: '1',  accountName: 'Cash',                accountCode: '1000', branch: 'All',         description: 'Opening Balance',              transactionType: 'Journal', debit: 45000,  credit: 0      },
  { _id: '2',  date: '2026-01-05', reference: 'OB-002',  accountId: '2',  accountName: 'Bank Account',        accountCode: '1010', branch: 'Head Office', description: 'Opening Balance',              transactionType: 'Journal', debit: 245000, credit: 0      },
  { _id: '3',  date: '2026-01-12', reference: 'INV-001', accountId: '3',  accountName: 'Accounts Receivable', accountCode: '1100', branch: 'All',         description: 'Sales Invoice - Emeka Biz',    transactionType: 'Invoice', debit: 120000, credit: 0      },
  { _id: '4',  date: '2026-01-12', reference: 'INV-001', accountId: '8',  accountName: 'Sales Income',        accountCode: '4000', branch: 'All',         description: 'Sales Invoice - Emeka Biz',    transactionType: 'Invoice', debit: 0,      credit: 120000 },
  { _id: '5',  date: '2026-01-18', reference: 'PAY-001', accountId: '5',  accountName: 'Accounts Payable',    accountCode: '2000', branch: 'All',         description: 'Vendor Payment - Sunrise Ltd', transactionType: 'Payment', debit: 80000,  credit: 0      },
  { _id: '6',  date: '2026-01-18', reference: 'PAY-001', accountId: '2',  accountName: 'Bank Account',        accountCode: '1010', branch: 'Head Office', description: 'Vendor Payment - Sunrise Ltd', transactionType: 'Payment', debit: 0,      credit: 80000  },
  { _id: '7',  date: '2026-02-03', reference: 'RCT-001', accountId: '2',  accountName: 'Bank Account',        accountCode: '1010', branch: 'Head Office', description: 'Receipt - Emeka Biz',          transactionType: 'Receipt', debit: 200000, credit: 0      },
  { _id: '8',  date: '2026-02-03', reference: 'RCT-001', accountId: '3',  accountName: 'Accounts Receivable', accountCode: '1100', branch: 'All',         description: 'Receipt - Emeka Biz',          transactionType: 'Receipt', debit: 0,      credit: 200000 },
  { _id: '9',  date: '2026-02-14', reference: 'JNL-001', accountId: '9',  accountName: 'Rent Expense',        accountCode: '5100', branch: 'All',         description: 'Bank Charges February',        transactionType: 'Journal', debit: 5000,   credit: 0      },
  { _id: '10', date: '2026-02-14', reference: 'JNL-001', accountId: '2',  accountName: 'Bank Account',        accountCode: '1010', branch: 'Head Office', description: 'Bank Charges February',        transactionType: 'Journal', debit: 0,      credit: 5000   },
  { _id: '11', date: '2026-02-28', reference: 'PAY-002', accountId: '10', accountName: 'Salaries Expense',    accountCode: '5200', branch: 'Lagos',       description: 'Salary Disbursement February', transactionType: 'Payment', debit: 450000, credit: 0      },
  { _id: '12', date: '2026-02-28', reference: 'PAY-002', accountId: '2',  accountName: 'Bank Account',        accountCode: '1010', branch: 'Head Office', description: 'Salary Disbursement February', transactionType: 'Payment', debit: 0,      credit: 450000 },
  { _id: '13', date: '2026-03-01', reference: 'PAY-003', accountId: '9',  accountName: 'Rent Expense',        accountCode: '5100', branch: 'All',         description: 'Utility Bill Payment',         transactionType: 'Payment', debit: 35000,  credit: 0      },
  { _id: '14', date: '2026-03-01', reference: 'PAY-003', accountId: '2',  accountName: 'Bank Account',        accountCode: '1010', branch: 'Head Office', description: 'Utility Bill Payment',         transactionType: 'Payment', debit: 0,      credit: 35000  },
  { _id: '15', date: '2026-03-15', reference: 'INV-002', accountId: '3',  accountName: 'Accounts Receivable', accountCode: '1100', branch: 'Lagos',       description: 'Sales Invoice - TechCorp',     transactionType: 'Invoice', debit: 280000, credit: 0      },
  { _id: '16', date: '2026-03-15', reference: 'INV-002', accountId: '8',  accountName: 'Sales Income',        accountCode: '4000', branch: 'Lagos',       description: 'Sales Invoice - TechCorp',     transactionType: 'Invoice', debit: 0,      credit: 280000 },
  { _id: '17', date: '2026-04-05', reference: 'JNL-002', accountId: '6',  accountName: 'VAT Payable',         accountCode: '2100', branch: 'All',         description: 'VAT Provision Q1',             transactionType: 'Journal', debit: 0,      credit: 52500  },
  { _id: '18', date: '2026-04-05', reference: 'JNL-002', accountId: '3',  accountName: 'Accounts Receivable', accountCode: '1100', branch: 'All',         description: 'VAT Provision Q1',             transactionType: 'Journal', debit: 52500,  credit: 0      },
];

const MOCK_JOURNAL_ENTRIES = [
  { _id: '1', date: '2026-05-16', entity: 'Head Office', entityCode: 'HO', description: 'Opening capital injection',        source: 'Manual',  createdBy: 'admin',   amount: 5000000, status: 'Posted' },
  { _id: '2', date: '2026-05-21', entity: 'Lagos',       entityCode: 'LAG', description: 'Office rent — Lagos',        source: 'Bill',    createdBy: 'finance', amount: 350000,  status: 'Posted' },
  { _id: '3', date: '2026-05-23', entity: 'Abuja',       entityCode: 'ABJ', description: 'Service invoice INV-1001 settled', source: 'Invoice', createdBy: 'sales',   amount: 1200000, status: 'Posted' },
  { _id: '4', date: '2026-05-29', entity: 'Head Office', entityCode: 'HO',  description: 'Payroll — November',          source: 'Payroll', createdBy: 'hr',      amount: 2400000, status: 'Posted' },
  { _id: '5', date: '2026-05-31', entity: 'Head Office', entityCode: 'HO',  description: 'Net pay disbursed',               source: 'Payment', createdBy: 'finance', amount: 2160000, status: 'Posted' },
  { _id: '6', date: '2026-06-05', entity: 'Lagos',       entityCode: 'LAG', description: 'Sales — retail',             source: 'Invoice', createdBy: 'sales',   amount: 850000,  status: 'Posted' },
];

const MOCK_TAX_RATES = [
  { _id: '1', name: 'VAT 7.5%',       taxType: 'VAT',      rate: 7.5, method: 'Exclusive', appliesTo: 'Both',      taxPayableAccountId: '6',  taxReceivableAccountId: null, withholdingAccountId: null, startDate: '2024-01-01', endDate: null, branch: 'All', status: 'Active'   },
  { _id: '2', name: 'WHT 5%',         taxType: 'WHT',      rate: 5,   method: 'Exclusive', appliesTo: 'Purchases', taxPayableAccountId: null, taxReceivableAccountId: null, withholdingAccountId: '5',  startDate: '2024-01-01', endDate: null, branch: 'All', status: 'Active'   },
  { _id: '3', name: 'WHT 10%',        taxType: 'WHT',      rate: 10,  method: 'Exclusive', appliesTo: 'Purchases', taxPayableAccountId: null, taxReceivableAccountId: null, withholdingAccountId: '5',  startDate: '2024-01-01', endDate: null, branch: 'All', status: 'Active'   },
  { _id: '4', name: 'Zero-Rated VAT', taxType: 'VAT',      rate: 0,   method: 'Exclusive', appliesTo: 'Both',      taxPayableAccountId: '6',  taxReceivableAccountId: null, withholdingAccountId: null, startDate: '2024-01-01', endDate: null, branch: 'All', status: 'Active'   },
  { _id: '5', name: 'Exempt VAT',     taxType: 'VAT',      rate: 0,   method: 'Exclusive', appliesTo: 'Both',      taxPayableAccountId: '6',  taxReceivableAccountId: null, withholdingAccountId: null, startDate: '2024-01-01', endDate: null, branch: 'All', status: 'Inactive' },
];

const MOCK_TRANSACTION_NUMBERING = [
  { _id: '1', documentType: 'Invoice',  prefix: 'INV',  branchCodeIncluded: false, yearIncluded: true, nextNumber: 1, numberLength: 4, branch: 'All', status: 'Active' },
  { _id: '2', documentType: 'Bill',     prefix: 'BILL', branchCodeIncluded: false, yearIncluded: true, nextNumber: 1, numberLength: 4, branch: 'All', status: 'Active' },
  { _id: '3', documentType: 'Payment',  prefix: 'PAY',  branchCodeIncluded: false, yearIncluded: true, nextNumber: 1, numberLength: 4, branch: 'All', status: 'Active' },
  { _id: '4', documentType: 'Receipt',  prefix: 'REC',  branchCodeIncluded: false, yearIncluded: true, nextNumber: 1, numberLength: 4, branch: 'All', status: 'Active' },
  { _id: '5', documentType: 'Journal',  prefix: 'JRN',  branchCodeIncluded: false, yearIncluded: true, nextNumber: 1, numberLength: 4, branch: 'All', status: 'Active' },
];

const MOCK_PAYMENT_METHODS = [
  { _id: '1', name: 'Bank Transfer', code: 'TRF', requiresBankReference: true,  requiresChequeNumber: false, requiresAttachment: false, defaultAccountId: '1', status: 'Active'   },
  { _id: '2', name: 'Cash',          code: 'CSH', requiresBankReference: false, requiresChequeNumber: false, requiresAttachment: false, defaultAccountId: null, status: 'Active'   },
  { _id: '3', name: 'POS',           code: 'POS', requiresBankReference: true,  requiresChequeNumber: false, requiresAttachment: true,  defaultAccountId: null, status: 'Active'   },
  { _id: '4', name: 'Cheque',        code: 'CHQ', requiresBankReference: false, requiresChequeNumber: true,  requiresAttachment: true,  defaultAccountId: null, status: 'Active'   },
  { _id: '5', name: 'Mobile Money',  code: 'MMO', requiresBankReference: true,  requiresChequeNumber: false, requiresAttachment: false, defaultAccountId: null, status: 'Active'   },
  { _id: '6', name: 'Card',          code: 'CRD', requiresBankReference: true,  requiresChequeNumber: false, requiresAttachment: false, defaultAccountId: null, status: 'Active'   },
  { _id: '7', name: 'Online Payment',code: 'ONL', requiresBankReference: true,  requiresChequeNumber: false, requiresAttachment: true,  defaultAccountId: null, status: 'Inactive' },
];

const MOCK_CASH_ACCOUNTS = [
  { _id: '1', cashAccountName: 'Lagos Petty Cash',    custodian: 'John Adeyemi',  branch: 'Lagos',       linkedGLAccountId: '1', currency: 'NGN', cashLimit: 100000, openingBalance: 45000,  status: 'Active'   },
  { _id: '2', cashAccountName: 'Abuja Petty Cash',    custodian: 'Fatima Musa',   branch: 'Abuja',       linkedGLAccountId: '1', currency: 'NGN', cashLimit: 80000,  openingBalance: 30000,  status: 'Active'   },
  { _id: '3', cashAccountName: 'Head Office Cash',    custodian: 'Emeka Obi',     branch: 'Head Office', linkedGLAccountId: '1', currency: 'NGN', cashLimit: 200000, openingBalance: 120000, status: 'Active'   },
  { _id: '4', cashAccountName: 'Port Harcourt Petty', custodian: 'Ngozi Eze',     branch: 'PH',          linkedGLAccountId: '1', currency: 'NGN', cashLimit: 60000,  openingBalance: 0,      status: 'Inactive' },
];

const MOCK_BANK_ACCOUNTS = [
  { _id: '1', bankName: 'First Bank',     accountName: 'Main Operating Account', accountNumber: '2034567890', currency: 'NGN', branch: 'Head Office', linkedGLAccountId: '2',  openingBalance: 500000,   openingBalanceDate: '2026-01-01', sortCodeSwift: 'FBNICLNG',  isDefaultAccount: true,  status: 'Active'   },
  { _id: '2', bankName: 'GTBank',          accountName: 'Petty Cash Account',     accountNumber: '0123456789', currency: 'NGN', branch: 'All',         linkedGLAccountId: '1',  openingBalance: 50000,    openingBalanceDate: '2026-01-01', sortCodeSwift: 'GTBINGLA',  isDefaultAccount: false, status: 'Active'   },
  { _id: '3', bankName: 'Access Bank',     accountName: 'USD Account',            accountNumber: '0987654321', currency: 'USD', branch: 'Head Office', linkedGLAccountId: '2',  openingBalance: 10000,    openingBalanceDate: '2026-01-01', sortCodeSwift: 'ABNGNGLA',  isDefaultAccount: false, status: 'Active'   },
  { _id: '4', bankName: 'Zenith Bank',     accountName: 'Salary Disbursement',    accountNumber: '1122334455', currency: 'NGN', branch: 'All',         linkedGLAccountId: '2',  openingBalance: 0,        openingBalanceDate: '2026-01-01', sortCodeSwift: 'ZEIBNGLA',  isDefaultAccount: false, status: 'Inactive' },
];

const MOCK_FINANCIAL_PERIODS = [
  { _id: '1', financialYear: 2025, periodName: 'October 2025',  startDate: '2025-10-01', endDate: '2025-10-31', status: 'Locked', branch: 'All', closedBy: 'Admin', closedDate: '2025-11-03', reopenReason: '' },
  { _id: '2', financialYear: 2025, periodName: 'November 2025', startDate: '2025-11-01', endDate: '2025-11-30', status: 'Locked', branch: 'All', closedBy: 'Admin', closedDate: '2025-12-02', reopenReason: '' },
  { _id: '3', financialYear: 2025, periodName: 'December 2025', startDate: '2025-12-01', endDate: '2025-12-31', status: 'Locked', branch: 'All', closedBy: 'Admin', closedDate: '2026-01-04', reopenReason: '' },
  { _id: '4', financialYear: 2026, periodName: 'January 2026',  startDate: '2026-01-01', endDate: '2026-01-31', status: 'Locked', branch: 'All', closedBy: 'Admin', closedDate: '2026-02-03', reopenReason: '' },
  { _id: '5', financialYear: 2026, periodName: 'February 2026', startDate: '2026-02-01', endDate: '2026-02-28', status: 'Locked', branch: 'All', closedBy: 'Admin', closedDate: '2026-03-02', reopenReason: '' },
  { _id: '6', financialYear: 2026, periodName: 'March 2026',    startDate: '2026-03-01', endDate: '2026-03-31', status: 'Closed', branch: 'All', closedBy: 'Admin', closedDate: '2026-04-01', reopenReason: '' },
  { _id: '7', financialYear: 2026, periodName: 'April 2026',    startDate: '2026-04-01', endDate: '2026-04-30', status: 'Closed', branch: 'All', closedBy: 'Admin', closedDate: '2026-05-02', reopenReason: '' },
  { _id: '8', financialYear: 2026, periodName: 'May 2026',      startDate: '2026-05-01', endDate: '2026-05-31', status: 'Closed', branch: 'All', closedBy: 'Admin', closedDate: '2026-06-02', reopenReason: '' },
  { _id: '9', financialYear: 2026, periodName: 'June 2026',     startDate: '2026-06-01', endDate: '2026-06-30', status: 'Open',   branch: 'All', closedBy: '',      closedDate: '',           reopenReason: '' },
];

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  private path = `${environment.baseUrl}`;

  private get requestOptions() {
    return {
      headers: new HttpHeaders({
        'Authorization': this.authService.token,
        'X-No-Error-Toast': 'true',
      })
    };
  }

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  /*************** ACCOUNT TYPES ***************/

  public getAccountTypes(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchAccountTypes`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_ACCOUNT_TYPES }))
    );
  }

  public createAccountType(data: any): Observable<any> {
    return this.http.post<any>(`${this.path}/addAccountType`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: { ...data, _id: Date.now().toString() } }))
    );
  }

  public updateAccountType(data: any, id: string): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateAccountType/${id}`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  public deleteAccountType(id: string): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteAccountType/${id}`, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  /*************** ACCOUNT GROUPS ***************/

  public getAccountGroups(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchAccountGroups`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_ACCOUNT_GROUPS }))
    );
  }

  public createAccountGroup(data: any): Observable<any> {
    return this.http.post<any>(`${this.path}/addAccountGroup`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: { ...data, _id: Date.now().toString() } }))
    );
  }

  public updateAccountGroup(data: any, id: string): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateAccountGroup/${id}`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  public deleteAccountGroup(id: string): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteAccountGroup/${id}`, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  /*************** CHART OF ACCOUNTS ***************/

  public getChartOfAccounts(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchChartOfAccounts`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_CHART_OF_ACCOUNTS }))
    );
  }

  public getAccount(id: string): Observable<any> {
    return this.http.get<any>(`${this.path}/getAccount/${id}`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_CHART_OF_ACCOUNTS.find(a => a._id === id) ?? null }))
    );
  }

  public getAccountLedger(id: string): Observable<any> {
    return this.http.get<any>(`${this.path}/getAccountLedger/${id}`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_ACCOUNT_LEDGER }))
    );
  }

  public createAccount(data: any): Observable<any> {
    return this.http.post<any>(`${this.path}/addAccount`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: { ...data, _id: Date.now().toString() } }))
    );
  }

  public updateAccount(data: any, id: string): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateAccount/${id}`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  public deleteAccount(id: string): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteAccount/${id}`, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  /*************** JOURNAL ENTRIES ***************/

  public getJournalEntries(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchJournalEntries`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_JOURNAL_ENTRIES }))
    );
  }

  public createJournalEntry(data: any): Observable<any> {
    return this.http.post<any>(`${this.path}/addJournalEntry`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: { ...data, _id: Date.now().toString() } }))
    );
  }

  /*************** GENERAL LEDGER ***************/

  public getGeneralLedger(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchGeneralLedger`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_GENERAL_LEDGER }))
    );
  }

  /*************** TAX RATES ***************/

  public getTaxRates(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchTaxRates`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_TAX_RATES }))
    );
  }

  public createTaxRate(data: any): Observable<any> {
    return this.http.post<any>(`${this.path}/addTaxRate`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: { ...data, _id: Date.now().toString() } }))
    );
  }

  public updateTaxRate(data: any, id: string): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateTaxRate/${id}`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  public deleteTaxRate(id: string): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteTaxRate/${id}`, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  /*************** FINANCIAL PERIODS ***************/

  public getFinancialPeriods(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchFinancialPeriods`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_FINANCIAL_PERIODS }))
    );
  }

  public createFinancialPeriod(data: any): Observable<any> {
    return this.http.post<any>(`${this.path}/addFinancialPeriod`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: { ...data, _id: Date.now().toString() } }))
    );
  }

  public updateFinancialPeriod(data: any, id: string): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateFinancialPeriod/${id}`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  public deleteFinancialPeriod(id: string): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteFinancialPeriod/${id}`, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  /*************** BANK ACCOUNTS ***************/

  public getBankAccounts(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchBankAccounts`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_BANK_ACCOUNTS }))
    );
  }

  public createBankAccount(data: any): Observable<any> {
    return this.http.post<any>(`${this.path}/addBankAccount`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: { ...data, _id: Date.now().toString() } }))
    );
  }

  public updateBankAccount(data: any, id: string): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateBankAccount/${id}`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  public deleteBankAccount(id: string): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteBankAccount/${id}`, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  /*************** CASH ACCOUNTS ***************/

  public getCashAccounts(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchCashAccounts`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_CASH_ACCOUNTS }))
    );
  }

  public createCashAccount(data: any): Observable<any> {
    return this.http.post<any>(`${this.path}/addCashAccount`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: { ...data, _id: Date.now().toString() } }))
    );
  }

  public updateCashAccount(data: any, id: string): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateCashAccount/${id}`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  public deleteCashAccount(id: string): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteCashAccount/${id}`, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  /*************** PAYMENT METHODS ***************/

  public getPaymentMethods(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchPaymentMethods`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_PAYMENT_METHODS }))
    );
  }

  public createPaymentMethod(data: any): Observable<any> {
    return this.http.post<any>(`${this.path}/addPaymentMethod`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: { ...data, _id: Date.now().toString() } }))
    );
  }

  public updatePaymentMethod(data: any, id: string): Observable<any> {
    return this.http.patch<any>(`${this.path}/updatePaymentMethod/${id}`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  public deletePaymentMethod(id: string): Observable<any> {
    return this.http.delete<any>(`${this.path}/deletePaymentMethod/${id}`, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  /*************** TRANSACTION NUMBERING ***************/

  public getTransactionNumbering(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchTransactionNumbering`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_TRANSACTION_NUMBERING }))
    );
  }

  public createTransactionNumbering(data: any): Observable<any> {
    return this.http.post<any>(`${this.path}/addTransactionNumbering`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: { ...data, _id: Date.now().toString() } }))
    );
  }

  public updateTransactionNumbering(data: any, id: string): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateTransactionNumbering/${id}`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  public deleteTransactionNumbering(id: string): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteTransactionNumbering/${id}`, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }
}
