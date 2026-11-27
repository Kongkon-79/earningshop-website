"use client";

import { LoaderCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { taskProofFormatMessage, taskProofMaxBytes, taskProofSizeMessage, taskProofTypes } from "@/lib/task-proof";

export const proofDialogClass = "max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] overflow-y-auto rounded-2xl bg-white p-4 sm:p-6 [&>button]:grid [&>button]:size-11 [&>button]:place-items-center";

type WorkProofFormProps = {
  id: string;
  resubmitting?: boolean;
  onBusyChange: (busy: boolean) => void;
  onUploaded: () => void;
};

export default function WorkProofForm({ id, resubmitting = false, onBusyChange, onUploaded }: WorkProofFormProps) {
  const router = useRouter();
  const helpId = useId();
  const uploading = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const actionLabel = resubmitting ? "আবার জমা দিন" : "কাজ জমা দিন";

  async function submitProof(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploading.current) return;

    const body = new FormData(event.currentTarget);
    const image = body.get("image");
    if (!(image instanceof File) || !image.size || !taskProofTypes.includes(image.type)) {
      setError(taskProofFormatMessage);
      return;
    }
    if (image.size > taskProofMaxBytes) {
      setError(taskProofSizeMessage);
      return;
    }

    uploading.current = true;
    setBusy(true);
    onBusyChange(true);
    setError("");
    const encodedId = encodeURIComponent(id);
    const url = resubmitting
      ? "/api/tasks/submissions/" + encodedId + "/resubmit"
      : "/api/tasks/" + encodedId + "/submissions";
    try {
      const response = await fetch(url, { method: resubmitting ? "PATCH" : "POST", body });
      const result: { success?: boolean; message?: string } | null = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) {
        setError(result?.message || "স্ক্রিনশট জমা দেওয়া যায়নি। আবার চেষ্টা করুন।");
        if (response.status === 409) router.refresh();
        return;
      }

      onUploaded();
      toast.success(resubmitting ? "স্ক্রিনশট আবার জমা হয়েছে।" : "কাজ জমা হয়েছে। অ্যাডমিন যাচাইয়ের পর স্ট্যাটাস আপডেট হবে।");
      router.refresh();
    } catch {
      setError("কাজ জমা দেওয়া যায়নি। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।");
    } finally {
      uploading.current = false;
      setBusy(false);
      onBusyChange(false);
    }
  }

  return (
    <form onSubmit={submitProof} aria-busy={busy} className="space-y-3 border-t border-slate-200 pt-4">
      <label className="block text-sm font-semibold text-slate-900">
        স্ক্রিনশট আপলোড করুন
        <input
          type="file"
          name="image"
          accept={taskProofTypes.join(",")}
          required
          disabled={busy}
          aria-describedby={helpId}
          aria-invalid={Boolean(error)}
          onChange={() => setError("")}
          className="mt-2 block w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-2 text-sm text-slate-700 file:mr-2 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700"
        />
      </label>
      <p id={helpId} className="text-xs text-slate-600">JPG, PNG বা WebP · সর্বোচ্চ ৪ এমবি</p>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={busy} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-65">
        {busy ? <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin" /> : <Upload aria-hidden="true" className="size-4" />}
        {busy ? "জমা হচ্ছে…" : actionLabel}
      </button>
    </form>
  );
}
