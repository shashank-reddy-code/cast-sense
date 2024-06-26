import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/channel/trending?time_window=7d&limit=5`,
      {
        headers: {
          "Content-Type": "application/json",
          api_key: process.env.NEYNAR_API_KEY as string,
        },
        next: { revalidate: 86500 },
      }
    );

    // log error if response is not ok
    if (!response.ok) {
      console.error(`Failed to fetch trending channels`, response);
      return NextResponse.json(JSON.stringify([]));
    }
    const data = await response.json();
    const channels = data.channels.map((channel: any) => channel.channel);

    const headers = new Headers();
    headers.set("Cache-Control", "s-maxage=3600");
    headers.set("Access-Control-Allow-Origin", "*");
    return new NextResponse(JSON.stringify(channels), {
      headers,
    });
  } catch (error) {
    console.error(`Failed to fetch trending channels`, error);
    return NextResponse.json(JSON.stringify([]));
  }
}
