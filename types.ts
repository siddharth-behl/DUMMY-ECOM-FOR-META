
export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  sizes: string[];
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  size: string;
  quantity: number;
}
