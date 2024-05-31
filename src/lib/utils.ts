import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DailyActivity } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number | null | undefined) {
  num = num ?? 0;

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

export function fillMissingDates(
  dailyActivity: DailyActivity[]
): DailyActivity[] {
  const generateAllDatesForRange = (startDate: Date, endDate: Date): Date[] => {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  // Determine the date range of the input data
  const startDate = new Date(
    Math.min(
      ...dailyActivity.map((activity) => new Date(activity.date).getTime())
    )
  );
  const endDate = new Date(
    Math.max(
      ...dailyActivity.map((activity) => new Date(activity.date).getTime())
    )
  );
  const allDates = generateAllDatesForRange(startDate, endDate);
  const activityMap = new Map(
    dailyActivity.map((activity) => [activity.date, activity.casts])
  );

  // Merge all dates with the activity data, defaulting to 0 casts if not present
  const completeDailyActivity: DailyActivity[] = allDates.map((date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return {
      date: formattedDate,
      casts: activityMap.get(formattedDate) || 0,
    };
  });

  return completeDailyActivity;
}

export function getMonthLabel(date: string) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dateObj = new Date(date);
  return monthNames[dateObj.getMonth()];
}

export function getDayLabel(date: string) {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dateObj = new Date(date);
  return dayNames[dateObj.getDay()];
}

export function getOpenrankText(openrank_percentile: number): string | null {
  if (openrank_percentile < 1) {
    return "🎖️ Top 1 percentile";
  } else if (openrank_percentile < 5) {
    return "🏅 Top 5 percentile";
  } else if (openrank_percentile < 10) {
    return "🥉 Top 10 percentile";
  } else if (openrank_percentile < 25) {
    return "🎗️ Top 25 percentile";
  }
  return null;
}
