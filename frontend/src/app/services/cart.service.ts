import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = '/api/cart';
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshCount();
  }

  refreshCount(): void {
    this.getCart().subscribe({ next: (cart: any) => {
      const count = cart.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0;
      this.cartCountSubject.next(count);
    }, error: () => {} });
  }

  getCart(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addToCart(item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, item).pipe(
      tap((cart: any) => {
        const count = cart.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0;
        this.cartCountSubject.next(count);
      })
    );
  }

  updateQuantity(productId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, { productId, quantity }).pipe(
      tap((cart: any) => {
        const count = cart.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0;
        this.cartCountSubject.next(count);
      })
    );
  }

  removeItem(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${productId}`).pipe(
      tap((cart: any) => {
        const count = cart.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0;
        this.cartCountSubject.next(count);
      })
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`).pipe(
      tap(() => this.cartCountSubject.next(0))
    );
  }
}