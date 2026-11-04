import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { PedidoService } from '../../services/pedido/pedido.service';
import { Pedido } from '../../models/pedido';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe],
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
    const idSalvo = localStorage.getItem('idPessoa'); // ✅ Corrigido
    if (idSalvo) {
      this.idCliente = Number(idSalvo);
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
          this.exibirMensagemSucesso('Nenhum pedido encontrado.');
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
      this.pedidoSelecionado = null; // Fecha se já estiver aberto
    } else {
      this.pedidoService.consultarPedidoPorId(pedido.idPedido!).subscribe({
        next: (pedidoDetalhado) => {
          this.pedidoSelecionado = pedidoDetalhado;
        },
        error: (erro) => this.exibirMensagemErro(erro)
      });
    }
  }

  // ✅ NOVO: Cancelar Pedido
  cancelarPedido(id: number, event: Event): void {
    event.stopPropagation(); // Evita que o clique abra os detalhes do pedido
    
    if (confirm('Tem certeza que deseja CANCELAR este pedido? Esta ação não pode ser desfeita.')) {
      this.pedidoService.cancelarPedido(id).subscribe({
        next: () => {
          this.exibirMensagemSucesso('Pedido cancelado com sucesso!');
          this.pedidoSelecionado = null;
          this.carregarPedidos(); // Recarrega a lista com o status atualizado
        },
        error: (erro) => this.exibirMensagemErro(erro)
      });
    }
  }

  // ✅ NOVO: Excluir Pedido (Opcional, use apenas se o PDF exigir exclusão física)
  excluirPedido(id: number, event: Event): void {
    event.stopPropagation();
    
    if (confirm('ATENÇÃO: Isso apagará o pedido permanentemente do sistema. Continuar?')) {
      this.pedidoService.excluirPedido(id).subscribe({
        next: () => {
          this.exibirMensagemSucesso('Pedido excluído permanentemente.');
          this.pedidoSelecionado = null;
          this.carregarPedidos();
        },
        error: (erro) => this.exibirMensagemErro(erro)
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

  // ✅ NOVO: Método de sucesso (para padronizar com o erro)
  exibirMensagemSucesso(msg: string): void {
    this.mensagem = msg;
    this.tipoMensagem = 'sucesso';
    this.exibirMensagem = true;
    setTimeout(() => this.exibirMensagem = false, 3000);
  }

  exibirMensagemErro(msg: string): void {
    this.mensagem = typeof msg === 'string' ? msg : 'Ocorreu um erro inesperado.';
    this.tipoMensagem = 'erro';
    this.exibirMensagem = true;
    setTimeout(() => this.exibirMensagem = false, 4000);
  }
}