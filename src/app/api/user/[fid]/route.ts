import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const fid = parseInt(params.fid);

  try {
    const [neynarResponse, icebreakerResponse] = await Promise.all([
      fetch(
        `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}&viewer_fid=3`,
        {
          headers: {
            "Content-Type": "application/json",
            api_key: process.env.NEYNAR_API_KEY as string,
            "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
          },
        }
      ),
      fetch(`https://app.icebreaker.xyz/api/v1/fid/${fid}`, {
        headers: {
          accept: "application/json",
        },
      }),
    ]);

    if (!neynarResponse.ok) {
      console.error(`Failed to lookup ${fid} on Neynar`, neynarResponse);
      return NextResponse.json(
        JSON.stringify({ error: "Failed to fetch user from Neynar" })
      );
    }

    const neynarData = await neynarResponse.json();

    if (neynarData.users.length === 0) {
      return NextResponse.json(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const user = neynarData.users[0];

    let twitterUrl, linkedinUrl, icebreakerUrl;

    if (icebreakerResponse.ok) {
      const icebreakerData = await icebreakerResponse.json();

      // Extract Twitter and LinkedIn URLs from Icebreaker data
      twitterUrl = icebreakerData.profiles[0]?.channels.find(
        (channel: any) => channel.type === "twitter"
      )?.url;
      linkedinUrl = icebreakerData.profiles[0]?.channels.find(
        (channel: any) => channel.type === "linkedin"
      )?.url;

      if (twitterUrl || linkedinUrl) {
        icebreakerUrl =
          `https://app.icebreaker.xyz/profiles/` +
          icebreakerData.profiles[0]?.profileID;
      }
    } else {
      console.warn(`Failed to lookup ${fid} on Icebreaker`, icebreakerResponse);
    }

    // Combine the data
    const combinedData = {
      ...user,
      twitterUrl,
      linkedinUrl,
      icebreakerUrl,
    };

    const headers = new Headers();
    headers.set(
      "Cache-Control",
      "no-store, no-cache, max-age=0, must-revalidate"
    );

    return new NextResponse(JSON.stringify(combinedData), {
      headers,
    });
  } catch (error) {
    console.error(`Failed to fetch user data`, error);
    return NextResponse.json(
      JSON.stringify({ error: "Failed to fetch user data" })
    );
  }
}
