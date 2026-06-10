import { Component, OnInit } from '@angular/core';
import { DEFAULT_CURRENCY } from 'src/app/core/constants/general-data';

interface ReportLine {
  label: string;
  amount?: number;
  isHeader?: boolean;
  isSubtotal?: boolean;
  isTotal?: boolean;
  indent?: number;
  negative?: boolean;
}

@Component({
  selector: 'app-financial-reports',
  templateUrl: './financial-reports.component.html',
  styleUrls: ['./financial-reports.component.scss']
})
export class FinancialReportsComponent implements OnInit {

  currency = DEFAULT_CURRENCY;
  selectedTab = 'profit-loss';
  isGenerated = false;
  isLoading = false;

  reportTabs = [
    { id: 'profit-loss',   label: 'Profit & Loss' },
    { id: 'balance-sheet', label: 'Balance Sheet' },
    { id: 'trial-balance', label: 'Trial Balance' },
    { id: 'cash-flow',     label: 'Cash Flow' },
    { id: 'ar-aging',      label: 'A/R Aging' },
    { id: 'ap-aging',      label: 'A/P Aging' },
    { id: 'audit-trail',   label: 'Audit Trail' },
  ];

  // Filters
  filterDateFrom: Date | null = null;
  filterDateTo: Date | null   = null;
  filterAsOfDate: Date | null = null;
  filterEntity   = '';
  filterAccountType = '';
  filterActionType  = '';

  readonly entities = ['All Entities', 'Head Office', 'Lagos', 'Abuja', 'Port Harcourt'];

  // Report data
  plData: ReportLine[] = [];
  bsAssets: ReportLine[] = [];
  bsLiabilitiesEquity: ReportLine[] = [];
  totalAssets = 0;
  totalLiabilitiesEquity = 0;

  trialBalanceData: any[] = [];
  trialDebitTotal  = 0;
  trialCreditTotal = 0;

  cashFlowData: ReportLine[] = [];

  arAgingData: any[] = [];
  arAgingTotals: any = {};
  apAgingData: any[] = [];
  apAgingTotals: any = {};

  auditTrailData: any[] = [];

  // ─── computed ───────────────────────────────────────────────────
  get showDateRange(): boolean {
    return ['profit-loss', 'trial-balance', 'cash-flow', 'audit-trail'].includes(this.selectedTab);
  }
  get showAsOfDate(): boolean {
    return ['balance-sheet', 'ar-aging', 'ap-aging'].includes(this.selectedTab);
  }
  get currentReportLabel(): string {
    return this.reportTabs.find(t => t.id === this.selectedTab)?.label ?? '';
  }

  // ─── lifecycle ──────────────────────────────────────────────────
  ngOnInit(): void {
    const now = new Date();
    this.filterAsOfDate = now;
    this.filterDateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
    this.filterDateTo   = now;
    this.filterEntity   = 'All Entities';
  }

  // ─── tab / generate ─────────────────────────────────────────────
  selectTab(id: string): void {
    this.selectedTab = id;
    this.isGenerated = false;
  }

  generateReport(): void {
    this.isLoading = true;
    setTimeout(() => {
      switch (this.selectedTab) {
        case 'profit-loss':   this.buildPL();      break;
        case 'balance-sheet': this.buildBS();      break;
        case 'trial-balance': this.buildTB();      break;
        case 'cash-flow':     this.buildCF();      break;
        case 'ar-aging':      this.buildARaging(); break;
        case 'ap-aging':      this.buildAPaging(); break;
        case 'audit-trail':   this.buildAudit();   break;
      }
      this.isGenerated = true;
      this.isLoading = false;
    }, 700);
  }

