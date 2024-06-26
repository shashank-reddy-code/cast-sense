import { NextResponse } from "next/server";
import { fetchFirstChannelFromDune } from "@/lib/dune";
import { fetchChannelById } from "@/lib/neynar";
import { CastEngagementCount, DailyEngagement } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  const channel = await fetchChannelById(params.name);
  if (!channel) {
    return new NextResponse("Channel not found", {
      status: 404,
    });
  }
  const result = await fetchFirstChannelFromDune(3715718, channel.url);
  if (!result) {
    console.error("No daily engagement data found for channel", params.name);
    return new NextResponse(JSON.stringify([[], []]));
  }

  const dailyEngagement: DailyEngagement[] = result?.daily_engagement.map(
    (item: string[]) => {
      const date = new Date(item[0]); // Create a date object from the datetime string
      const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

      return {
        date: formattedDate,
        total: item[1],
        replies: item[2],
        recasts: item[3],
        likes: item[4],
      };
    }
  );
  // todo: optimize this repetitive loop
  const dailyPowerBadgeEngagement: DailyEngagement[] =
    result?.daily_engagement.map((item: string[]) => {
      const date = new Date(item[0]); // Create a date object from the datetime string
      const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

      return {
        date: formattedDate,
        total: item[5],
        replies: item[6],
        recasts: item[7],
        likes: item[8],
      };
    });
  const data = [dailyEngagement, dailyPowerBadgeEngagement];

  const headers = new Headers();
  headers.set("Cache-Control", "s-maxage=3600");
  headers.set("Access-Control-Allow-Origin", "https://www.castsense.xyz");
  headers.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  return new NextResponse(JSON.stringify(data), {
    headers,
  });
}
