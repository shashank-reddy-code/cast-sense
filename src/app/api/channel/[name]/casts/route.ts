// todo: add churnRate as well
import { NextResponse } from "next/server";
import { fetchFirstChannelFromDune } from "@/lib/dune";
import { fetchChannelById } from "@/lib/neynar";
import { CastEngagementCount } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  const channel = await fetchChannelById(params.channelId);
  const topAndBottomCasts = await fetchFirstChannelFromDune(
    3715759,
    channel.url
  );
  if (!topAndBottomCasts) {
    console.error(
      "top and bottom casts not found for channel",
      params.channelId
    );
    return {
      top_hash: [],
      bottom_hash: [],
    };
  }

  const topHash: CastEngagementCount[] =
    topAndBottomCasts?.top_hash?.map((item: string[]) => {
      return {
        hash: item[0],
        engagement_count: item[1],
        like_count: item[2],
        recast_count: item[3],
        reply_count: item[4],
        power_badge_count: item[5],
        fname: item[6],
      };
    }) || [];

  const bottomHash: CastEngagementCount[] =
    topAndBottomCasts?.bottom_hash?.map((item: string[]) => {
      return {
        hash: item[0],
        engagement_count: item[1],
        like_count: item[2],
        recast_count: item[3],
        reply_count: item[4],
        power_badge_count: item[5],
        fname: item[6],
      };
    }) || [];

  const data = {
    top_hash: topHash,
    bottom_hash: bottomHash,
  };

  const headers = new Headers();
  headers.set("Cache-Control", "max-age=3600");
  return new NextResponse(JSON.stringify(data), {
    headers,
  });
}
