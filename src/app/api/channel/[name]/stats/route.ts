// todo: add churnRate as well
import { NextResponse } from "next/server";
import { fetchFirstChannelFromDune } from "@/lib/dune";
import { fetchChannelById } from "@/lib/neynar";

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  const channel = await fetchChannelById(params.name);
  const [trends, churnRate] = await Promise.all([
    fetchFirstChannelFromDune(3714673, channel.url),
    fetchFirstChannelFromDune(3766009, channel.url),
  ]);
  const data = { ...trends, churn_rate: churnRate };

  const headers = new Headers();
  headers.set("Cache-Control", "s-maxage=86500");
  headers.set("pragma", "no-cache");
  return new NextResponse(JSON.stringify(data), {
    headers,
  });
}
