import { NextResponse } from "next/server";
import { fetchFirstChannelFromDune } from "@/lib/dune";
import { fetchChannelById } from "@/lib/neynar";
import { FollowerTier } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  const channel = await fetchChannelById(params.channelId);
  const [followerTiers, powerBadgeFollowers] = await Promise.all([
    fetchFirstChannelFromDune(3715790, channel.url),
    fetchFirstChannelFromDune(3715907, channel.url),
  ]);

  const tierCounts: { [key: string]: number } = followerTiers.tier_name_counts;
  const tierPercentages: { [key: string]: number } =
    followerTiers.tier_name_percentages;

  const tierMap: FollowerTier[] = [];

  for (const tier in tierCounts) {
    const count = tierCounts[tier];
    const percentage = tierPercentages[tier] || 0;
    tierMap.push({ tier, count, percentage });
  }

  const sortedMap = tierMap.sort((a, b) => {
    return b.percentage - a.percentage;
  });

  const data = [powerBadgeFollowers, ...sortedMap];

  const headers = new Headers();
  headers.set("Cache-Control", "max-age=3600");
  return new NextResponse(JSON.stringify(data), {
    headers,
  });
}
