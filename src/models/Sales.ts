// // src/modles/Sales.ts

// import mongoose, { Schema, models, Document } from "mongoose";

// export interface ISale extends Document {
//   amount: number;
//   paymentMethod: 'cash' | 'qr';
//   createdAt: Date;
// }

// const SaleSchema = new Schema<ISale>({
//   amount: {
//     type: Number,
//     required: true,
//   },
//   paymentMethod: {
//     type: String,
//     enum: ["cash", "qr"],
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Sale = models.Sale || mongoose.model<ISale>("Sale", SaleSchema);

// export default Sale;


import mongoose, { Schema, models, Document } from "mongoose";

export interface ISale extends Document {
  tenantId: string; // <-- ADD THIS LINE
  amount: number;
  paymentMethod: 'cash' | 'qr';
  createdAt: Date;
}

const SaleSchema = new Schema<ISale>({
  tenantId: { // <-- ADD THIS OBJECT
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
    enum: ["cash", "qr"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Sale = models.Sale || mongoose.model<ISale>("Sale", SaleSchema);

export default Sale;