import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { generatePersonalizedRecommendations } from "@/lib/recommendation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recommendations = await generatePersonalizedRecommendations(user.id);
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Recommendations error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
