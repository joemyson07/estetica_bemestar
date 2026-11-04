import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { firstValueFrom } from 'rxjs';

import { CarrinhoService, ItemCarrinho } from '../../services/carrinho/carrinho.service';
import { PedidoService } from '../../services/pedido/pedido.service';
import { PessoaService } from '../../services/pessoas/pessoas.service';
import { Pedido } from '../../models/pedido';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit, OnDestroy {
  itensCarrinho: ItemCarrinho[] = [];
  valorTotal: number = 0;
  processando: boolean = false;

  // Controle do modal de identificação
  mostrarModalIdentificacao: boolean = false;
  emailIdentificacao: string = '';
  cpfIdentificacao: string = '';
  erroIdentificacao: string = '';
  nomeClienteAtual: string = '';

  private subscription!: Subscription;

  constructor(
    private carrinhoService: CarrinhoService,
    private pedidoService: PedidoService,
    private pessoaService: PessoaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription = this.carrinhoService.itens$.subscribe(itens => {
      this.itensCarrinho = itens;
      this.valorTotal = this.carrinhoService.getValorTotal();
    });
    this.nomeClienteAtual = localStorage.getItem('nomeCliente') || '';
  }

  trocarCliente() {
    localStorage.removeItem('idPessoa');
    localStorage.removeItem('nomeCliente');
    this.nomeClienteAtual = '';
    this.abrirModalIdentificacao();
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // --- Ações do Carrinho ---

  alterarQuantidade(idItem: number, novaQtd: number) {
    const erro = this.carrinhoService.alterarQuantidade(idItem, novaQtd);
    if (erro) alert(erro);
  }

  removerItem(idItem: number) {
    this.carrinhoService.removerItem(idItem);
  }

  limparTudo() {
    if (confirm('Tem certeza que deseja esvaziar o carrinho?')) {
      this.carrinhoService.limparCarrinho();
    }
    }

  // --- Lógica de Checkout e Identificação ---

  async confirmarPedido() {
    if (this.itensCarrinho.length === 0) return;

    const idPessoaSalvo = localStorage.getItem('idPessoa');

    if (!idPessoaSalvo) {
      this.abrirModalIdentificacao();
    } else {
      await this.processarPedido(Number(idPessoaSalvo));
    }
  }

  async identificarEContinuar() {
    this.erroIdentificacao = '';
    
    if (!this.emailIdentificacao.trim() || !this.cpfIdentificacao.trim()) {
      this.erroIdentificacao = 'Por favor, preencha ambos os campos.';
      return;
    }

    this.processando = true;

    try {
      // Chama o endpoint de login que criamos no backend
      const cliente = await firstValueFrom(
        this.pessoaService.login(this.emailIdentificacao.trim(), this.cpfIdentificacao.trim())
      );

      // Salva no localStorage para persistir a sessão
      localStorage.setItem('idPessoa', String(cliente.idPessoa));
      localStorage.setItem('nomeCliente', cliente.nome);

      this.mostrarModalIdentificacao = false;
      await this.processarPedido(cliente.idPessoa);
      
    } catch (err: any) {
      this.erroIdentificacao = err.error || 'Email ou CPF inválidos. Verifique seus dados ou cadastre-se.';
    } finally {
      this.processando = false;
    }
  }

  abrirModalIdentificacao() {
    this.mostrarModalIdentificacao = true;
    this.erroIdentificacao = '';
    this.emailIdentificacao = '';
    this.cpfIdentificacao = '';
  }

  fecharModal() {
    this.mostrarModalIdentificacao = false;
    this.emailIdentificacao = '';
    this.cpfIdentificacao = '';
    this.erroIdentificacao = '';
  }

  private async processarPedido(idPessoa: number) {
    this.processando = true;

    // Monta o objeto Pedido conforme o DTO do backend (PedidoPostDTO)
    const pedido: Pedido = {
      idPessoa: idPessoa,
      dataPedido: new Date().toISOString(),
      status: 'Aberto',
      itens: this.itensCarrinho.map(itemCarrinho => ({
        idItem: itemCarrinho.item.idItem,
        quantidade: itemCarrinho.quantidade,
        valorUnitario: itemCarrinho.valorUnitario,
        idFuncionario: null 
      }))
    };

    try {
      const resposta = await firstValueFrom(this.pedidoService.cadastrarPedido(pedido));
      
      alert(`Pedido #${resposta.idPedido} realizado com sucesso!`);
      this.carrinhoService.limparCarrinho();
      this.router.navigate(['/meus-pedidos']);
      
    } catch (err: any) {
      const msgErro = err.error || err.message || 'Erro desconhecido ao processar o pedido.';
      alert(`Falha ao finalizar pedido:\n${msgErro}`);
    } finally {
      this.processando = false;
    }
  }
}