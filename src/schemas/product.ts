import mongoose from 'mongoose';

export interface ProductState {
  state: Product;
}

export interface ProductData {
  SKU: string;
  user_SKU: string;
  name: string;
  buy_price: number;
  sell_price: number;
  inventory: number;
  qr_code: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export interface Product extends ProductData {
  states: ProductState[];
}

export const productSchema = new mongoose.Schema<Product>({
  SKU: {
    type: String,
    required: true,
  },
  user_SKU: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  buy_price: {
    type: Number,
    required: true,
  },
  sell_price: {
    type: Number,
    required: true,
  },
  inventory: {
    type: Number,
    required: true,
  },
  qr_code: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
  updated_at: {
    type: Date,
    required: false,
  },
  deleted_at: {
    type: Date,
    required: false,
  },
  states: [],
});
