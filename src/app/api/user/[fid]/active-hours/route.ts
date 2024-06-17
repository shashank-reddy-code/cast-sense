// /app/api/user/[fid]/active-hours/route.ts
import { NextResponse } from "next/server";
import { fetchFirstFidFromDune } from "@/lib/dune";
import { FollowerActiveHours } from "@/lib/types";
import moment from "moment-timezone";

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const fid = parseInt(params.fid);
  const timezone = new URL(req.url).searchParams.get("tz") || "UTC";
  const data = await fetchFirstFidFromDune(3697395, fid);
  const headers = new Headers();
  headers.set("Cache-Control", "s-maxage=86500");
  headers.set("pragma", "no-cache");

  if (!data) {
    return new NextResponse(null, { status: 404 });
  }

  const result = await processFollowerActiveHours(data, timezone);

  return new NextResponse(JSON.stringify(result), { headers });
}

async function processFollowerActiveHours(
  data: any,
  timezone: string
): Promise<FollowerActiveHours> {
  const result = data;
  if ("fid" in result) {
    delete result["fid"];
  }

  // Determine the offset for the timezone
  const offset = Math.ceil(moment.tz(timezone).utcOffset() / 60);
  // Initialize an object to hold the final counts for all days of the week.
  const weeklyHourlyCounts: { [key: string]: { [key: number]: number } } = {};
  // Days of the week array for easier manipulation
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // Process each day's hourly counts.
  daysOfWeek.forEach((day) => {
    const dayCounts = result[`${day}_hourly_counts`];
    weeklyHourlyCounts[day] = weeklyHourlyCounts[day] || {};

    // Set default count for each hour.
    for (let hour = 0; hour < 24; hour++) {
      let adjustedHour = (hour + offset + 24) % 24; // Adjust hour for timezone offset, ensure it wraps correctly
      let adjustedDayIndex =
        (daysOfWeek.indexOf(day) + Math.floor((hour + offset) / 24)) % 7;
      let adjustedDay = daysOfWeek[adjustedDayIndex];

      if (!weeklyHourlyCounts[adjustedDay]) {
        weeklyHourlyCounts[adjustedDay] = {};
      }
      weeklyHourlyCounts[adjustedDay][adjustedHour] =
        (weeklyHourlyCounts[adjustedDay][adjustedHour] || 0) +
        (dayCounts[hour] || 0);
    }
  });

  // Find the best 3 times to post
  let bestTimes = [];
  for (let day in weeklyHourlyCounts) {
    for (let hour in weeklyHourlyCounts[day]) {
      bestTimes.push({ day, hour, count: weeklyHourlyCounts[day][hour] });
    }
  }

  // Sort the times by follower count in descending order and take the top three
  bestTimes.sort((a, b) => b.count - a.count);
  bestTimes = bestTimes.slice(0, 3);

  // Map to readable format
  const readableBestTimes = bestTimes
    .map((time) => {
      let hour = parseInt(time.hour);
      let ampm = hour >= 12 ? "pm" : "am";
      hour = hour % 12 || 12; // Convert 24h to 12h format
      let day = time.day.charAt(0).toUpperCase() + time.day.slice(1); // Capitalize the first letter
      return `${day} at ${hour}${ampm}`;
    })
    .join(", ");

  const output: FollowerActiveHours = {
    activeHours: weeklyHourlyCounts,
    bestTimesToPost: readableBestTimes,
  };

  return output;
}
