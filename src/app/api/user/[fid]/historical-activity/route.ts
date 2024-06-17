import { NextResponse } from "next/server";
import { fetchFirstFidFromDune } from "@/lib/dune";
import { DailyActivity } from "@/lib/types";
import { fillMissingDates } from "@/lib/utils";

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const fid = parseInt(params.fid);
  const data = await fetchFirstFidFromDune(3744055, fid);
  const headers = new Headers();
  headers.set("Cache-Control", "max-age=86500");
  headers.set("pragma", "no-cache");

  if (!data) {
    return new NextResponse(null, { status: 404 });
  }

  const dailyActivity: DailyActivity[] = data?.daily_casts.map(
    (item: string[]) => {
      const date = new Date(item[0]); // Create a date object from the datetime string
      const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'
      return {
        date: formattedDate,
        casts: item[1],
      };
    }
  );

  const result = fillMissingDates(dailyActivity);

  return new NextResponse(JSON.stringify(result), { headers });
}
