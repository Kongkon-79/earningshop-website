import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import ResetPasswordForm from "./_components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loader variant="inline" message="পাসওয়ার্ড রিসেটের ফর্ম লোড হচ্ছে…" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
