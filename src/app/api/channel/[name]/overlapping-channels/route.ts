// todo: add churnRate as well
import { NextResponse } from "next/server";
import { fetchFirstChannelFromDune } from "@/lib/dune";
import {
  fetchChannelById,
  fetchChannelByUrl,
  fetchChannelsByParentUrlsBatch,
} from "@/lib/neynar";
import { TopChannel } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  const channel = await fetchChannelById(params.channelId);
  const result = await fetchFirstChannelFromDune(3746998, channel.url);
  const data: TopChannel[] = await fetchChannelsByParentUrlsBatch(
    result.top_similar_channels.map((item: string[]) => item[0])
  );
  //   const channelPromises = result.top_similar_channels.map(
  //     async (item: string[]) => {
  //       const channel = await fetchChannelByUrl(item[0]);
  //       return { channel, casts: item[1] };
  //     }
  //   );

  // const data: TopChannel[] = await Promise.all(channelPromises);

  const headers = new Headers();
  headers.set("Cache-Control", "max-age=3600");
  return new NextResponse(JSON.stringify(data), {
    headers,
  });
}
