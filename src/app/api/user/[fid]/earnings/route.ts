import { NextResponse } from "next/server";
import { fetchFirstFidFromDune } from "@/lib/dune";
import { Earnings } from "@/lib/types";
import { fetchMoxieEarnings } from "@/lib/airstack";

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const fid = parseInt(params.fid);
  const [earnings, moxieEarnings]: [Earnings, number] = await Promise.all([
    fetchFirstFidFromDune(4050787, fid),
    fetchMoxieEarnings(fid),
  ]);

  const totalEarnings =
    (earnings?.total || 0) +
    (moxieEarnings || 0) * (earnings?.moxie_usd_price || 0);

  const data = {
    ...earnings,
    total_earnings: totalEarnings,
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
