export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  categories?: string[];
  images?: { preview: string };
  delivery?: {
    startTown: { town: string; country: string };
    earlyDate: Date;
    price: number;
  };
  discount?: number;
  isAvailable?: boolean;
}

export interface UserProfile {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: 'user' | 'manager' | 'admin';
}

export interface Address {
  country?: string;
  town?: string;
  street?: string;
  houseNumber?: string;
}

export interface BasketItem {
  productId: number;
  count: number;
}

export interface BasketData {
  basket: BasketItem[];
  userbasket?: { basket: BasketItem[] };
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  message?: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterResponse {
  message?: string;
}