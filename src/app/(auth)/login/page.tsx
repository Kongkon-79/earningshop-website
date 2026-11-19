import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import LoginForm from "./_components/login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader variant="inline" message="লগইন ফর্ম লোড হচ্ছে…" />}>
      <LoginForm />
    </Suspense>
  );
}
