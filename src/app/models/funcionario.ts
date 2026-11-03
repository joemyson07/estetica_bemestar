// src/app/models/funcionario.ts

// Interface para o Endereço (se você já tiver isso em pessoa.ts, pode importar de lá em vez de redeclarar)
export interface Endereco {
  cep: string;
  numero: string;
  complemento: string;
}

// Interface para LEITURA (GET) - O que o backend devolve
export interface Funcionario {
  idPessoa: number;
  nome: string;
  cpf: string;
  dataNascimento: string; // DateOnly no .NET vem como string 'YYYY-MM-DD' no JSON
  sexo: string;
  email: string;
  telefone: string;
  ativo: boolean;
  cargo: string;
  dataAdmissao: string;
  endereco?: Endereco; // O '?' indica que é opcional no retorno
}

// Interface para CRIAÇÃO (POST) - O que o frontend envia
export interface FuncionarioCreate {
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: string;
  cargo: string;
  dataAdmissao: string;
  endereco: Endereco;
}

// Interface para ATUALIZAÇÃO (PUT) - O que o frontend envia
export interface FuncionarioUpdate {
  idPessoa: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: string;
  ativo: boolean;
  cargo: string;
  dataAdmissao: string;
  endereco: Endereco;
}