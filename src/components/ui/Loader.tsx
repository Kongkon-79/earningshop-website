import { Link2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import styles from "./Loader.module.css";

type LoaderVariant = "page" | "section" | "inline";

interface LoaderProps {
  variant?: LoaderVariant;
  message?: string;
  className?: string;
}

const variantClasses: Record<LoaderVariant, string> = {
  page: "fixed inset-0 z-[100] overflow-y-auto bg-[#faf9f4] bg-[radial-gradient(ellipse_at_top_right,_#d1fae5,_transparent_62%)]",
  section: "min-h-64 w-full bg-[#faf9f4]",
  inline: "min-h-40 w-full",
};

export default function Loader({ variant = "page", message, className }: LoaderProps) {
  const isInline = variant === "inline";

  return (
    <div className={cn("grid place-items-center px-4 py-6 font-sans", variantClasses[variant], className)}>
      <div
        className={cn(
          "flex w-full flex-col items-center text-center",
          isInline
            ? "max-w-xs gap-3"
            : "max-w-sm gap-4 rounded-3xl border border-teal-900/10 bg-white px-5 py-7 shadow-lg shadow-teal-950/10 sm:gap-5 sm:px-8 sm:py-9",
        )}
      >
        <Image
          src="/assets/images/logo.png"
          alt="Earningshop Limited"
          width={715}
          height={349}
          priority={variant === "page"}
          sizes={isInline ? "96px" : "(min-width: 640px) 176px, 144px"}
          className={cn("h-auto", isInline ? "w-24" : "w-36 sm:w-44")}
        />

        {!isInline && (
          <div lang="bn" className="flex flex-wrap justify-center gap-2 text-sm font-medium text-teal-900">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5">
              <ShoppingBag aria-hidden="true" className="size-4 shrink-0" />
              বেবি প্রোডাক্ট
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5">
              <Link2 aria-hidden="true" className="size-4 shrink-0" />
              রেফারেল
            </span>
          </div>
        )}

        <p
          role="status"
          lang={message ? undefined : "bn"}
          className={cn("break-words font-semibold leading-relaxed text-slate-800", isInline ? "text-sm" : "text-base")}
        >
          {message || "লোড হচ্ছে, একটু অপেক্ষা করুন…"}
        </p>

        <div aria-hidden="true" className="h-1.5 w-full max-w-36 overflow-hidden rounded-full bg-teal-100">
          <span className={cn("block h-full w-1/3 rounded-full bg-teal-700", styles.indicator)} />
        </div>
      </div>
    </div>
  );
}
