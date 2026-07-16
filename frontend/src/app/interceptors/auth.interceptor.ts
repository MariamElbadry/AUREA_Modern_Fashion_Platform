import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
  const isPublicAuthRequest = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register');
  const request = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    : req;

  return next(request).pipe(
    catchError((error: any) => {
      // A rejected login belongs to the form. Only expire an existing session
      // when a protected request reports that its token is no longer valid.
      if (error.status === 401 && token && !isPublicAuthRequest) {
        authService.logout();
        router.navigate(['/auth']);
      }
      return throwError(() => error);
    })
  );
};
