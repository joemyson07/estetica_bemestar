import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PessoaService } from '../../services/pessoas/pessoas.service';
import { Pessoa } from '../../models/pessoa';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  private fb = inject(FormBuilder);
  private pessoaService = inject(PessoaService);
  private router = inject(Router);

  formCadastro: FormGroup = this.fb.group({
    nome: ['', [Validators.required]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    data_nascimento: ['', [Validators.required]],
    sexo: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required]],
    cep: ['', [Validators.required]],
    numero: ['', [Validators.required]],
    complemento: ['']
  });

  salvar(): void {
    if (this.formCadastro.invalid) {
      this.formCadastro.markAllAsTouched();
      alert('Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    const dados = this.formCadastro.value;

    const novaPessoa: Pessoa = {
      nome: dados.nome,
      cpf: Number(dados.cpf),
      data_nascimento: dados.data_nascimento,
      sexo: dados.sexo,
      email: dados.email,
      telefone: Number(dados.telefone),
      ativo_pessoa: 'S',
      endereco: {
        cep: dados.cep,
        numero: dados.numero,
        complemento: dados.complemento
      }
    };

    this.pessoaService.cadastrar(novaPessoa).subscribe({
      next: () => {
        alert('Cadastro efetuado com sucesso!');
        this.limpar();
      },
      error: () => alert('Erro ao cadastrar. Verifique se o CPF ou E-mail já estão cadastrados.')
    });
  }

  limpar(): void {
    this.formCadastro.reset();
  }

  voltarAoCatalogo(): void {
    this.router.navigate(['/home']);
  }
}