import { NextResponse } from "next/server";
import { fetchFirstChannelFromDune } from "@/lib/dune";
import { fetchChannelById } from "@/lib/neynar";
import { CastEngagementCount, TopAndBottomCasts } from "@/lib/types";
import { fetchMoxieCastEarnings } from "@/lib/airstack";

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

  // Collect hashes for top casts only
  const topHashes = topAndBottomCasts.top_hash.map((item: any[]) => item[0]);

  // Fetch Moxie earnings for top casts only
  const moxieEarnings = await fetchMoxieCastEarnings(topHashes);

  const mapCasts = (items: string[][]): CastEngagementCount[] =>
    items.map((item) => ({
      hash: item[0],
      engagement_count: Number(item[1]),
      like_count: Number(item[2]),
      recast_count: Number(item[3]),
      reply_count: Number(item[4]),
      power_badge_count: Number(item[5]),
      spam_count: Number(item[6]),
      degen_tip_count: Number(item[7]),
      total_moxie_count: moxieEarnings.get(item[0]) || 0,
      fname: item[7],
    }));

  const result: TopAndBottomCasts = {
    top_hash: mapCasts(topAndBottomCasts.top_hash),
    bottom_hash: mapCasts(topAndBottomCasts.bottom_hash),
  };

  const headers = new Headers();
  headers.set("Cache-Control", "s-maxage=60");
  return new NextResponse(JSON.stringify(result), {
    headers,
  });
}
