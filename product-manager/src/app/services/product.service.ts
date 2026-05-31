import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private url = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // GET — público (sem token)
  listar(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }

  buscarPorId(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  // POST/PUT/DELETE — token adicionado automaticamente pelo interceptor
  criar(produto: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.url, produto);
  }

  atualizar(id: string, produto: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${id}`, produto);
  }

  remover(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }
}
