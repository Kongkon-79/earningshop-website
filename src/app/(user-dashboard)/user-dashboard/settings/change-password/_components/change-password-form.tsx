"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, KeyRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthPasswordInput, authButtonClass } from "@/app/(auth)/auth-form-ui";
import { Button } from "@/components/ui/button";
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { changeAccountPassword, changePasswordFormSchema, type ChangePasswordValues } from "@/lib/change-password";

const passwordFields = [
  { name: "oldPassword", label: "বর্তমান পাসওয়ার্ড", autoComplete: "current-password" },
  { name: "newPassword", label: "নতুন পাসওয়ার্ড", autoComplete: "new-password" },
  { name: "confirmPassword", label: "নতুন পাসওয়ার্ড আবার দিন", autoComplete: "new-password" },
] as const;

export default function ChangePasswordForm() {
  const [success, setSuccess] = useState(false);
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit({ oldPassword, newPassword }: ChangePasswordValues) {
    setSuccess(false);
    try {
      await changeAccountPassword({ oldPassword, newPassword });
      form.reset();
      setSuccess(true);
    } catch (error) {
      form.setError("root", {
        message: error instanceof Error ? error.message : "পাসওয়ার্ড বদলানো যায়নি। আবার চেষ্টা করুন।",
      });
    }
  }

  return (
    <section aria-labelledby="password-form-title" className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-900">
          <KeyRound aria-hidden="true" className="size-5" />
        </span>
        <h2 id="password-form-title" className="text-lg font-bold">পাসওয়ার্ডের তথ্য</h2>
      </div>
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-3 sm:mt-5 sm:space-y-4" aria-busy={isSubmitting}>
          {passwordFields.map(({ name, label, autoComplete }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>{label}</FormLabel>
                  <AuthPasswordInput {...field} label={label} autoComplete={autoComplete} readOnly={isSubmitting} />
                  {name === "newPassword" && <FormDescription className="text-slate-600">অন্তত ৬টি অক্ষর দিন।</FormDescription>}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {errors.root?.message && (
            <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm leading-relaxed text-red-800 [overflow-wrap:anywhere]">{errors.root.message}</p>
          )}
          {success && (
            <p role="status" className="flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">
              <CheckCircle2 aria-hidden="true" className="size-4 shrink-0" />
              পাসওয়ার্ড পরিবর্তন হয়েছে।
            </p>
          )}
          <Button type="submit" disabled={isSubmitting} className={`${authButtonClass} h-auto min-h-11 whitespace-normal sm:w-auto sm:px-6`}>
            {isSubmitting ? "সংরক্ষণ হচ্ছে…" : "পাসওয়ার্ড পরিবর্তন করুন"}
          </Button>
        </form>
      </Form>
    </section>
  );
}
