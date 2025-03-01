import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from "../../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authAuthority: string = '';

  constructor(private authService: OidcSecurityService) {
    this.authAuthority = environment.authAuthority;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.getAccessToken()).pipe(
      switchMap((token) => {
        if (!token || request.url.startsWith(this.authAuthority)) {
          return next.handle(request);
        }

        const clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next.handle(clonedRequest);
      })
    );
  }
}
