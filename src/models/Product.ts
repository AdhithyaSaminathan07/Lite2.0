import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface describing the properties a Product document has
export interface IProduct extends Document {
  tenantId: string;
  name: string;
  quantity: number;
  buyingPrice?: number;
  sellingPrice: number;
  gstRate: number;
  image?: string;
  sku: string;
  description?: string;
}

// The generic <IProduct> passed to `new Schema` tells TypeScript
// what the resulting documents will look like.
const ProductSchema = new Schema<IProduct>({
  tenantId: {
    type: String,
    required: true,
    index: true,
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
    required: [true, 'Product ID (SKU) is required.'],
    validate: {
        // --- START: MODIFIED SECTION ---
        // Using `!!` ensures the result is always a boolean (true/false)
        validator: (value: string) => !!(value && value.trim().length > 0),
        // --- END: MODIFIED SECTION ---
        message: 'Product ID (SKU) cannot be an empty string.'
    }
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Create a compound index to ensure SKU is unique per tenantId.
ProductSchema.index({ tenantId: 1, sku: 1 }, { unique: true });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema, 'Product');

export default Product;