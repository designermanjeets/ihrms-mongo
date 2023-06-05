import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable, Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenStorageService } from '../_services/token.service';
import { AuthService } from '../_services/auth.service';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

const TOKEN_HEADER_KEY = 'Authorization';  // for Spring Boot back-end
// const TOKEN_HEADER_KEY = 'x-access-token';    // for Node.js Express back-end

@Pipe({name: 'safeHtml'})
export class Safe implements PipeTransform{
  constructor(private sanitizer: DomSanitizer){}
  transform(html: string) {
    alert('html')
    return this.sanitizer.sanitize(SecurityContext.HTML, html);
  }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private tokenService: TokenStorageService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.warn('AuthInterceptor');
    let authReq = req;
    const token = this.tokenService.getToken();
    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && !authReq.url.includes('login') && error.status === 401) {
        return this.handle401Error(authReq, next);
      }
      if (error instanceof HttpErrorResponse && !authReq.url.includes('login') && error.status === 400 ||
          error instanceof HttpErrorResponse && !authReq.url.includes('login') && error.status === 404)
      {
        const err = error?.error?.error;
        if(err && err?.validationErrors) {
          for (const validationError of err?.validationErrors) {
            if(validationError) {
              this.toastrService.error(
                `Error Message: ${validationError?.message}`,
                `Error in Field: ${validationError?.members[0]}`, {
                  timeOut: 10000,
                }
              );
            }
          }
        }
        if(err?.code === 0 || !error.ok) {
          this.toastrService.error(
            ``,
            `${err?.message || error.message}`, {
              timeOut: 5000,
            }
          );
        }
        return throwError(error);
      }

      return throwError(error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.tokenService.getRefreshToken();

      if (token)
        return this.authService.refreshToken(token).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;

            this.tokenService.saveToken(token.accessToken);
            this.refreshTokenSubject.next(token.accessToken);

            return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.authService.logout();
            return throwError(err);
          })
        );
    } else {
      this.isRefreshing = false;
      this.authService.logout();
      return throwError('401 Logout!');
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    let headers;
    if(request.url === 'https://yrqjjg.api.infobip.com/whatsapp/1/message/template') {
      // 
      console.log(request.url);
    } else {
    /* for Spring Boot back-end */
      headers = new HttpHeaders({
        // TOKEN_HEADER_KEY: 'Bearer ' + token,
        tenantId: sessionStorage.getItem('tenantId') || ''
      });
    }

    return request.clone({headers});

    /* for Node.js Express back-end */
    // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token) });
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
