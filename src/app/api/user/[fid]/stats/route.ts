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
  headers.set("Cache-Control", "s-maxage=3600");
  headers.set("Access-Control-Allow-Origin", "https://www.castsense.xyz");
  headers.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  return new NextResponse(JSON.stringify(data), {
    headers,
  });
}
