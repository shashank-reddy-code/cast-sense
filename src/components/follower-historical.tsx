"use client";

import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function FollowerHistorical({ dailyFollowers }) {
  // Convert and format data for the chart
  const data = dailyFollowers.map((item) => {
    const date = new Date(item[0]); // Create a date object from the datetime string
    const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

    return {
      date: formattedDate,
      followers: item[1], // Index 1 for followers
      unfollowers: item[2], // Index 2 for unfollowers
    };
  });
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
