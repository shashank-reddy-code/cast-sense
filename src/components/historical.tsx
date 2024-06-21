"use client";

import { FollowerHistorical } from "@/components/follower-historical";
import { EngagementHistorical } from "@/components/engagement-historical";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CastEngagementCount,
  DailyActivity,
  DailyEngagement,
  DailyFollower,
  DailyOpenrankStrategies,
} from "@/lib/types";
import { DailyActivityHeatMap } from "./daily-activity-heatmap";
import { OpenrankHistorical } from "./openrank-historical";
import { getOpenrankText } from "@/lib/utils";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Historical({
  dailyEngagement,
  dailyFollowers,
  dailyActivity,
  dailyPowerBadgeEngagement = [],
  dailyOpenrankStrategies = { followRanks: [], engagementRanks: [] },
  maxScale,
  isChannel = false,
  casts = [],
}: {
  dailyEngagement: DailyEngagement[];
  dailyFollowers: DailyFollower[];
  dailyActivity: DailyActivity[];
  dailyPowerBadgeEngagement?: DailyEngagement[];
  dailyOpenrankStrategies?: DailyOpenrankStrategies;
  maxScale?: number;
  isChannel?: boolean;
  casts?: CastEngagementCount[];
}) {
  const [range, setRange] = useState(90); // State for date range, default is {range} days
  const filterDataByRange = (data: any[], days: number): any[] => {
    const now = new Date();
    const cutoffDate = new Date(now.setDate(now.getDate() - days));
    return data.filter((item) => new Date(item.date) >= cutoffDate);
  };

  const openrankText = isChannel
    ? undefined
    : getOpenrankText(
        dailyOpenrankStrategies.engagementRanks[
          dailyOpenrankStrategies.engagementRanks.length - 1
        ].percentile
      );
  const description = isChannel
    ? `Unique casters over the last ${range} days`
    : `Followers over the last ${range} days`;
  return (
    <div>
      <Tabs
        defaultValue="90"
        onValueChange={(value) => setRange(parseInt(value))}
        className="mb-4"
      >
        <TabsList className="ml-auto">
          <TabsTrigger value="7" className="text-zinc-600 dark:text-zinc-200">
            7 days
          </TabsTrigger>
          <TabsTrigger value="30" className="text-zinc-600 dark:text-zinc-200">
            30 days
          </TabsTrigger>
          <TabsTrigger value="90" className="text-zinc-600 dark:text-zinc-200">
            90 days
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-8">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>You are reaching new users</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <FollowerHistorical
              dailyFollowers={filterDataByRange(dailyFollowers, range)}
              maxScale={maxScale}
              casts={casts}
            />
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>You are buzzzing</CardTitle>
            <CardDescription>
              Engagement over the last {range} days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EngagementHistorical
              dailyEngagement={filterDataByRange(dailyEngagement, range)}
              powerBadgeEngagement={filterDataByRange(
                dailyPowerBadgeEngagement,
                range
              )}
              maxScale={maxScale}
            />
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Your daily streak</CardTitle>
            <CardDescription>
              Cast frequency over the past {range} days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DailyActivityHeatMap
              dailyActivity={filterDataByRange(dailyActivity, range)}
            />
          </CardContent>
        </Card>
        {dailyOpenrankStrategies &&
          dailyOpenrankStrategies.engagementRanks.length > 0 &&
          dailyOpenrankStrategies.followRanks.length > 0 && (
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Your reputation in the network</CardTitle>
                <CardDescription>
                  OpenRank score over the past {range} days
                  {openrankText && (
                    <p className="text-sm mt-1">
                      You are in the {openrankText} by engagement
                    </p>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OpenrankHistorical
                  followRanks={filterDataByRange(
                    dailyOpenrankStrategies.followRanks,
                    range
                  )}
                  engagementRanks={filterDataByRange(
                    dailyOpenrankStrategies.engagementRanks,
                    range
                  )}
                />
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}
