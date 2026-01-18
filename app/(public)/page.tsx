import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth/session";

export default async function HomePage() {
  const isLoggedIn = await isAuthenticated();

  if (isLoggedIn) {
    redirect("/dashboard");
  } else {
    redirect("/onboarding");
  }

  return null;
}
