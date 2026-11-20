"use client";

import { ArrowUpRight, Clapperboard, Play } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { TrainingVideo } from "./training-videos";

const actionClass = "absolute inset-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700";

export default function TrainingVideoCard({ video }: { video: TrainingVideo }) {
  const titleId = useId();
  const dialogTitleRef = useRef<HTMLHeadingElement>(null);
  const [failedThumbnail, setFailedThumbnail] = useState<string>();
  const thumbnail = failedThumbnail !== video.thumbnail ? video.thumbnail : undefined;
  const player = video.player;
  const ActionIcon = player ? Play : ArrowUpRight;

  return (
    <article className="group relative h-full min-w-0 rounded-2xl border border-slate-200 bg-white transition-colors hover:border-teal-400 motion-reduce:transition-none">
      <div aria-hidden="true" className="relative grid aspect-[13/6] place-items-center overflow-hidden rounded-t-2xl bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            unoptimized
            referrerPolicy="no-referrer"
            onError={() => setFailedThumbnail(thumbnail)}
          />
        ) : (
          <Clapperboard className="size-16 -translate-x-7 -rotate-12 text-teal-800/25 sm:size-20" />
        )}
        <span className="absolute inset-0 bg-slate-950/10 transition-colors group-hover:bg-slate-950/25 motion-reduce:transition-none" />
        <span className="absolute grid size-11 place-items-center rounded-full bg-slate-950/80 text-white shadow-md group-hover:bg-teal-800 sm:size-12">
          <ActionIcon className="size-5" />
        </span>
      </div>

      <div className="px-4 py-4 sm:px-5">
        <h2 id={titleId} className="font-bold leading-snug text-slate-900 [overflow-wrap:anywhere]">{video.title}</h2>
        {video.description && (
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere]">{video.description}</p>
        )}
      </div>

      {player ? (
        <Dialog>
          <DialogTrigger asChild>
            <button type="button" aria-labelledby={titleId} className={actionClass} />
          </DialogTrigger>
          <DialogContent
            aria-describedby={undefined}
            closeLabel="ভিডিও বন্ধ করুন"
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              dialogTitleRef.current?.focus();
            }}
            className="max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-3xl overflow-y-auto rounded-2xl bg-white p-4 sm:p-6 [&>button]:grid [&>button]:size-11 [&>button]:place-items-center"
          >
            <DialogTitle ref={dialogTitleRef} tabIndex={-1} className="min-h-11 pr-12 text-base font-bold leading-snug text-slate-900 [overflow-wrap:anywhere] sm:text-lg">
              {video.title}
            </DialogTitle>
            {player.type === "youtube" ? (
              <iframe
                title={video.title}
                src={player.url}
                className="aspect-video w-full rounded-xl bg-slate-950"
                allow="encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <video
                aria-label={video.title}
                src={player.url}
                className="aspect-video w-full rounded-xl bg-slate-950"
                controls
                playsInline
                preload="metadata"
              />
            )}
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg text-sm font-semibold text-teal-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              নতুন ট্যাবে ভিডিও খুলুন <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </DialogContent>
        </Dialog>
      ) : (
        <a href={video.url} target="_blank" rel="noopener noreferrer" aria-labelledby={titleId} aria-describedby={`${titleId}-target`} className={actionClass}>
          <span id={`${titleId}-target`} className="sr-only">নতুন ট্যাবে খুলবে</span>
        </a>
      )}
    </article>
  );
}
