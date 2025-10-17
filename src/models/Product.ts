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


import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface describing the properties a Product document has
export interface IProduct extends Document {
  tenantId: string; // <-- ADD THIS LINE
  name: string;
  quantity: number;
  buyingPrice?: number;
  sellingPrice: number;
  gstRate: number;
  image?: string;
  sku?: string;
  description?: string;
}

const ProductSchema: Schema<IProduct> = new Schema({
  tenantId: { // <-- ADD THIS OBJECT
    type: String,
    required: true,
    index: true, // Adding an index improves query performance for this field
  },
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
    // Note: SKU must be unique PER TENANT, not globally.
    // A compound index is the best way to enforce this.
    // We will remove 'unique: true' here and create the index below.
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Create a compound index to ensure SKU is unique per tenantId
ProductSchema.index({ tenantId: 1, sku: 1 }, { unique: true, sparse: true });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;