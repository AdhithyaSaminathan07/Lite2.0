// // // src/Models/Product.ts

// // import mongoose, { Schema, Document } from 'mongoose';

// // export interface IProduct extends Document {
// //   name: string;
// //   description?: string;
// //   price: number;
// //   inStock: boolean;
// //   createdAt: Date;
// // }

// // const ProductSchema: Schema = new Schema({
// //   name: {
// //     type: String,
// //     required: true,
// //   },
// //   description: {
// //     type: String,
// //   },
// //   price: {
// //     type: Number,
// //     required: true,
// //   },
// //   inStock: {
// //     type: Boolean,
// //     default: true,
// //   },
// //   createdAt: {
// //     type: Date,
// //     default: Date.now,
// //   },
// // });

// // export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

// // src/models/Product.ts

// import mongoose, { Schema, Document, Model } from 'mongoose';

// // Interface describing the properties a Product document has
// export interface IProduct extends Document {
//   name: string;
//   quantity: number;
//   buyingPrice?: number;
//   sellingPrice: number;
//   gstRate: number;
//   image?: string;
//   sku?: string;
//   description?: string;
// }

// const ProductSchema: Schema<IProduct> = new Schema({
//   name: {
//     type: String,
//     required: [true, 'Product name is required.'],
//     trim: true,
//   },
//   quantity: {
//     type: Number,
//     required: [true, 'Product quantity is required.'],
//     default: 0,
//   },
//   buyingPrice: {
//     type: Number,
//     default: 0,
//   },
//   sellingPrice: {
//     type: Number,
//     required: [true, 'Product selling price is required.'],
//     default: 0,
//   },
//   gstRate: {
//     type: Number,
//     required: [true, 'GST rate is required.'],
//     default: 0,
//   },
//   image: {
//     type: String,
//     default: null,
//   },
//   sku: {
//     type: String,
//     trim: true,
//     unique: true,
//     sparse: true, 
//   },
//   description: {
//     type: String,
//     trim: true,
//   },
// }, {
//   // Add timestamps (createdAt, updatedAt)
//   timestamps: true, 
// });

// // THIS IS THE MOST IMPORTANT LINE. IT FORCES MONGOOSE TO USE THE 'Product' COLLECTION.
// const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema, 'Product');

// export default Product;



import mongoose, { Schema, models, Document } from "mongoose";

export interface IProduct extends Document {
  tenantId: string;
  name: string;
  sku?: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  gstRate: number;
  image?: string;
  lowStockThreshold?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  tenantId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  sku: {
    type: String,
    trim: true,
    sparse: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  buyingPrice: {
    type: Number,
    required: false,
    default: 0,
  },
  sellingPrice: {
    type: Number,
    required: [true, "Selling price is required"],
    default: 0,
  },
  gstRate: {
    type: Number,
    required: false,
    default: 0,
  },
  image: {
    type: String,
    required: false,
  },
  lowStockThreshold: {
    type: Number,
    required: false,
  },
}, {
  timestamps: true,
});

ProductSchema.index({ tenantId: 1, sku: 1 }, { unique: true, sparse: true });

const Product = models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;