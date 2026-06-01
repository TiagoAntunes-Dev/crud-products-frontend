import { Category } from './category.model';

export interface Product {
  _id?: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  category?: Category | string | null;
  createdAt?: string;
  updatedAt?: string;
}
