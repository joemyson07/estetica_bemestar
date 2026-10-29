export interface Item {
  idItem: number;
  idCategoria: number;
  categoria: string;          // Vem do JOIN com a tabela categoria
  item: string;               // Nome do produto/serviço
  descricaoItem: string;
  preco: number;              // Preço base
  precoVenda?: number;        // Existe na vw_produto_categoria (calculado pela função)
  unidade?: string;           // Existe na vw_produto_categoria
  tipoItem: 'P' | 'S';        // 'P' = Produto, 'S' = Serviço
  ativo: boolean;             // Ajustado para boolean (match com o banco)
  quantidadeEstoque: number | null; // Null para serviços, número para produtos
}