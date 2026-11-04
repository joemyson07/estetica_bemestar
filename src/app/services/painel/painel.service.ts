import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PainelResumo } from '../../models/painel';

@Injectable({
  providedIn: 'root'
})
export class PainelService {

  // ⚠️ Ajuste a porta se necessário (5083 é a que seu backend está rodando)
  private apiUrl = 'http://localhost:5083/api/painel/resumo';

  constructor(private http: HttpClient) { }

  /**
   * RF24: Exibir no painel administrativo informações resumidas sobre 
   * clientes, produtos, serviços, pedidos e estoque
   */
  getResumo(): Observable<PainelResumo> {
    return this.http.get<PainelResumo>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Tratamento padronizado de erros da API (RF22)
   */
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

    console.error('PainelService - Erro:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}