"use client";

import { ArrowUpRight, Coins, LoaderCircle, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Work } from "./work-data";
import { formatWorkDate, formatWorkReward } from "./work-format";

const imageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxImageSize = 4 * 1024 * 1024;
const externalLink = "inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700";

export default function WorkCard({ work, preview = false }: { work: Work; preview?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [failedImage, setFailedImage] = useState<string>();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const image = work.image === failedImage ? undefined : work.image;
  const deadline = formatWorkDate(work.deadlineAt);

  function changeOpen(nextOpen: boolean) {
    if (isSubmitting) return;
    setOpen(nextOpen);
    if (nextOpen) setError("");
  }

  async function submitProof(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || submitted || preview) return;

    const payload = new FormData(event.currentTarget);
    const screenshot = payload.get("image");
    if (!(screenshot instanceof File) || !screenshot.size || !imageTypes.includes(screenshot.type)) {
      setError("JPG, PNG বা WebP ফরম্যাটের একটি স্ক্রিনশট দিন।");
      return;
    }
    if (screenshot.size > maxImageSize) {
      setError("স্ক্রিনশটের সাইজ ৪ এমবির মধ্যে রাখুন।");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/tasks/${encodeURIComponent(work.id)}/submissions`, {
        method: "POST",
        body: payload,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) {
        setError(result?.message || "কাজ জমা দেওয়া যায়নি। আবার চেষ্টা করুন।");
        if (response.status === 409) router.refresh();
        return;
      }

      setSubmitted(true);
      setOpen(false);
      toast.success("কাজ জমা হয়েছে। অ্যাডমিন যাচাইয়ের পর স্ট্যাটাস আপডেট হবে।");
      router.refresh();
    } catch {
      setError("কাজ জমা দেওয়া যায়নি। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-sm focus-within:shadow-sm motion-reduce:transition-none">
      <div className="relative grid h-20 shrink-0 place-items-center bg-gradient-to-br from-emerald-50 via-[#f3faf0] to-[#fcf9ea] sm:h-24">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            referrerPolicy="no-referrer"
            onError={() => setFailedImage(image)}
          />
        ) : (
          <Coins aria-hidden="true" className="size-6 text-emerald-700/55" strokeWidth={1.65} />
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 py-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 font-bold leading-snug text-slate-900 [overflow-wrap:anywhere]">{work.title}</h3>
          <span className="shrink-0 whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold leading-none text-emerald-800">
            {formatWorkReward(work.reward)}
          </span>
        </div>
        {work.description && (
          <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere]">{work.description}</p>
        )}
        <div className="mt-auto pt-3">
          <Dialog open={open} onOpenChange={changeOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                disabled={submitted}
                className="flex min-h-10 w-full items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold leading-snug text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:bg-slate-600 motion-reduce:transition-none"
              >
                {submitted ? "জমা দেওয়া হয়েছে" : preview ? "বিস্তারিত দেখুন" : "বিস্তারিত ও জমা দিন"}
              </button>
            </DialogTrigger>

            <DialogContent
              closeLabel="কাজের বিস্তারিত বন্ধ করুন"
              className="max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] overflow-y-auto rounded-2xl bg-white p-4 sm:p-6 [&>button]:grid [&>button]:size-11 [&>button]:place-items-center"
            >
              <div className="pr-12">
                <DialogTitle className="text-lg font-bold leading-snug text-slate-900 [overflow-wrap:anywhere]">{work.title}</DialogTitle>
                <DialogDescription className="mt-1.5 text-sm font-semibold text-emerald-800">
                  {preview ? "নমুনা রিওয়ার্ড" : "রিওয়ার্ড"} {formatWorkReward(work.reward)}
                </DialogDescription>
              </div>

              {work.description && <p className="text-sm leading-relaxed text-slate-700 [overflow-wrap:anywhere]">{work.description}</p>}
              {deadline && <p className="text-sm text-slate-600">জমা দেওয়ার শেষ সময় <time dateTime={work.deadlineAt} className="font-semibold">{deadline}</time></p>}
              {work.instructions && (
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-sm font-bold text-slate-900">কাজের নির্দেশনা</p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-700 [overflow-wrap:anywhere]">{work.instructions}</p>
                </div>
              )}
              {(work.url || work.videoUrl) && (
                <div className="flex flex-wrap gap-x-4">
                  {work.url && <a href={work.url} target="_blank" rel="noopener noreferrer" className={externalLink}>কাজের লিংক খুলুন <ArrowUpRight aria-hidden="true" className="size-4" /></a>}
                  {work.videoUrl && <a href={work.videoUrl} target="_blank" rel="noopener noreferrer" className={externalLink}>গাইড ভিডিও দেখুন <ArrowUpRight aria-hidden="true" className="size-4" /></a>}
                </div>
              )}

              {preview ? (
                <p className="rounded-xl bg-emerald-50 p-3 text-sm leading-relaxed text-emerald-950">এটি একটি নমুনা কাজ। সক্রিয় কাজ প্রকাশ হলে জমা দেওয়ার অপশন পাবেন।</p>
              ) : (
                <form onSubmit={submitProof} aria-busy={isSubmitting} className="space-y-3 border-t border-slate-200 pt-4">
                  <label className="block text-sm font-semibold text-slate-900">
                    স্ক্রিনশট আপলোড করুন
                    <input
                      type="file"
                      name="image"
                      accept={imageTypes.join(",")}
                      required
                      disabled={isSubmitting}
                      aria-describedby={`work-image-help-${work.id}`}
                      onChange={() => setError("")}
                      className="mt-2 block w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-2 text-sm text-slate-700 file:mr-2 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700"
                    />
                  </label>
                  <p id={`work-image-help-${work.id}`} className="text-xs text-slate-600">JPG, PNG বা WebP · সর্বোচ্চ ৪ এমবি</p>
                  {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-65"
                  >
                    {isSubmitting ? <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin" /> : <Upload aria-hidden="true" className="size-4" />}
                    {isSubmitting ? "জমা হচ্ছে…" : "কাজ জমা দিন"}
                  </button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </article>
  );
}
