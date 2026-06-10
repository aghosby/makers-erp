import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-accounting-dashboard',
  templateUrl: './accounting-dashboard.component.html',
  styleUrls: ['./accounting-dashboard.component.scss']
})
export class AccountingDashboardComponent implements OnInit {

  readonly currency = '₦';

  // ─── KPI cards ───────────────────────────────────────────────────
  kpiCards = [
    { icon: 'wallet',   label: 'Total Revenue',           value: '₦7,180,000',  change: '+8%',  dir: 'increase' },
    { icon: 'cash',     label: 'Total Expenses',           value: '₦5,769,800',  change: '+3%',  dir: 'increase' },
    { icon: 'trending', label: 'Net Profit',               value: '₦970,200',    change: '+12%', dir: 'increase' },
    { icon: 'card',     label: 'Outstanding Receivables',  value: '₦1,834,125',  change: '-5%',  dir: 'decrease' },
  ];

  // ─── Period selector ─────────────────────────────────────────────
  periods = ['This Week', 'Last Week', 'This Month', 'This Year'];
  currentPeriod = 'This Year';

  // ─── Revenue vs Expenses (grouped column) ────────────────────────
  RevenueHighcharts: typeof Highcharts = Highcharts;
  revenueChartOptions: Highcharts.Options = {
    chart: { type: 'column', backgroundColor: 'transparent' },
    title: { text: '' },
    credits: { enabled: false },
    legend: { enabled: true, align: 'right', verticalAlign: 'top', itemStyle: { fontFamily: 'AR', fontSize: '11px' } },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yAxis: {
      title: { text: '' },
      labels: {
        formatter: function () {
          return '₦' + (this.value as number / 1000000).toFixed(1) + 'M';
        }
      }
    },
    tooltip: {
      shared: true,
      valuePrefix: '₦',
      formatter: function () {
        let s = `<b>${this.x}</b><br/>`;
        this.points?.forEach(p => {
          s += `<span style="color:${p.color}">●</span> ${p.series.name}: <b>₦${(p.y / 1000000).toFixed(2)}M</b><br/>`;
        });
        return s;
      }
    },
    plotOptions: { column: { borderRadius: 4, groupPadding: 0.1 } },
    colors: ['#4285f4', '#eb5757'],
    series: [
      {
        type: 'column',
        name: 'Revenue',
        data: [520000, 480000, 610000, 590000, 670000, 720000, 740000, 680000, 760000, 810000, 830000, 770000],
      },
      {
        type: 'column',
        name: 'Expenses',
        data: [410000, 390000, 520000, 480000, 540000, 560000, 610000, 570000, 600000, 640000, 680000, 630000],
      },
    ],
  };

