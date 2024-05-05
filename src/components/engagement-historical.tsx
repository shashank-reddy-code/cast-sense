"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function EngagementHistorical({ dailyEngagement }) {
  console.log("debugging dailyEngagement", dailyEngagement);
  // Convert and format data for the chart
  const data = dailyEngagement.map((item) => {
    const date = new Date(item[0]); // Create a date object from the datetime string
    const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

    return {
      name: formattedDate,
      total: item[1],
    };
  });
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
        />
        <Tooltip
          cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
          contentStyle={{ backgroundColor: "#9a4dce" }}
          labelStyle={{ color: "black" }}
          itemStyle={{ color: "black" }}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
