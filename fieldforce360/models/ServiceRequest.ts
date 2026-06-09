import mongoose, { Schema, Document, Types } from "mongoose";

export interface IServiceRequest extends Document {
  title: string;
  description: string;
  status: string;
  assignedTo: Types.ObjectId;
  customerId: Types.ObjectId;
  location: string;
  createdAt: Date;
}

const ServiceRequestSchema: Schema = new Schema<IServiceRequest>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ServiceRequest =
  mongoose.models.ServiceRequest ||
  mongoose.model<IServiceRequest>("ServiceRequest", ServiceRequestSchema);

export default ServiceRequest;
