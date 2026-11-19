"use client";

import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { forwardRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const authInputClass = "h-11 rounded-xl border-slate-300 bg-white text-base focus-visible:ring-teal-700";
export const authIconClass = "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500";
export const authButtonClass = "h-11 w-full rounded-xl bg-teal-800 text-base font-semibold text-white hover:bg-teal-900 focus-visible:ring-teal-700";

export function AuthFormHeader({
  title,
  description,
  backHref,
  backLabel,
}: {
  title: string;
  description?: ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="mb-3">
      {backHref && backLabel && (
        <Link href={backHref} className="mb-1 inline-flex min-h-11 items-center gap-2 rounded-md text-sm text-slate-600 hover:text-teal-800 focus-visible:outline-teal-700">
          <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />
          {backLabel}
        </Link>
      )}
      <h1 className="text-2xl font-bold leading-snug sm:text-3xl">{title}</h1>
      {description && <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>}
    </header>
  );
}

type AuthPasswordInputProps = Omit<ComponentPropsWithoutRef<typeof Input>, "type" | "className"> & {
  label: string;
};

export const AuthPasswordInput = forwardRef<HTMLInputElement, AuthPasswordInputProps>(
  function AuthPasswordInput({ label, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    const VisibilityIcon = visible ? EyeOff : Eye;

    return (
      <div className="relative">
        <LockKeyhole aria-hidden="true" className={authIconClass} />
        <FormControl>
          <Input
            {...props}
            ref={ref}
            type={visible ? "text" : "password"}
            placeholder="••••••"
            className={`${authInputClass} pl-9 pr-11`}
          />
        </FormControl>
        <button
          type="button"
          aria-label={visible ? `${label} লুকান` : `${label} দেখুন`}
          onClick={() => setVisible((current) => !current)}
          className="absolute right-0 top-0 grid size-11 place-items-center rounded-xl text-slate-600 hover:text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700"
        >
          <VisibilityIcon aria-hidden="true" className="size-4" />
        </button>
      </div>
    );
  },
);
