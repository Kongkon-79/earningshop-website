"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { forgotPasswordSchema, resetPassword, resetPasswordSchema } from "@/lib/forgot-password";
import { AuthFormHeader, AuthPasswordInput, authButtonClass } from "../../../../auth-form-ui";

const formSchema = z.object({
  password: resetPasswordSchema.shape.newPassword,
  confirmPassword: resetPasswordSchema.shape.newPassword,
}).refine((values) => values.password === values.confirmPassword, {
  path: ["confirmPassword"],
  message: "দুইটি পাসওয়ার্ড মিলছে না।",
});

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetEmail = forgotPasswordSchema.safeParse({ email: searchParams.get("email") });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: resetPassword,
    onSuccess: (message) => {
      form.reset();
      toast.success(message);
      router.replace("/login");
    },
    onError: (error) => toast.error(error.message),
  });

  function onSubmit({ password }: z.infer<typeof formSchema>) {
    if (!resetEmail.success) return;
    mutate({ email: resetEmail.data.email, newPassword: password });
  }

  return (
    <div>
      <AuthFormHeader
        backHref={resetEmail.success ? "/login" : "/forgot-password"}
        backLabel={resetEmail.success ? "লগইনে ফিরুন" : "নতুন কোড নিন"}
        title="নতুন পাসওয়ার্ড দিন"
        description={resetEmail.success
          ? "নতুন পাসওয়ার্ডে অন্তত ছয়টি অক্ষর ব্যবহার করুন।"
          : "এই রিসেট লিংকটি অসম্পূর্ণ। আবার একটি যাচাই কোড নিন।"}
      />
      {resetEmail.success && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>নতুন পাসওয়ার্ড</FormLabel>
                  <AuthPasswordInput {...field} autoComplete="new-password" label="নতুন পাসওয়ার্ড" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>পাসওয়ার্ড আবার দিন</FormLabel>
                  <AuthPasswordInput {...field} autoComplete="new-password" label="নিশ্চিতকরণ পাসওয়ার্ড" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className={authButtonClass}>
              {isPending ? "সংরক্ষণ হচ্ছে…" : "পাসওয়ার্ড বদলান"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
