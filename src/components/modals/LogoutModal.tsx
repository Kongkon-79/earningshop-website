"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRef, useState, type ReactElement, type RefObject } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type LogoutModalProps = {
  callbackUrl?: string;
} & (
  | { children: ReactElement; open?: never; onOpenChange?: never; returnFocusRef?: never }
  | { children?: never; open: boolean; onOpenChange: (open: boolean) => void; returnFocusRef: RefObject<HTMLButtonElement> }
);

const actionClass = "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-center text-sm font-semibold leading-snug focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 aria-disabled:opacity-70";

export default function LogoutModal({ children, callbackUrl = "/", open, onOpenChange, returnFocusRef }: LogoutModalProps) {
  const [localOpen, setLocalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");
  const signingOut = useRef(false);

  function changeOpen(next: boolean) {
    if (signingOut.current) return;
    setError("");
    if (onOpenChange) onOpenChange(next);
    else setLocalOpen(next);
  }

  async function confirmLogout() {
    if (signingOut.current) return;
    signingOut.current = true;
    setIsSigningOut(true);
    setError("");

    try {
      await signOut({ callbackUrl });
    } catch {
      signingOut.current = false;
      setIsSigningOut(false);
      setError("লগআউট করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  return (
    <Dialog open={open ?? localOpen} onOpenChange={changeOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent
        lang="bn"
        closeLabel="লগআউট মডাল বন্ধ করুন"
        onCloseAutoFocus={(event) => {
          if (!returnFocusRef?.current) return;
          event.preventDefault();
          returnFocusRef.current.focus();
        }}
        className={cn(
          "max-h-[calc(100dvh_-_1.5rem)] w-[calc(100%_-_1.5rem)] max-w-sm gap-4 overflow-y-auto rounded-2xl border-slate-200 bg-white p-4 font-sans text-slate-900 sm:rounded-2xl sm:p-6 motion-reduce:animate-none",
          "isolate [&>button]:grid [&>button]:size-10 [&>button]:place-items-center [&>button]:rounded-lg [&>button]:bg-white",
          isSigningOut && "[&>button]:hidden",
        )}
      >
        <div className="pr-11">
          <span className="mb-3 grid size-11 place-items-center rounded-xl bg-red-50 text-red-700">
            <LogOut aria-hidden="true" className="size-5" />
          </span>
          <DialogTitle className="text-xl font-bold leading-snug">লগআউট করবেন?</DialogTitle>
        </div>
        <DialogDescription className="-mt-2 text-sm leading-relaxed text-slate-600">
          ড্যাশবোর্ড ব্যবহার করতে আবার লগইন করতে হবে।
        </DialogDescription>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
        <div className="grid grid-cols-2 gap-2.5">
          <DialogClose asChild>
            <button type="button" disabled={isSigningOut} className={cn(actionClass, "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus-visible:outline-slate-700")}>
              বাতিল
            </button>
          </DialogClose>
          <button
            type="button"
            onClick={confirmLogout}
            aria-disabled={isSigningOut}
            className={cn(actionClass, "bg-red-700 text-white hover:bg-red-800 focus-visible:outline-red-700")}
          >
            {isSigningOut && <LoaderCircle aria-hidden="true" className="size-4 shrink-0 motion-safe:animate-spin" />}
            {isSigningOut ? "লগআউট হচ্ছে…" : "লগআউট করুন"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
