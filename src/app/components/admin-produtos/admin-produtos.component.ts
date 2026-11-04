import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../services/item/item.service';
import { CategoriaService } from '../../services/categoria/categoria.service';
import { Item } from '../../models/item';
import { Categoria } from '../../models/categoria';

@Component({
  selector: 'app-admin-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './admin-produtos.component.html',
  styleUrls: ['./admin-produtos.component.css']
})
export class AdminProdutosComponent implements OnInit {
  itens: Item[] = [];
  itensFiltrados: Item[] = [];
  categorias: Categoria[] = [];
  
  carregando = true;
  erro = '';
  
  // Filtros
  termoBusca = '';
  filtroTipo = 'Todos'; // Todos, P, S
  filtroCategoria = 0; // 0 = Todas

  // Modal de Edição/Criação
  modalAberto = false;
  modoEdicao = false;
  
  formData: any = {
    idItem: 0,
    item: '',
    descricaoItem: '',
    preco: 0,
    tipoItem: 'P',
    idCategoria: 0,
    ativo: true
  };

  constructor(
    private itemService: ItemService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.carregando = true;
    
    this.categoriaService.listar().subscribe({
      next: (cats) => this.categorias = cats,
      error: () => this.erro = 'Erro ao carregar categorias.'
    });

    // Mantido como você escreveu (listarAtivos)
    this.itemService.listarAtivos().subscribe({
      next: (itens) => {
        this.itens = itens;
        this.aplicarFiltros();
        this.carregando = false;
      },
      error: (err: any) => { // ✅ CORRIGIDO: Adicionado ': any'
        this.erro = 'Erro ao carregar itens: ' + (err.message || err);
        this.carregando = false;
      }
    });
  }

  aplicarFiltros() {
    this.itensFiltrados = this.itens.filter(i => {
      const matchBusca = i.item.toLowerCase().includes(this.termoBusca.toLowerCase()) || 
                         i.descricaoItem.toLowerCase().includes(this.termoBusca.toLowerCase());
      const matchTipo = this.filtroTipo === 'Todos' || i.tipoItem === this.filtroTipo;
      const matchCategoria = this.filtroCategoria === 0 || i.idCategoria === this.filtroCategoria;
      
      return matchBusca && matchTipo && matchCategoria;
    });
  }

  abrirModal(item?: Item) {
    if (item) {
      this.modoEdicao = true;
      this.formData = { ...item };
    } else {
      this.modoEdicao = false;
      this.formData = {
        idItem: 0, item: '', descricaoItem: '', preco: 0, 
        tipoItem: 'P', idCategoria: this.categorias[0]?.idCategoria || 0, ativo: true
      };
    }
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  salvarItem() {
    if (!this.formData.item.trim() || this.formData.preco <= 0) {
      alert('Preencha o nome e um preço válido.');
      return;
    }

    if (this.modoEdicao) {
      this.itemService.atualizar(this.formData.idItem, this.formData).subscribe({
        next: () => {
          alert('Item atualizado com sucesso!');
          this.fecharModal();
          this.carregarDados();
        },
        error: (err: any) => alert('Erro ao atualizar: ' + (err.error || err.message)) // ✅ CORRIGIDO: Adicionado ': any'
      });
    } else {
      alert('Funcionalidade de cadastro pode ser adicionada aqui seguindo o mesmo padrão.');
      this.fecharModal();
    }
  }

  toggleAtivo(item: Item) {
    const acao = item.ativo ? 'INATIVAR' : 'ATIVAR';
    if (confirm(`Deseja realmente ${acao} o item "${item.item}"?`)) {
      const novoStatus = !item.ativo;
      
      this.itemService.atualizar(item.idItem, { ...item, ativo: novoStatus }).subscribe({
        next: () => this.carregarDados(),
        error: (err: any) => alert('Erro ao alterar status: ' + (err.error || err.message)) // ✅ CORRIGIDO: Adicionado ': any'
      });
    }
  }

  getTipoLabel(tipo: string): string {
    return tipo === 'P' ? 'Produto' : 'Serviço';
  }
}