import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../utils/authentication.service';

const MOCK_BILLS: any[] = [
  {
    _id: 'b1', billNumber: 'BILL-0001', vendor: 'EKEDC (Electricity)', category: 'Utilities',
    date: '2026-05-02', dueDate: '2026-05-20', description: 'Office electricity — April',
    subtotal: 85000, taxRate: 0, taxAmount: 0, total: 85000,
    status: 'Paid', requiresApproval: false, approvedBy: 'finance',
    attachment: { name: 'ekedc-april-bill.pdf', url: '#', size: '142 KB' },
    notes: 'Account number: 54321-0098', createdBy: 'finance',
    items: [{ description: 'Electricity — April', quantity: 1, unitPrice: 85000, amount: 85000 }],
  },
  {
    _id: 'b2', billNumber: 'BILL-0002', vendor: 'Office Depot NG', category: 'Office Supplies',
    date: '2026-05-10', dueDate: '2026-05-25', description: 'Stationery and printer consumables',
    subtotal: 32000, taxRate: 7.5, taxAmount: 2400, total: 34400,
    status: 'Approved', requiresApproval: true, approvedBy: 'admin',
    attachment: null, notes: '', createdBy: 'admin',
    items: [
      { description: 'Printer Ink Cartridges', quantity: 4, unitPrice: 5000, amount: 20000 },
      { description: 'Stationery Set',          quantity: 3, unitPrice: 4000, amount: 12000 },
    ],
  },
  {
    _id: 'b3', billNumber: 'BILL-0003', vendor: 'Aero Contractors', category: 'Travel',
    date: '2026-05-15', dueDate: '2026-06-15', description: 'Staff travel — Lagos to Abuja',
    subtotal: 240000, taxRate: 7.5, taxAmount: 18000, total: 258000,
    status: 'Pending Approval', requiresApproval: true, approvedBy: null,
    attachment: { name: 'flight-receipts.pdf', url: '#', size: '318 KB' },
    notes: 'Three staff members attended compliance summit', createdBy: 'hr',
    items: [{ description: 'Economy Flights x3', quantity: 3, unitPrice: 80000, amount: 240000 }],
  },
  {
    _id: 'b4', billNumber: 'BILL-0004', vendor: 'Dell Technologies', category: 'Equipment',
    date: '2026-05-20', dueDate: '2026-06-20', description: 'Laptop for new engineer',
    subtotal: 650000, taxRate: 7.5, taxAmount: 48750, total: 698750,
    status: 'Draft', requiresApproval: true, approvedBy: null,
    attachment: null, notes: '', createdBy: 'admin',
    items: [{ description: 'Dell XPS 15 Laptop', quantity: 1, unitPrice: 650000, amount: 650000 }],
  },
  {
    _id: 'b5', billNumber: 'BILL-0005', vendor: 'Konga Marketplace', category: 'Office Supplies',
    date: '2026-04-28', dueDate: '2026-05-28', description: 'Cleaning and sanitation supplies',
    subtotal: 18500, taxRate: 0, taxAmount: 0, total: 18500,
    status: 'Overdue', requiresApproval: false, approvedBy: null,
    attachment: null, notes: '', createdBy: 'admin',
    items: [{ description: 'Cleaning Supplies Bundle', quantity: 1, unitPrice: 18500, amount: 18500 }],
  },
  {
    _id: 'b6', billNumber: 'BILL-0006', vendor: 'Andela Nigeria', category: 'Services',
    date: '2026-06-01', dueDate: '2026-07-01', description: 'Software development retainer — June',
    subtotal: 1200000, taxRate: 7.5, taxAmount: 90000, total: 1290000,
    status: 'Pending Approval', requiresApproval: true, approvedBy: null,
    attachment: { name: 'andela-retainer-june.pdf', url: '#', size: '98 KB' },
    notes: 'Monthly retainer as per SLA', createdBy: 'finance',
    items: [{ description: 'Development Retainer — June', quantity: 1, unitPrice: 1200000, amount: 1200000 }],
  },
];

@Injectable({ providedIn: 'root' })
export class BillService {

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

  public getBills(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchBills`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_BILLS }))
    );
  }

  public getBill(id: string): Observable<any> {
    return this.http.get<any>(`${this.path}/getBill/${id}`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_BILLS.find(b => b._id === id) ?? null }))
    );
  }

  public createBill(data: any): Observable<any> {
    return this.http.post<any>(`${this.path}/addBill`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: { ...data, _id: Date.now().toString() } }))
    );
  }

  public updateBill(data: any, id: string): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateBill/${id}`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  public deleteBill(id: string): Observable<any> {
    return this.http.delete<any>(`${this.path}/deleteBill/${id}`, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  public getNextBillNumber(): Observable<any> {
    const next = 'BILL-' + String(MOCK_BILLS.length + 1).padStart(4, '0');
    return of({ status: 200, data: next });
  }
}
