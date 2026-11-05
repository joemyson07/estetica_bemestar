export interface EntradaProduto {
  idEntrada: number;
  idItem: number;
  dataEntrada: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal?: number;
}

export interface EntradaProdutoCreate {
  idItem: number;
  dataEntrada: string;
  quantidadeEntrada: number;
  valorUnitarioEntrada: number;
}