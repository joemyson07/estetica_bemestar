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
  filtroTipo = 'Todos'; 
  filtroCategoria = 0; 

  modalCategoriaAberto = false;
  novaCategoriaNome = '';
  salvandoCategoria = false;

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
    ativo: true,
    codigoPreco: 2,      
    unidade: 'UN' 
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
      error: (err: any) => { 
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

  abrirModalCategoria() {
    this.novaCategoriaNome = '';
    this.modalCategoriaAberto = true;
  }

  fecharModalCategoria() {
    this.modalCategoriaAberto = false;
    this.novaCategoriaNome = '';
  }

  salvarCategoria() {
    if (!this.novaCategoriaNome.trim()) {
      alert('Informe o nome da categoria.');
      return;
    }
    this.salvandoCategoria = true;

    // Chama o service para cadastrar
    this.categoriaService.cadastrar({ categoria: this.novaCategoriaNome.trim() }).subscribe({
      next: (categoriaCriada) => {
        // Recarrega as categorias para incluir a nova
        this.categoriaService.listar().subscribe({
          next: (cats) => {
            this.categorias = cats;
            // Seleciona automaticamente a nova categoria
            this.formData.idCategoria = categoriaCriada.idcategoria;
            this.fecharModalCategoria();
            this.salvandoCategoria = false;
            alert('Categoria criada com sucesso!');
          }
        });
      },
      error: (err: any) => {
        alert('Erro ao criar categoria: ' + (err.error || err.message));
        this.salvandoCategoria = false;
      }
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
        error: (err: any) => alert('Erro ao atualizar: ' + (err.error || err.message)) 
      });
    } else {
      this.itemService.cadastrar(this.formData).subscribe({
        next: () => {
          alert('Item cadastrado com sucesso!');
          this.fecharModal();
          this.carregarDados(); // Recarrega a tabela para mostrar o novo item
        },
        error: (err: any) => {
          alert('Erro ao cadastrar: ' + (err.error || err.message));
        }
      });
    }
  }

  toggleAtivo(item: Item) {
    const acao = item.ativo ? 'INATIVAR' : 'ATIVAR';
    if (confirm(`Deseja realmente ${acao} o item "${item.item}"?`)) {
      const novoStatus = !item.ativo;
      
      this.itemService.atualizar(item.idItem, { ...item, ativo: novoStatus }).subscribe({
        next: () => this.carregarDados(),
        error: (err: any) => alert('Erro ao alterar status: ' + (err.error || err.message)) 
      });
    }
  }

  getTipoLabel(tipo: string): string {
    return tipo === 'P' ? 'Produto' : 'Serviço';
  }
}