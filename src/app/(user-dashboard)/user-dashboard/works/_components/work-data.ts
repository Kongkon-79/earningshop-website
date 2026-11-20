import { z } from "zod";
import { backendApiUrl } from "@/lib/backend-url";

export type Work = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  reward: number;
  deadlineAt?: string;
  image?: string;
  url?: string;
  videoUrl?: string;
};

export type WorkSubmission = {
  id: string;
  taskTitle: string;
  status: "pending" | "approved" | "rejected";
  reward?: number;
  imageUrl?: string;
  note?: string;
  createdAt?: string;
};

const webUrl = z.url({ protocol: /^https?$/ });

const taskRecord = z.object({
  _id: z.string().min(1),
  title: z.string().trim().min(1),
  description: z.string().nullish(),
  instructions: z.string().nullish(),
  reward: z.number().nonnegative(),
  deadlineAt: z.string().nullish(),
  image: z.string().nullish(),
  url: z.string().nullish(),
  videoUrl: z.string().nullish(),
}).transform(({ _id, description, instructions, deadlineAt, image, url, videoUrl, ...task }): Work => ({
  ...task,
  id: _id,
  description: description?.trim() ?? "",
  instructions: instructions?.trim() ?? "",
  deadlineAt: deadlineAt && Number.isFinite(Date.parse(deadlineAt)) ? deadlineAt : undefined,
  image: webUrl.safeParse(image).data,
  url: webUrl.safeParse(url).data,
  videoUrl: webUrl.safeParse(videoUrl).data,
}));

const submissionRecord = z.object({
  _id: z.string().min(1),
  taskTitle: z.string().trim().min(1),
  reward: z.number().nonnegative().nullish(),
  status: z.enum(["pending", "approved", "rejected"]),
  imageUrl: z.string().nullish(),
  note: z.string().nullish(),
  createdAt: z.string().nullish(),
}).transform(({ _id, reward, imageUrl, note, createdAt, ...submission }): WorkSubmission => ({
  ...submission,
  id: _id,
  reward: reward ?? undefined,
  imageUrl: webUrl.safeParse(imageUrl).data,
  note: note?.trim() || undefined,
  createdAt: createdAt && Number.isFinite(Date.parse(createdAt)) ? createdAt : undefined,
}));

const listResponse = z.object({
  success: z.literal(true),
  meta: z.object({ total: z.number().int().nonnegative() }),
  data: z.array(z.unknown()),
});

export const worksPerPage = 12;

async function readWorkList<T>(
  path: string,
  schema: z.ZodType<T>,
  accessToken: string,
  page: number,
) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(worksPerPage),
    });
    const response = await fetch(backendApiUrl(path, params), {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;

    const result = listResponse.safeParse(await response.json());
    if (!result.success) return null;

    const items = result.data.data.flatMap((item) => {
      const parsed = schema.safeParse(item);
      return parsed.success ? [parsed.data] : [];
    });

    return { items, total: result.data.meta.total };
  } catch {
    return null;
  }
}

export function getAvailableWorks(accessToken: string, page: number) {
  return readWorkList("/task/available", taskRecord, accessToken, page);
}

export function getWorkSubmissions(accessToken: string, page: number) {
  return readWorkList("/task/submissions/me", submissionRecord, accessToken, page);
}
