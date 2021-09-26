import mongoose from 'mongoose';
import { string } from 'yup/lib/locale';

export interface User {
  SKU: string;
  email: string;
  password: string;
  created_at: Date;
}

export const userSchema = new mongoose.Schema<User>({
  SKU: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
});
