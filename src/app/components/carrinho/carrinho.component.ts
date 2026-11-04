import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho/carrinho.service';
import { PedidoService } from '../../services/pedido/pedido.service';
import { PessoaService } from '../../services/pessoas/pessoas.service'; // ✅ ADICIONAR
import { Pedido, ItemPedido } from '../../models/pedido';
import { Subscription, firstValueFrom } from 'rxjs'; // ✅ ADICIONAR firstValueFrom

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
  
  // ✅ NOVOS: Controle do modal de identificação
  mostrarModalIdentificacao: boolean = false;
  emailIdentificacao: string = '';
  cpfIdentificacao: string = '';
  erroIdentificacao: string = '';
  processando: boolean = false;
  
  private subscription: Subscription = new Subscription();

  constructor(
    private carrinhoService: CarrinhoService,
    private pedidoService: PedidoService,
    private pessoaService: PessoaService, // ✅ ADICIONAR
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

  // ✅ CORRIGIDO: Usar as chaves corretas do localStorage
  private carregarCliente(): void {
    const idSalvo = localStorage.getItem('idPessoa'); // ✅ MUDOU de 'clienteAtual'
    if (idSalvo) {
      this.idCliente = Number(idSalvo);
      console.log('✅ Cliente carregado do localStorage:', this.idCliente);
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

  // ✅ CORRIGIDO: Adicionar modal de identificação
  async confirmarPedido(): Promise<void> {
    if (this.itens.length === 0) {
      this.exibirMensagemErro('O carrinho está vazio.');
      return;
    }

    // ✅ Se não tem cliente identificado, abre o modal (em vez de redirecionar para /cadastro)
    if (!this.idCliente) {
      this.mostrarModalIdentificacao = true;
      this.erroIdentificacao = '';
      return;
    }

    // Validação de estoque
    for (const itemCarrinho of this.itens) {
      if (itemCarrinho.item.tipoItem === 'P') {
        const estoque = itemCarrinho.item.quantidadeEstoque ?? 0;
        if (itemCarrinho.quantidade > estoque) {
          this.exibirMensagemErro(`Estoque insuficiente para "${itemCarrinho.item.item}". Disponível: ${estoque}`);
          return;
        }
      }
    }

    // Monta o pedido
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

    console.log('📤 Enviando pedido:', pedido);

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
        console.error('❌ Erro ao criar pedido:', erro);
        this.exibirMensagemErro(erro.error || erro.message || 'Erro ao criar pedido');
      }
    });
  }

  // ✅ NOVOS: Métodos do modal de identificação
  async identificarCliente(): Promise<void> {
    this.erroIdentificacao = '';
    
    const cpfLimpo = this.cpfIdentificacao.replace(/\D/g, '');
    const emailLimpo = this.emailIdentificacao.trim().toLowerCase();

    if (!emailLimpo || !cpfLimpo) {
      this.erroIdentificacao = 'Preencha email e CPF.';
      return;
    }

    this.processando = true;

    try {
      const cliente = await firstValueFrom(
        this.pessoaService.login(emailLimpo, cpfLimpo)
      );
      
      localStorage.setItem('idPessoa', String(cliente.idPessoa));
      localStorage.setItem('nomeCliente', cliente.nome);
      
      this.idCliente = cliente.idPessoa;
      this.mostrarModalIdentificacao = false;
      
      // Continua com o pedido
      await this.confirmarPedido();
      
    } catch (err: any) {
      this.erroIdentificacao = err.error || 'Email ou CPF inválidos.';
    } finally {
      this.processando = false;
    }
  }

  fecharModal(): void {
    this.mostrarModalIdentificacao = false;
    this.emailIdentificacao = '';
    this.cpfIdentificacao = '';
    this.erroIdentificacao = '';
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