import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchChannel = async (parent_url: string) => {
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/channel?id=${parent_url}&type=parent_url`,
    {
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.NEYNAR_API_KEY as string,
      },
    }
  );
  // log error if response is not ok
  if (!response.ok) {
    console.error("Failed to fetch channel", response);
    return null;
  }
  const data = await response.json();
  return data.channel;
};
