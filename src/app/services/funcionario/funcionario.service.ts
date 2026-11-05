import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Funcionario, FuncionarioCreate, FuncionarioUpdate } from '../../models/funcionario';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  
  private apiUrl = 'http://localhost:5083/api/funcionarios';

  constructor(private http: HttpClient) { }

  listarFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  
  consultarFuncionarioPorId(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

 
  cadastrarFuncionario(funcionario: FuncionarioCreate): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.apiUrl, funcionario).pipe(
      catchError(this.handleError)
    );
  }

 
  atualizarFuncionario(id: number, funcionario: FuncionarioUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, funcionario).pipe(
      catchError(this.handleError)
    );
  }

  
  inativarFuncionario(id: number): Observable<void> {
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
    
    console.error('FuncionarioService - Erro:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}