import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { createAuthOptions } from "@/lib/auth";
import { BackendProfileError, updateAccountProfile, updateAccountProfilePicture } from "@/lib/backend-profile";
import { profileUpdateSchema } from "@/lib/personal-profile";
import { profilePhotoFormatMessage, profilePhotoMaxBytes, profilePhotoSizeMessage, validateProfilePhoto } from "@/lib/profile-photo";

const loginMessage = "সেশন শেষ হয়েছে। আবার লগইন করুন।";
const saveError = "প্রোফাইল সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।";
const photoSaveError = "ছবি সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।";
const maxPhotoRequestBytes = profilePhotoMaxBytes + 32 * 1024;

function failure(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status });
}

async function hasImageSignature(file: File) {
  const bytes = Buffer.from(await file.slice(0, 12).arrayBuffer());
  switch (file.type) {
    case "image/jpeg":
      return [255, 216, 255].every((byte, index) => bytes[index] === byte);
    case "image/png":
      return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte);
    case "image/webp":
      return bytes.toString("latin1", 0, 4) === "RIFF"
        && bytes.toString("latin1", 8, 12) === "WEBP";
    default:
      return false;
  }
}

async function readProfilePicture(request: Request, contentType: string) {
  if (Number(request.headers.get("content-length")) > maxPhotoRequestBytes) {
    return failure(profilePhotoSizeMessage, 413);
  }
  if (!request.body) return failure("একটি ছবি বেছে নিন।", 400);

  const reader = request.body.getReader();
  let form: FormData;
  try {
    const bytes = new Uint8Array(maxPhotoRequestBytes);
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (length + value.byteLength > maxPhotoRequestBytes) {
        return failure(profilePhotoSizeMessage, 413);
      }
      bytes.set(value, length);
      length += value.byteLength;
    }
    form = await new Response(bytes.subarray(0, length), {
      headers: { "Content-Type": contentType },
    }).formData();
  } catch {
    return failure("ছবির ফাইলটি পড়া যায়নি।", 400);
  } finally {
    reader.releaseLock();
  }

  const files = form.getAll("profilePicture");
  const file = files[0];
  if (files.length !== 1 || typeof file === "string") {
    return failure("একটি ছবি বেছে নিন।", 400);
  }

  const error = validateProfilePhoto(file);
  if (error) return failure(error, file.size > profilePhotoMaxBytes ? 413 : 415);
  if (!(await hasImageSignature(file))) return failure(profilePhotoFormatMessage, 415);

  return file;
}

export async function PUT(request: Request) {
  const session = await getServerSession(createAuthOptions());
  if (!session?.user?.accessToken) return failure(loginMessage, 401);

  const contentType = request.headers.get("content-type") ?? "";
  const requestType = contentType.split(";")[0].trim().toLowerCase();
  const isPhoto = requestType === "multipart/form-data";
  if (!isPhoto && requestType !== "application/json") {
    return failure("প্রোফাইল তথ্যের ফরম্যাট সঠিক নয়।", 415);
  }

  const errorMessage = isPhoto ? photoSaveError : saveError;
  try {
    const { accessToken, id } = session.user;
    if (isPhoto) {
      const file = await readProfilePicture(request, contentType);
      if (file instanceof NextResponse) return file;

      const profile = await updateAccountProfilePicture(accessToken, file);
      if (profile.id !== id || !profile.profilePicture) return failure(photoSaveError, 502);
      return NextResponse.json({ success: true, profile });
    }

    const input = profileUpdateSchema.safeParse(await request.json().catch(() => null));
    if (!input.success) return failure("প্রোফাইলের ফিল্ডগুলো যাচাই করুন।", 400);

    const profile = await updateAccountProfile(accessToken, input.data);
    if (profile.id !== id) return failure(saveError, 502);
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    if (error instanceof BackendProfileError) {
      if (error.status === 401) return failure(loginMessage, 401);
      if (error.status === 403) return failure("প্রোফাইল বদলানোর অনুমতি পাওয়া যায়নি।", 403);
      if (error.status === 400 && !isPhoto) return failure("প্রোফাইলের ফিল্ডগুলো যাচাই করুন।", 400);
      if (error.status === 413 && isPhoto) return failure(profilePhotoSizeMessage, 413);
    }
    return failure(errorMessage, 502);
  }
}
