import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getMaxValue(engagementData: any, followersData: any) {
  const maxEngagement = Math.max(
    ...engagementData.map((e: any) => parseInt(e[1]))
  );
  const maxFollowers = Math.max(
    ...followersData.map((f: any) => parseInt(f[1]))
  );
  return Math.max(maxEngagement, maxFollowers);
}
