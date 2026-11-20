import { ArrowLeft, ArrowRight, ArrowUpRight, ClipboardList } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDashboardUser } from "@/lib/dashboard-auth";
import WorkCard from "./work-card";
import { getAvailableWorks, getWorkSubmissions, worksPerPage, type Work, type WorkSubmission } from "./work-data";
import { formatWorkDate, formatWorkReward } from "./work-format";

const exampleWorks: Work[] = [
  { id: "example-facebook", title: "Facebook পেজে লাইক ও শেয়ার", description: "আমাদের ফেসবুক পেজে লাইক ও পোস্ট শেয়ার করুন।", instructions: "", reward: 10 },
  { id: "example-app", title: "অ্যাপ ইনস্টল ও প্লে-স্টোর রিভিউ দিন", description: "নির্দিষ্ট অ্যাপ ইনস্টল করে আপনার অভিজ্ঞতা নিয়ে রিভিউ লিখুন।", instructions: "", reward: 40 },
  { id: "example-instagram", title: "ইনস্টাগ্রাম ফলো ও স্টোরি শেয়ার", description: "ইনস্টাগ্রাম অ্যাকাউন্ট ফলো করে রিল বা পোস্ট শেয়ার করুন।", instructions: "", reward: 12 },
  { id: "example-youtube", title: "YouTube ভিডিও দেখে লাইক ও কমেন্ট দিন", description: "নির্দিষ্ট ইউটিউব ভিডিওটি দেখে লাইক ও কমেন্ট দিন।", instructions: "", reward: 15 },
  { id: "example-member", title: "নতুন সদস্য ভেরিফিকেশন", description: "নিজের রেফারেল লিংকে নতুন সদস্য যোগ করিয়ে ভেরিফিকেশনের স্ক্রিনশট জমা দিন।", instructions: "", reward: 50 },
  { id: "example-product", title: "প্রোডাক্ট ভিডিও রিভিউ", description: "প্রোডাক্টের ৩০ সেকেন্ডের ছোট রিভিউ তৈরি করে স্ক্রিনশট জমা দিন।", instructions: "", reward: 35 },
  { id: "example-social", title: "সোশ্যাল মিডিয়া শেয়ার", description: "অফিশিয়াল পেজের নতুন পোস্ট নিজের টাইমলাইনে শেয়ার করে স্ক্রিনশট জমা দিন।", instructions: "", reward: 20 },
];

const submissionStatus = {
  pending: { label: "যাচাইয়ের অপেক্ষায়", color: "bg-amber-50 text-amber-900" },
  approved: { label: "অনুমোদিত", color: "bg-emerald-50 text-emerald-900" },
  rejected: { label: "প্রত্যাখ্যাত", color: "bg-red-50 text-red-800" },
} satisfies Record<WorkSubmission["status"], { label: string; color: string }>;

const numberFormatter = new Intl.NumberFormat("bn-BD");
const pageLinkClass = "inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-emerald-800 hover:border-emerald-400 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";

function worksHref(tasksPage: number, submissionsPage: number, anchor = "") {
  const params = new URLSearchParams();
  if (tasksPage > 1) params.set("tasksPage", String(tasksPage));
  if (submissionsPage > 1) params.set("submissionsPage", String(submissionsPage));
  const query = params.toString();
  return `/user-dashboard/works${query ? `?${query}` : ""}${anchor}`;
}

function Pagination({ label, page, total, href }: {
  label: string;
  page: number;
  total: number;
  href: (page: number) => string;
}) {
  if (total <= 1) return null;

  return (
    <nav aria-label={label} className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
      {page > 1 && (
        <Link href={href(page - 1)} prefetch={false} className={pageLinkClass}>
          <ArrowLeft aria-hidden="true" className="size-4" /> আগের পেজ
        </Link>
      )}
      <span className="text-sm text-slate-600">পেজ {numberFormatter.format(page)} / {numberFormatter.format(total)}</span>
      {page < total && (
        <Link href={href(page + 1)} prefetch={false} className={pageLinkClass}>
          পরের পেজ <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      )}
    </nav>
  );
}