  // ─── P&L ────────────────────────────────────────────────────────
  private buildPL(): void {
    const revenue = [
      { label: 'Product Sales',          amount: 4800000 },
      { label: 'Service Revenue',         amount: 2200000 },
      { label: 'Other Income',            amount: 180000  },
    ];
    const totalRevenue = 7180000;

    const cogs = [
      { label: 'Direct Materials',        amount: 1920000 },
      { label: 'Direct Labour',           amount: 640000  },
    ];
    const totalCOGS      = 2560000;
    const grossProfit    = 4620000;

    const opex = [
      { label: 'Salaries & Benefits',     amount: 1850000 },
      { label: 'Utilities',               amount: 145000  },
      { label: 'Office Supplies',         amount: 87000   },
      { label: 'Travel & Entertainment',  amount: 212000  },
      { label: 'Marketing & Advertising', amount: 340000  },
      { label: 'Professional Services',   amount: 480000  },
      { label: 'Depreciation',            amount: 95000   },
    ];
    const totalOpex       = 3209000;
    const operatingProfit = 1411000;
    const interestIncome  = 42000;
    const interestExpense = 67000;
    const netBeforeTax    = 1386000;
    const tax             = 415800;
    const netProfit       = 970200;

    this.plData = [
      { label: 'REVENUE', isHeader: true },
      ...revenue.map(r => ({ label: r.label, amount: r.amount, indent: 1 })),
      { label: 'Total Revenue', amount: totalRevenue, isSubtotal: true },

      { label: 'COST OF GOODS SOLD', isHeader: true },
      ...cogs.map(r => ({ label: r.label, amount: r.amount, indent: 1 })),
      { label: 'Total Cost of Goods Sold', amount: totalCOGS, isSubtotal: true },

      { label: 'GROSS PROFIT', amount: grossProfit, isTotal: true },

      { label: 'OPERATING EXPENSES', isHeader: true },
      ...opex.map(r => ({ label: r.label, amount: r.amount, indent: 1 })),
      { label: 'Total Operating Expenses', amount: totalOpex, isSubtotal: true },

      { label: 'OPERATING PROFIT', amount: operatingProfit, isTotal: true },

      { label: 'OTHER INCOME / (EXPENSE)', isHeader: true },
      { label: 'Interest Income',    amount: interestIncome,  indent: 1 },
      { label: 'Interest Expense',   amount: interestExpense, indent: 1, negative: true },

      { label: 'NET PROFIT BEFORE TAX', amount: netBeforeTax, isTotal: true },
      { label: 'Tax Provision (30%)',   amount: tax,           indent: 1, negative: true },
      { label: 'NET PROFIT AFTER TAX',  amount: netProfit,     isTotal: true },
    ];
  }

  // ─── Balance Sheet ───────────────────────────────────────────────
  private buildBS(): void {
    this.totalAssets = 13258125;

    this.bsAssets = [
      { label: 'CURRENT ASSETS', isHeader: true },
      { label: 'Cash & Bank Balances',         amount: 3240000,  indent: 1 },
      { label: 'Accounts Receivable',          amount: 1834125,  indent: 1 },
      { label: 'Inventory',                    amount: 1450000,  indent: 1 },
      { label: 'Prepaid Expenses',             amount: 124000,   indent: 1 },
      { label: 'Total Current Assets',         amount: 6648125,  isSubtotal: true },

      { label: 'NON-CURRENT ASSETS', isHeader: true },
      { label: 'Property & Equipment (Gross)', amount: 8500000,  indent: 1 },
      { label: 'Less: Accumulated Depreciation', amount: 2340000, indent: 1, negative: true },
      { label: 'Intangible Assets',            amount: 450000,   indent: 1 },
      { label: 'Total Non-Current Assets',     amount: 6610000,  isSubtotal: true },

      { label: 'TOTAL ASSETS',                 amount: 13258125, isTotal: true },
    ];

    const totalCurrentLiab = 3175150;
    const totalNonCurrentLiab = 2500000;
    const totalLiabilities = 5675150;
    const retainedEarnings = 2582975;
    const totalEquity = 7582975;
    this.totalLiabilitiesEquity = 13258125;

    this.bsLiabilitiesEquity = [
      { label: 'CURRENT LIABILITIES', isHeader: true },
      { label: 'Accounts Payable',    amount: 2085150, indent: 1 },
      { label: 'Accrued Liabilities', amount: 340000,  indent: 1 },
      { label: 'Short-term Loans',    amount: 750000,  indent: 1 },
      { label: 'Total Current Liabilities', amount: totalCurrentLiab, isSubtotal: true },

      { label: 'NON-CURRENT LIABILITIES', isHeader: true },
      { label: 'Long-term Loans',     amount: 2500000, indent: 1 },
      { label: 'Total Non-Current Liabilities', amount: totalNonCurrentLiab, isSubtotal: true },

      { label: 'TOTAL LIABILITIES',   amount: totalLiabilities, isSubtotal: true },

      { label: 'EQUITY', isHeader: true },
      { label: 'Share Capital',       amount: 5000000,         indent: 1 },
      { label: 'Retained Earnings',   amount: retainedEarnings, indent: 1 },
      { label: 'Total Equity',        amount: totalEquity,     isSubtotal: true },

      { label: 'TOTAL LIABILITIES & EQUITY', amount: this.totalLiabilitiesEquity, isTotal: true },
    ];
  }