  // ─── Monthly Net Profit (area spline) ────────────────────────────
  ProfitHighcharts: typeof Highcharts = Highcharts;
  profitChartOptions: Highcharts.Options = {
    chart: { type: 'areaspline', backgroundColor: 'transparent' },
    title: { text: '' },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yAxis: {
      title: { text: '' },
      labels: {
        formatter: function () {
          return '₦' + (this.value as number / 1000).toFixed(0) + 'K';
        }
      }
    },
    tooltip: { valuePrefix: '₦', valueSuffix: '' },
    colors: ['#36ab68'],
    series: [
      {
        type: 'areaspline',
        name: 'Net Profit',
        data: [110000, 90000, 90000, 110000, 130000, 160000, 130000, 110000, 160000, 170000, 150000, 140000],
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, '#36ab68'],
            [1, Highcharts.color('#36ab68').setOpacity(0).get('rgba') as string],
          ],
        },
      },
    ],
  };

  // ─── Expense by Category (horizontal bar) ────────────────────────
  ExpenseHighcharts: typeof Highcharts = Highcharts;
  expenseChartOptions: Highcharts.Options = {
    chart: { type: 'bar', backgroundColor: 'transparent' },
    title: { text: '' },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories: ['Salaries', 'COGS', 'Marketing', 'Professional\nSvcs', 'Travel', 'Utilities', 'Supplies'],
    },
    yAxis: {
      title: { text: '' },
      labels: {
        formatter: function () {
          return '₦' + (this.value as number / 1000).toFixed(0) + 'K';
        }
      }
    },
    tooltip: { valuePrefix: '₦' },
    plotOptions: { bar: { borderRadius: 4, colorByPoint: true } },
    colors: ['#4285f4', '#e5a647', '#eb5757', '#36ab68', '#9b59b6', '#00a4ef', '#f39c12'],
    series: [
      {
        type: 'bar',
        name: 'Spend',
        data: [1850000, 1920000, 340000, 480000, 212000, 145000, 87000],
      },
    ],
  };

  // ─── Invoice Status (donut) ───────────────────────────────────────
  invoicePieColorScheme: Color = {
    name: 'invoice', selectable: true, group: ScaleType.Ordinal,
    domain: ['rgba(54, 171, 104, 0.8)', 'rgba(66, 133, 244, 0.8)', 'rgba(229, 166, 71, 0.8)', 'rgba(235, 87, 87, 0.8)']
  };
  invoiceStatusData = [
    { name: 'Paid',     value: 8,  status: 'paid' },
    { name: 'Sent',     value: 4,  status: 'sent' },
    { name: 'Overdue',  value: 3,  status: 'overdue' },
    { name: 'Draft',    value: 2,  status: 'draft' },
  ];

  // ─── Bills Status (donut) ────────────────────────────────────────
  billPieColorScheme: Color = {
    name: 'bills', selectable: true, group: ScaleType.Ordinal,
    domain: ['rgba(66, 133, 244, 0.8)', 'rgba(229, 166, 71, 0.8)', 'rgba(54, 171, 104, 0.8)', 'rgba(235, 87, 87, 0.8)']
  };
  billStatusData = [
    { name: 'Approved',          value: 3, status: 'approved' },
    { name: 'Pending Approval',  value: 2, status: 'pending'  },
    { name: 'Paid',              value: 2, status: 'paid'     },
    { name: 'Draft',             value: 1, status: 'draft'    },
  ];

  // ─── Recent transactions ─────────────────────────────────────────
  recentTransactions = [
    { ref: 'JE-0006', desc: 'Monthly payroll accrual',       amount: '₦1,850,000', type: 'debit',  date: '09 Jun' },
    { ref: 'INV-0005', desc: 'Invoice — Prime Partners',     amount: '₦645,000',   type: 'credit', date: '07 Jun' },
    { ref: 'BILL-0006', desc: 'Andela retainer',             amount: '₦1,290,000', type: 'debit',  date: '05 Jun' },
    { ref: 'INV-0006', desc: 'Invoice — BlueSky Holdings',   amount: '₦2,150,000', type: 'credit', date: '01 Jun' },
    { ref: 'JE-0003',  desc: 'Q1 tax provision',             amount: '₦415,800',   type: 'debit',  date: '30 May' },
  ];

  // ─── Bills due soon ──────────────────────────────────────────────
  billsDue = [
    { vendor: 'MTN Nigeria',      amount: '₦67,000',    dueDate: '12 Jun', status: 'overdue' },
    { vendor: 'Andela Nigeria',   amount: '₦1,290,000', dueDate: '15 Jun', status: 'pending' },
    { vendor: 'Printivo',         amount: '₦85,000',    dueDate: '20 Jun', status: 'pending' },
    { vendor: 'Dell Tech NG',     amount: '₦698,750',   dueDate: '28 Jun', status: 'approved' },
    { vendor: 'Konga Marketplace', amount: '₦18,500',   dueDate: '30 Jun', status: 'approved' },
  ];

  // ─── AR / AP summary ────────────────────────────────────────────
  arTotal  = '₦1,834,125';
  apTotal  = '₦2,085,150';
  cashBalance = '₦3,240,000';
  cashTarget  = 5000000;
  cashCurrent = 3240000;
  get cashPercent(): number { return Math.round((this.cashCurrent / this.cashTarget) * 100); }

  constructor() {}
  ngOnInit(): void {}

  changePeriod(p: string): void { this.currentPeriod = p; }

  getBillClass(status: string): string {
    const m: Record<string, string> = { overdue: 'declined', pending: 'pending', approved: 'approved', paid: 'approved' };
    return m[status] ?? 'inactive';
  }
}
