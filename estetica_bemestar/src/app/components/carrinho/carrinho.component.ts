import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho/carrinho.service';
import { PedidoService } from '../../services/pedido/pedido.service';
import { Pedido, ItemPedido } from '../../models/pedido';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit, OnDestroy {
  itens: ItemCarrinho[] = [];
  valorTotal: number = 0;
  mensagem: string = '';
  tipoMensagem: 'sucesso' | 'erro' = 'erro';
  exibirMensagem: boolean = false;
  idCliente: number | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private carrinhoService: CarrinhoService,
    private pedidoService: PedidoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.carrinhoService.itens$.subscribe((itens: ItemCarrinho[]) => {
        this.itens = itens;
        this.valorTotal = this.carrinhoService.getValorTotal();
      })
    );
    this.carregarCliente();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private carregarCliente(): void {
    const clienteSalvo = localStorage.getItem('clienteAtual');
    if (clienteSalvo) {
      const cliente = JSON.parse(clienteSalvo);
      this.idCliente = cliente.idPessoa;
    }
  }

  alterarQuantidade(item: ItemCarrinho, quantidade: number): void {
    const erro = this.carrinhoService.alterarQuantidade(item.item.idItem, quantidade);
    if (erro) {
      this.exibirMensagemErro(erro);
    }
  }

  removerItem(idItem: number): void {
    this.carrinhoService.removerItem(idItem);
    this.exibirMensagemSucesso('Item removido do carrinho.');
  }

  confirmarPedido(): void {
    if (this.itens.length === 0) {
      this.exibirMensagemErro('O carrinho está vazio.');
      return;
    }

    if (!this.idCliente) {
      this.exibirMensagemErro('Cliente não identificado. Faça o cadastro primeiro.');
      this.router.navigate(['/cadastro']);
      return;
    }

    for (const itemCarrinho of this.itens) {
      if (itemCarrinho.item.tipoItem === 'P') {
        const estoque = itemCarrinho.item.quantidadeEstoque ?? 0;
        if (itemCarrinho.quantidade > estoque) {
          this.exibirMensagemErro(`Estoque insuficiente para "${itemCarrinho.item.item}". Disponível: ${estoque}`);
          return;
        }
      }
    }

    const itensPedido: ItemPedido[] = this.itens.map(i => ({
      idItem: i.item.idItem,
      nomeItem: i.item.item,
      tipoItem: i.item.tipoItem,
      quantidade: i.quantidade,
      valorUnitario: i.valorUnitario,
      valorTotal: i.valorTotal,
      estoqueDisponivel: i.item.quantidadeEstoque ?? undefined
    }));

    const pedido: Pedido = {
      idPessoa: this.idCliente,
      dataPedido: new Date().toISOString(),
      valorTotal: this.valorTotal,
      status: 'Aberto',
      itens: itensPedido
    };

    this.pedidoService.cadastrarPedido(pedido).subscribe({
      next: (pedidoCriado: any) => {
        const id = pedidoCriado.idPedido || pedidoCriado.idAtendimento;
        this.exibirMensagemSucesso(`Pedido #${id} registrado com sucesso!`);
        this.carrinhoService.limparCarrinho();
        setTimeout(() => {
          this.router.navigate(['/meus-pedidos']);
        }, 2000);
      },
      error: (erro: any) => {
        this.exibirMensagemErro(erro);
      }
    });
  }

  voltarCatalogo(): void {
    this.router.navigate(['/home']);
  }

  exibirMensagemSucesso(msg: string): void {
    this.mensagem = msg;
    this.tipoMensagem = 'sucesso';
    this.exibirMensagem = true;
    setTimeout(() => this.exibirMensagem = false, 3000);
  }

  exibirMensagemErro(msg: string): void {
    this.mensagem = msg;
    this.tipoMensagem = 'erro';
    this.exibirMensagem = true;
    setTimeout(() => this.exibirMensagem = false, 4000);
  }
}