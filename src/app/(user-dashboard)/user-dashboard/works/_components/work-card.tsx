"use client";

import { ArrowUpRight, Coins } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Work } from "./work-data";
import WorkProofForm, { proofDialogClass } from "./work-proof-form";
import { formatWorkDate, formatWorkReward } from "./work-format";

const externalLink = "inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700";

export default function WorkCard({ work }: { work: Work }) {
  const [open, setOpen] = useState(false);
  const [failedImage, setFailedImage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const image = work.image === failedImage ? undefined : work.image;
  const deadline = formatWorkDate(work.deadlineAt);

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
          <Dialog open={open} onOpenChange={(nextOpen) => { if (!isSubmitting) setOpen(nextOpen); }}>
            <DialogTrigger asChild>
              <button
                type="button"
                disabled={submitted}
                className="flex min-h-10 w-full items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold leading-snug text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:bg-slate-600 motion-reduce:transition-none"
              >
                {submitted ? "জমা দেওয়া হয়েছে" : "বিস্তারিত ও জমা দিন"}
              </button>
            </DialogTrigger>

            <DialogContent
              closeLabel="কাজের বিস্তারিত বন্ধ করুন"
              className={proofDialogClass}
            >
              <div className="pr-12">
                <DialogTitle className="text-lg font-bold leading-snug text-slate-900 [overflow-wrap:anywhere]">{work.title}</DialogTitle>
                <DialogDescription className="mt-1.5 text-sm font-semibold text-emerald-800">
                  রিওয়ার্ড {formatWorkReward(work.reward)}
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

              <WorkProofForm
                id={work.id}
                onBusyChange={setIsSubmitting}
                onUploaded={() => { setSubmitted(true); setOpen(false); }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </article>
  );
}
