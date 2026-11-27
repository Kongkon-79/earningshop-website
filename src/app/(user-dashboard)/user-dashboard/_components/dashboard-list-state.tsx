"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";

export default function DashboardListState({ icon, message, retry }: { icon: ReactNode; message: string; retry?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center sm:min-h-44">
      <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-600">
        {icon}
      </span>
      <p role={retry ? "alert" : "status"} className="text-sm font-semibold text-slate-800">{message}</p>
      {retry && (
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => router.refresh())}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-60"
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          {pending ? "লোড হচ্ছে…" : "আবার চেষ্টা করুন"}
        </button>
      )}
    </div>
  );
}
