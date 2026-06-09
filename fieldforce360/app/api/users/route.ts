import { NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import User from "@/models/User";
import { mockTechnicians } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  if (!isDbConfigured()) {
    const users =
      role === "technician"
        ? mockTechnicians.map(({ _id, name }) => ({ _id, name }))
        : mockTechnicians;
    return NextResponse.json(users);
  }

  try {
    await connectDB();
    const users =
      role === "technician" || role === "manager"
        ? await User.find({ role: role as "technician" | "manager" })
            .select("name email role location isActive")
            .lean()
        : await User.find()
            .select("name email role location isActive")
            .lean();
    return NextResponse.json(users);
  } catch {
    return NextResponse.json(
      mockTechnicians.map(({ _id, name }) => ({ _id, name }))
    );
  }
}
