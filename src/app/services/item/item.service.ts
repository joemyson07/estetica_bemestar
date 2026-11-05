import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Item } from '../../models/item';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5083/api/Itens';

  listarAtivos(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}?ativo=S`).pipe(
      catchError(this.handleError)
    );
  }

  atualizar(id: number, item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, item).pipe(
      catchError(this.handleError)
    );
  }
  

  listarTodos(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  cadastrar(item: any): Observable<any> {
    return this.http.post(this.apiUrl, item).pipe(
      catchError(this.handleError)
    );
  }
  

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido no servidor.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro no cliente: ${error.error.message}`;
    } else {
      errorMessage = `Erro do servidor (Código: ${error.status})`;
      if (typeof error.error === 'string') {
        errorMessage += `\nDetalhe: ${error.error}`;
      } else if (error.error && error.error.message) {
        errorMessage += `\nDetalhe: ${error.error.message}`;
      }
    }
    console.error('ItemService - Erro:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}