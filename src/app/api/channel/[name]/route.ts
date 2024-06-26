import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  try {
    const encodedName = encodeURIComponent(params.name);
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/channel/search?q=${encodedName}`,
      {
        headers: {
          "Content-Type": "application/json",
          api_key: process.env.NEYNAR_API_KEY as string,
          cache: "no-store",
        },
      }
    );
    // log error if response is not ok
    if (!response.ok) {
      console.error(`Failed to fetch channel ${name}`, response);
      return NextResponse.json(
        { error: "Failed to fetch channel by name" },
        { status: 500 }
      );
    }
    const data = await response.json();

    if (data.channels.length === 0) {
      return NextResponse.json(
        {
          error: "Channel not found",
        },
        {
          status: 404,
        }
      );
    }
    const channel = data.channels[0];

    const headers = new Headers();
    headers.set("Cache-Control", "s-maxage=3600");
    return new NextResponse(JSON.stringify(channel), {
      headers,
    });
  } catch (error) {
    console.error(`Failed to fetch channel by name`, error);
    return NextResponse.json(
      {
        error: "Failed to fetch channel by name",
      },
      { status: 500 }
    );
  }
}
