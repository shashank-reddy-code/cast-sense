import { NextResponse } from "next/server";
import { fetchFirstChannelFromDune } from "@/lib/dune";
import { fetchChannelById, fetchUsersByFidBatch } from "@/lib/neynar";
import { TopEngager } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  try {
    const channel = await fetchChannelById(params.name);
    if (!channel) {
      return new NextResponse("Channel not found", {
        status: 404,
      });
    }
    const row = await fetchFirstChannelFromDune(3715815, channel.url, [
      "channel_url",
      "top_caster_fids",
      "influential_caster_fids",
      "top_casters",
    ]);
    if (!row) {
      return new NextResponse("Error finding analytics for channel", {
        status: 500,
      });
    }
    const data = await parseRow(row);

    const headers = new Headers();
    headers.set("Cache-Control", "s-maxage=3600");
    return new NextResponse(JSON.stringify(data), {
      headers,
    });
  } catch (error) {
    console.error("Failed to fetch channel stats:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch channel data" }),
      { status: 500 }
    );
  }
}

async function parseRow(row: any): Promise<{ results: TopEngager[] }> {
  const topCastersArray = row.top_caster_fids || [];

  // rows are formatted as [fid, likes, recasts, replies]
  const topCastersResult = await fetchUsersByFidBatch(
    topCastersArray.map((item: number[]) => item[0])
  );

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

  return {
    results: topEngagers,
  };
}
