import { NextResponse } from "next/server";
import { fetchFirstFidFromDune } from "@/lib/dune";
import { DailyOpenrank, DailyOpenrankStrategies } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const fid = parseInt(params.fid);
  const data = await fetchFirstFidFromDune(3781870, fid);
  const headers = new Headers();
  headers.set("Cache-Control", "s-maxage=3600");
  headers.set("Access-Control-Allow-Origin", "*");

  if (!data) {
    return new NextResponse(null, { status: 404 });
  }

  const followRanks: DailyOpenrank[] = data?.daily_follow_rank.map(
    (item: any) => {
      const date = new Date(item[0]); // Create a date object from the datetime string
      const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'
      return {
        date: formattedDate,
        rank: item[1],
        percentile: item[2],
      };
    }
  );

  const engagementRanks: DailyOpenrank[] = data?.daily_engagement_rank.map(
    (item: any) => {
      const date = new Date(item[0]); // Create a date object from the datetime string
      const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'
      return {
        date: formattedDate,
        rank: item[1],
        percentile: item[2],
      };
    }
  );

  const result: DailyOpenrankStrategies = {
    followRanks,
    engagementRanks,
  };

  return new NextResponse(JSON.stringify(result), { headers });
}
