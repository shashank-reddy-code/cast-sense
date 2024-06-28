import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const timeout = 1000;
  const fid = parseInt(params.fid);
  try {
    const fetchWithTimeout = async (provider: string) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      try {
        // fetch all subscribers for 0xshash\
        // todo: check for specific contracts in here
        const response = await fetch(
          `https://api.neynar.com/v2/farcaster/user/subscribers?fid=646&subscription_provider=${provider}`,
          {
            headers: {
              "Content-Type": "application/json",
              api_key: process.env.NEYNAR_API_KEY as string,
            },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        clearTimeout(id);

        if (!response.ok) {
          console.error(
            `Failed to fetch subscribers for provider ${provider} and fid ${fid}`,
            response
          );
          return 0;
        }

        const data = await response.json();
        const isPro = data.subscribers.some(
          (subscriber: any) => subscriber.user.fid === fid
        );
        if (isPro) {
          console.log(`${fid} pro user logged in`);
        }
        return { isPro };
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.error(
            `Request timed out for provider ${provider} and fid ${fid}`
          );
        } else {
          console.error(
            `Error fetching subscribers for provider ${provider} and fid ${fid}`,
            error
          );
        }
        return { isPro: false };
      } finally {
        clearTimeout(id);
      }
    };

    const proStatus = await fetchWithTimeout("fabric_stp");
    const headers = new Headers();
    headers.set(
      "Cache-Control",
      "no-store, no-cache, max-age=0, must-revalidate"
    );
    return new NextResponse(JSON.stringify(proStatus), {
      headers,
    });
  } catch (error) {
    console.error(`Failed to fetch trending channels`, error);
    return NextResponse.json(JSON.stringify({ error: "Failed to fetch user" }));
  }
}
