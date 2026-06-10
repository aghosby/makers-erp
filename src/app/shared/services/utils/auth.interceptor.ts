import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private notificationService: ToastrService) {
    console.log('Interceptor constructed');
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const skipToast = request.headers.has('X-No-Error-Toast');

    if (skipToast) {
      request = request.clone({ headers: request.headers.delete('X-No-Error-Toast') });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error?.url?.includes('ipapi') || skipToast) {
          return throwError(() => error);
        }

        switch (error.status) {
          case 401:
            this.notificationService.warning('Your session has expired. Please login once again.', 'Session Expired');
          break;

          case 403:
            this.notificationService.warning('You do not have access to that', 'Unauthorized');
          break;

          default:
            const message = error?.error?.error ?? 'An unexpected error occurred. Please try again.';
            this.notificationService.error(message, 'Failed');
            console.error(error.error);
        }

        return throwError(() => error);
      })
    );
  }
}
