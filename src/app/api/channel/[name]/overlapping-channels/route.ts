import { NextResponse } from "next/server";
import { fetchFirstChannelFromDune } from "@/lib/dune";
import { fetchChannelById, fetchChannelsByParentUrlsBatch } from "@/lib/neynar";
import { Channel, TopChannel } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  const channel = await fetchChannelById(params.name);
  if (!channel) {
    return new NextResponse("Channel not found", {
      status: 404,
    });
  }
  const result = await fetchFirstChannelFromDune(3746998, channel.url);
  const channels: Channel[] = await fetchChannelsByParentUrlsBatch(
    result.top_similar_channels.map((item: string[]) => item[0])
  );
  const data = result.top_similar_channels.map((item: string[]) => {
    const parent_url = item[0];
    const casts = item[1];
    const channel = channels.find((ch) => ch.parent_url === parent_url);
    return { casts, channel };
  });

  const headers = new Headers();
  headers.set("Cache-Control", "s-maxage=3600");

  return new NextResponse(JSON.stringify(data), {
    headers,
  });
}
