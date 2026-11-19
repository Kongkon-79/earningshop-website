import { NextResponse } from "next/server";
import { BackendAuthError, sendPasswordResetOtp } from "@/lib/backend-auth";
import { forgotPasswordSchema } from "@/lib/forgot-password";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const input = forgotPasswordSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json(
      { success: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    const message = await sendPasswordResetOtp(input.data.email);
    return NextResponse.json({ success: true, message });
  } catch (error) {
    if (error instanceof BackendAuthError && error.status >= 400 && error.status < 500) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { success: false, message: "Unable to send the OTP. Please try again." },
      { status: 502 },
    );
  }
}
