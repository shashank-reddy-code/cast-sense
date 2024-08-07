import { NextResponse } from "next/server";
import { fetchFirstFidFromDune } from "@/lib/dune";
import { TopLevelStats } from "@/lib/types";
import { fetchSubscriberCount } from "@/lib/neynar";

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const fid = parseInt(params.fid);
  const [duneStats, totalSubscribers]: [TopLevelStats, number] =
    await Promise.all([
      fetchFirstFidFromDune(3555616, fid),
      fetchSubscriberCount(fid),
    ]);
  const data: TopLevelStats = {
    ...duneStats,
    subscribers: totalSubscribers,
  };
  const headers = new Headers();
  headers.set(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate"
  );
  return new NextResponse(JSON.stringify(data), {
    headers,
  });
}
