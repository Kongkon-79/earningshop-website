import { redirect } from "next/navigation";

export default function LegacyChangePasswordPage() {
  redirect("/user-dashboard/settings/change-password");
}
