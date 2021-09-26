import mongoose from 'mongoose';
import { string } from 'yup/lib/locale';

export interface User {
  SKU: string;
  phone: string;
  password: string;
  is_verified: boolean;
  verification_token: string;
  created_at: Date;
}

export const userSchema = new mongoose.Schema<User>({
  SKU: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_verified: {
    type: Boolean,
    required: true,
  },
  verification_token: {
    type: String,
  },
  created_at: {
    type: Date,
    required: true,
  },
});
