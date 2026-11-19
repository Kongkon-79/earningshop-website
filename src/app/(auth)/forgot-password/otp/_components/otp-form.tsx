"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema, requestPasswordReset, verifyOtpSchema, verifyResetOtp } from "@/lib/forgot-password";
import { AuthFormHeader, authButtonClass, authInputClass } from "../../../auth-form-ui";

const otpLength = 6;

export default function OtpForm() {
  const [otp, setOtp] = useState<string[]>(() => Array(otpLength).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const searchParams = useSearchParams();
  const resetEmail = forgotPasswordSchema.safeParse({ email: searchParams.get("email") });
  const router = useRouter();

  const { mutate: verifyOtp, isPending } = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: verifyResetOtp,
    onSuccess: (message, { email }) => {
      toast.success(message);
      router.push(`/forgot-password/otp/reset-password?${new URLSearchParams({ email })}`);
    },
    onError: (error) => toast.error(error.message),
  });

  const { mutate: resendOtp, isPending: resendOtpPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: requestPasswordReset,
    onSuccess: (message) => toast.success(message),
    onError: (error) => toast.error(error.message),
  });

  function fillOtp(value: string) {
    setOtp(value.split(""));
    inputRefs.current[otpLength - 1]?.focus();
  }

  function handleChange(index: number, value: string) {
    if (/^[0-9]{6}$/.test(value)) {
      fillOtp(value);
      return;
    }
    if (!/^[0-9]*$/.test(value)) return;

    const digit = value.slice(-1);
    setOtp((current) => current.map((previousDigit, position) => position === index ? digit : previousDigit));
    if (digit) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowLeft" || (event.key === "Backspace" && !otp[index])) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight") inputRefs.current[index + 1]?.focus();
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const value = event.clipboardData.getData("text").trim();
    if (!/^[0-9]{6}$/.test(value)) return;

    event.preventDefault();
    fillOtp(value);
  }

  function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending || resendOtpPending || !resetEmail.success) return;

    const input = verifyOtpSchema.safeParse({ email: resetEmail.data.email, otp: otp.join("") });
    if (!input.success) {
      toast.error("ছয় সংখ্যার সম্পূর্ণ কোডটি লিখুন।");
      return;
    }
    verifyOtp(input.data);
  }

  const isBusy = isPending || resendOtpPending;

  return (
    <div>
      <AuthFormHeader
        backHref="/forgot-password"
        backLabel="ইমেইল ধাপে ফিরুন"
        title="যাচাই কোড দিন"
        description={resetEmail.success ? (
          <>কোড পাঠানো হয়েছে <span dir="ltr" className="break-all font-semibold text-slate-700">{resetEmail.data.email}</span> ঠিকানায়।</>
        ) : "আবার ইমেইল দিয়ে একটি নতুন যাচাই কোড নিন।"}
      />
      {resetEmail.success && (
        <form onSubmit={handleVerify} className="space-y-3">
          <fieldset>
            <legend className="mb-2 text-sm font-medium">ছয় সংখ্যার কোড</legend>
            <div className="grid grid-cols-6 gap-1.5 sm:gap-3" dir="ltr">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={index === 0 ? otpLength : 1}
                  value={digit}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  ref={(input) => { inputRefs.current[index] = input; }}
                  className={`${authInputClass} min-w-0 px-0 text-center font-semibold tabular-nums`}
                  aria-label={`কোডের ${(index + 1).toLocaleString("bn-BD")} নম্বর অঙ্ক`}
                />
              ))}
            </div>
          </fieldset>
          <Button type="submit" disabled={isBusy} className={authButtonClass}>
            {isPending ? "যাচাই হচ্ছে…" : "কোড যাচাই করুন"}
          </Button>
          <div className="flex flex-wrap items-center justify-center gap-x-2 text-sm text-slate-600">
            কোড পাননি?
            <button
              type="button"
              onClick={() => resendOtp(resetEmail.data.email)}
              disabled={isBusy}
              className="min-h-11 rounded-md font-semibold text-teal-800 hover:underline focus-visible:outline-teal-700 disabled:opacity-60"
            >
              {resendOtpPending ? "কোড পাঠানো হচ্ছে…" : "আবার পাঠান"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
