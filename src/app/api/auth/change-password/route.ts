import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { createAuthOptions } from "@/lib/auth";
import { BackendAuthError, changePasswordWithBackend } from "@/lib/backend-auth";
import { changePasswordSchema } from "@/lib/change-password";

export async function POST(request: Request) {
  const session = await getServerSession(createAuthOptions());
  const accessToken = session?.user?.accessToken;
  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "সেশন শেষ হয়েছে। আবার লগইন করুন।" },
      { status: 401 },
    );
  }

  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return NextResponse.json(
      { success: false, message: "JSON request expected." },
      { status: 415 },
    );
  }

  const body: unknown = await request.json().catch(() => null);
  const input = changePasswordSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json(
      { success: false, message: input.error.issues[0]?.message ?? "পাসওয়ার্ড যাচাই করুন।" },
      { status: 400 },
    );
  }

  try {
    const message = await changePasswordWithBackend(input.data, accessToken);
    return NextResponse.json({ success: true, message });
  } catch (error) {
    if (error instanceof BackendAuthError && error.status >= 400 && error.status < 500) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { success: false, message: "পাসওয়ার্ড বদলানো যায়নি। আবার চেষ্টা করুন।" },
      { status: 502 },
    );
  }
}
