import { NextResponse } from "next/server";
import { fetchFirstChannelFromDune } from "@/lib/dune";
import { fetchChannelById } from "@/lib/neynar";
import { DailyActivity, DailyFollower } from "@/lib/types";
import { fillMissingDates } from "@/lib/utils";

// todo: split dailyActivity into a separate API
export async function GET(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  const channel = await fetchChannelById(params.channelId);
  const dailyFollower = await fetchFirstChannelFromDune(3715676, channel.url);
  if (!dailyFollower) {
    console.error("No daily engagement data found for channel", channel.url);
    return new NextResponse(JSON.stringify([[], []]));
  }

  let dailyFollowers: DailyFollower[] = [];
  let dailyActivity: DailyActivity[] = [];

  dailyFollower?.daily_casters.forEach((item: any) => {
    const date = new Date(item[0]); // Create a date object from the datetime string
    const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

    dailyFollowers.push({
      date: formattedDate,
      followers: item[1], // Index 1 for followers
      unfollowers: 0, // this data is not on-hub yet
    });

    dailyActivity.push({
      date: formattedDate,
      casts: item[2],
    });
  });
  const dailyActivityFilled = fillMissingDates(dailyActivity);
  const data = [dailyFollowers, dailyActivityFilled];

  const headers = new Headers();
  headers.set("Cache-Control", "max-age=86500");
  headers.set("pragma", "no-cache");
  return new NextResponse(JSON.stringify(data), {
    headers,
  });
}
