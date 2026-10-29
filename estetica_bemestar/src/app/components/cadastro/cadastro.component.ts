import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PessoaService } from '../../services/pessoas/pessoas.service';
import { Pessoa } from '../../models/pessoa';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  private pessoaService = inject(PessoaService);
  private router = inject(Router);

  nome = '';
  cpf = '';
  dataNascimento = '';
  sexo = '';
  email = '';
  telefone = '';
  cep = '';
  numero = '';
  complemento = '';

  enviando = false;

  salvar(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      alert('Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    if (this.enviando) return;
    this.enviando = true;

    const pessoa: Pessoa = {
      nome: this.nome,
      cpf: this.cpf,
      data_nascimento: this.dataNascimento,
      sexo: this.sexo,
      email: this.email,
      telefone: this.telefone,
      ativo_pessoa: 'S',
      endereco: {
        cep: this.cep,
        numero: this.numero,
        complemento: this.complemento
      }
    };

    this.pessoaService.cadastrar(pessoa).subscribe({
      next: () => {
        alert('Cadastro efetuado com sucesso!');
        this.limpar(form);
        this.enviando = false;
      },
      error: (msgErro) => {
        console.log('ERRO AO CADASTRAR', msgErro);
        alert('Erro ao cadastrar. Verifique se o CPF ou E-mail já estão cadastrados.');
        this.enviando = false;
      }
    });
  }

  limpar(form: NgForm): void {
    form.resetForm();
  }

  voltarAoCatalogo(): void {
    this.router.navigate(['/home']);
  }
}