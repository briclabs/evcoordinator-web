import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class GatewayInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith('/assets')) {
      return next.handle(req);
    }

    const newReq = req.clone({
      url: req.url,
      withCredentials: true
    });

    return next.handle(newReq);
  }
}
