import { z } from "zod";
import type { ChangePasswordPayload } from "./change-password";
import type { ResetPasswordPayload, VerifyOtpPayload } from "./forgot-password";
import type { RegistrationPayload } from "./registration";
import { backendApiUrl } from "./backend-url";

const loginDataSchema = z.object({
  accessToken: z.string().min(1),
  user: z.object({
    _id: z.string().min(1),
    fullName: z.string().min(1),
    email: z.string().min(1),
    emailVerified: z.boolean(),
    role: z.string().min(1),
    phoneNumber: z.string().nullish(),
    status: z.string().min(1),
    referralCode: z.string().nullish(),
  }),
});

const authEnvelopeSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  data: z.unknown(),
});

// Server-side auth calls can use a private URL without exposing it in the browser.
export class BackendAuthError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

async function postToBackendAuth(path: string, body: unknown, accessToken?: string, query?: URLSearchParams) {
  const response = await fetch(backendApiUrl(path, query), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json().catch(() => {
    throw new Error(`Backend authentication returned a non-JSON response (${response.status})`);
  });
  const envelope = authEnvelopeSchema.safeParse(data);
  if (!response.ok || !envelope.success || envelope.data.success !== true) {
    throw new BackendAuthError(
      (envelope.success && envelope.data.message) ||
        `Backend authentication failed (${response.status})`,
      response.status,
    );
  }

  return envelope.data.data;
}

export async function backendAuthRequest(path: string, body: unknown) {
  const login = loginDataSchema.safeParse(await postToBackendAuth(path, body));
  if (!login.success) {
    throw new Error("Backend authentication returned an incomplete session");
  }

  return login.data;
}

const registeredAccountSchema = z.object({
  _id: z.string().min(1),
  fullName: z.string().min(1),
  email: z.string().min(1),
});

export async function registerWithBackend({ phoneNumber, ...registration }: RegistrationPayload, referralCode?: string) {
  const query = referralCode !== undefined ? new URLSearchParams({ ref: referralCode }) : undefined;
  const result = await postToBackendAuth("/auth/register", {
    ...registration,
    ...(phoneNumber ? { phoneNumber } : {}),
  }, undefined, query);
  return registeredAccountSchema.parse(result);
}

const authMessageSchema = z.object({ message: z.string().min(1) });

export async function sendPasswordResetOtp(email: string) {
  const data = await postToBackendAuth("/auth/forgot-password", { email });
  return authMessageSchema.parse(data).message;
}

export async function verifyPasswordResetOtp({ email, otp }: VerifyOtpPayload) {
  const data = await postToBackendAuth("/auth/verify", { email, otp });
  return authMessageSchema.parse(data).message;
}

export async function resetPasswordWithBackend({ email, newPassword }: ResetPasswordPayload) {
  const data = await postToBackendAuth("/auth/reset-password", { email, newPassword });
  return authMessageSchema.parse(data).message;
}

export async function changePasswordWithBackend({ oldPassword, newPassword }: ChangePasswordPayload, accessToken: string) {
  const data = await postToBackendAuth("/auth/change-password", { oldPassword, newPassword }, accessToken);
  return authMessageSchema.parse(data).message;
}
