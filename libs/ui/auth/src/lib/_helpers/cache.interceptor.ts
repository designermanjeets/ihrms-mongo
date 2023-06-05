import { HTTP_INTERCEPTORS, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { share, shareReplay, tap } from 'rxjs/operators';

@Injectable()
class CacheInterceptor implements HttpInterceptor {

  private cache: Map<HttpRequest<any>, HttpResponse<any>> = new Map();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

    if(req.method !== "GET") {
      return next.handle(req)
    }

    if(req.headers.get("reset")) { // Example:- return this.httpClient.get("api/dogs", new HttpHeaders({reset}))
      this.cache.delete(req);
    }

    const cachedResponse: HttpResponse<any> = this.cache.get(req) as any

    if(cachedResponse) {
      console.log('cachedResponse');
      return of(cachedResponse.clone())
    } else {
      return next.handle(req).pipe(
        tap((stateEvent:any) => {
          if(stateEvent instanceof HttpResponse) {
            this.cache.set(req, stateEvent.clone())
          }
        }), shareReplay(1)
      )
    }
  }
}

export const cacheInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
];
