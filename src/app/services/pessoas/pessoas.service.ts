import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Pessoa, PessoaCreate, PessoaUpdate } from '../../models/pessoa';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private http = inject(HttpClient);
  
  private apiUrl = 'http://localhost:5083/api/pessoas';

  constructor() { }

 
  login(email: string, cpf: string): Observable<Pessoa> {
    return this.http.post<Pessoa>(`${this.apiUrl}/login`, { email, cpf }).pipe(
      catchError(this.handleError)
    );
  }

  getAll(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }


  getById(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  cadastrar(pessoa: PessoaCreate): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.apiUrl, pessoa).pipe(
      catchError(this.handleError)
    );
  }

  atualizar(id: number, pessoa: PessoaUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, pessoa).pipe(
      catchError(this.handleError)
    );
  }

  inativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido na comunicação com o servidor.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro no cliente: ${error.error.message}`;
    } else {
      errorMessage = `Erro do servidor (Código: ${error.status})`;

      if (typeof error.error === 'string') {
        errorMessage += `\nDetalhe: ${error.error}`;
      } else if (error.error && error.error.message) {
        errorMessage += `\nDetalhe: ${error.error.message}`;
      } else if (error.error && error.error.title) {
        errorMessage += `\nDetalhe: ${error.error.title}`;
      }
    }

    console.error('PessoaService - Erro:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}