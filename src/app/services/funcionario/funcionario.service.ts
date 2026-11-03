import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Funcionario, FuncionarioCreate, FuncionarioUpdate } from '../../models/funcionario';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  
  // ⚠️ ATENÇÃO: Verifique se a porta (5083) é a mesma que o seu backend .NET está usando no launchSettings.json
  private apiUrl = 'http://localhost:5083/api/funcionarios';

  constructor(private http: HttpClient) { }

  /**
   * RF04 / RF09: Listar todos os funcionários ativos
   */
  listarFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * RF09: Consultar um funcionário específico por ID
   */
  consultarFuncionarioPorId(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * RF04: Cadastrar um novo funcionário (Cria Pessoa + Endereco + Funcionario)
   */
  cadastrarFuncionario(funcionario: FuncionarioCreate): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.apiUrl, funcionario).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * RF04: Atualizar dados do funcionário
   */
  atualizarFuncionario(id: number, funcionario: FuncionarioUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, funcionario).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * RF04: Inativar funcionário (Soft Delete no backend)
   */
  inativarFuncionario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Tratamento padronizado de erros da API (RF22)
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido na comunicação com o servidor.';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente (ex: rede caiu)
      errorMessage = `Erro no cliente: ${error.error.message}`;
    } else {
      // Erro retornado pelo backend (ex: 400, 404, 409, 500)
      errorMessage = `Erro do servidor (Código: ${error.status})`;
      
      // Tenta extrair a mensagem de erro enviada pelo .NET (ex: "Já existe uma pessoa com este CPF")
      if (typeof error.error === 'string') {
        errorMessage += `\nDetalhe: ${error.error}`;
      } else if (error.error && error.error.message) {
        errorMessage += `\nDetalhe: ${error.error.message}`;
      } else if (error.error && error.error.title) {
         // Formato padrão de erro do .NET ProblemDetails
        errorMessage += `\nDetalhe: ${error.error.title}`;
      }
    }
    
    console.error('FuncionarioService - Erro:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}