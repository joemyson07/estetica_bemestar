import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ItemService } from '../../services/item/item.service';
import { CategoriaService } from '../../services/categoria/categoria.service';
import { CarrinhoService } from '../../services/carrinho/carrinho.service';
import { Item } from '../../models/item';
import { Categoria } from '../../models/categoria';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private itensService = inject(ItemService);
  private categoriasService = inject(CategoriaService);
  carrinho = inject(CarrinhoService);

  itens = signal<Item[]>([]);
  categorias = signal<Categoria[]>([]);
  busca = signal('');
  categoriaSelecionada = signal<number | null>(null); // null = todas
  carregando = signal(true);
  erro = signal('');
  aviso = signal('');

  itensFiltrados = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    const cat = this.categoriaSelecionada();

    return this.itens().filter(i =>
      (cat === null || i.idCategoria === cat) &&
      (termo === '' || i.item.toLowerCase().includes(termo))
    );
  });

  ngOnInit(): void {
    this.categoriasService.listar().subscribe({
      next: lista => this.categorias.set(lista),
      error: () => this.categorias.set([])
    });

    this.itensService.listarAtivos().subscribe({
      next: lista => {
        this.itens.set(lista);
        this.carregando.set(false);
      },
      error: err => {
        console.error(err);
        this.erro.set('Não foi possível carregar o catálogo. Verifique se a API está em execução.');
        this.carregando.set(false);
      }
    });
  }

  selecionarCategoria(id: number | null): void {
    this.categoriaSelecionada.set(id);
  }

  disponivel(item: Item): boolean {
    return item.tipoItem === 'S' || (item.quantidadeEstoque ?? 0) > 0;
  }

  textoDisponibilidade(item: Item): string {
    if (item.tipoItem === 'S') return 'Serviço disponível';
    const qtd = item.quantidadeEstoque ?? 0;
    return qtd > 0 ? `${qtd} em estoque` : 'Indisponível';
  }

  adicionar(item: Item): void {
    const ok = this.carrinho.adicionar(item);
    this.aviso.set(
      ok ? `${item.item} adicionado ao carrinho.`
         : `Quantidade máxima em estoque de ${item.item} já está no carrinho.`
    );
    setTimeout(() => this.aviso.set(''), 2500);
  }
}