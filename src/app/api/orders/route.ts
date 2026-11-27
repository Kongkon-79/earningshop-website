import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { createAuthOptions } from "@/lib/auth";
import { backendApiUrl } from "@/lib/backend-url";
import { checkoutInput, checkoutOptions, checkoutReceipt } from "@/lib/checkout";

const signInMessage = "অর্ডার করতে আবার লগইন করুন।";
const unavailableMessage = "চেকআউটের তথ্য পাওয়া যায়নি। আবার চেষ্টা করুন।";

function failure(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

async function orderOptions(path: string) {
  const response = await fetch(backendApiUrl(path), {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  return response.ok ? (await response.json()).data : null;
}

export async function GET() {
  try {
    const [deliveryCharges, paymentMethods] = await Promise.all([
      orderOptions("/order/delivery-charges"),
      orderOptions("/order/payment-methods"),
    ]);
    if (!deliveryCharges) return failure("ডেলিভারি চার্জ পাওয়া যায়নি। চার্জ পাওয়া গেলে অর্ডার করুন।", 503);

    const parsed = checkoutOptions.safeParse({ deliveryCharges, paymentMethods });
    if (parsed.success) return NextResponse.json(parsed.data);
  } catch {
    return failure(unavailableMessage, 502);
  }
  return failure(unavailableMessage, 502);
}

export async function POST(request: Request) {
  const user = (await getServerSession(createAuthOptions()))?.user;
  if (!user?.accessToken || !user.email) return failure(signInMessage, 401);
  if (user.role !== "user") return failure("অর্ডার করতে ইউজার অ্যাকাউন্ট ব্যবহার করুন।", 403);

  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") return failure("অর্ডারের তথ্য যাচাই করুন।", 415);
  const result = checkoutInput.safeParse(await request.json().catch(() => null));
  if (!result.success) return failure("প্রোডাক্টের পরিমাণ ও ডেলিভারি তথ্য যাচাই করুন।", 400);

  const { senderPhone, transactionId, ...order } = result.data;
  const body = {
    ...order,
    email: user.email,
    ...(order.paymentMethod !== "cod" ? { senderPhone, transactionId } : {}),
  };

  try {
    const response = await fetch(backendApiUrl("/order"), {
      method: "POST",
      headers: { Authorization: "Bearer " + user.accessToken, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    if (response.status === 401) return failure(signInMessage, 401);
    if (response.status === 403) return failure("এই অ্যাকাউন্ট থেকে অর্ডার করা যাচ্ছে না।", 403);
    if (response.status === 400 || response.status === 404) {
      return failure("কার্টে থাকা প্রোডাক্ট ও ডেলিভারি তথ্য যাচাই করুন।", 400);
    }
    if (response.status === 409) return failure("এই ট্রানজ্যাকশন আইডি ইতিমধ্যে ব্যবহার করা হয়েছে।", 409);
    if (response.status === 503) return failure("ডেলিভারি চার্জ পাওয়া যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।", 503);
    if (response.ok) {
      const receipt = checkoutReceipt.safeParse((await response.json()).data);
      if (receipt.success) return NextResponse.json(receipt.data, { status: 201 });
    }
  } catch {
    return failure("অর্ডারের ফল নিশ্চিত করা যায়নি। আবার জমা দেওয়ার আগে অর্ডারের অবস্থা যাচাই করুন।", 502);
  }
  return failure("অর্ডারের ফল নিশ্চিত করা যায়নি। আবার জমা দেওয়ার আগে অর্ডারের অবস্থা যাচাই করুন।", 502);
}
