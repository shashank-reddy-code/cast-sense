import { NextResponse } from "next/server";
import { fetchFirstFidFromDune } from "@/lib/dune";
import { Benchmark } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const fid = parseInt(params.fid);
  const data: Benchmark = await fetchFirstFidFromDune(3696719, fid);
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
