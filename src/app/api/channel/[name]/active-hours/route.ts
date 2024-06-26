import { NextResponse } from "next/server";
import { fetchFirstChannelFromDune } from "@/lib/dune";
import { fetchChannelById } from "@/lib/neynar";
import moment from "moment-timezone";

export async function GET(
  req: Request,
  { params }: { params: { name: string; tz: string } }
) {
  const timezone = new URL(req.url).searchParams.get("tz") || "UTC";
  const channel = await fetchChannelById(params.name);
  if (!channel) {
    return new NextResponse("Channel not found", {
      status: 404,
    });
  }
  const result = await fetchFirstChannelFromDune(3715688, channel.url);
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
  daysOfWeek.forEach((day, dayIndex) => {
    const dayCounts = result[`${day}_hourly_counts`] || {};
    weeklyHourlyCounts[day] = weeklyHourlyCounts[day] || {};

    // Set default count for each hour.
    for (let hour = 0; hour < 24; hour++) {
      let adjustedHour = (hour + offset + 24) % 24; // Adjust hour for timezone offset, ensure it wraps correctly
      let adjustedDayIndex =
        (dayIndex + Math.floor((hour + offset) / 24) + 7) % 7;
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

  // Sort the times by count in descending order and take the top three
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

  const data = {
    activeHours: weeklyHourlyCounts,
    bestTimesToPost: readableBestTimes,
  };
  const headers = new Headers();
  headers.set("Cache-Control", "s-maxage=3600");

  return new NextResponse(JSON.stringify(data), {
    headers,
  });
}
