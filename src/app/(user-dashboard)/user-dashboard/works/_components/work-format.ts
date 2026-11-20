const rewardFormatter = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 2 });
const dateFormatter = new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium", timeZone: "Asia/Dhaka" });

export function formatWorkReward(amount: number) {
  return `৳ ${rewardFormatter.format(amount)}`;
}

export function formatWorkDate(value?: string) {
  const timestamp = value ? Date.parse(value) : NaN;
  return Number.isFinite(timestamp) ? dateFormatter.format(timestamp) : undefined;
}
