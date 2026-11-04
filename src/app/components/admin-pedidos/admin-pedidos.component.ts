import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../services/pedido/pedido.service';
import { Pedido } from '../../models/pedido';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe],
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.css']
})
export class AdminPedidosComponent implements OnInit {
  todosPedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  pedidoSelecionado: Pedido | null = null;
  
  statusFiltro: string = 'Todos';
  carregando = true;
  erro = '';
  processandoStatus = false;

  statusDisponiveis = ['Todos', 'Aberto', 'Em processamento', 'Concluído', 'Cancelado'];

  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    this.carregarPedidos();
  }

  carregarPedidos() {
    this.carregando = true;
    this.pedidoService.listarPedidos().subscribe({
      next: (pedidos) => {
        // Ordena do mais recente para o mais antigo
        this.todosPedidos = pedidos.sort((a, b) => {
          const dataA = a.dataPedido ? new Date(a.dataPedido).getTime() : 0;
          const dataB = b.dataPedido ? new Date(b.dataPedido).getTime() : 0;
          return dataB - dataA;
        });
        this.aplicarFiltro();
        this.carregando = false;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar pedidos: ' + (err.message || err);
        this.carregando = false;
      }
    });
  }

  aplicarFiltro() {
    if (this.statusFiltro === 'Todos') {
      this.pedidosFiltrados = this.todosPedidos;
    } else {
      this.pedidosFiltrados = this.todosPedidos.filter(
        p => p.status?.toLowerCase() === this.statusFiltro.toLowerCase()
      );
    }
    this.pedidoSelecionado = null; // Reseta a seleção ao filtrar
  }

  selecionarPedido(pedido: Pedido) {
    if (this.pedidoSelecionado?.idPedido === pedido.idPedido) {
      this.pedidoSelecionado = null; // Fecha se já estiver aberto
    } else {
      // Busca detalhes completos do pedido (com itens)
      this.pedidoService.consultarPedidoPorId(pedido.idPedido!).subscribe({
        next: (detalhes) => {
          this.pedidoSelecionado = detalhes;
        },
        error: (err) => {
          alert('Erro ao carregar detalhes: ' + (err.message || err));
        }
      });
    }
  }

  alterarStatus(id: number, novoStatus: string, event: Event) {
    event.stopPropagation(); // Evita abrir/fechar o card ao clicar no botão
    
    if (!confirm(`Deseja alterar o status do pedido #${id} para "${novoStatus}"?`)) {
      return;
    }

    this.processandoStatus = true;
    this.pedidoService.atualizarStatus(id, novoStatus).subscribe({
      next: () => {
        alert('Status atualizado com sucesso!');
        this.processandoStatus = false;
        this.pedidoSelecionado = null;
        this.carregarPedidos(); // Recarrega para refletir a mudança
      },
      error: (err) => {
        alert('Erro ao atualizar: ' + (err.error || err.message));
        this.processandoStatus = false;
      }
    });
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
}