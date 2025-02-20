import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: OidcSecurityService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token: string | null = null;

    this.authService.getAccessToken().subscribe({
      next: (accessToken) => { token = accessToken;},
      error: (err) => { console.log('Error getting token:', err); },
    } )

    if (!token || request.url.startsWith('http://localhost:9000')) {
      return next.handle(request);
    }

    const clonedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(clonedRequest);
  }
}
