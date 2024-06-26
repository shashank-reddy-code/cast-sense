import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const fid = parseInt(params.fid);
  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}&viewer_fid=3`,
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
      console.error(`Failed to lookup ${fid}`, response);
      return NextResponse.json(
        JSON.stringify({ error: "Failed to fetch user" })
      );
    }
    const data = await response.json();
    if (data.users.length === 0) {
      return NextResponse.json(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    const user = data.users[0];
    const headers = new Headers();
    headers.set("Cache-Control", "s-maxage=3600");
    headers.set("Access-Control-Allow-Origin", "https://www.castsense.xyz");
    headers.set(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    return new NextResponse(JSON.stringify(user), {
      headers,
    });
  } catch (error) {
    console.error(`Failed to fetch trending channels`, error);
    return NextResponse.json(JSON.stringify({ error: "Failed to fetch user" }));
  }
}
