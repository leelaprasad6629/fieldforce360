import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import CheckIn from "@/models/CheckIn";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { latitude, longitude } = await request.json();
  const location = `${latitude},${longitude}`;

  if (!isDbConfigured()) {
    return NextResponse.json({
      success: true,
      location,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    await connectDB();
    const checkIn = await CheckIn.create({
      technicianId: userId,
      location,
      timestamp: new Date(),
    });
    return NextResponse.json(checkIn);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Check-in failed" },
      { status: 500 }
    );
  }
}
