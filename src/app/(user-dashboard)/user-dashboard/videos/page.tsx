import VideosContainer from "./_components/videos-container";

export default function VideosPage({ searchParams }: { searchParams?: { page?: string | string[] } }) {
  const value = searchParams?.page;
  const page = typeof value === "string" && /^\d{1,6}$/.test(value) ? Math.max(1, Number(value)) : 1;

  return <VideosContainer page={page} />;
}
