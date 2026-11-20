"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { registrationSchema, type RegistrationPayload } from "@/lib/registration";
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
import { CircleCheck, Mail, Phone, UserRound } from "lucide-react";
import { AuthFormHeader, AuthPasswordInput, authButtonClass, authIconClass, authInputClass } from "../../auth-form-ui";
import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const linkStyle = "rounded-sm font-semibold text-teal-800 hover:underline focus-visible:outline-teal-700";

const formSchema = registrationSchema
  .extend({ confirmPassword: registrationSchema.shape.password })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "দুইটি পাসওয়ার্ড মিলছে না।",
  });

const SignupForm = ({ referralCode }: { referralCode?: string }) => {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (values: RegistrationPayload) => {
      const query = referralCode !== undefined ? `?${new URLSearchParams({ ref: referralCode })}` : "";
      const response = await fetch(`/api/auth/register${query}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success || typeof result.data?.email !== "string") {
        throw new Error(typeof result?.message === "string" ? result.message : "রেজিস্ট্রেশন সম্পন্ন হয়নি। আবার চেষ্টা করুন।");
      }
      return result.data.email as string;
    },
    onSuccess: (email) => {
      setRegisteredEmail(email);
      form.reset();
      setIsRegistrationModalOpen(true);
    },
    onError: (error) => toast.error(error.message),
  });

  function onSubmit({ fullName, email, phoneNumber, password }: z.infer<typeof formSchema>) {
    mutate({ fullName, email, password, ...(phoneNumber ? { phoneNumber } : {}) });
  }

  function openLogin() {
    setIsRegistrationModalOpen(false);
    router.push("/login");
  }

  return (
    <div>
      <Dialog open={isRegistrationModalOpen} onOpenChange={setIsRegistrationModalOpen}>
        <DialogContent lang="bn" className="w-[calc(100%-2rem)] max-w-[460px] max-h-[90dvh] overflow-y-auto rounded-[20px] border-0 bg-white p-6 font-sans shadow-2xl sm:rounded-[20px] sm:p-8">
          <DialogHeader className="items-center space-y-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-800 ring-8 ring-teal-50/50">
              <CircleCheck className="h-7 w-7 stroke-[2.25]" aria-hidden="true" />
            </div>
            <DialogTitle className="pt-2 text-2xl font-bold leading-tight tracking-tight text-[#1A1A1A]">
              অ্যাকাউন্ট তৈরি হয়েছে
            </DialogTitle>
            <DialogDescription className="max-w-[360px] text-center text-[15px] leading-6 text-black">
              <span className="break-all font-semibold">{registeredEmail}</span> দিয়ে এখন লগইন করতে পারবেন।
            </DialogDescription>
          </DialogHeader>

          <Button
            type="button"
            onClick={openLogin}
            className="mt-3 h-12 w-full rounded-[12px] bg-teal-800 text-base font-semibold text-white shadow-sm transition-colors hover:bg-teal-900"
          >
            লগইন করুন
          </Button>
        </DialogContent>
      </Dialog>

      <AuthFormHeader title="অ্যাকাউন্ট খুলুন" />

      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 sm:space-y-3 [@media(min-width:640px)_and_(max-height:500px)]:space-y-2">
          <div className="grid grid-cols-2 gap-3 [@media(min-width:640px)_and_(max-height:500px)]:grid-cols-3">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="min-w-0 space-y-1">
                  <FormLabel>পূর্ণ নাম</FormLabel>
                  <div className="relative">
                    <UserRound aria-hidden="true" className={authIconClass} />
                    <FormControl>
                      <Input {...field} autoComplete="name" placeholder="আপনার নাম" className={`${authInputClass} pl-9`} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="min-w-0 space-y-1">
                  <FormLabel>ফোন নম্বর (ঐচ্ছিক)</FormLabel>
                  <div className="relative">
                    <Phone aria-hidden="true" className={authIconClass} />
                    <FormControl>
                      <Input {...field} type="tel" autoComplete="tel" placeholder="01XXXXXXXXX" className={`${authInputClass} pl-9`} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-2 min-w-0 space-y-1 [@media(min-width:640px)_and_(max-height:500px)]:col-span-1">
                  <FormLabel>ইমেইল</FormLabel>
                  <div className="relative">
                    <Mail aria-hidden="true" className={authIconClass} />
                    <FormControl>
                      <Input {...field} type="email" autoComplete="email" placeholder="you@example.com" className={`${authInputClass} pl-9`} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="min-w-0 space-y-1">
                  <FormLabel>পাসওয়ার্ড</FormLabel>
                  <AuthPasswordInput {...field} autoComplete="new-password" label="পাসওয়ার্ড" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="min-w-0 space-y-1">
                  <FormLabel>পাসওয়ার্ড আবার দিন</FormLabel>
                  <AuthPasswordInput {...field} autoComplete="new-password" label="নিশ্চিতকরণ পাসওয়ার্ড" />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <p id="sign-up-consent" className="text-sm leading-snug text-slate-600">
            অ্যাকাউন্ট তৈরি করলে আপনি{" "}
            <Link href="/terms-of-use" className={linkStyle}>ব্যবহারের শর্তাবলি</Link>{" "}
            ও <Link href="/privacy-policy" className={linkStyle}>গোপনীয়তা নীতিতে</Link> সম্মতি দিচ্ছেন।
          </p>

          <Button type="submit" aria-describedby="sign-up-consent" disabled={isPending} className={authButtonClass}>
            {isPending ? "অ্যাকাউন্ট তৈরি হচ্ছে…" : "অ্যাকাউন্ট তৈরি করুন"}
          </Button>

          <p className="text-center text-sm leading-relaxed text-slate-600">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className={`inline-flex min-h-11 items-center ${linkStyle}`}>লগইন করুন</Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
