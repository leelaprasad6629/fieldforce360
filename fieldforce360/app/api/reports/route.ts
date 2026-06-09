import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Define the service request schema and model
const serviceRequestSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, required: true, default: 'Pending' },
    title: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { collection: 'service_requests' }
);

const ServiceRequest = mongoose.models.ServiceRequest || mongoose.model('ServiceRequest', serviceRequestSchema);

async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

// GET: Fetch all service requests (reports)
export async function GET() {
  try {
    await connectToDatabase();
    const requests = await ServiceRequest.find()
      .populate('customerId', 'name')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: requests });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a new service request (report)
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Basic validation (expand as needed)
    if (!body.customerId || !body.title) {
      return NextResponse.json(
        { success: false, error: 'customerId and title are required' },
        { status: 400 }
      );
    }

    const newRequest = await ServiceRequest.create({
      customerId: body.customerId,
      assignedTo: body.assignedTo || null,
      status: body.status || 'Pending',
      title: body.title,
      description: body.description || '',
    });

    return NextResponse.json({ success: true, data: newRequest }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}