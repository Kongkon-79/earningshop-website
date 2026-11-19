import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
});

export const verifyOtpSchema = forgotPasswordSchema.extend({
  otp: z.string().regex(/^[0-9]{6}$/, "Please enter all 6 digits of the OTP."),
});

export type VerifyOtpPayload = z.infer<typeof verifyOtpSchema>;

export const resetPasswordSchema = forgotPasswordSchema.extend({
  newPassword: z.string().min(6, "Password must be at least 6 characters long."),
});

export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;

const responseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

async function postPasswordResetRequest(
  path: string,
  body: { email: string } | VerifyOtpPayload | ResetPasswordPayload,
  fallback: string,
): Promise<string> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = responseSchema.safeParse(await response.json().catch(() => null));
  if (!result.success) {
    throw new Error(fallback);
  }

  if (!response.ok || !result.data.success) {
    throw new Error(result.data.message);
  }

  return result.data.message;
}

export function requestPasswordReset(email: string) {
  return postPasswordResetRequest(
    "/api/auth/forgot-password",
    { email },
    "Unable to send the OTP. Please try again.",
  );
}

export function verifyResetOtp(values: VerifyOtpPayload) {
  return postPasswordResetRequest(
    "/api/auth/verify",
    values,
    "Unable to verify the OTP. Please try again.",
  );
}

export function resetPassword(values: ResetPasswordPayload) {
  return postPasswordResetRequest(
    "/api/auth/reset-password",
    values,
    "Unable to reset your password. Please try again.",
  );
}
