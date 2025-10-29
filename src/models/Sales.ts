// src/models/Sales.ts

import mongoose, { Schema, models, Document } from "mongoose";

export interface ISale extends Document {
  amount: number;
  paymentMethod: 'cash' | 'qr' | 'card';
  createdAt: Date;
}

const SaleSchema = new Schema<ISale>({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "qr", "card"],
    required: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Sale = models.Sale || mongoose.model<ISale>("Sale", SaleSchema);

export default Sale;