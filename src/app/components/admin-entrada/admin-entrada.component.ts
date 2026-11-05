import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntradaProdutoService } from '../../services/entradaproduto/entradaproduto.service';
import { ItemService } from '../../services/item/item.service';
import { EntradaProduto, EntradaProdutoCreate } from '../../models/entrada-produto';
import { Item } from '../../models/item';

@Component({
  selector: 'app-admin-entrada',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './admin-entrada.component.html',
  styleUrls: ['./admin-entrada.component.css']
})
export class AdminentradaComponent implements OnInit {
  entrada: EntradaProduto[] = [];
  produtos: Item[] = [];
  carregando = true;
  erro = '';
  sucesso = '';

  // Formulário
  formData: EntradaProdutoCreate = {
    idItem: 0,
    dataEntrada: '',
    quantidadeEntrada: 0,
    valorUnitarioEntrada: 0
  };

  constructor(
    private entradaervice: EntradaProdutoService,
    private itemService: ItemService
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.carregando = true;
    
    // Carrega produtos (apenas produtos, não serviços)
    this.itemService.listarAtivos().subscribe({
      next: (itens) => {
        this.produtos = itens.filter(i => i.tipoItem === 'P');
      },
      error: (err: any) => {
        this.erro = 'Erro ao carregar produtos: ' + (err.message || err);
      }
    });

    // Carrega histórico de entrada
    this.entradaervice.listar().subscribe({
      next: (entrada) => {
        this.entrada = entrada.sort((a, b) => 
          new Date(b.dataEntrada).getTime() - new Date(a.dataEntrada).getTime()
        );
        this.carregando = false;
      },
      error: (err: any) => {
        this.erro = 'Erro ao carregar entrada: ' + (err.message || err);
        this.carregando = false;
      }
    });
  }

    registrarEntrada() {
    // 1. Limpeza e conversão robusta (troca vírgula por ponto se o usuário digitar errado)
    const qtdStr = String(this.formData.quantidadeEntrada).replace(',', '.');
    const vlrStr = String(this.formData.valorUnitarioEntrada).replace(',', '.');

    const quantidade = Math.floor(Number(qtdStr)); // Garante que seja número inteiro
    const valorUnitario = Number(vlrStr);

    // 2. Validações
    if (!this.formData.idItem) {
      this.erro = 'Selecione um produto.';
      return;
    }

    if (isNaN(quantidade) || quantidade <= 0) {
      this.erro = 'A quantidade deve ser um número inteiro maior que zero.';
      return;
    }

    if (isNaN(valorUnitario) || valorUnitario <= 0) {
      this.erro = 'O valor unitário deve ser maior que zero.';
      return;
    }

    if (!this.formData.dataEntrada) {
      this.formData.dataEntrada = new Date().toISOString().split('T')[0];
    }

    this.erro = '';
    this.carregando = true;

    // 3. Monta o objeto final
    const entradaParaEnviar = {
      idItem: Number(this.formData.idItem),
      dataEntrada: this.formData.dataEntrada,
      quantidadeEntrada: quantidade,
      valorUnitarioEntrada: valorUnitario
    };

    // 🔍 DEBUG CRÍTICO: Isso vai mostrar o JSON EXATO no console do navegador
    console.log('📤 JSON EXATO enviado ao backend:', JSON.stringify(entradaParaEnviar, null, 2));

    this.entradaervice.cadastrar(entradaParaEnviar).subscribe({
      next: () => {
        this.sucesso = 'Entrada registrada com sucesso! Estoque atualizado automaticamente.';
        this.limparFormulario();
        this.carregarDados();
        
        setTimeout(() => {
          this.sucesso = '';
        }, 4000);
      },
      error: (err: any) => {
        this.erro = 'Erro ao registrar entrada: ' + (err.error || err.message);
        this.carregando = false;
      }
    });
  }

  limparFormulario() {
    this.formData = {
      idItem: 0,
      dataEntrada: '',
      quantidadeEntrada: 0,
      valorUnitarioEntrada: 0
    };
  }

  getNomeProduto(idItem: number): string {
    const produto = this.produtos.find(p => p.idItem === idItem);
    return produto ? produto.item : `Produto #${idItem}`;
  }
}