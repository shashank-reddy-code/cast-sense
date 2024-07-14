"use client";

import { DailyEngagement } from "@/lib/types";
import {
  Area,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartConfig } from "@/components/ui/chart";
import { formatDate, formatLargeNumber } from "@/lib/utils";
import { CardFooter } from "./ui/card";

const chartConfig = {
  total: {
    label: "Total Engagement",
    color: "hsl(var(--chart-1))",
  },
  replies: {
    label: "Replies",
    color: "hsl(var(--chart-2))",
  },
  recasts: {
    label: "Recasts",
    color: "hsl(var(--chart-3))",
  },
  likes: {
    label: "Likes",
    color: "hsl(var(--chart-5))",
  },
  powerBadgeTotal: {
    label: "Power Badge Engagement",
    color: "hsl(var(--chart-purple))",
  },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="font-semibold">{formatDate(label)}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {chartConfig[entry.dataKey as keyof typeof chartConfig].label}:{" "}
            {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function mergeData(
  dailyEngagement: DailyEngagement[],
  powerBadgeEngagement: DailyEngagement[]
) {
  return dailyEngagement.map((daily, index) => ({
    ...daily,
    powerBadgeTotal: powerBadgeEngagement[index]?.total || 0,
  }));
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
  if (!dailyEngagement || !powerBadgeEngagement) return null;

  const mergedData = mergeData(dailyEngagement, powerBadgeEngagement);
  const totalEngagement = mergedData.reduce((sum, day) => sum + day.total, 0);

  // Calculate tick values for x-axis (show about 5-7 ticks)
  const tickInterval = Math.ceil(mergedData.length / 6);
  const xAxisTicks = mergedData
    .map((day, index) => (index % tickInterval === 0 ? day.date : null))
    .filter((date): date is string => date !== null);

  return (
    <>
      <div className="h-[200px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={mergedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.total.color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.total.color}
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
            <YAxis
              domain={maxScale ? [0, maxScale] : [0, "auto"]}
              tickFormatter={(value) => formatLargeNumber(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="replies"
              stackId="a"
              fill={chartConfig.replies.color}
            />
            <Bar
              dataKey="recasts"
              stackId="a"
              fill={chartConfig.recasts.color}
            />
            <Bar dataKey="likes" stackId="a" fill={chartConfig.likes.color} />
            <Area
              type="monotone"
              dataKey="powerBadgeTotal"
              stroke={chartConfig.powerBadgeTotal.color}
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorPowerBadgeTotal)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-lg mt-10">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {formatLargeNumber(totalEngagement)} total impressions{" "}
              {" between "}
              {formatDate(mergedData[0].date)} -{" "}
              {formatDate(mergedData[mergedData.length - 1].date)}
            </div>
          </div>
        </div>
      </CardFooter>
    </>
  );
}
