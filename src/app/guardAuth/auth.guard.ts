import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const token = cookieService.get('userToken');
  // return true;
  if (token) {
    return true; // User is authenticated
  } else {
    router.navigate(['/login']); // Redirect to login if not authenticated
    return false;
  }
};
