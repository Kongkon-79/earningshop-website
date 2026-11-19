import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z.string().trim().min(1, "পূর্ণ নাম লিখুন।"),
  email: z.string().trim().email("সঠিক ইমেইল ঠিকানা লিখুন।"),
  phoneNumber: z.string().trim().optional(),
  password: z.string().min(6, "পাসওয়ার্ডে অন্তত ৬টি অক্ষর দিন।"),
});

export type RegistrationPayload = z.infer<typeof registrationSchema>;
