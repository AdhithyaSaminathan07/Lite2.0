import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  subdomain: string;
}

const TenantSchema: Schema = new Schema({
  name: { type: String, required: true },
  subdomain: { type: String, required: true, unique: true },
});

export default mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);