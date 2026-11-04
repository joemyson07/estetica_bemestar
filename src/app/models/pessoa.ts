// src/app/models/pessoa.ts

export interface Endereco {
  cep: string;
  numero: string;
  complemento: string;
}

// Interface para LEITURA (GET) e resposta do Login
export interface Pessoa {
  idPessoa: number;          // O .NET envia como 'idPessoa' (camelCase)
  nome: string;
  cpf: string;
  dataNascimento: string;    // O .NET envia como 'dataNascimento' (NÃO é data_nascimento)
  sexo: string;
  email: string;
  telefone: string;
  ativo: boolean;            // O .NET envia como 'ativo' (NÃO é ativo_pessoa)
  endereco?: Endereco;
}

// Interface para CRIAÇÃO (POST) - Cadastro de Cliente
export interface PessoaCreate {
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: string;
  endereco: Endereco;
}

// Interface para ATUALIZAÇÃO (PUT)
export interface PessoaUpdate {
  idPessoa: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: string;
  ativo: boolean;
  endereco: Endereco;
}