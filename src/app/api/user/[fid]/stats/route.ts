import { NextResponse } from "next/server";
import { fetchFirstRowFromDune } from "@/lib/dune";
import { TopLevelStats } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const fid = parseInt(params.fid);
  const data: TopLevelStats = await fetchFirstRowFromDune(3555616, fid);
  const headers = new Headers();
  headers.set("Cache-Control", "max-age=3600");
  return new NextResponse(JSON.stringify(data), {
    headers,
  });
}
