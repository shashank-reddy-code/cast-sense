"use client";

import { DailyFollower } from "@/lib/types";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function FollowerHistorical({
  dailyFollowers,
  maxScale,
}: {
  dailyFollowers: DailyFollower[];
  maxScale?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={dailyFollowers}>
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
          labelStyle={{ color: "white" }}
          itemStyle={{ color: "black" }}
        />
        {/* <Legend /> */}
        <Bar
          dataKey="followers"
          stackId="a"
          fill="#8884d8"
          radius={[10, 10, 0, 0]}
          className="fill-primary"
        />
        <Bar
          dataKey="unfollowers"
          stackId="a"
          fill="#82ca9d"
          radius={[10, 10, 0, 0]}
          className="fill-secondary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
