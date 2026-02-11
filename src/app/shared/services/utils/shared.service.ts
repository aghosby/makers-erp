import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable, ReplaySubject, timer } from 'rxjs';
import { HumanResourcesService } from '../hr/human-resources.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private path = `${environment.baseUrl}`;
  //private token = `${environment.token}`;

  headerParams = {
    'Authorization': this.authService.token
  }
  requestOptions = {                                                                                                                                                                                 
    headers: new HttpHeaders(this.headerParams)
  }

  constructor(
    private http: HttpClient, 
    private authService: AuthenticationService,
    private hrService: HumanResourcesService,
    private location: Location,
  ) { }

  private dataSubject: ReplaySubject<string> = new ReplaySubject<string>(1);

  setData(data: string): void {
    this.dataSubject.next(data);
  }

  getData$(): Observable<string> {
    return this.dataSubject.asObservable();
  }

  getDepartments() {
    let departments;
    this.hrService.getDepartments().subscribe({
      next:(res) => {
        if(res.success) {
          departments = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
    return departments;
  }

  goBack() {
    this.location.back();
  }

  public getNotifications(): Observable<any> {
    return this.http.get<any>(`${this.path}/notifications`, this.requestOptions);
  }

  pollNotifications(intervalMs = 5000): Observable<any> { 
    return timer(0, intervalMs).pipe( 
      switchMap(() => this.getNotifications())
    ); 
  }

  public readNotification(notificationId:string): Observable<any> {
    return this.http.patch<any>(`${this.path}/notifications/markAsRead/${notificationId}`, undefined, this.requestOptions);
  }

  //Converts an array to an Object of key value pairs
  arrayToObject(arrayVar, key:string) {
    console.log(arrayVar)
    if(arrayVar && arrayVar.length > 0) {
      let reqObj = {}
      reqObj = arrayVar.reduce((agg, item, index) => {
        agg[item['_id']] = item[key];
        return agg;
      }, {})
      //console.log(reqObj);
      return reqObj;
    }
    else return {}    
  }

  // Change label display text
  getRangeDisplayText = (page: number, pageSize: number, length: number) => {
    const initialText = `Page`;  // customize this line
    if (length == 0 || pageSize == 0) {
      return `${initialText} 0 of ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length 
      ? Math.min(startIndex + pageSize, length) 
      : startIndex + pageSize;
    return `${initialText} ${startIndex + 1} to ${endIndex} of ${length}`; // customize this line
  };

}
