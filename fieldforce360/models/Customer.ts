import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  email?: string;
  phone?: string;
}

const CustomerSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
});

const Customer =
  mongoose.models.Customer ||
  mongoose.model<ICustomer>("Customer", CustomerSchema);

export default Customer;
