// Interface que espelha exatamente o que a API retorna
// MongoDB usa _id (string) em vez do id numérico do json-server
export interface Category {
  _id: string;
  name: string;
  description?: string;
}

export interface Product {
  _id?: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  category?: Category | string | null; // pode vir populado ou como ID
  createdAt?: string;
  updatedAt?: string;
}