  // ─── Trial Balance ───────────────────────────────────────────────
  private buildTB(): void {
    const raw = [
      { code: '1001', name: 'Cash & Bank',                  type: 'Asset',     debit: 3240000,  credit: 0        },
      { code: '1200', name: 'Accounts Receivable',          type: 'Asset',     debit: 1834125,  credit: 0        },
      { code: '1400', name: 'Inventory',                    type: 'Asset',     debit: 1450000,  credit: 0        },
      { code: '1500', name: 'Prepaid Expenses',             type: 'Asset',     debit: 124000,   credit: 0        },
      { code: '1800', name: 'Property & Equipment',         type: 'Asset',     debit: 8500000,  credit: 0        },
      { code: '1900', name: 'Accumulated Depreciation',     type: 'Asset',     debit: 0,        credit: 2340000  },
      { code: '2100', name: 'Accounts Payable',             type: 'Liability', debit: 0,        credit: 2085150  },
      { code: '2200', name: 'Accrued Liabilities',          type: 'Liability', debit: 0,        credit: 340000   },
      { code: '2300', name: 'Short-term Loans',             type: 'Liability', debit: 0,        credit: 750000   },
      { code: '2500', name: 'Long-term Loans',              type: 'Liability', debit: 0,        credit: 2500000  },
      { code: '3000', name: 'Share Capital',                type: 'Equity',    debit: 0,        credit: 5000000  },
      { code: '3100', name: 'Retained Earnings (Opening)',  type: 'Equity',    debit: 0,        credit: 721975   },
      { code: '4000', name: 'Product Sales Revenue',        type: 'Revenue',   debit: 0,        credit: 4800000  },
      { code: '4100', name: 'Service Revenue',              type: 'Revenue',   debit: 0,        credit: 2200000  },
      { code: '4200', name: 'Other Income',                 type: 'Revenue',   debit: 0,        credit: 180000   },
      { code: '5000', name: 'Direct Materials',             type: 'Expense',   debit: 1920000,  credit: 0        },
      { code: '5100', name: 'Direct Labour',                type: 'Expense',   debit: 640000,   credit: 0        },
      { code: '6000', name: 'Salaries & Benefits',          type: 'Expense',   debit: 1850000,  credit: 0        },
      { code: '6100', name: 'Utilities',                    type: 'Expense',   debit: 145000,   credit: 0        },
      { code: '6200', name: 'Office Supplies',              type: 'Expense',   debit: 87000,    credit: 0        },
      { code: '6300', name: 'Travel & Entertainment',       type: 'Expense',   debit: 212000,   credit: 0        },
      { code: '6400', name: 'Marketing & Advertising',      type: 'Expense',   debit: 340000,   credit: 0        },
      { code: '6500', name: 'Professional Services',        type: 'Expense',   debit: 480000,   credit: 0        },
      { code: '6600', name: 'Depreciation',                 type: 'Expense',   debit: 95000,    credit: 0        },
    ];

    this.trialBalanceData = this.filterAccountType
      ? raw.filter(r => r.type === this.filterAccountType)
      : raw;

    this.trialDebitTotal  = this.trialBalanceData.reduce((s, r) => s + r.debit,  0);
    this.trialCreditTotal = this.trialBalanceData.reduce((s, r) => s + r.credit, 0);
  }

