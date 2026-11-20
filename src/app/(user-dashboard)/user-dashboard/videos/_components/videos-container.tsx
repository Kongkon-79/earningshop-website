import { ArrowLeft, ArrowRight, ClipboardCheck, Link2, ListChecks, ShoppingBag, UserRoundPlus, Wallet } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import TrainingVideoCard from "./training-video-card";
import { getTrainingVideos, videosPerPage } from "./training-videos";

const guideTopics = [
  {
    title: "৩. ব্যালেন্স দেখা ও উইথড্র রিকোয়েস্ট",
    description: "ব্যালেন্স চেক করে bKash বা Nagad-এ উইথড্র করার নিয়ম।",
    icon: Wallet,
    colors: "from-emerald-100 to-teal-50 text-emerald-800",
  },
  {
    title: "২. কাজ করে আয় করার পদ্ধতি",
    description: "কাজ পেজ থেকে টাস্ক নিয়ে স্ক্রিনশট জমা দেওয়ার পুরো প্রক্রিয়া।",
    icon: ListChecks,
    colors: "from-sky-100 to-cyan-50 text-sky-800",
  },
  {
    title: "৪. শপ থেকে পণ্য অর্ডার ও পেমেন্ট",
    description: "অনলাইন পেমেন্ট ও ক্যাশ অন ডেলিভারি, দুটোরই নিয়ম।",
    icon: ShoppingBag,
    colors: "from-amber-100 to-orange-50 text-amber-800",
  },
  {
    title: "১. অ্যাকাউন্ট খোলা ও রেফারেল কোড নেওয়া",
    description: "রেজিস্টার করে নিজের রেফারেল কোড বের করা ও বন্ধুকে পাঠানোর নিয়ম।",
    icon: UserRoundPlus,
    colors: "from-indigo-100 to-violet-50 text-indigo-800",
  },
  {
    title: "কীভাবে কাজ জমা দেবেন",
    description: "স্ক্রিনশট আপলোড করে কাজ জমা দেওয়ার নিয়ম।",
    icon: ClipboardCheck,
    colors: "from-teal-100 to-emerald-50 text-teal-800",
  },
  {
    title: "রেফারেল লিংক শেয়ার করার নিয়ম",
    description: "রেফারেল কোড ও লিংক কপি করে শেয়ার করার নিয়ম।",
    icon: Link2,
    colors: "from-rose-100 to-pink-50 text-rose-800",
  },
];

const pageNumber = new Intl.NumberFormat("bn-BD");
const pageLinkClass = "inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-teal-800 hover:border-teal-400 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700";

function videosHref(page: number) {
  return page === 1 ? "/user-dashboard/videos" : `/user-dashboard/videos?page=${page}`;
}

export default async function VideosContainer({ page = 1 }: { page?: number }) {
  const result = await getTrainingVideos(page);
  const pageCount = result ? Math.max(1, Math.ceil(result.total / videosPerPage)) : 1;
  if (result && page > pageCount) redirect(videosHref(pageCount));

  const videos = result?.videos ?? [];

  return (
    <section aria-label="ট্রেনিং ভিডিওর তালিকা" className="pt-[var(--dashboard-gutter)]">
      {videos.length === 0 && (
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          {result
            ? "এই গাইডগুলোর ভিডিও প্রকাশ হলে এখান থেকে দেখা যাবে।"
            : "ভিডিও লোড করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।"}
        </p>
      )}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-[var(--dashboard-gutter)] xl:grid-cols-3">
        {videos.length > 0 ? videos.map((video) => (
          <li key={video.id} className="min-w-0">
            <TrainingVideoCard video={video} />
          </li>
        )) : guideTopics.map(({ title, description, icon: Icon, colors }) => (
          <li key={title} className="min-w-0">
            <article className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div
                aria-hidden="true"
                className={`relative grid aspect-[13/6] place-items-center overflow-hidden bg-gradient-to-br ${colors}`}
              >
                <span className="absolute -right-7 -top-12 size-36 rounded-full border border-current opacity-10" />
                <span className="absolute -bottom-16 -left-10 size-44 rounded-full bg-white/40" />
                <span className="relative grid size-16 place-items-center rounded-2xl border border-white/80 bg-white/75 shadow-sm sm:size-20 sm:rounded-3xl">
                  <Icon className="size-8 sm:size-9" strokeWidth={1.75} />
                </span>
              </div>
              <div className="px-4 py-4 sm:px-5">
                <h2 className="font-bold leading-snug text-slate-900">{title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {pageCount > 1 && (
        <nav aria-label="ভিডিও তালিকার পেজ" className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {page > 1 && (
            <Link href={videosHref(page - 1)} className={pageLinkClass} prefetch={false}>
              <ArrowLeft aria-hidden="true" className="size-4" /> আগের পেজ
            </Link>
          )}
          <p aria-current="page" className="text-sm text-slate-600">
            পেজ {pageNumber.format(page)} / {pageNumber.format(pageCount)}
          </p>
          {page < pageCount && (
            <Link href={videosHref(page + 1)} className={pageLinkClass} prefetch={false}>
              পরের পেজ <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          )}
        </nav>
      )}
    </section>
  );
}
