import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const competencies = await prisma.competency.findMany({
      include: {
        topics: true,
      },
      orderBy: { domain: "asc" },
    });

    return NextResponse.json({ competencies });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load competencies" },
      { status: 500 }
    );
  }
}
