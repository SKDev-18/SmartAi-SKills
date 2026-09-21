import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ADMIN") {
    redirect("/admin/dashboard");
  } else if (!user.onboardingCompleted) {
    redirect("/onboarding/step-1");
  } else {
    redirect("/dashboard");
  }
}
