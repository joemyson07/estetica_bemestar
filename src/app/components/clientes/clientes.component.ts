import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PessoaService } from '../../services/pessoas/pessoas.service';
import { Pessoa, PessoaUpdate } from '../../models/pessoa';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Pessoa[] = [];
  carregando = true;
  erro = '';

  // Controle do Formulário
  formularioAberto = false;
  modoEdicao = false;
  
  // Objeto que guarda os dados do formulário
  formData: any = {
    idPessoa: 0,
    nome: '',
    cpf: '',
    dataNascimento: '',
    sexo: 'M',
    email: '',
    telefone: '',
    endereco: { cep: '', numero: '', complemento: '' }
  };

  constructor(private pessoaService: PessoaService) {}

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.carregando = true;
    this.pessoaService.getAll().subscribe({
      next: (dados) => {
        // Filtra apenas clientes ativos (não funcionários)
        this.clientes = dados.filter(p => p.ativo);
        this.carregando = false;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar clientes: ' + err.message;
        this.carregando = false;
      }
    });
  }

  abrirFormulario(cliente?: Pessoa) {
    if (cliente) {
      this.modoEdicao = true;
      this.formData = {
        idPessoa: cliente.idPessoa,
        nome: cliente.nome,
        cpf: cliente.cpf,
        dataNascimento: cliente.dataNascimento,
        sexo: cliente.sexo,
        email: cliente.email,
        telefone: cliente.telefone,
        endereco: cliente.endereco ? { ...cliente.endereco } : { cep: '', numero: '', complemento: '' }
      };
    } else {
      this.modoEdicao = false;
      this.limparFormulario();
    }
    this.formularioAberto = true;
  }

  fecharFormulario() {
    this.formularioAberto = false;
    this.limparFormulario();
  }

  limparFormulario() {
    this.formData = {
      idPessoa: 0, nome: '', cpf: '', dataNascimento: '', sexo: 'M',
      email: '', telefone: '',
      endereco: { cep: '', numero: '', complemento: '' }
    };
  }

  salvarCliente() {
    const dadosEnvio: PessoaUpdate = {
      idPessoa: this.formData.idPessoa,
      nome: this.formData.nome.trim(),
      cpf: this.formData.cpf.replace(/\D/g, ''),
      dataNascimento: this.formData.dataNascimento,
      sexo: this.formData.sexo,
      email: this.formData.email.trim().toLowerCase(),
      telefone: this.formData.telefone.trim(),
      ativo: true,
      endereco: {
        cep: this.formData.endereco.cep.replace(/\D/g, ''),
        numero: this.formData.endereco.numero.trim(),
        complemento: this.formData.endereco.complemento.trim()
      }
    };

    if (this.modoEdicao) {
      this.pessoaService.atualizar(this.formData.idPessoa, dadosEnvio).subscribe({
        next: () => {
          alert('Cliente atualizado com sucesso!');
          this.fecharFormulario();
          this.carregarClientes();
        },
        error: (err) => alert('Erro ao atualizar: ' + (err.error || err.message))
      });
    }
  }

  excluirCliente(id: number, nome: string) {
    if (confirm(`Tem certeza que deseja EXCLUIR o cliente ${nome}?\n\nEsta ação irá inativar o cliente no sistema.`)) {
      this.pessoaService.inativar(id).subscribe({
        next: () => {
          alert('Cliente excluído (inativado) com sucesso.');
          this.carregarClientes();
        },
        error: (err) => alert('Erro ao excluir: ' + (err.error || err.message))
      });
    }
  }
}