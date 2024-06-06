"use client";

import { DailyOpenrank } from "@/lib/types";
import { getOpenrankText } from "@/lib/utils";
import {
  Bar,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function OpenrankHistorical({
  dailyOpenrank,
  maxScale,
}: {
  dailyOpenrank: DailyOpenrank[];
  maxScale?: number;
}) {
  if (!dailyOpenrank) return <></>;
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={dailyOpenrank}>
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
        <Line type="monotone" dataKey="rank" stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
