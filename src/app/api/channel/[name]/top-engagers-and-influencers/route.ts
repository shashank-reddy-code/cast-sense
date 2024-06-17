// todo: add churnRate as well
import { NextResponse } from "next/server";
import { fetchFirstChannelFromDune } from "@/lib/dune";
import { fetchChannelById, fetchUsersByFidBatch } from "@/lib/neynar";
import { TopEngager } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  const channel = await fetchChannelById(params.channelId);
  const row = await fetchFirstChannelFromDune(3715815, channel.url);
  const data = await parseRow(row);

  const headers = new Headers();
  headers.set("Cache-Control", "max-age=86500");
  headers.set("pragma", "no-cache");
  return new NextResponse(JSON.stringify(data), {
    headers,
  });
}

async function parseRow(
  row: any
): Promise<{ topEngagers: TopEngager[]; topInfluencers: TopEngager[] }> {
  const topCastersArray = row.top_caster_fids || [];
  const influentialCastersArray = row.influential_caster_fids || [];

  // rows are formatted as [fid, likes, recasts, replies]
  const topCastersPromise = fetchUsersByFidBatch(
    topCastersArray.map((item: number[]) => item[0])
  );
  const influentialCastersPromise = fetchUsersByFidBatch(
    influentialCastersArray.map((item: number[]) => item[0])
  );

  const [topCastersResult, influentialCastersResult] = await Promise.all([
    topCastersPromise,
    influentialCastersPromise,
  ]);

  // Map the additional properties back to the corresponding result
  const topEngagers = topCastersResult.map((profile: any, index: number) => {
    const original = topCastersArray[index];
    return {
      profile,
      likes: original[1],
      recasts: original[2],
      replies: original[3],
    };
  });

  const topInfluencers = influentialCastersResult.map(
    (profile: any, index: number) => {
      const original = influentialCastersArray[index];
      return {
        profile,
        likes: original[1],
        recasts: original[2],
        replies: original[3],
      };
    }
  );

  return {
    topEngagers,
    topInfluencers,
  };
}
