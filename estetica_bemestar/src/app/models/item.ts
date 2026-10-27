export interface Item {
    idItem: number;
    idCategoria: number;
    categoria: string;
    item: string;
    descricaoItem: string;
    preco: number;
    tipoItem: 'P' | 'S';      // P = produto, S = serviço
    ativo: 'S' | 'N';
    quantidadeEstoque: number | null; // null para serviços
  }