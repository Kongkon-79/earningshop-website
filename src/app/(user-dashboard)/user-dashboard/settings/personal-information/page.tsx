import { BackendProfileError, getAccountProfile } from "@/lib/backend-profile";
import { getDashboardUser } from "@/lib/dashboard-auth";
import PersonalInformationForm, { ProfileLoadError } from "./_components/personal-information-form";

export default async function PersonalInformationPage() {
  const user = await getDashboardUser();

  try {
    const profile = await getAccountProfile(user.accessToken);
    if (profile.id !== user.id) return <ProfileLoadError expired={false} />;

    return <PersonalInformationForm initialProfile={profile} />;
  } catch (error) {
    return <ProfileLoadError expired={error instanceof BackendProfileError && error.status === 401} />;
  }
}
