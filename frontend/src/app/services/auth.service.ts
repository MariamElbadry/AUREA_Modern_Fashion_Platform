import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeUser();
  }

  private initializeUser(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem('authToken');
      if (storedUser && storedToken) {
        try {
          this.currentUserSubject.next(JSON.parse(storedUser));
        } catch (e) {
          this.logout();
        }
      }
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token && response.user) {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}
