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
    console.error(`Failed to fetch channel ${parent_url}`, response);
    return null;
  }
  const data = await response.json();
  return data.channel;
};

export const fetchProfileByFid = async (fid: number) => {
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
    {
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.NEYNAR_API_KEY as string,
      },
    }
  );
  // log error if response is not ok
  if (!response.ok) {
    console.error(`Failed to fetch profile by fid ${fid}`, response);
    return null;
  }
  const data = await response.json();
  return data.users[0];
};

export const fetchProfileByName = async (name: string) => {
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/search?q=${name}`,
    {
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.NEYNAR_API_KEY as string,
      },
    }
  );
  // log error if response is not ok
  if (!response.ok) {
    console.error(`Failed to fetch profile by name for ${name}`, response);
    return null;
  }
  const data = await response.json();
  // todo: handle empty result
  return data.result.users[0];
};

export const fetchChannelByName = async (name: string) => {
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/channel/search?q=${name}`,
    {
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.NEYNAR_API_KEY as string,
      },
    }
  );
  // log error if response is not ok
  if (!response.ok) {
    console.error(`Failed to fetch channel ${name}`, response);
    return null;
  }
  const data = await response.json();
  // todo: handle empty result
  return data.channels[0];
};
