import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstoqueService } from '../../services/estoque/estoque.service';
import { Estoque } from '../../models/estoque';

@Component({
  selector: 'app-admin-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './admin-estoque.component.html',
  styleUrls: ['./admin-estoque.component.css']
})
export class AdminEstoqueComponent implements OnInit {
  estoques: Estoque[] = [];
  estoquesFiltrados: Estoque[] = [];
  carregando = true;
  erro = '';
  
  // Busca
  termoBusca = '';
  buscaId: number | null = null;

  constructor(private estoqueService: EstoqueService) {}

  ngOnInit() {
    this.carregarEstoque();
  }

  carregarEstoque() {
    this.carregando = true;
    this.estoqueService.listar().subscribe({
      next: (estoques) => {
        this.estoques = estoques;
        this.aplicarFiltros();
        this.carregando = false;
      },
      error: (err: any) => {
        this.erro = 'Erro ao carregar estoque: ' + (err.message || err);
        this.carregando = false;
      }
    });
  }

  aplicarFiltros() {
    this.estoquesFiltrados = this.estoques.filter(e => {
      const matchBusca = this.termoBusca === '' || 
                         e.nomeItem.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
                         (e.categoria && e.categoria.toLowerCase().includes(this.termoBusca.toLowerCase()));
      
      const matchId = this.buscaId === null || e.idItem === this.buscaId;
      
      return matchBusca && matchId;
    });
  }

  buscarPorId() {
    if (this.buscaId === null || this.buscaId <= 0) {
      this.buscaId = null;
      this.aplicarFiltros();
      return;
    }

    this.estoqueService.consultarPorId(this.buscaId).subscribe({
      next: (estoque) => {
        // Se encontrou, mostra apenas esse item
        this.estoquesFiltrados = [estoque];
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.erro = `Nenhum item encontrado com ID ${this.buscaId}.`;
          this.estoquesFiltrados = [];
        } else {
          this.erro = 'Erro ao buscar item: ' + (err.message || err);
        }
      }
    });
  }

  limparBuscaId() {
    this.buscaId = null;
    this.aplicarFiltros();
  }

  getEstoqueBaixo(quantidade: number): boolean {
    return quantidade <= 5; // Considera estoque baixo quando <= 5 unidades
  }

  getStatusTexto(estoque: Estoque): string {
    if (!estoque.ativo) return 'Inativo';
    if (estoque.quantidadeEstoque === 0) return 'Sem Estoque';
    if (this.getEstoqueBaixo(estoque.quantidadeEstoque)) return 'Estoque Baixo';
    return 'Disponível';
  }

  getStatusClass(estoque: Estoque): string {
    if (!estoque.ativo) return 'status-inativo';
    if (estoque.quantidadeEstoque === 0) return 'status-sem-estoque';
    if (this.getEstoqueBaixo(estoque.quantidadeEstoque)) return 'status-baixo';
    return 'status-disponivel';
  }
}