"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { AuthFormHeader, AuthPasswordInput, authButtonClass, authIconClass, authInputClass } from "../../auth-form-ui";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const authError = searchParams.has("error");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!result?.ok || result.error) {
        throw new Error(result?.error || "Login failed. Please try again.");
      }

      toast.success("লগইন সফল হয়েছে।");
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <AuthFormHeader
        backHref="/"
        backLabel="হোমে ফিরুন"
        title="আবার স্বাগতম"
        description="আপনার ড্যাশবোর্ডে লগইন করুন।"
      />
      {authError && (
        <p role="alert" className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-800">
          লগইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।
        </p>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-3 [@media(min-width:640px)_and_(max-height:500px)]:space-y-2">
          <div className="grid gap-3 [@media(min-width:640px)_and_(max-height:500px)]:grid-cols-2">
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>পাসওয়ার্ড</FormLabel>
                  <AuthPasswordInput {...field} autoComplete="current-password" label="পাসওয়ার্ড" />
                  <FormMessage lang="en" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end text-sm">
            <Link href="/forgot-password" className="inline-flex min-h-11 items-center rounded-md font-medium text-teal-800 hover:underline focus-visible:outline-teal-700">
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </div>

          <Button type="submit" disabled={isLoading} className={authButtonClass}>
            {isLoading ? "লগইন হচ্ছে…" : "লগইন"}
          </Button>

          <p className="text-center text-sm leading-relaxed text-slate-600">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/sign-up" className="inline-flex min-h-11 items-center rounded-md font-semibold text-teal-800 hover:underline focus-visible:outline-teal-700">
              নতুন অ্যাকাউন্ট খুলুন
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
