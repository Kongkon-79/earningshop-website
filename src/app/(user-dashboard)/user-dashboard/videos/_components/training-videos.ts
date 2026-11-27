import { z } from "zod";
import { backendApiUrl } from "@/lib/backend-url";

const webUrl = z.url({ protocol: /^https?$/ });
const videoRecord = z.object({
  _id: z.string(),
  title: z.string().trim().min(1),
  description: z.string().nullish(),
  videoUrl: webUrl,
  thumbnailUrl: z.string().nullish(),
  status: z.literal("active").optional(),
});

const videoResponse = z.object({
  success: z.literal(true),
  meta: z.object({ total: z.number().int().nonnegative() }),
  data: z.array(z.unknown()),
});

export type TrainingVideo = {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnails: string[];
  player?: { type: "youtube" | "file"; url: string };
};

export const videosPerPage = 12;

function getYouTubeId(url: URL) {
  let id: string | null = null;
  const segments = url.pathname.split("/");

  switch (url.hostname) {
    case "youtu.be":
      id = segments[1];
      break;
    case "youtube.com":
    case "www.youtube.com":
    case "m.youtube.com":
    case "www.youtube-nocookie.com":
    case "youtube-nocookie.com":
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      if (["embed", "shorts", "live"].includes(segments[1])) id = segments[2];
      break;
  }

  return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : undefined;
}

export async function getTrainingVideos(page: number) {
  try {
    const query = new URLSearchParams({
      status: "active",
      page: String(page),
      limit: String(videosPerPage),
    });
    const response = await fetch(backendApiUrl("/video", query), {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;

    const result = videoResponse.safeParse(await response.json());
    if (!result.success) return null;

    const videos = result.data.data.flatMap((record): TrainingVideo[] => {
      const parsed = videoRecord.safeParse(record);
      if (!parsed.success) return [];

      const { _id, title, description, videoUrl, thumbnailUrl } = parsed.data;
      const url = new URL(videoUrl);
      const youtubeId = getYouTubeId(url);
      const customThumbnail = webUrl.safeParse(thumbnailUrl).data;
      const youtubeThumbnail = youtubeId ? "https://i.ytimg.com/vi/" + youtubeId + "/hqdefault.jpg" : undefined;
      const thumbnails = [customThumbnail, youtubeThumbnail].filter((src): src is string => Boolean(src));

      let player: TrainingVideo["player"];
      if (youtubeId) {
        player = { type: "youtube", url: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1` };
      } else if (/\.(mp4|webm|og[gv]|m4v)$/i.test(url.pathname)) {
        player = { type: "file", url: url.href };
      }

      return [{
        id: _id,
        title,
        description: description?.trim() ?? "",
        url: url.href,
        thumbnails: Array.from(new Set(thumbnails)),
        player,
      }];
    });

    return { videos, total: result.data.meta.total };
  } catch {
    return null;
  }
}
