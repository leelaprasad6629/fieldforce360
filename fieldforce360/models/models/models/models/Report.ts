import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReport extends Document {
  technicianId: mongoose.Types.ObjectId;
  requestId: mongoose.Types.ObjectId;
  notes: string;
  photoUrl: string;
  signature: string;
  completedAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest", required: true },
    notes: { type: String, required: true },
    photoUrl: { type: String },
    signature: { type: String },
    completedAt: { type: Date }
  }
);

const Report: Model<IReport> = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);

export default Report;