  // ─── Cash Flow ───────────────────────────────────────────────────
  private buildCF(): void {
    this.cashFlowData = [
      { label: 'OPERATING ACTIVITIES', isHeader: true },
      { label: 'Net Profit After Tax',                        amount: 970200,   indent: 1 },
      { label: 'Add: Depreciation & Amortisation',            amount: 95000,    indent: 1 },
      { label: 'Less: Increase in Accounts Receivable',       amount: 340125,   indent: 1, negative: true },
      { label: 'Less: Increase in Inventory',                 amount: 210000,   indent: 1, negative: true },
      { label: 'Add: Increase in Accounts Payable',           amount: 285150,   indent: 1 },
      { label: 'Net Cash from Operating Activities',          amount: 800225,   isSubtotal: true },

      { label: 'INVESTING ACTIVITIES', isHeader: true },
      { label: 'Purchase of Property & Equipment',            amount: 1200000,  indent: 1, negative: true },
      { label: 'Proceeds from Asset Disposal',                amount: 85000,    indent: 1 },
      { label: 'Net Cash Used in Investing Activities',       amount: -1115000, isSubtotal: true },

      { label: 'FINANCING ACTIVITIES', isHeader: true },
      { label: 'Proceeds from Long-term Loan',                amount: 1500000,  indent: 1 },
      { label: 'Repayment of Loans',                          amount: 400000,   indent: 1, negative: true },
      { label: 'Dividends Paid',                              amount: 200000,   indent: 1, negative: true },
      { label: 'Net Cash from Financing Activities',          amount: 900000,   isSubtotal: true },

      { label: 'NET INCREASE IN CASH',                        amount: 585225,   isTotal: true },
      { label: 'Cash at Beginning of Period',                 amount: 2654775,  indent: 1 },
      { label: 'CASH AT END OF PERIOD',                       amount: 3240000,  isTotal: true },
    ];
  }

  // ─── A/R Aging ───────────────────────────────────────────────────
  private buildARaging(): void {
    this.arAgingData = [
      { customer: 'Apex Ventures',     current: 483750,  d30: 0,        d60: 0,       d90: 0,       over90: 0,       total: 483750  },
      { customer: 'Goldrun Foods',     current: 134375,  d30: 0,        d60: 0,       d90: 0,       over90: 0,       total: 134375  },
      { customer: 'Prime Partners',    current: 645000,  d30: 0,        d60: 0,       d90: 0,       over90: 0,       total: 645000  },
      { customer: 'BlueSky Holdings',  current: 0,       d30: 2150000,  d60: 0,       d90: 0,       over90: 0,       total: 2150000 },
      { customer: 'TechCorp Nigeria',  current: 0,       d30: 0,        d60: 301000,  d90: 0,       over90: 0,       total: 301000  },
      { customer: 'Sunrise Trading',   current: 0,       d30: 0,        d60: 0,       d90: 184500,  over90: 0,       total: 184500  },
      { customer: 'NovaTech Systems',  current: 0,       d30: 0,        d60: 0,       d90: 0,       over90: 225000,  total: 225000  },
      { customer: 'Emeka Biz Ltd',     current: 0,       d30: 0,        d60: 0,       d90: 0,       over90: 0,       total: 0       },
    ];
    const sum = (k: string) => this.arAgingData.reduce((s: number, r: any) => s + r[k], 0);
    this.arAgingTotals = { current: sum('current'), d30: sum('d30'), d60: sum('d60'), d90: sum('d90'), over90: sum('over90'), total: sum('total') };
  }

