import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import OtpForm from "./_components/otp-form";

export default function OtpPage() {
  return (
    <Suspense fallback={<Loader variant="inline" message="কোড যাচাইয়ের ফর্ম লোড হচ্ছে…" />}>
      <OtpForm />
    </Suspense>
  );
}
