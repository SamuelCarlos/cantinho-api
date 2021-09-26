import mongoose from 'mongoose';

import { ProductData } from './product';

export interface EventData {
  type: 'buy' | 'sell';
  quantity: number;
  discount: number | null;
  created_at: Date;
  product: ProductData;
}

export const eventSchema = new mongoose.Schema<EventData>({
  type: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
  },
  created_at: {
    type: Date,
    required: true,
  },
  product: {
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
  },
});
