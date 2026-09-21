import { NextRequest, NextResponse } from "next/server";
import { igotService } from "@/lib/igot/mock-adapter";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("query") || undefined;
    const domain = searchParams.get("domain") || undefined;
    const difficulty = searchParams.get("difficulty") || undefined;

    const courses = await igotService.searchCourses({
      query,
      competencyDomain: domain,
      difficulty,
      limit: 12,
    });

    return NextResponse.json({ courses });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch iGOT courses" },
      { status: 500 }
    );
  }
}
