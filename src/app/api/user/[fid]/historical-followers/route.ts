import { NextResponse } from "next/server";
import { fetchFirstFidFromDune } from "@/lib/dune";
import { DailyFollower } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const fid = parseInt(params.fid);
  const data = await fetchFirstFidFromDune(3693389, fid);
  const headers = new Headers();
  headers.set("Cache-Control", "s-maxage=3600");
  if (!data) {
    return new NextResponse(null, { status: 404 });
  }

  const dailyFollowers: DailyFollower[] = data?.daily_followers.map(
    (item: any) => {
      const date = new Date(item[0]); // Create a date object from the datetime string
      const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'
      return {
        date: formattedDate,
        followers: item[1], // Index 1 for followers
        unfollowers: item[2], // Index 2 for unfollowers
      };
    }
  );

  return new NextResponse(JSON.stringify(dailyFollowers), { headers });
}
