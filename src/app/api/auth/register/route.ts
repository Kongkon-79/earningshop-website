import { NextResponse } from "next/server";
import { BackendAuthError, registerWithBackend } from "@/lib/backend-auth";
import { registrationSchema } from "@/lib/registration";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const registration = registrationSchema.safeParse(body);
  if (!registration.success) {
    return NextResponse.json(
      { success: false, message: registration.error.issues[0]?.message },
      { status: 400 },
    );
  }

  try {
    const account = await registerWithBackend(registration.data);
    return NextResponse.json({ success: true, data: account }, { status: 201 });
  } catch (error) {
    if (error instanceof BackendAuthError && error.status >= 400 && error.status < 500) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { success: false, message: "রেজিস্ট্রেশন সম্পন্ন হয়নি। আবার চেষ্টা করুন।" },
      { status: 502 },
    );
  }
}
