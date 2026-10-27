import { Injectable, computed, signal } from '@angular/core';
import { Item } from '../../models/item';

export interface ItemCarrinho {
  item: Item;
  quantidade: number;
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private _itens = signal<ItemCarrinho[]>([]);

  readonly itens = this._itens.asReadonly();
  readonly quantidadeTotal = computed(() =>
    this._itens().reduce((soma, i) => soma + i.quantidade, 0)
  );
  readonly total = computed(() =>
    this._itens().reduce((soma, i) => soma + i.item.preco * i.quantidade, 0)
  );

  // Retorna false se não puder adicionar (limite de estoque de produto)
  adicionar(item: Item): boolean {
    const atual = this._itens().find(i => i.item.idItem === item.idItem);

    if (atual) {
      if (!this.podeAumentar(atual)) return false;
      this._itens.update(lista =>
        lista.map(i => i.item.idItem === item.idItem
          ? { ...i, quantidade: i.quantidade + 1 }
          : i)
      );
      return true;
    }

    this._itens.update(lista => [...lista, { item, quantidade: 1 }]);
    return true;
  }

  alterarQuantidade(idItem: number, quantidade: number): void {
    const atual = this._itens().find(i => i.item.idItem === idItem);
    if (!atual) return;

    if (quantidade <= 0) {
      this.remover(idItem);
      return;
    }
    // serviço não tem estoque; produto respeita o estoque
    const limite = atual.item.tipoItem === 'P' ? atual.item.quantidadeEstoque ?? 0 : Infinity;
    const nova = Math.min(quantidade, limite);

    this._itens.update(lista =>
      lista.map(i => i.item.idItem === idItem ? { ...i, quantidade: nova } : i)
    );
  }

  remover(idItem: number): void {
    this._itens.update(lista => lista.filter(i => i.item.idItem !== idItem));
  }

  limpar(): void {
    this._itens.set([]);
  }

  private podeAumentar(i: ItemCarrinho): boolean {
    if (i.item.tipoItem === 'S') return true;
    return i.quantidade < (i.item.quantidadeEstoque ?? 0);
  }
}