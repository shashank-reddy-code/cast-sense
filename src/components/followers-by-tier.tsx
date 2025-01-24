"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { FollowerTier } from "@/lib/types";
import { formatLargeNumber } from "@/lib/utils";

type TierKey =
  | "🤖 npc"
  | "🥉 active"
  | "🥈 star"
  | "🥇 influencer"
  | "💎 vip"
  | "⚡ power badge"
  | "🚫 spam";

type ChartConfigType = {
  [K in TierKey]: { label: string; color: string };
} & {
  count: { label: string };
};

const chartConfig: Record<TierKey, { label: string; color: string }> & {
  count: { label: string };
} = {
  count: {
    label: "Followers",
  },
  "🤖 npc": {
    label: "NPC",
    color: "hsl(var(--chart-1))",
  },
  "🥉 active": {
    label: "Active",
    color: "hsl(var(--chart-2))",
  },
  "🥈 star": {
    label: "Star",
    color: "hsl(var(--chart-3))",
  },
  "🥇 influencer": {
    label: "Influencer",
    color: "hsl(var(--chart-4))",
  },
  "💎 vip": {
    label: "VIP",
    color: "hsl(var(--chart-5))",
  },
  "⚡ power badge": {
    label: "Power Badge",
    color: "hsl(var(--chart-purple))",
  },
  "🚫 spam": {
    label: "Spam",
    color: "hsl(var(--chart-red))",
  },
} satisfies ChartConfig;

function getDescription(tier: string) {
  switch (tier) {
    case "🤖 npc":
      return "users with < 400 followers";
    case "🥉 active":
      return "users with > 400 followers";
    case "🥈 star":
      return "users with > 1000 followers";
    case "🥇 influencer":
      return "users with > 10000 followers";
    case "💎 vip":
      return "users with > 50000 followers";
    case "⚡ power badge":
      return "users with badge on neynar";
      case "🚫 spam":
      return "users flagged as spam accounts on warpcast";
  }
}

export function FollowersByTier({
  followerTiers,
  isChannel = false,
}: {
  followerTiers: FollowerTier[];
  isChannel?: boolean;
}) {
  const description = isChannel
    ? "Breakdown of active casters"
    : "Breakdown of active followers";

  const totalCount = followerTiers
    .filter((tier) => tier.tier !== "⚡ power badge")
    .reduce((sum, tier) => sum + tier.count, 0);

  const chartData = followerTiers.map((tier) => ({
    tier: tier.tier,
    count: tier.count,
    percentage: tier.percentage,
    fill: chartConfig[tier.tier as TierKey].color,
    definition: getDescription(tier.tier),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-4">Follower fanfare</CardTitle>
        <CardDescription className="text-lg">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
              right: 10,
              top: 10,
              bottom: 10,
            }}
            height={300}
          >
            <YAxis
              dataKey="tier"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={80}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border border-border p-2 rounded-md shadow-md">
                      <p className="font-semibold">{data.tier}</p>
                      <p>{data.definition}</p>
                      <p>{formatLargeNumber(data.count)} followers</p>
                      <p>
                        {data.percentage.toFixed(2)}% of {data.tier.slice(2)}{" "}
                        users
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" layout="vertical" radius={[0, 5, 5, 0]} />
          </BarChart>
        </ChartContainer>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-lg mt-10">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                {formatLargeNumber(totalCount)} total active followers
              </div>
            </div>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
