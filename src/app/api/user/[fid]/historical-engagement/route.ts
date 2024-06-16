import { NextResponse } from "next/server";
import { fetchFirstFidFromDune } from "@/lib/dune";
import { DailyEngagement } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const fid = parseInt(params.fid);
  const data = await fetchFirstFidFromDune(3693328, fid);
  const headers = new Headers();
  headers.set("Cache-Control", "max-age=3600");

  if (!data) {
    return new NextResponse(null, { status: 404 });
  }

  const dailyEngagement: DailyEngagement[] = data?.daily_engagement.map(
    (item: string[]) => {
      const date = new Date(item[0]); // Create a date object from the datetime string
      const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'
      return {
        date: formattedDate,
        total: item[1],
        replies: item[2],
        recasts: item[3],
        likes: item[4],
      };
    }
  );

  const dailyPowerBadgeEngagement: DailyEngagement[] =
    data?.daily_engagement.map((item: string[]) => {
      const date = new Date(item[0]); // Create a date object from the datetime string
      const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'
      return {
        date: formattedDate,
        total: item[5],
        replies: item[6],
        recasts: item[7],
        likes: item[8],
      };
    });

  const result = [dailyEngagement, dailyPowerBadgeEngagement];

  return new NextResponse(JSON.stringify(result), { headers });
}
