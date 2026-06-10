import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../utils/authentication.service';

const MOCK_VENDORS: any[] = [
  {
    _id: 'v1',
    vendorName: 'Andela Nigeria',
    contactPersonName: 'Tunde Fashola',
    email: 'procurement@andela.com',
    phone: '+234 801 234 5678',
    activeOrders: 2,
    fulfilledOrders: 14,
    imageUrl: null,
    address: { street: '14 Balarabe Musa Crescent', city: 'Victoria Island', state: 'Lagos', country: 'Nigeria', zipCode: '101241' },
  },
  {
    _id: 'v2',
    vendorName: 'Dell Technologies NG',
    contactPersonName: 'Chioma Obi',
    email: 'sales.ng@dell.com',
    phone: '+234 802 345 6789',
    activeOrders: 1,
    fulfilledOrders: 8,
    imageUrl: null,
    address: { street: 'Plot 1668 Okonjo Iweala Way', city: 'Abuja', state: 'FCT', country: 'Nigeria', zipCode: '900001' },
  },
  {
    _id: 'v3',
    vendorName: 'Office Depot NG',
    contactPersonName: 'Emeka Eze',
    email: 'orders@officedepot.ng',
    phone: '+234 803 456 7890',
    activeOrders: 3,
    fulfilledOrders: 27,
    imageUrl: null,
    address: { street: '5 Allen Avenue', city: 'Ikeja', state: 'Lagos', country: 'Nigeria', zipCode: '100001' },
  },
  {
    _id: 'v4',
    vendorName: 'Aero Contractors',
    contactPersonName: 'Ngozi Adeyemi',
    email: 'corporate@aerocontractors.com',
    phone: '+234 804 567 8901',
    activeOrders: 0,
    fulfilledOrders: 5,
    imageUrl: null,
    address: { street: 'Murtala Muhammed Airport', city: 'Ikeja', state: 'Lagos', country: 'Nigeria', zipCode: '100214' },
  },
  {
    _id: 'v5',
    vendorName: 'Konga Marketplace',
    contactPersonName: 'Bola Adesanya',
    email: 'b2b@konga.com',
    phone: '+234 805 678 9012',
    activeOrders: 1,
    fulfilledOrders: 42,
    imageUrl: null,
    address: { street: '3A Akin Adesola Street', city: 'Victoria Island', state: 'Lagos', country: 'Nigeria', zipCode: '101241' },
  },
  {
    _id: 'v6',
    vendorName: 'EKEDC',
    contactPersonName: 'Femi Ogundipe',
    email: 'corporate@ekedc.com',
    phone: '+234 806 789 0123',
    activeOrders: 0,
    fulfilledOrders: 24,
    imageUrl: null,
    address: { street: '24/25 Marina', city: 'Lagos Island', state: 'Lagos', country: 'Nigeria', zipCode: '102273' },
  },
  {
    _id: 'v7',
    vendorName: 'MTN Nigeria',
    contactPersonName: 'Adaeze Nwosu',
    email: 'enterprise@mtnnigeria.net',
    phone: '+234 807 890 1234',
    activeOrders: 2,
    fulfilledOrders: 36,
    imageUrl: null,
    address: { street: 'MTN Plaza, Falomo', city: 'Ikoyi', state: 'Lagos', country: 'Nigeria', zipCode: '101233' },
  },
  {
    _id: 'v8',
    vendorName: 'Printivo',
    contactPersonName: 'Seun Martins',
    email: 'orders@printivo.com',
    phone: '+234 808 901 2345',
    activeOrders: 1,
    fulfilledOrders: 11,
    imageUrl: null,
    address: { street: '12 Kudirat Abiola Way', city: 'Oregun', state: 'Lagos', country: 'Nigeria', zipCode: '100004' },
  },
];

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private path = `${environment.baseUrl}`;
  //private token = `${environment.token}`;

  headerParams = {
    'Authorization': this.authService.token
  }
  requestOptions = {                                                                                                                                                                                 
    headers: new HttpHeaders(this.headerParams)
  }

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  /*************** CUSTOMER RELATED ACTIONS ***************/

  //Create a new customer
  public createCustomer(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/create-customer`, info, this.requestOptions);
  }

  //Get the list of all customers
  public getCustomers(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-customers`, this.requestOptions);
  }

  //Get details of a customer
  public getCustomer(customerId:string): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-customer/${customerId}`, this.requestOptions);
  }

  //Delete customer
  public deleteCustomer(customerId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/delete-customer/${customerId}`, this.requestOptions);
  }

  /*************** PRODUCT RELATED ACTIONS ***************/

  //Create a new product
  public createProduct(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/create-product`, info, this.requestOptions);
  }

  //Get the list of all products
  public getProducts(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-products`, this.requestOptions);
  }

  //Get product details
  public getProductDetails(productId:string): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-product/${productId}`, this.requestOptions);
  }

  //Create a new product stock
  public createStock(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/create-stock`, info, this.requestOptions);
  }

  //Get stock history
  public getStockHistory(productId:string): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-stocks?productId=${productId}`, this.requestOptions);
  }

  //Create a new product category
  public createProductCategory(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/create-product-cat`, info, this.requestOptions);
  }

  //Get the list of all product categories
  public getProductCategories(): Observable<any> {
    return this.http.get<any>(`${this.path}/get-product-cats`, this.requestOptions);
  }

  /*************** SUPPLIER RELATED ACTIONS ***************/

  //Create a new supplier
  public createSupplier(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/create-supplier`, info, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: { ...info, _id: Date.now().toString() } }))
    );
  }

  //Get the list of all suppliers
  public getSuppliers(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-suppliers`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_VENDORS }))
    );
  }

  //Get details of a supplier
  public getSupplier(supplierId:string): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-supplier/${supplierId}`, this.requestOptions).pipe(
      catchError(() => of({ status: 200, data: MOCK_VENDORS.find(v => v._id === supplierId) ?? null }))
    );
  }

  //Update a supplier
  public updateSupplier(supplierId: string, info: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/update-supplier/${supplierId}`, info, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  //Delete a supplier
  public deleteSupplier(supplierId: string): Observable<any> {
    return this.http.delete<any>(`${this.path}/delete-supplier/${supplierId}`, this.requestOptions).pipe(
      catchError(() => of({ status: 200 }))
    );
  }

  /*************** COURIER RELATED ACTIONS ***************/

  //Create a new freight carrier
  public createCourier(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/create-courier`, info, this.requestOptions);
  }

  //Get the list of all couriers
  public getCouriers(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-couriers`, this.requestOptions);
  }

  /*************** GENERAL RELATED ACTIONS ***************/

  //Get the list of all industries
  public getIndustries(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-industries`, this.requestOptions);
  }
}
