import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EntradaProduto, EntradaProdutoCreate } from '../../models/entrada-produto';

@Injectable({ providedIn: 'root' })
export class EntradaProdutoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5083/api/EntradaProdutos';

  listar(): Observable<EntradaProduto[]> {
    return this.http.get<EntradaProduto[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  cadastrar(entrada: EntradaProdutoCreate): Observable<any> {
    return this.http.post(this.apiUrl, entrada).pipe(
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
    console.error('EntradaProdutoService - Erro:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}