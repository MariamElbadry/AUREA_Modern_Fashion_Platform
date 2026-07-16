import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('authToken');
  
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(cloned).pipe(
      catchError((error: any) => {
        if (error.status === 401) {
          authService.logout();
          router.navigate(['/auth']);
        }
        throw error;
      })
    );
  }
  
  return next(req).pipe(
    catchError((error: any) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/auth']);
      }
      throw error;
    })
  );
};