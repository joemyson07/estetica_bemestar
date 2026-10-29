// Este é o objeto principal que será enviado para POST /api/pedidos
export interface Pedido {
  idPedido?: number;
  idPessoa: number;           // ID do cliente
  dataPedido?: string;        // Ex: '2026-10-30T10:00:00'
  valorTotal?: number;        // Soma dos itens
  status?: string;            // 'Aberto', 'Em processamento', 'Concluído', 'Cancelado'
  itens?: ItemPedido[];       // Lista de itens deste pedido
}

// Este é o objeto de cada linha dentro do pedido
export interface ItemPedido {
  idItemPedido?: number;
  idPedido?: number;
  idItem: number;             // ID do produto/serviço
  nomeItem?: string;          // Nome (ex: "Creme Hidratante") - útil para exibir na tela
  tipoItem?: 'P' | 'S';       // 'P' = Produto, 'S' = Serviço (alinhado com seu model Item)
  quantidade: number;         // Quantidade solicitada
  valorUnitario: number;      // Preço unitário no momento da compra
  valorTotal?: number;        // quantidade * valorUnitario
  estoqueDisponivel?: number; // Apenas para validação visual no frontend
}