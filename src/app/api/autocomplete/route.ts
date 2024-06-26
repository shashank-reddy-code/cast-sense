import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const term = new URL(req.url).searchParams.get("q");
  if (!term) {
    return {
      status: 400,
      body: JSON.stringify({ error: "Bad Request" }),
    };
  }
  const name = encodeURIComponent(term);
  try {
    const userPromise = fetch(
      `https://api.neynar.com/v2/farcaster/user/search?q=${name}&viewer_fid=3`,
      {
        headers: {
          "Content-Type": "application/json",
          api_key: process.env.NEYNAR_API_KEY as string,
        },
        next: { revalidate: 86500 },
      }
    );

    const channelPromise = await fetch(
      `https://api.neynar.com/v2/farcaster/channel/search?q=${name}`,
      {
        headers: {
          "Content-Type": "application/json",
          api_key: process.env.NEYNAR_API_KEY as string,
          cache: "no-store",
        },
        // next: { revalidate: 86500 },
      }
    );

    const [userResponse, channelResponse] = await Promise.all([
      userPromise,
      channelPromise,
    ]);

    // log error if response is not ok

    let channels = [];
    if (!channelResponse.ok) {
      console.error(`Failed to search channel ${name}`, channelResponse);
    } else {
      const data = await channelResponse.json();
      channels = data.channels.slice(0, 5);
    }

    let users = [];
    if (!userResponse.ok) {
      console.error(`Failed to search user ${name}`, userResponse);
    } else {
      const data = await userResponse.json();
      users = data.result.users.slice(0, 5);
    }

    const headers = new Headers();
    headers.set("Cache-Control", "s-maxage=3600");
    return new NextResponse(JSON.stringify({ users, channels }), {
      headers,
    });
  } catch (error) {
    console.error(`Failed to search for ${name} in autocompletee`, error);
    return {
      status: 200,
      body: JSON.stringify({ users: [], channels: [] }),
    };
  }
}
