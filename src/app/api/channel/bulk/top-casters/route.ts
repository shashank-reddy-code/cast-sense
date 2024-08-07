import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const channelUrls = (
    new URL(decodeURIComponent(req.url)).searchParams.get("channels") || ""
  ).split(",");

  const meta = {
    "x-dune-api-key": process.env.DUNE_API_KEY || "",
  };
  const header = new Headers(meta);

  const channelFilter = `channel_url in (${channelUrls
    .map((url) => `"${url}"`)
    .join(",")})`;
  const encodedChannelFilter = encodeURIComponent(channelFilter);
  const columns = [
    "channel_url",
    "top_caster_fids",
    "influential_caster_fids",
    "top_casters",
  ];

  try {
    const latest_response = await fetch(
      `https://api.dune.com/api/v1/query/3715815/results?&filters=${encodedChannelFilter}&columns=${columns.join(
        ","
      )}`,
      {
        method: "GET",
        headers: header,
      }
    );

    if (!latest_response.ok) {
      console.error(
        `Failed to fetch top casters for channels ${channelUrls}`,
        latest_response
      );
      return new NextResponse(JSON.stringify({}), {
        headers: {
          "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
        },
      });
    }

    const body = await latest_response.text();
    const result = JSON.parse(body).result.rows;

    const topCasters: { [key: string]: string[] } = {};
    result.forEach((item: any) => {
      const channelUrl = item.channel_url;
      topCasters[channelUrl] = item.top_casters
        .slice(0, 5)
        .map((casterCount: string[]) => casterCount[0]);
    });

    return new NextResponse(JSON.stringify(topCasters), {
      headers: {
        "Cache-Control": "s-maxage=3600",
      },
    });
  } catch (error) {
    console.error(
      `Failed to fetch top casters for channels ${channelUrls}`,
      error
    );
    return new NextResponse(JSON.stringify({}), {
      headers: {
        "Cache-Control": "s-maxage=3600",
      },
    });
  }
}
