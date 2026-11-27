"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import WorkProofForm, { proofDialogClass } from "./work-proof-form";

export default function WorkResubmit({ id, taskTitle }: { id: string; taskTitle: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!busy) setOpen(nextOpen); }}>
      <DialogTrigger asChild>
        <button
          type="button"
          disabled={submitted}
          className="inline-flex min-h-10 items-center rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-60"
        >
          {submitted ? "পুনরায় জমা হয়েছে" : "আবার জমা দিন"}
        </button>
      </DialogTrigger>
      <DialogContent closeLabel="পুনরায় জমা দেওয়ার ফর্ম বন্ধ করুন" className={proofDialogClass}>
        <div className="space-y-1.5 pr-12">
          <DialogTitle className="leading-snug [overflow-wrap:anywhere]">{taskTitle}</DialogTitle>
          <DialogDescription>সংশোধিত স্ক্রিনশট আপলোড করে কাজটি আবার জমা দিন।</DialogDescription>
        </div>
        <WorkProofForm
          id={id}
          resubmitting
          onBusyChange={setBusy}
          onUploaded={() => { setSubmitted(true); setOpen(false); }}
        />
      </DialogContent>
    </Dialog>
  );
}
