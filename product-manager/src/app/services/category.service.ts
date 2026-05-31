import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private url = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  buscarPorId(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.url}/${id}`);
  }

  criar(categoria: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.url, categoria);
  }

  remover(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }
}