  // ─── A/P Aging ───────────────────────────────────────────────────
  private buildAPaging(): void {
    this.apAgingData = [
      { vendor: 'Andela Nigeria',    current: 1290000, d30: 0,       d60: 0,       d90: 0,      over90: 0,      total: 1290000 },
      { vendor: 'Dell Technologies', current: 698750,  d30: 0,       d60: 0,       d90: 0,      over90: 0,      total: 698750  },
      { vendor: 'Aero Contractors',  current: 258000,  d30: 0,       d60: 0,       d90: 0,      over90: 0,      total: 258000  },
      { vendor: 'Office Depot NG',   current: 34400,   d30: 0,       d60: 0,       d90: 0,      over90: 0,      total: 34400   },
      { vendor: 'Printivo',          current: 0,       d30: 85000,   d60: 0,       d90: 0,      over90: 0,      total: 85000   },
      { vendor: 'Konga Marketplace', current: 0,       d30: 0,       d60: 18500,   d90: 0,      over90: 0,      total: 18500   },
      { vendor: 'MTN Nigeria',       current: 0,       d30: 0,       d60: 0,       d90: 0,      over90: 67000,  total: 67000   },
      { vendor: 'EKEDC',             current: 0,       d30: 0,       d60: 0,       d90: 0,      over90: 0,      total: 0       },
    ];
    const sum = (k: string) => this.apAgingData.reduce((s: number, r: any) => s + r[k], 0);
    this.apAgingTotals = { current: sum('current'), d30: sum('d30'), d60: sum('d60'), d90: sum('d90'), over90: sum('over90'), total: sum('total') };
  }

  // ─── Audit Trail ─────────────────────────────────────────────────
  private buildAudit(): void {
    const raw = [
      { ts: '2026-06-09T14:32:00', user: 'finance',  action: 'CREATE',  entity: 'Journal Entry', ref: 'JE-0006',   desc: 'Monthly payroll accrual',              amount: 1850000 },
      { ts: '2026-06-08T11:20:00', user: 'admin',    action: 'APPROVE', entity: 'Bill',           ref: 'BILL-0002', desc: 'Office Depot NG bill approved',        amount: 34400   },
      { ts: '2026-06-07T09:15:00', user: 'sales',    action: 'CREATE',  entity: 'Invoice',        ref: 'INV-0005',  desc: 'Invoice issued to Prime Partners',     amount: 645000  },
      { ts: '2026-06-06T16:47:00', user: 'admin',    action: 'UPDATE',  entity: 'Journal Entry',  ref: 'JE-0005',   desc: 'Corrected depreciation amount',        amount: 95000   },
      { ts: '2026-06-05T10:05:00', user: 'finance',  action: 'CREATE',  entity: 'Bill',           ref: 'BILL-0006', desc: 'Andela retainer bill submitted',       amount: 1290000 },
      { ts: '2026-06-04T14:00:00', user: 'hr',       action: 'CREATE',  entity: 'Journal Entry',  ref: 'JE-0004',   desc: 'Travel expense — Aero Contractors',   amount: 258000  },
      { ts: '2026-06-03T08:55:00', user: 'finance',  action: 'PAID',    entity: 'Invoice',        ref: 'INV-0001',  desc: 'Emeka Biz Ltd invoice marked paid',    amount: 1075000 },
      { ts: '2026-06-02T11:30:00', user: 'admin',    action: 'DELETE',  entity: 'Journal Entry',  ref: 'JE-0002',   desc: 'Duplicate entry removed',              amount: 0       },
      { ts: '2026-06-01T15:20:00', user: 'sales',    action: 'CREATE',  entity: 'Invoice',        ref: 'INV-0006',  desc: 'Invoice issued to BlueSky Holdings',   amount: 2150000 },
      { ts: '2026-05-30T09:00:00', user: 'finance',  action: 'CREATE',  entity: 'Journal Entry',  ref: 'JE-0003',   desc: 'Q1 tax provision entry',               amount: 415800  },
      { ts: '2026-05-28T13:10:00', user: 'admin',    action: 'APPROVE', entity: 'Bill',           ref: 'BILL-0001', desc: 'EKEDC electricity bill approved',       amount: 85000   },
      { ts: '2026-05-27T10:45:00', user: 'finance',  action: 'CREATE',  entity: 'Invoice',        ref: 'INV-0004',  desc: 'Invoice created for Goldrun Foods',    amount: 134375  },
      { ts: '2026-05-25T16:00:00', user: 'admin',    action: 'REJECT',  entity: 'Bill',           ref: 'BILL-0005', desc: 'Konga bill rejected — needs revision', amount: 18500   },
      { ts: '2026-05-22T11:20:00', user: 'finance',  action: 'UPDATE',  entity: 'Invoice',        ref: 'INV-0002',  desc: 'Invoice status updated to Overdue',    amount: 301000  },
    ];

    this.auditTrailData = this.filterActionType
      ? raw.filter(r => r.action === this.filterActionType)
      : raw;
  }

