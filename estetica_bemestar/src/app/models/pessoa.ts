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
    cpf: number;
    data_nascimento: string;
    sexo: string;
    email: string;
    telefone: number;
    ativo_pessoa?: string;
    endereco?: Endereco;
  }