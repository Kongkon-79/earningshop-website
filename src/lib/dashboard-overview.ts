import { z } from "zod";
import { backendApiUrl } from "./backend-url";

const balanceResponse = z.object({
  success: z.literal(true),
  data: z.object({ balance: z.number(), currency: z.literal("BDT") }),
});

const submissionCount = z.object({
  success: z.literal(true),
  meta: z.object({ total: z.number().int().nonnegative() }),
});

const approvedSubmissions = submissionCount.extend({
  data: z.array(z.object({
    _id: z.string(),
    taskTitle: z.string(),
    reward: z.number().nullish(),
    reviewedAt: z.string().nullish(),
  })),
});

async function readOverviewData<T>(
  schema: z.ZodType<T>,
  path: string,
  accessToken: string,
  params?: Record<string, string>,
): Promise<T | null> {
  try {
    const response = await fetch(backendApiUrl(path, params ? new URLSearchParams(params) : undefined), {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;

    const result = schema.safeParse(await response.json());
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export async function getTaskRewardBalance(accessToken: string) {
  const reward = await readOverviewData(balanceResponse, "/task/rewards/balance", accessToken);
  return reward?.data.balance ?? null;
}

export async function getDashboardOverview(accessToken: string) {
  const [balance, pending, approved] = await Promise.all([
    getTaskRewardBalance(accessToken),
    readOverviewData(submissionCount, "/task/submissions/me", accessToken, { status: "pending", limit: "1" }),
    readOverviewData(approvedSubmissions, "/task/submissions/me", accessToken, {
      status: "approved",
      sortBy: "reviewedAt",
      sortOrder: "desc",
      limit: "4",
    }),
  ]);

  return {
    balance,
    pending: pending?.meta.total ?? null,
    approved: approved?.meta.total ?? null,
    recentRewards: approved?.data ?? null,
  };
}
