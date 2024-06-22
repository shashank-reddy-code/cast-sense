// /app/api/user/[fid]/casts/route.ts
import { NextResponse } from "next/server";
import { fetchFirstFidFromDune } from "@/lib/dune";
import { TopAndBottomCasts, CastEngagementCount } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const fid = parseInt(params.fid);
  const data = await fetchFirstFidFromDune(3697964, fid);
  const headers = new Headers();
  headers.set("Cache-Control", "s-maxage=3600");

  if (!data) {
    return new NextResponse(null, { status: 404 });
  }

  const topHash: CastEngagementCount[] = data?.top_hash.map(
    (item: string[]) => {
      return {
        hash: item[0],
        engagement_count: item[1],
        like_count: item[2],
        recast_count: item[3],
        reply_count: item[4],
        power_badge_count: item[5],
        fname: data?.fname,
      };
    }
  );

  const bottomHash: CastEngagementCount[] = data?.bottom_hash.map(
    (item: string[]) => {
      return {
        hash: item[0],
        engagement_count: item[1],
        like_count: item[2],
        recast_count: item[3],
        reply_count: item[4],
        power_badge_count: item[5],
        fname: data?.fname,
      };
    }
  );

  const result: TopAndBottomCasts = {
    top_hash: topHash,
    bottom_hash: bottomHash,
  };

  return new NextResponse(JSON.stringify(result), { headers });
}
