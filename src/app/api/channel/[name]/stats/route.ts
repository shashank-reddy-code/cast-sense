import { NextResponse } from "next/server";
import { fetchFirstChannelFromDune } from "@/lib/dune";
import { fetchChannelById } from "@/lib/neynar";
import { TopLevelStats } from "@/lib/types";

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
    const [trends, churnRate]: [TopLevelStats, number] = await Promise.all([
      fetchFirstChannelFromDune(3714673, channel.url),
      fetchFirstChannelFromDune(3766009, channel.url),
    ]);
    if (!trends) {
      return new NextResponse("Error finding analytics for channel", {
        status: 500,
      });
    }
    const data = { ...trends, churn_rate: churnRate };

    const headers = new Headers();
    headers.set("Cache-Control", "s-maxage=3600");
    headers.set("Access-Control-Allow-Origin", "*");

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
