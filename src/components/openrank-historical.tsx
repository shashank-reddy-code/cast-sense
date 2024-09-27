"use client";

import { DailyOpenrank } from "@/lib/types";
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
} from "@/components/ui/chart";
import { formatDate, formatLargeNumber } from "@/lib/utils";
import { CardFooter } from "./ui/card";

const chartConfig = {
  followRank: {
    label: "Follow Rank",
    color: "hsl(var(--chart-1))",
  },
  engagementRank: {
    label: "Engagement Rank",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

function mergeData(
  followRanks: DailyOpenrank[],
  engagementRanks: DailyOpenrank[]
) {
  return followRanks.map((daily, index) => ({
    date: daily.date,
    followRank: daily.rank,
    engagementRank: engagementRanks[index]?.rank || 0,
  }));
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="font-semibold">{formatDate(label)}</p>
        <p style={{ color: chartConfig.followRank.color }}>
          Follow Rank: {formatLargeNumber(data.followRank)}
        </p>
        <p style={{ color: chartConfig.engagementRank.color }}>
          Engagement Rank: {formatLargeNumber(data.engagementRank)}
        </p>
      </div>
    );
  }
  return null;
};

export function OpenrankHistorical({
  followRanks,
  engagementRanks,
  maxScale,
  openrankText,
}: {
  followRanks: DailyOpenrank[];
  engagementRanks: DailyOpenrank[];
  maxScale?: number;
  openrankText?: string;
}) {
  if (!followRanks || !engagementRanks) return null;

  const mergedData = mergeData(followRanks, engagementRanks);

  // Calculate tick values for x-axis (show about 5-7 ticks)
  const tickInterval = Math.ceil(mergedData.length / 6);
  const xAxisTicks = mergedData
    .map((day, index) => (index % tickInterval === 0 ? day.date : null))
    .filter((date): date is string => date !== null);

  return (
    <ChartContainer config={chartConfig}>
      <>
        <div className="h-[200px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mergedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                ticks={xAxisTicks}
                tickMargin={10}
              />
              <YAxis
                reversed
                domain={maxScale ? [0, maxScale] : ["auto", "auto"]}
                tickFormatter={(value) => formatLargeNumber(value)}
              />
              <ChartTooltip content={<CustomTooltip />} />
              <ChartLegend />
              <Line
                type="monotone"
                dataKey="followRank"
                stroke={chartConfig.followRank.color}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="engagementRank"
                stroke={chartConfig.engagementRank.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {openrankText && (
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-lg mt-10">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  You are in the {openrankText} by engagement
                </div>
              </div>
            </div>
          </CardFooter>
        )}
      </>
    </ChartContainer>
  );
}
