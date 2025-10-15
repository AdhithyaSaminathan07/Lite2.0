// // src/Models/Product.ts

// import mongoose, { Schema, Document } from 'mongoose';

// export interface IProduct extends Document {
//   name: string;
//   description?: string;
//   price: number;
//   inStock: boolean;
//   createdAt: Date;
// }

// const ProductSchema: Schema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   inStock: {
//     type: Boolean,
//     default: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

// src/models/Product.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface describing the properties a Product document has
export interface IProduct extends Document {
  name: string;
  quantity: number;
  buyingPrice?: number; // Optional, can be useful for profit calculation
  sellingPrice: number;
  gstRate: number;
  image?: string;
  sku?: string;
  description?: string;
}

const ProductSchema: Schema<IProduct> = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required.'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Product quantity is required.'],
    default: 0,
  },
  buyingPrice: {
    type: Number,
    default: 0,
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Product selling price is required.'],
    default: 0,
  },
  gstRate: {
    type: Number,
    required: [true, 'GST rate is required.'],
    default: 0,
  },
  image: {
    type: String,
    default: null,
  },
  sku: {
    type: String,
    trim: true,
    unique: true,
    // Use a sparse index for unique SKUs that can also be null/undefined
    sparse: true, 
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  // Add timestamps (createdAt, updatedAt)
  timestamps: true, 
});

// This prevents Mongoose from redefining the model every time in development (HMR)
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;