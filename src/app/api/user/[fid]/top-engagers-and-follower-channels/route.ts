import { NextResponse } from "next/server";
import { fetchFirstFidFromDune } from "@/lib/dune";
import {
  fetchChannelsByParentUrlsBatch,
  fetchUsersByFidBatch,
} from "@/lib/neynar";
import { TopChannel, TopEngager } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const fid = parseInt(params.fid);
  const data = await fetchFirstFidFromDune(3738107, fid);
  const headers = new Headers();
  headers.set("Cache-Control", "s-maxage=86500");
  headers.set("pragma", "no-cache");

  const parsedData = await parseRow(data);
  return new NextResponse(JSON.stringify(parsedData), {
    headers,
  });
}

async function parseRow(row: any): Promise<{
  topEngagers: TopEngager[];
  channels: TopChannel[];
}> {
  if (!row) {
    return {
      topEngagers: [],
      channels: [],
    };
  }
  // Get the topEngagers and topChannels arrays
  const topEngagersArray = row.top_engager_fids;
  const topChannelsArray = row.top_channel_urls;

  // Fetch users and channels in batch
  // topEngagers are formatted as [fid, likes, recasts, replies]
  const engagerPromise = fetchUsersByFidBatch(
    topEngagersArray.map((item: number[]) => item[0])
  );
  // topChannels are formatted as [channelUrl, casts]
  const channelPromise = fetchChannelsByParentUrlsBatch(
    topChannelsArray.map((item: string[]) => item[0])
  );

  const [engagersResult, channelsResult] = await Promise.all([
    engagerPromise,
    channelPromise,
  ]);

  // Map the additional properties back to the corresponding result
  const topEngagers = engagersResult.map((profile: any, index: number) => {
    const original = topEngagersArray[index];
    return {
      profile,
      likes: original[1],
      recasts: original[2],
      replies: original[3],
    };
  });

  const channels = channelsResult.map((channel: any, index: number) => {
    const original = topChannelsArray[index];
    return {
      channel,
      casts: original[1],
    };
  });

  return {
    topEngagers,
    channels,
  };
}
