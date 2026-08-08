// Categorias oficiales definidas por el cliente.
export const CAMISETA_CATEGORIES = [
  "Uruguayos",
  "Selección",
  "Sudamérica",
  "Europa",
  "Shorts",
  "Conjuntos largo",
  "Conjuntos corto",
  "Camperas rompevientos",
  "Otros"
] as const;

export type CamisetaProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  currency: string;
  category: string | null;
  imageUrl: string;
};

export type CamisetaSaleMovement = {
  id: number;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  currency: string;
  mpPaymentId: string;
  mpStatus: string;
  createdAt: string;
};

export type CamisetaBestSeller = {
  productId: string;
  productName: string;
  unitsSold: number;
  totalVendido: number;
};

export type CamisetaPanelSummary = {
  totalVendido: number;
  totalGanancia: number;
  cantidadVentas: number;
  currency: string;
  movimientos: CamisetaSaleMovement[];
  masVendidas: CamisetaBestSeller[];
};
