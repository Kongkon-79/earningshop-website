import { redirect } from "next/navigation";

export default function LegacyPersonalInformationPage() {
  redirect("/user-dashboard/settings/personal-information");
}
