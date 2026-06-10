import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../utils/authentication.service';

const MOCK_INVOICES = [
  {
    _id: '1', invoiceNumber: 'INV-0001', customer: 'Emeka Biz Ltd',    customerId: 'c1',
    entity: 'Head Office', date: '2026-04-10', dueDate: '2026-05-10',
    subtotal: 1000000, taxRate: 7.5, taxAmount: 75000, total: 1075000,
    status: 'Paid',    notes: '',  createdBy: 'sales',
    items: [
      { description: 'Web Development Services', quantity: 1, unitPrice: 800000, amount: 800000 },
      { description: 'UI/UX Design',              quantity: 1, unitPrice: 200000, amount: 200000 },
    ],
  },
  {
    _id: '2', invoiceNumber: 'INV-0002', customer: 'TechCorp Nigeria',  customerId: 'c2',
    entity: 'Lagos',       date: '2026-04-15', dueDate: '2026-05-15',
    subtotal: 280000,  taxRate: 7.5, taxAmount: 21000,  total: 301000,
    status: 'Overdue', notes: '',  createdBy: 'sales',
    items: [
      { description: 'IT Consulting — Q1', quantity: 8, unitPrice: 35000, amount: 280000 },
    ],
  },
  {
    _id: '3', invoiceNumber: 'INV-0003', customer: 'Apex Ventures',    customerId: 'c3',
    entity: 'Abuja',       date: '2026-05-01', dueDate: '2026-05-31',
    subtotal: 450000,  taxRate: 7.5, taxAmount: 33750,  total: 483750,
    status: 'Sent',    notes: '',  createdBy: 'sales',
    items: [
      { description: 'Software Licence — Annual', quantity: 1, unitPrice: 450000, amount: 450000 },
    ],
  },
  {
    _id: '4', invoiceNumber: 'INV-0004', customer: 'Goldrun Foods',    customerId: 'c4',
    entity: 'Lagos',       date: '2026-05-18', dueDate: '2026-06-18',
    subtotal: 125000,  taxRate: 7.5, taxAmount: 9375,   total: 134375,
    status: 'Draft',   notes: '',  createdBy: 'finance',
    items: [
      { description: 'Training Workshop', quantity: 5, unitPrice: 25000, amount: 125000 },
    ],
  },
  {
    _id: '5', invoiceNumber: 'INV-0005', customer: 'Prime Partners',   customerId: 'c5',
    entity: 'Head Office', date: '2026-06-01', dueDate: '2026-07-01',
    subtotal: 600000,  taxRate: 7.5, taxAmount: 45000,  total: 645000,
    status: 'Sent',    notes: '',  createdBy: 'sales',
    items: [
      { description: 'Monthly Retainer', quantity: 1, unitPrice: 600000, amount: 600000 },
    ],
  },
  {
    _id: '6', invoiceNumber: 'INV-0006', customer: 'BlueSky Holdings', customerId: 'c6',
    entity: 'Head Office', date: '2026-06-05', dueDate: '2026-07-05',
    subtotal: 2000000, taxRate: 7.5, taxAmount: 150000, total: 2150000,
    status: 'Draft',   notes: '',  createdBy: 'admin',
    items: [
      { description: 'System Integration Project', quantity: 1, unitPrice: 2000000, amount: 2000000 },
    ],
  },
];

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

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

  public getInvoices(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchInvoices`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_INVOICES }))
    );
  }

  public getInvoice(id: string): Observable<any> {
    return this.http.get<any>(`${this.path}/getInvoice/${id}`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_INVOICES.find(i => i._id === id) ?? null }))
    );
  }

  public createInvoice(data: any): Observable<any> {
    return this.http.post<any>(`${this.path}/addInvoice`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: { ...data, _id: Date.now().toString() } }))
    );
  }

  public updateInvoice(data: any, id: string): Observable<any> {
    return this.http.patch<any>(`${this.path}/updateInvoice/${id}`, data, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  public getNextInvoiceNumber(): Observable<any> {
    const next = 'INV-' + String(MOCK_INVOICES.length + 1).padStart(4, '0');
    return of({ status: 200, data: next });
  }
}
