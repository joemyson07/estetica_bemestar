export interface Item {
  idItem: number;
  idCategoria: number;
  categoria: string;         
  item: string;               
  descricaoItem: string;
  preco: number;              
  precoVenda?: number;        
  unidade?: string;           
  tipoItem: 'P' | 'S';        
  ativo: boolean;             
  quantidadeEstoque: number | null; 
}