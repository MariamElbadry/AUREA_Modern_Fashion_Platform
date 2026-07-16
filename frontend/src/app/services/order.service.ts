import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = '/api/orders';
  constructor(private http: HttpClient) {}

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getOrder(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  placeOrder(): Observable<any> {
    return this.http.post(this.apiUrl, {});
  }

  cancelOrder(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/cancel`, {});
  }
}