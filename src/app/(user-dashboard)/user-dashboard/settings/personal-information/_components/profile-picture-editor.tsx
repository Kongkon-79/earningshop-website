"use client";

import { Camera, CheckCircle2, UserRound } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { profilePhotoTypes, validateProfilePhoto } from "@/lib/profile-photo";

const saveError = "ছবি সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।";
const outlineClass = "min-h-11 rounded-xl border-teal-200 bg-white font-semibold text-teal-900 hover:bg-teal-50 focus-visible:ring-teal-700";

export default function ProfilePictureEditor({ fullName, initialPicture }: { fullName: string; initialPicture: string }) {
  const router = useRouter();
  const picker = useRef<HTMLInputElement>(null);
  const [picture, setPicture] = useState(initialPicture);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [failedImage, setFailedImage] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const image = file && preview ? preview : picture;
  const previewError = Boolean(file && preview && failedImage === preview);

  function selectPicture(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    event.target.value = "";
    if (!selected) return;

    const error = validateProfilePhoto(selected);
    setSaved(false);
    setError(error ?? "");
    setFile(error ? null : selected);
    setPreview("");
    setFailedImage("");
  }

  function cancelSelection() {
    setFile(null);
    setPreview("");
    setError("");
  }

  async function savePicture() {
    if (!file || isUploading || previewError) return;

    setError("");
    setIsUploading(true);
    const body = new FormData();
    body.append("profilePicture", file);
    try {
      const response = await fetch("/api/account/profile", { method: "PUT", body });
      const result: { success?: boolean; message?: string; profile?: { profilePicture: string } } | null =
        await response.json().catch(() => null);
      if (!response.ok || !result?.success || !result.profile?.profilePicture) {
        setError(result?.message || saveError);
        return;
      }

      setPicture(result.profile.profilePicture);
      setFailedImage("");
      setFile(null);
      setPreview("");
      setSaved(true);
      router.refresh();
    } catch {
      setError(saveError);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <header className="flex flex-col gap-4 border-b border-teal-100 bg-teal-50 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-teal-100 bg-white text-teal-900">
          {image && image !== failedImage ? (
            <Image
              key={image}
              src={image}
              alt={file ? "নির্বাচিত ছবির প্রিভিউ" : "প্রোফাইল ছবি"}
              width={64}
              height={64}
              unoptimized
              referrerPolicy="no-referrer"
              onError={() => setFailedImage(image)}
              className="size-full object-cover"
            />
          ) : (
            <UserRound aria-hidden="true" className="size-7" />
          )}
        </span>
        <div className="min-w-0">
          <h2 id="profile-details-title" className="text-lg font-bold text-teal-950 [overflow-wrap:anywhere]">{fullName}</h2>
          <p className="text-sm text-teal-900">অ্যাকাউন্ট প্রোফাইল</p>
        </div>
      </div>

      <div className="min-w-0 space-y-2 sm:max-w-xs sm:flex-auto" aria-busy={isUploading}>
        <input
          ref={picker}
          type="file"
          aria-label="প্রোফাইল ছবি বেছে নিন"
          accept={profilePhotoTypes.join(",")}
          className="hidden"
          disabled={isUploading}
          onChange={selectPicture}
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className={outlineClass} disabled={isUploading} onClick={() => picker.current?.click()}>
            <Camera aria-hidden="true" />
            {file ? "অন্য ছবি বাছুন" : "ছবি পরিবর্তন করুন"}
          </Button>
          {file && (
            <>
              <Button
                type="button"
                className="min-h-11 rounded-xl bg-teal-900 font-semibold text-white hover:bg-teal-800 focus-visible:ring-teal-700"
                disabled={isUploading || previewError}
                onClick={savePicture}
              >
                {isUploading ? "আপলোড হচ্ছে…" : "ছবি সংরক্ষণ করুন"}
              </Button>
              <Button type="button" variant="outline" className={outlineClass} disabled={isUploading} onClick={cancelSelection}>
                বাতিল করুন
              </Button>
            </>
          )}
        </div>
        <p className="text-xs text-slate-600">JPG, PNG বা WebP · সর্বোচ্চ ৪ এমবি</p>
        {(error || previewError) && (
          <p role="alert" className="text-sm font-medium text-red-700">{error || "ছবিটি খোলা যায়নি। অন্য একটি ছবি বেছে নিন।"}</p>
        )}
        {saved && (
          <p role="status" className="flex items-center gap-2 text-sm font-semibold text-teal-900">
            <CheckCircle2 aria-hidden="true" className="size-4 shrink-0" />
            প্রোফাইল ছবি সংরক্ষণ হয়েছে।
          </p>
        )}
      </div>
    </header>
  );
}
