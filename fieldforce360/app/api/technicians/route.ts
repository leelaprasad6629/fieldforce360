import { NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import User from "@/models/User";
import { mockTechnicians } from "@/lib/mock-data";

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json(mockTechnicians);
  }

  try {
    await connectDB();
    const technicians = await User.find({ role: "technician" })
      .select("name role location isActive")
      .lean();
    return NextResponse.json(technicians);
  } catch {
    return NextResponse.json(mockTechnicians);
  }
}
