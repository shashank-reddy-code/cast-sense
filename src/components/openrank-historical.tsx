"use client";

import { DailyOpenrank } from "@/lib/types";
import {
  Bar,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function mergeData(
  followRanks: DailyOpenrank[],
  engagementRanks: DailyOpenrank[]
) {
  const mergedData = followRanks.map((daily, index) => {
    // assumes both series start from same date
    // todo: lookup by date here to ensure this is more accurate
    const engagementRank = engagementRanks[index]?.rank || 0;
    const followRank = daily.rank;
    const date = daily.date;
    return { date, followRank, engagementRank };
  });
  return mergedData;
}

export function OpenrankHistorical({
  followRanks,
  engagementRanks,
  maxScale,
}: {
  followRanks: DailyOpenrank[];
  engagementRanks: DailyOpenrank[];
  maxScale?: number;
}) {
  if (!followRanks || !engagementRanks) return <></>;
  const mergedData = mergeData(followRanks, engagementRanks);
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
          reversed={true}
          {...(maxScale ? { domain: [0, maxScale] } : {})}
        />
        <Tooltip
          cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
          contentStyle={{ backgroundColor: "#9a4dce" }}
          labelStyle={{ color: "black" }}
          itemStyle={{ color: "black" }}
        />
        <Line
          type="monotone"
          dataKey="followRank"
          stroke="#8884d8"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="engagementRank"
          stroke="#82ca9d"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
