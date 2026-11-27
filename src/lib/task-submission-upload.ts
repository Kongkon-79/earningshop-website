import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { createAuthOptions } from "@/lib/auth";
import { backendApiUrl } from "@/lib/backend-url";
import { taskProofFormatMessage, taskProofMaxBytes, taskProofSizeMessage, taskProofTypes } from "@/lib/task-proof";

const maxRequestBytes = taskProofMaxBytes + 64 * 1024;
const uploadErrorMessage = "স্ক্রিনশট জমা দেওয়া যায়নি। আবার চেষ্টা করুন।";
const loginMessage = "সেশন শেষ হয়েছে। আবার লগইন করুন।";

function failure(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status });
}

function isSameOrigin(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite) return fetchSite === "same-origin";

  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function uploadTaskProof(request: Request, id: string, action: "submit" | "resubmit") {
  const resubmitting = action === "resubmit";
  if (!isSameOrigin(request)) return failure("এই অনুরোধটি গ্রহণ করা হয়নি।", 403);

  const session = await getServerSession(createAuthOptions());
  const accessToken = session?.user?.accessToken;
  if (!accessToken) return failure(loginMessage, 401);
  if (session.user?.role !== "user") return failure("কাজ জমা দিতে ইউজার অ্যাকাউন্ট ব্যবহার করুন।", 403);

  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return failure("কাজটি পাওয়া যায়নি।", 404);
  }

  const contentType = request.headers.get("content-type");
  if (contentType?.split(";")[0].trim().toLowerCase() !== "multipart/form-data") {
    return failure("স্ক্রিনশট ফাইল হিসেবে আপলোড করুন।", 415);
  }

  if (Number(request.headers.get("content-length")) > maxRequestBytes) {
    return failure(taskProofSizeMessage, 413);
  }
  if (!request.body) return failure("একটি স্ক্রিনশট বেছে নিন।", 400);

  let formData: FormData;
  const reader = request.body.getReader();
  try {
    const bytes = new Uint8Array(maxRequestBytes);
    let receivedBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (receivedBytes + value.byteLength > maxRequestBytes) {
        return failure(taskProofSizeMessage, 413);
      }
      bytes.set(value, receivedBytes);
      receivedBytes += value.byteLength;
    }

    formData = await new Response(bytes.subarray(0, receivedBytes), {
      headers: { "Content-Type": contentType },
    }).formData();
  } catch {
    return failure("স্ক্রিনশট ফাইলটি পড়া যায়নি।", 400);
  } finally {
    reader.releaseLock();
  }

  const images = formData.getAll("image");
  const image = images[0];
  if (images.length !== 1 || typeof image === "string" || image.size === 0) {
    return failure("একটি স্ক্রিনশট বেছে নিন।", 400);
  }
  if (image.size > taskProofMaxBytes) return failure(taskProofSizeMessage, 413);
  if (!taskProofTypes.includes(image.type)) {
    return failure(taskProofFormatMessage, 415);
  }

  const proof = new FormData();
  proof.append("image", image);

  try {
    const path = resubmitting ? "/task/submissions/" + id + "/resubmit" : "/task/" + id + "/submissions";
    const response = await fetch(backendApiUrl(path), {
      method: resubmitting ? "PATCH" : "POST",
      body: proof,
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
    if (response.status === 401) return failure(loginMessage, 401);
    if (response.status === 403) return failure("কাজ জমা দিতে সক্রিয় অ্যাকাউন্ট প্রয়োজন।", 403);
    if (response.status === 404) {
      return failure(resubmitting ? "এই জমাটি এখন আবার পাঠানো যাচ্ছে না।" : "কাজটি পাওয়া যায়নি।", 404);
    }
    if (response.status === 409) {
      return failure(resubmitting ? "জমার স্ট্যাটাস বদলেছে। তালিকাটি দেখুন।" : "এই কাজটি আগেই জমা দিয়েছেন।", 409);
    }
    if (response.status === 400) return failure("স্ক্রিনশট বা কাজের তথ্য যাচাই করুন।", 400);
    if (response.status === 413) return failure(taskProofSizeMessage, 413);
    if (!response.ok) return failure(uploadErrorMessage, 502);

    const result: { success?: boolean } | null = await response.json().catch(() => null);
    if (result?.success !== true) return failure(uploadErrorMessage, 502);

    return NextResponse.json({ success: true, message: "স্ক্রিনশট জমা হয়েছে।" });
  } catch {
    return failure(uploadErrorMessage, 502);
  }
}
