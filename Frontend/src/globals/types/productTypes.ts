import { Status } from "./types";

interface User {
  id: string;
  email: string;
  username: string;
}

interface Category {
  id: string;
  categoryName: string;
}

export interface Product {
  id: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productStock: number;
  productImage: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  categoryId: string;
  User: User;
  Category: Category;
}

export interface ProductState {
  product: Product[];
  status: Status;
  singleProduct: Product | null;
}
