import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesignerService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  getDesigners(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/designers`);
  }

  getProductsByDesigner(designerName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products/designer/${designerName}`);
  }
}