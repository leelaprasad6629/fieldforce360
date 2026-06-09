import { NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import ServiceRequest from "@/models/ServiceRequest";
import { mockRequests } from "@/lib/mock-data";

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json(mockRequests);
  }

  try {
    await connectDB();
    const requests = await ServiceRequest.find()
      .populate("assignedTo", "name")
      .populate("customerId", "name")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(requests);
  } catch {
    return NextResponse.json(mockRequests);
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!isDbConfigured()) {
    const created = {
      _id: `req-${Date.now()}`,
      ...body,
      assignedTo: mockRequests[0].assignedTo,
      customerId: mockRequests[0].customerId,
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json(created, { status: 201 });
  }

  try {
    await connectDB();
    const created = await ServiceRequest.create(body);
    const populated = await ServiceRequest.findById(created._id)
      .populate("assignedTo", "name")
      .populate("customerId", "name")
      .lean();
    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create request" },
      { status: 500 }
    );
  }
}
