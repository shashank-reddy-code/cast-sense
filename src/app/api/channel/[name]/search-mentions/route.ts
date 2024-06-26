import { NextResponse } from "next/server";
import { fetchChannelById } from "@/lib/neynar";

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  const channel = await fetchChannelById(params.name);
  if (!channel) {
    return new NextResponse("Channel not found", {
      status: 404,
    });
  }
  const response = await fetch(
    `https://alertcaster.xyz/api/search?q=/${params.name}&type=channel`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      //next: { revalidate: 86500 },
    }
  );
  // log error if response is not ok
  if (!response.ok) {
    console.error(`Failed to fetch channel ${channel.id}`, response);
    return NextResponse.json(JSON.stringify([]));
  }
  const data = await response.json();
  const mentions = data
    .filter((item: any) => {
      const shouldRemove =
        item._source.root_parent_url === channel.url ||
        item._source.author_username === channel.lead.username ||
        //item._source.author_power_badge === false ||
        new Date(item._source.published_at) <
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return !shouldRemove;
    })
    .sort((a: any, b: any) => b._source.engagements - a._source.engagements)
    .map((item: any) => ({
      hash: item._source.hash,
      fname: item._source.author_username,
    }))
    .slice(0, 15);

  const headers = new Headers();
  headers.set("Cache-Control", "s-maxage=3600");
  headers.set("Access-Control-Allow-Origin", "https://www.castsense.xyz");
  headers.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  return new NextResponse(JSON.stringify(mentions), {
    headers,
  });
}
