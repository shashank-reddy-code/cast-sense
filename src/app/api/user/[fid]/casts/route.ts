// /app/api/user/[fid]/casts/route.ts
import { NextResponse } from "next/server";
import { fetchFirstFidFromDune } from "@/lib/dune";
import { TopAndBottomCasts, CastEngagementCount } from "@/lib/types";
import { fetchMoxieCastEarnings } from "@/lib/airstack";

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const fid = parseInt(params.fid);
  const data = await fetchFirstFidFromDune(3697964, fid);
  const headers = new Headers();
  headers.set("Cache-Control", "s-maxage=60");
  if (!data) {
    return new NextResponse(null, { status: 404 });
  }

  // Collect hashes for top casts only
  const topHashes = data.top_hash.map((item: any[]) => item[0]);

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
      fname: data?.fname,
    }));

  const topHash: CastEngagementCount[] = mapCasts(data?.top_hash);
  const bottomHash: CastEngagementCount[] = mapCasts(data?.bottom_hash);

  const result: TopAndBottomCasts = {
    top_hash: topHash,
    bottom_hash: bottomHash,
  };

  return new NextResponse(JSON.stringify(result), { headers });
}
