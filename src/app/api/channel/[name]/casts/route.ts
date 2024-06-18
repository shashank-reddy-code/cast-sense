// todo: add churnRate as well
import { NextResponse } from "next/server";
import { fetchFirstChannelFromDune } from "@/lib/dune";
import { fetchChannelById } from "@/lib/neynar";
import { CastEngagementCount } from "@/lib/types";

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
  const topAndBottomCasts = await fetchFirstChannelFromDune(
    3715759,
    channel.url
  );
  if (!topAndBottomCasts) {
    console.error("top and bottom casts not found for channel", params.name);
    const emptyData = {
      top_hash: [],
      bottom_hash: [],
    };
    return new NextResponse(JSON.stringify(emptyData));
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
  headers.set("Cache-Control", "s-maxage=86500");
  headers.set("pragma", "no-cache");
  return new NextResponse(JSON.stringify(data), {
    headers,
  });
}
