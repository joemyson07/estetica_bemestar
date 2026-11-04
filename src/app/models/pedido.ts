// Este é o objeto principal que será enviado para POST /api/pedidos
export interface Pedido {
  idPedido?: number;
  idPessoa: number;   
  nomeCliente?: string;        
  dataPedido?: string;        
  valorTotal?: number;        
  status?: string;            
  itens?: ItemPedido[];       
}


export interface ItemPedido {
  idItemPedido?: number;
  idPedido?: number;
  idItem: number;            
  nomeItem?: string;          
  tipoItem?: 'P' | 'S';      
  quantidade: number;         
  valorUnitario: number;     
  valorTotal?: number;      
  estoqueDisponivel?: number;
}