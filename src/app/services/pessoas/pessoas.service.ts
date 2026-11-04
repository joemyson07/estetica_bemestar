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
  
  // ⚠️ Ajuste a porta se necessário (5083 é a padrão do seu backend)
  private apiUrl = 'http://localhost:5083/api/pessoas';

  constructor() { }

  // ==========================================
  // MÉTODO ESSENCIAL PARA O CARRINHO FUNCIONAR
  // ==========================================
  /**
   * Valida email e CPF e retorna os dados do cliente
   * Usado no modal de identificação do carrinho
   */
  login(email: string, cpf: string): Observable<Pessoa> {
    return this.http.post<Pessoa>(`${this.apiUrl}/login`, { email, cpf }).pipe(
      catchError(this.handleError)
    );
  }

  // ==========================================
  // MÉTODOS DE CRUD (Loja e Painel Admin)
  // ==========================================

  /**
   * RF04 / RF09: Listar todos os clientes
   */
  getAll(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * RF04 / RF09: Consultar cliente por ID
   */
  getById(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * RF04: Cadastrar novo cliente
   */
  cadastrar(pessoa: PessoaCreate): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.apiUrl, pessoa).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * RF04: Atualizar dados do cliente
   */
  atualizar(id: number, pessoa: PessoaUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, pessoa).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * RF04: Inativar cliente (Soft Delete)
   */
  inativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ==========================================
  // TRATAMENTO DE ERROS (RF22)
  // ==========================================
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