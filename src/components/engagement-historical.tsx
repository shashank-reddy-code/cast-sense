"use client";

import { DailyEngagement } from "@/lib/types";
import {
  Bar,
  Line,
  ResponsiveContainer,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";

function mergeData(
  dailyEngagement: DailyEngagement[],
  powerBadgeEngagement: DailyEngagement[]
) {
  const mergedData = dailyEngagement.map((daily, index) => {
    // assumes both series start from same date
    // todo: lookup by date here to ensure this is more accurate
    const powerBadge = powerBadgeEngagement[index] || {};
    return { ...daily, powerBadgeTotal: powerBadge.total };
  });
  return mergedData;
}

export function EngagementHistorical({
  dailyEngagement,
  powerBadgeEngagement,
  maxScale,
}: {
  dailyEngagement: DailyEngagement[];
  powerBadgeEngagement: DailyEngagement[];
  maxScale?: number;
}) {
  if (!dailyEngagement || !powerBadgeEngagement) return <></>;

  const mergedData = mergeData(dailyEngagement, powerBadgeEngagement);
  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={mergedData}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          {...(maxScale ? { domain: [0, maxScale] } : {})}
        />
        <Tooltip
          cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
          contentStyle={{ backgroundColor: "#9a4dce" }}
          labelStyle={{ color: "black" }}
          itemStyle={{ color: "black" }}
          formatter={(value, name) => {
            if (name === "powerBadgeTotal") {
              return [value, "power badge total"];
            }
            return [value, name];
          }}
        />
        <Legend
          formatter={(value) => {
            switch (value) {
              case "replies":
                return "Replies";
              case "recasts":
                return "Recasts";
              case "likes":
                return "Likes";
              case "powerBadgeTotal":
                return "Power Badge Engagement";
              default:
                return value;
            }
          }}
        />
        <Bar
          dataKey="replies"
          stackId="a"
          fill="#008080"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="recasts"
          stackId="a"
          fill="#8884d8"
          radius={[4, 4, 0, 0]}
        />
        <Bar dataKey="likes" stackId="a" fill="#D2B48C" radius={[4, 4, 0, 0]} />
        <Line
          type="monotone"
          dataKey="powerBadgeTotal"
          data={mergedData}
          stroke="#00FFFF"
          strokeWidth={3}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
