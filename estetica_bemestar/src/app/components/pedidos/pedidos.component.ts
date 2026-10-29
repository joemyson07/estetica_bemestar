import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from '../../services/pedido/pedido.service';
import { Pedido } from '../../models/pedido';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  pedidoSelecionado: Pedido | null = null;
  mensagem: string = '';
  tipoMensagem: 'sucesso' | 'erro' = 'erro';
  exibirMensagem: boolean = false;
  idCliente: number | null = null;
  carregando: boolean = false;

  constructor(
    private pedidoService: PedidoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarCliente();
    this.carregarPedidos();
  }

  private carregarCliente(): void {
    const clienteSalvo = localStorage.getItem('clienteAtual');
    if (clienteSalvo) {
      const cliente = JSON.parse(clienteSalvo);
      this.idCliente = cliente.idPessoa;
    }
  }

  carregarPedidos(): void {
    if (!this.idCliente) {
      this.exibirMensagemErro('Cliente não identificado. Faça o cadastro primeiro.');
      return;
    }

    this.carregando = true;
    this.pedidoService.consultarPedidosPorCliente(this.idCliente).subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.carregando = false;
        if (pedidos.length === 0) {
          this.mensagem = 'Nenhum pedido encontrado.';
          this.tipoMensagem = 'sucesso';
          this.exibirMensagem = true;
          setTimeout(() => this.exibirMensagem = false, 3000);
        }
      },
      error: (erro) => {
        this.carregando = false;
        this.exibirMensagemErro(erro);
      }
    });
  }

  selecionarPedido(pedido: Pedido): void {
    if (this.pedidoSelecionado?.idPedido === pedido.idPedido) {
      this.pedidoSelecionado = null;
    } else {
      this.pedidoService.consultarPedidoPorId(pedido.idPedido!).subscribe({
        next: (pedidoDetalhado) => {
          this.pedidoSelecionado = pedidoDetalhado;
        },
        error: (erro) => {
          this.exibirMensagemErro(erro);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'aberto': return 'status-aberto';
      case 'em processamento': return 'status-processando';
      case 'concluído': return 'status-concluido';
      case 'cancelado': return 'status-cancelado';
      default: return '';
    }
  }

  voltarCatalogo(): void {
    this.router.navigate(['/home']);
  }

  exibirMensagemErro(msg: string): void {
    this.mensagem = msg;
    this.tipoMensagem = 'erro';
    this.exibirMensagem = true;
    setTimeout(() => this.exibirMensagem = false, 4000);
  }
}