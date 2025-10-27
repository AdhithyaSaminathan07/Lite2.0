

// src/models/Sales.ts

import mongoose, { Schema, models, Document } from "mongoose";

// This interface defines the shape of the Sale document for TypeScript
export interface ISale extends Document {
  tenantId: string;
  amount: number;
  // FIX 1: Updated the allowed types to include 'qr-code' and 'card'
  paymentMethod: 'cash' | 'qr-code' | 'card'; 
  createdAt: Date;
}

const SaleSchema = new Schema<ISale>({
  tenantId: {
    type: String,
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    // FIX 2: Updated the enum array to allow the correct values
    enum: ["cash", "qr-code", "card"], 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Sale = models.Sale || mongoose.model<ISale>("Sale", SaleSchema);

export default Sale;