export default async function WorksContainer({ tasksPage = 1, submissionsPage = 1 }: {
  tasksPage?: number;
  submissionsPage?: number;
} = {}) {
  const { accessToken } = await getDashboardUser();
  const [works, submissions] = await Promise.all([
    getAvailableWorks(accessToken, tasksPage),
    getWorkSubmissions(accessToken, submissionsPage),
  ]);

  const workPageCount = Math.max(1, Math.ceil((works?.total ?? 0) / worksPerPage));
  const submissionPageCount = Math.max(1, Math.ceil((submissions?.total ?? 0) / worksPerPage));
  if ((works && tasksPage > workPageCount) || (submissions && submissionsPage > submissionPageCount)) {
    redirect(worksHref(works ? Math.min(tasksPage, workPageCount) : tasksPage, submissions ? Math.min(submissionsPage, submissionPageCount) : submissionsPage));
  }

  const preview = !works?.items.length;
  const items = preview ? exampleWorks : works.items;

  return (
    <div className="space-y-6 pt-[var(--dashboard-gutter)] sm:space-y-8">
      <section id="available-works" aria-labelledby="available-works-title" className="scroll-mt-32">
        <h2 id="available-works-title" className="sr-only">কাজের তালিকা</h2>
        {preview && (
          <p className="mb-3 text-sm leading-relaxed text-slate-600">
            {works ? "এখন কোনো কাজ উপলভ্য নেই। নিচে নমুনা কাজ দেখতে পারেন।" : "কাজের তালিকা লোড করা যায়নি। নিচে নমুনা কাজ দেখানো হচ্ছে।"}
          </p>
        )}
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {items.map((work) => (
            <li key={work.id} className="min-w-0"><WorkCard work={work} preview={preview} /></li>
          ))}
        </ul>
        <Pagination label="কাজের তালিকার পেজ" page={tasksPage} total={workPageCount} href={(page) => worksHref(page, submissionsPage, "#available-works")} />
      </section>

      <section id="my-submissions" aria-labelledby="my-submissions-title" className="scroll-mt-32">
        <h2 id="my-submissions-title" className="mb-2.5 font-bold leading-snug text-slate-900 sm:mb-3 sm:text-lg">আমার জমা</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
          {submissions?.items.length ? (
            <ul className="divide-y divide-slate-200">
              {submissions.items.map((submission) => {
                const status = submissionStatus[submission.status];
                const date = formatWorkDate(submission.createdAt);
                return (
                  <li key={submission.id} className="flex flex-col gap-1.5 px-1 py-3 first:pt-1 last:pb-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 [overflow-wrap:anywhere]">{submission.taskTitle}</h3>
                      {date && <time dateTime={submission.createdAt} className="mt-1 block text-xs leading-relaxed text-slate-600">{date}</time>}
                      {submission.note && <p className="mt-1 text-sm leading-relaxed text-slate-700 [overflow-wrap:anywhere]">{submission.note}</p>}
                      {submission.imageUrl && (
                        <a href={submission.imageUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-8 items-center gap-1 text-xs font-semibold text-emerald-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700">
                          স্ক্রিনশট দেখুন <ArrowUpRight aria-hidden="true" className="size-3.5" />
                        </a>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2 text-xs font-semibold">
                      {submission.reward != null && <span className="text-slate-700">{formatWorkReward(submission.reward)}</span>}
                      <span className={`rounded-full px-2.5 py-1 ${status.color}`}>{status.label}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 text-center sm:min-h-44">
              <span className="grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-500">
                <ClipboardList aria-hidden="true" className="size-5" />
              </span>
              <p className="text-sm font-semibold text-slate-800">
                {submissions ? "এখনও কিছু জমা দেননি" : "জমা দেওয়া কাজের তালিকা লোড করা যায়নি"}
              </p>
            </div>
          )}
        </div>
        <Pagination label="জমা দেওয়া কাজের পেজ" page={submissionsPage} total={submissionPageCount} href={(page) => worksHref(tasksPage, page, "#my-submissions")} />
      </section>
    </div>
  );
}
