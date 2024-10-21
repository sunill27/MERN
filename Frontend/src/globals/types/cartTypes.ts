import { Product } from "./productTypes";
import { Status } from "./types";

export interface CartItem {
  Product: Product;
  productId: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  status: Status;
}