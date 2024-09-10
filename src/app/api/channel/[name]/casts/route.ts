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

  // Collect all hashes
  const allHashes = [
    ...topAndBottomCasts.top_hash,
    ...topAndBottomCasts.bottom_hash,
  ].map((item) => item[0]);

  // Fetch Moxie earnings for all casts
  const moxieEarnings = await fetchMoxieCastEarnings(allHashes);

  const mapCasts = (items: string[][]): CastEngagementCount[] =>
    items.map((item) => ({
      hash: item[0],
      engagement_count: Number(item[1]),
      like_count: Number(item[2]),
      recast_count: Number(item[3]),
      reply_count: Number(item[4]),
      power_badge_count: Number(item[5]),
      degen_tip_count: Number(item[6]),
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
