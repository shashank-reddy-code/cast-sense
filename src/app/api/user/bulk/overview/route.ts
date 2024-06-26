import { FidOverview } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const fids = (
    new URL(decodeURIComponent(req.url)).searchParams.get("fids") || ""
  ).split(",");

  const meta = {
    "x-dune-api-key": process.env.DUNE_API_KEY || "",
  };
  const header = new Headers(meta);

  try {
    const fidFilter = `fid in (${fids.join(",")})`;
    const latest_response = await fetch(
      `https://api.dune.com/api/v1/query/3738107/results?&filters=${fidFilter}`,
      {
        method: "GET",
        headers: header,
        next: { revalidate: 86500 },
      }
    );
    if (latest_response.status !== 200) {
      console.error("Failed to fetch profile previews", latest_response);
      return NextResponse.json(JSON.stringify({}));
    }
    const body = await latest_response.text();
    const result = JSON.parse(body).result.rows;

    const fidsOverview: { [key: number]: FidOverview } = {};
    result.forEach((item: any) => {
      const top5Channels = item.top_channels
        .slice(0, 5)
        .map((c: string[0]) => c[0]);

      fidsOverview[item.fid] = {
        top_channel_names: top5Channels,
        openrank_rank: item.openrank_rank,
        openrank_percentile: item.openrank_percentile,
      };
    });
    return new NextResponse(JSON.stringify(fidsOverview), {
      headers: {
        "Cache-Control": "s-maxage=3600",
      },
    });
  } catch (error) {
    console.error(`Failed to fetch top casters for channels ${fids}`, error);
    return NextResponse.json(JSON.stringify({}));
  }
}
