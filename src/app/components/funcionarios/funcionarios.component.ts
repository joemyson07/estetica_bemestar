import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FuncionarioService } from '../../services/funcionario/funcionario.service';
import { Funcionario, FuncionarioCreate, FuncionarioUpdate } from '../../models/funcionario';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent implements OnInit {
  funcionarios: Funcionario[] = [];
  carregando = true;
  erro = '';
  formularioAberto = false;
  modoEdicao = false;
  
  formData: any = {
    idPessoa: 0,
    nome: '',
    cpf: '',
    dataNascimento: '',
    sexo: 'M',
    email: '',
    telefone: '',
    cargo: '',
    dataAdmissao: '',
    endereco: { cep: '', numero: '', complemento: '' }
  };

  constructor(private funcionarioService: FuncionarioService) {}

  ngOnInit() {
    this.carregarFuncionarios();
  }

  carregarFuncionarios() {
    this.carregando = true;
    this.funcionarioService.listarFuncionarios().subscribe({
      next: (dados) => {
        this.funcionarios = dados;
        this.carregando = false;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar funcionários: ' + err.message;
        this.carregando = false;
      }
    });
  }

  abrirFormulario(funcionario?: Funcionario) {
    if (funcionario) {
      this.modoEdicao = true;
      this.formData = {
        idPessoa: funcionario.idPessoa,
        nome: funcionario.nome,
        cpf: funcionario.cpf,
        dataNascimento: funcionario.dataNascimento,
        sexo: funcionario.sexo,
        email: funcionario.email,
        telefone: funcionario.telefone,
        cargo: funcionario.cargo,
        dataAdmissao: funcionario.dataAdmissao,
        endereco: { ...funcionario.endereco }
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
      email: '', telefone: '', cargo: '', dataAdmissao: '',
      endereco: { cep: '', numero: '', complemento: '' }
    };
  }

  salvarFuncionario() {
    const dadosEnvio = {
      ...this.formData,
      cpf: this.formData.cpf.replace(/\D/g, ''),
      email: this.formData.email.trim().toLowerCase(),
      cep: this.formData.endereco.cep.replace(/\D/g, '')
    };

    if (this.modoEdicao) {
      this.funcionarioService.atualizarFuncionario(this.formData.idPessoa, dadosEnvio).subscribe({
        next: () => {
          alert('Funcionário atualizado com sucesso!');
          this.fecharFormulario();
          this.carregarFuncionarios();
        },
        error: (err) => alert('Erro ao atualizar: ' + (err.error || err.message))
      });
    } else {
      this.funcionarioService.cadastrarFuncionario(dadosEnvio).subscribe({
        next: () => {
          alert('Funcionário cadastrado com sucesso!');
          this.fecharFormulario();
          this.carregarFuncionarios();
        },
        error: (err) => alert('Erro ao cadastrar: ' + (err.error || err.message))
      });
    }
  }

  desativarFuncionario(id: number, nome: string) {
    if (confirm(`Tem certeza que deseja desativar o funcionário ${nome}?`)) {
      this.funcionarioService.inativarFuncionario(id).subscribe({
        next: () => {
          alert('Funcionário desativado com sucesso.');
          this.carregarFuncionarios();
        },
        error: (err) => alert('Erro ao desativar: ' + (err.error || err.message))
      });
    }
  }
}