import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICheckIn extends Document {
  technicianId: mongoose.Types.ObjectId;
  location: string;
  timestamp: Date;
  serviceRequestId: mongoose.Types.ObjectId;
}

const CheckInSchema: Schema = new Schema(
  {
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    serviceRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest", required: true }
  }
);

const CheckIn: Model<ICheckIn> = mongoose.models.CheckIn || mongoose.model<ICheckIn>('CheckIn', CheckInSchema);

export default CheckIn;