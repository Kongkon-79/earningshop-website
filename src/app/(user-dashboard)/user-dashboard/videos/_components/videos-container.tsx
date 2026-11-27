import { ArrowLeft, ArrowRight, Clapperboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import DashboardListState from "../../_components/dashboard-list-state";
import TrainingVideoCard from "./training-video-card";
import { getTrainingVideos, videosPerPage } from "./training-videos";

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
      {videos.length ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-[var(--dashboard-gutter)] xl:grid-cols-3">
          {videos.map((video) => (
            <li key={video.id} className="min-w-0">
              <TrainingVideoCard video={video} />
            </li>
          ))}
        </ul>
      ) : (
        <DashboardListState
          icon={<Clapperboard className="size-5" />}
          message={result ? "এখন কোনো ট্রেনিং ভিডিও প্রকাশিত নেই।" : "ভিডিও লোড করা যায়নি।"}
          retry={!result}
        />
      )}

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
