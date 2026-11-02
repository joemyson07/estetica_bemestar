import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Pedido } from '../../models/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:5000/api/pedidos';

  constructor(private http: HttpClient) {}

  listarPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  consultarPedidoPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  cadastrarPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido).pipe(
      catchError(this.handleError)
    );
  }

  atualizarStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status }).pipe(
      catchError(this.handleError)
    );
  }

  consultarPedidosPorCliente(idPessoa: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`http://localhost:5000/api/pessoas/${idPessoa}/pedidos`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let mensagem = 'Erro desconhecido';
    if (error.error instanceof ErrorEvent) {
      mensagem = `Erro: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          mensagem = 'Dados inválidos. Verifique as informações.';
          break;
        case 404:
          mensagem = 'Pedido não encontrado.';
          break;
        case 500:
          mensagem = 'Erro no servidor. Tente novamente mais tarde.';
          break;
        default:
          mensagem = `Erro ${error.status}: ${error.message}`;
      }
    }
    console.error(mensagem);
    return throwError(() => mensagem);
  }
}