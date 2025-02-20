import { OidcSecurityService } from "angular-auth-oidc-client";
import { map, Observable, take } from "rxjs";
import { inject } from "@angular/core";

export function authGuard(): Observable<boolean> {
  const oidcSecurityService = inject(OidcSecurityService);

  return oidcSecurityService.isAuthenticated().pipe(
    take(1),
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        oidcSecurityService.authorize();
        return false;
      }
      return true;
    })
  );
}

