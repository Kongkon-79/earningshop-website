"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema, requestPasswordReset } from "@/lib/forgot-password";
import { AuthFormHeader, authButtonClass, authIconClass, authInputClass } from "../../auth-form-ui";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: requestPasswordReset,
    onSuccess: (message, email) => {
      toast.success(message);
      router.push(`/forgot-password/otp?${new URLSearchParams({ email })}`);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div>
      <AuthFormHeader
        backHref="/login"
        backLabel="লগইনে ফিরুন"
        title="পাসওয়ার্ড ভুলে গেছেন?"
        description="অ্যাকাউন্টের ইমেইল দিন। আমরা সেখানে একটি যাচাই কোড পাঠাব।"
      />
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(({ email }) => mutate(email))} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>ইমেইল</FormLabel>
                <div className="relative">
                  <Mail aria-hidden="true" className={authIconClass} />
                  <FormControl>
                    <Input {...field} type="email" autoComplete="email" placeholder="you@example.com" className={`${authInputClass} pl-9`} />
                  </FormControl>
                </div>
                <FormMessage lang="en" />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className={authButtonClass}>
            {isPending ? "কোড পাঠানো হচ্ছে…" : "যাচাই কোড পাঠান"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
