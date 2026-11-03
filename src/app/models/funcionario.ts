
export interface Endereco {
  cep: string;
  numero: string;
  complemento: string;
}

export interface Funcionario {
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
  endereco?: Endereco; 
}

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