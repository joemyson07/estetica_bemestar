import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Estoque } from '../../models/estoque';

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5083/api/Estoque';

  listar(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  consultarPorId(id: number): Observable<Estoque> {
    return this.http.get<Estoque>(`${this.apiUrl}/${id}`).pipe(
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
    console.error('EstoqueService - Erro:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}