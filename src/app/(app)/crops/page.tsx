import { redirect } from "next/navigation";

export default function CropsPage() {
  // Redirect to the overview section so each section has its own page
  redirect("/crops/overview");
}
