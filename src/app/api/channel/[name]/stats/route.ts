import { NextResponse } from "next/server";
import { fetchFirstChannelFromDune } from "@/lib/dune";
import { fetchChannelById } from "@/lib/neynar";
import { TopLevelStats } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  try {
    const channel = await fetchChannelById(params.name);
    if (!channel) {
      return new NextResponse("Channel not found", {
        status: 404,
      });
    }
    const [trends, churnResponse]: [TopLevelStats, any] = await Promise.all([
      fetchFirstChannelFromDune(3714673, channel.url),
      fetchFirstChannelFromDune(3766009, channel.url),
    ]);
    if (!trends) {
      return new NextResponse("Error finding analytics for channel", {
        status: 500,
      });
    }
    const data = {
      current_period_casts: trends.current_period_casts,
      casts_percentage_change: trends.casts_percentage_change,
      current_period_recasts: trends.current_period_recasts,
      recasts_percentage_change: trends.recasts_percentage_change,
      // todo: this needs to be fetched from alertcaster
      // current_period_mentions: trends.current_period_mentions,
      // mentions_percentage_change: trends.mentions_percentage_change,
      current_period_replies: trends.current_period_replies,
      replies_percentage_change: trends.replies_percentage_change,
      current_period_likes: trends.current_period_likes,
      likes_percentage_change: trends.likes_percentage_change,
      churn_rate: parseFloat(churnResponse?.churn_rate || "0"),
      total_followers: channel.follower_count,
    };

    const headers = new Headers();
    headers.set("Cache-Control", "s-maxage=3600");
    return new NextResponse(JSON.stringify(data), {
      headers,
    });
  } catch (error) {
    console.error("Failed to fetch channel stats:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch channel data" }),
      { status: 500 }
    );
  }
}
