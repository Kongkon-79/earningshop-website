import { NextResponse } from "next/server";
import { BackendAuthError, verifyPasswordResetOtp } from "@/lib/backend-auth";
import { verifyOtpSchema } from "@/lib/forgot-password";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const input = verifyOtpSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json(
      { success: false, message: input.error.issues[0]?.message ?? "Invalid email or OTP." },
      { status: 400 },
    );
  }

  try {
    const message = await verifyPasswordResetOtp(input.data);
    return NextResponse.json({ success: true, message });
  } catch (error) {
    if (error instanceof BackendAuthError && error.status >= 400 && error.status < 500) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { success: false, message: "Unable to verify the OTP. Please try again." },
      { status: 502 },
    );
  }
}
