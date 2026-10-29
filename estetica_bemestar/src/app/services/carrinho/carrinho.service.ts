import { Injectable } from '@angular/core';
import { Item } from '../../models/item'; // Ajuste o caminho se seu model estiver em outro lugar
import { BehaviorSubject } from 'rxjs';

export interface ItemCarrinho {
  item: Item;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private itens: ItemCarrinho[] = [];
  private itensSubject = new BehaviorSubject<ItemCarrinho[]>([]);
  itens$ = this.itensSubject.asObservable();

  constructor() {}

  adicionarItem(item: Item, quantidade: number = 1): string | null {
    // Validação de estoque para produtos (tipoItem === 'P')
    if (item.tipoItem === 'P') {
      const estoque = item.quantidadeEstoque ?? 0;
      if (quantidade > estoque) {
        return `Estoque insuficiente. Disponível: ${estoque}`;
      }
      if (estoque === 0) {
        return 'Produto indisponível no estoque.';
      }
    }

    const existente = this.itens.find(i => i.item.idItem === item.idItem);
    if (existente) {
      const novaQtd = existente.quantidade + quantidade;
      const estoque = item.quantidadeEstoque ?? 0;
      
      if (item.tipoItem === 'P' && novaQtd > estoque) {
        return `Quantidade máxima em estoque: ${estoque}`;
      }
      existente.quantidade = novaQtd;
      existente.valorTotal = existente.quantidade * existente.valorUnitario;
    } else {
      this.itens.push({
        item,
        quantidade,
        valorUnitario: item.preco,
        valorTotal: quantidade * item.preco
      });
    }
    this.atualizarSubject();
    return null;
  }

  alterarQuantidade(idItem: number, quantidade: number): string | null {
    const itemCarrinho = this.itens.find(i => i.item.idItem === idItem);
    if (!itemCarrinho) return 'Item não encontrado no carrinho.';

    if (quantidade <= 0) {
      this.removerItem(idItem);
      return null;
    }

    const estoque = itemCarrinho.item.quantidadeEstoque ?? 0;
    if (itemCarrinho.item.tipoItem === 'P' && quantidade > estoque) {
      return `Estoque insuficiente. Máximo: ${estoque}`;
    }

    itemCarrinho.quantidade = quantidade;
    itemCarrinho.valorTotal = quantidade * itemCarrinho.valorUnitario;
    this.atualizarSubject();
    return null;
  }

  removerItem(idItem: number): void {
    this.itens = this.itens.filter(i => i.item.idItem !== idItem);
    this.atualizarSubject();
  }

  limparCarrinho(): void {
    this.itens = [];
    this.atualizarSubject();
  }

  getItens(): ItemCarrinho[] {
    return this.itens;
  }

  getValorTotal(): number {
    return this.itens.reduce((total, item) => total + item.valorTotal, 0);
  }

  getQuantidadeTotal(): number {
    return this.itens.reduce((total, item) => total + item.quantidade, 0);
  }

  private atualizarSubject(): void {
    this.itensSubject.next([...this.itens]);
  }
}