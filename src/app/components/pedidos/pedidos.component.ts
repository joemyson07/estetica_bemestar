import { Router } from '@angular/router'; 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../services/pedido/pedido.service';
import { PessoaService } from '../../services/pessoas/pessoas.service';
import { Pedido } from '../../models/pedido';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  pedidoSelecionado?: Pedido;
  carregando = true;
  erro = '';
  
  // Controle de identificação do cliente
  clienteIdentificado = false;
  nomeCliente = '';
  idPessoa = 0;
  
  // Formulário de identificação
  emailIdentificacao = '';
  cpfIdentificacao = '';
  erroIdentificacao = '';

  constructor(
    private pedidoService: PedidoService,
    private pessoaService: PessoaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.verificarCliente();
  }

  verificarCliente() {
    const idSalvo = localStorage.getItem('idPessoa');
    const nomeSalvo = localStorage.getItem('nomeCliente');

    if (idSalvo && nomeSalvo) {
      this.idPessoa = Number(idSalvo);
      this.nomeCliente = nomeSalvo;
      this.clienteIdentificado = true;
      this.carregarPedidos();
    } else {
      this.carregando = false;
    }
  }

  async identificarCliente() {
    this.erroIdentificacao = '';
    
    if (!this.emailIdentificacao || !this.cpfIdentificacao) {
      this.erroIdentificacao = 'Preencha email e CPF.';
      return;
    }

    try {
      const cliente = await firstValueFrom(
        this.pessoaService.login(this.emailIdentificacao, this.cpfIdentificacao)
      );
      
      localStorage.setItem('idPessoa', String(cliente.idPessoa));
      localStorage.setItem('nomeCliente', cliente.nome);
      
      this.idPessoa = cliente.idPessoa;
      this.nomeCliente = cliente.nome;
      this.clienteIdentificado = true;
      this.carregarPedidos();
    } catch (err: any) {
      this.erroIdentificacao = err.error || 'Email ou CPF inválidos.';
    }
  }

  sairConta() {
    localStorage.removeItem('idPessoa');
    localStorage.removeItem('nomeCliente');
    this.clienteIdentificado = false;
    this.idPessoa = 0;
    this.nomeCliente = '';
    this.pedidos = [];
    this.pedidoSelecionado = undefined;
  }

  carregarPedidos() {
    this.carregando = true;
    this.pedidoService.consultarPedidosPorCliente(this.idPessoa).subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.carregando = false;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar pedidos: ' + err.message;
        this.carregando = false;
      }
    });
  }

  selecionarPedido(pedido: Pedido) {
    this.pedidoSelecionado = pedido;
  }

  voltarParaLista() {
    this.pedidoSelecionado = undefined;
  }

  // Adicione estes métodos dentro da classe PedidosComponent:

voltarCatalogo() {
  this.router.navigate(['/home']);
}

getStatusClass(status: string): string {
  switch (status) {
    case 'Aberto': return 'status-aberto';
    case 'Em processamento': return 'status-processando';
    case 'Concluído': return 'status-concluido';
    case 'Cancelado': return 'status-cancelado';
    default: return '';
  }
}
}