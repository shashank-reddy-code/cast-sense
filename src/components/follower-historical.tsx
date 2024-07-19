"use client";

import { DailyFollower } from "@/lib/types";
import { formatDate, formatLargeNumber } from "@/lib/utils";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CardFooter } from "./ui/card";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="font-semibold">{formatDate(label)}</p>
        <p style={{ color: "hsl(var(--chart-1))" }}>
          New followers: {formatLargeNumber(data.followers)}
        </p>
        <p style={{ color: "hsl(var(--chart-2))" }}>
          Unfollowers: {formatLargeNumber(data.unfollowers)}
        </p>
      </div>
    );
  }
  return null;
};

export function FollowerHistorical({
  dailyFollowers,
  maxScale,
  isChannel = false,
}: {
  dailyFollowers: DailyFollower[];
  maxScale?: number;
  isChannel?: boolean;
}) {
  const totalFollowers = dailyFollowers.reduce(
    (sum, day) => sum + day.followers,
    0
  );

  // Calculate tick values for x-axis (show about 5-7 ticks)
  const tickInterval = Math.ceil(dailyFollowers.length / 6);
  const xAxisTicks = dailyFollowers
    .map((day, index) => (index % tickInterval === 0 ? day.date : null))
    .filter((date): date is string => date !== null);

  return (
    <>
      <div className="h-[200px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dailyFollowers}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              ticks={xAxisTicks}
              tickMargin={10}
            />
            <YAxis domain={maxScale ? [0, maxScale] : [0, "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="followers"
              //stroke="#8884d8"
              stroke="hsl(var(--chart-1))"
              fillOpacity={1}
              fill="url(#colorFollowers)"
            />
            <Area
              type="monotone"
              dataKey="unfollowers"
              //stroke="#8884d8"
              stroke="hsl(var(--chart-2))"
              fillOpacity={1}
              fill="url(#colorUnfollowers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {!isChannel && (
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-lg mt-10">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                {formatLargeNumber(totalFollowers)} followers gained
                {" between "}
                {formatDate(dailyFollowers[0].date)} -{" "}
                {formatDate(dailyFollowers[dailyFollowers.length - 1].date)}
              </div>
            </div>
          </div>
        </CardFooter>
      )}
    </>
  );
}
