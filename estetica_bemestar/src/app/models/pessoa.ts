export interface Endereco {
    idendereco?: number;
    idpessoa?: number;
    cep: string;
    numero: string;
    complemento?: string;
  }
  
  export interface Pessoa {
    idpessoa?: number;
    nome: string;
    cpf: string;
    data_nascimento: string;
    sexo: string;
    email: string;
    telefone: string;
    ativo_pessoa?: string;
    endereco?: Endereco;
  }