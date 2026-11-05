export interface Estoque {
  idItem: number;
  nomeItem: string;
  descricaoItem?: string;
  preco: number;
  precoVenda?: number;
  unidade: string;
  categoria?: string;
  quantidadeEstoque: number;
  ativo: boolean;
}