  // ─── helpers ────────────────────────────────────────────────────
  getActionClass(action: string): string {
    const map: { [k: string]: string } = {
      CREATE: 'approved', APPROVE: 'approved', PAID: 'approved',
      UPDATE: 'pending',
      DELETE: 'declined', REJECT: 'declined',
    };
    return map[action] ?? 'inactive';
  }

  formatAmount(val: number, negative = false): string {
    if (!val) return '—';
    const formatted = `${this.currency}${val.toLocaleString()}`;
    return negative ? `(${formatted})` : formatted;
  }

  // ─── download ────────────────────────────────────────────────────
  downloadCSV(): void {
    const title  = this.currentReportLabel;
    const period = this.showDateRange
      ? `${this.filterDateFrom} to ${this.filterDateTo}`
      : `As of ${this.filterAsOfDate}`;

    let csv = `${title}\n${period}\n\n`;

    if (this.selectedTab === 'profit-loss' || this.selectedTab === 'cash-flow') {
      const data = this.selectedTab === 'profit-loss' ? this.plData : this.cashFlowData;
      data.forEach(r => {
        const indent = '  '.repeat(r.indent ?? 0);
        const amt = r.amount !== undefined
          ? (r.negative || (r.amount < 0) ? `(${Math.abs(r.amount)})` : String(r.amount))
          : '';
        csv += `"${indent}${r.label}",${amt}\n`;
      });
    } else if (this.selectedTab === 'balance-sheet') {
      csv += `Assets\n`;
      this.bsAssets.forEach(r => { csv += `"${r.label}",${r.amount ?? ''}\n`; });
      csv += `\nLiabilities & Equity\n`;
      this.bsLiabilitiesEquity.forEach(r => { csv += `"${r.label}",${r.amount ?? ''}\n`; });
    } else if (this.selectedTab === 'trial-balance') {
      csv += `Code,Account Name,Type,Debit,Credit\n`;
      this.trialBalanceData.forEach(r => { csv += `${r.code},"${r.name}",${r.type},${r.debit},${r.credit}\n`; });
      csv += `,,TOTALS,${this.trialDebitTotal},${this.trialCreditTotal}\n`;
    } else if (this.selectedTab === 'ar-aging') {
      csv += `Customer,Current,1-30 Days,31-60 Days,61-90 Days,Over 90 Days,Total\n`;
      this.arAgingData.forEach(r => { csv += `"${r.customer}",${r.current},${r.d30},${r.d60},${r.d90},${r.over90},${r.total}\n`; });
      csv += `TOTALS,${this.arAgingTotals.current},${this.arAgingTotals.d30},${this.arAgingTotals.d60},${this.arAgingTotals.d90},${this.arAgingTotals.over90},${this.arAgingTotals.total}\n`;
    } else if (this.selectedTab === 'ap-aging') {
      csv += `Vendor,Current,1-30 Days,31-60 Days,61-90 Days,Over 90 Days,Total\n`;
      this.apAgingData.forEach(r => { csv += `"${r.vendor}",${r.current},${r.d30},${r.d60},${r.d90},${r.over90},${r.total}\n`; });
      csv += `TOTALS,${this.apAgingTotals.current},${this.apAgingTotals.d30},${this.apAgingTotals.d60},${this.apAgingTotals.d90},${this.apAgingTotals.over90},${this.apAgingTotals.total}\n`;
    } else if (this.selectedTab === 'audit-trail') {
      csv += `Timestamp,User,Action,Entity,Reference,Description,Amount\n`;
      this.auditTrailData.forEach(r => {
        csv += `${r.ts},${r.user},${r.action},${r.entity},${r.ref},"${r.desc}",${r.amount}\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${title.replace(/\s+/g, '-')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
