// /app/api/user/[fid]/follower-tiers/route.ts
import { NextResponse } from "next/server";
import { fetchFirstFidFromDune } from "@/lib/dune";
import { FollowerTier } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const fid = parseInt(params.fid);
  const [data, powerbadgeData] = await Promise.all([
    fetchFirstFidFromDune(4615610, fid),
    fetchFirstFidFromDune(3696361, fid),
  ]);

  const headers = new Headers();
  headers.set("Cache-Control", "s-maxage=60");
  if (!data || !powerbadgeData) {
    return new NextResponse(null, { status: 404 });
  }

  const result = await processFollowerTiers(data, powerbadgeData);

  return new NextResponse(JSON.stringify(result), { headers });
}

async function processFollowerTiers(
  data: any,
  powerbadgeData: any
): Promise<FollowerTier[]> {
  const followerTiers = data;
  const powerbadgeFollowers = powerbadgeData;
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

  const powerbadgeFollowerTier: FollowerTier = {
    tier: "⚡ power badge",
    count: powerbadgeFollowers?.count || 0,
    percentage: parseFloat(powerbadgeFollowers?.percentage || 0),
  };

  return [powerbadgeFollowerTier, ...sortedMap];
}
