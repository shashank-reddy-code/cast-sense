"use client";

import { DailyEngagement } from "@/lib/types";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function EngagementHistorical({
  dailyEngagement,
  maxScale,
}: {
  dailyEngagement: DailyEngagement[];
  maxScale?: number;
}) {
  if (!dailyEngagement) return <></>;
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={dailyEngagement}>
        <XAxis
          dataKey="name"
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
        />
        <Legend />
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
      </BarChart>
    </ResponsiveContainer>
  );
}
