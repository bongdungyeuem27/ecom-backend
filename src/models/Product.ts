import { IProduct } from '~data/data';
import { Schema, model } from 'mongoose';

const ProductSchema = new Schema<IProduct>({
  _id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export const Product = model<IProduct>('product', ProductSchema);
