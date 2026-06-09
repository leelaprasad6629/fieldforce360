import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import Report from "@/models/Report";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { taskId, report } = await request.json();

  if (!isDbConfigured()) {
    return NextResponse.json({
      success: true,
      taskId,
      report,
      completedAt: new Date().toISOString(),
    });
  }

  try {
    await connectDB();
    const saved = await Report.create({
      technicianId: userId,
      requestId: taskId,
      notes: report,
      completedAt: new Date(),
    });
    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Report submission failed" },
      { status: 500 }
    );
  }
}
