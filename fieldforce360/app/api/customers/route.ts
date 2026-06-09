import { NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { mockCustomers } from "@/lib/mock-data";

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json(mockCustomers);
  }

  try {
    await connectDB();
    const customers = await Customer.find().select("name email phone").lean();
    return NextResponse.json(customers);
  } catch {
    return NextResponse.json(mockCustomers);
  }
}
