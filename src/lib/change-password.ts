import { z } from "zod";

const passwordSchema = z.string().min(6, "পাসওয়ার্ডে অন্তত ৬টি অক্ষর দিন।");

export const changePasswordSchema = z.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});

export const changePasswordFormSchema = changePasswordSchema
  .extend({ confirmPassword: z.string().min(1, "নতুন পাসওয়ার্ড আবার দিন।") })
  .refine(({ oldPassword, newPassword }) => oldPassword !== newPassword, {
    path: ["newPassword"],
    message: "নতুন পাসওয়ার্ডটি বর্তমান পাসওয়ার্ড থেকে আলাদা হতে হবে।",
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    path: ["confirmPassword"],
    message: "দুইটি পাসওয়ার্ড মিলছে না।",
  });

export type ChangePasswordPayload = z.infer<typeof changePasswordSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordFormSchema>;

const responseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export async function changeAccountPassword(values: ChangePasswordPayload) {
  const response = await fetch("/api/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const result = responseSchema.safeParse(await response.json().catch(() => null));
  if (response.ok && result.success && result.data.success) return;

  if (response.status === 401) {
    throw new Error("সেশন শেষ হয়েছে। আবার লগইন করে চেষ্টা করুন।");
  }
  if (result.success && result.data.message === "Invalid old password") {
    throw new Error("বর্তমান পাসওয়ার্ডটি সঠিক নয়।");
  }
  throw new Error(result.success ? result.data.message : "পাসওয়ার্ড বদলানো যায়নি। আবার চেষ্টা করুন।");
}
