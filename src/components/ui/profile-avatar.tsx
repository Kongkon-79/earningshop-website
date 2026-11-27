"use client";

import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  src?: string;
  alt?: string;
  className?: string;
};

export default function ProfileAvatar({ src, alt = "", className }: ProfileAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const photo = src !== failedSrc ? src : undefined;

  return (
    <span
      aria-hidden={alt ? undefined : true}
      className={cn("grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-solid border-teal-300 bg-teal-50 text-teal-900", className)}
    >
      {photo ? (
        <Image
          src={photo}
          alt={alt}
          width={80}
          height={80}
          unoptimized
          referrerPolicy="no-referrer"
          className="size-full object-cover object-center"
          onError={() => setFailedSrc(photo)}
        />
      ) : (
        <CircleUserRound aria-hidden="true" className="size-1/2" />
      )}
    </span>
  );
}
