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
}: {
  dailyEngagement: DailyEngagement[];
  dailyFollowers: DailyFollower[];
  dailyActivity: DailyActivity[];
  dailyPowerBadgeEngagement?: DailyEngagement[];
  dailyOpenrankStrategies?: DailyOpenrankStrategies;
  maxScale?: number;
  isChannel?: boolean;
}) {
  const [range, setRange] = useState(90); // State for date range, default is {range} days
  const filterDataByRange = (data: any[], days: number): any[] => {
    const now = new Date();
    const cutoffDate = new Date(now.setDate(now.getDate() - days));
    return data.filter((item) => new Date(item.date) >= cutoffDate);
  };

  let openrankText;

  if (!isChannel && dailyOpenrankStrategies?.engagementRanks?.length > 0) {
    const lastEngagementRank =
      dailyOpenrankStrategies.engagementRanks[
        dailyOpenrankStrategies.engagementRanks.length - 1
      ];
    openrankText = getOpenrankText(lastEngagementRank.percentile);
  }

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
          <CardContent>
            <FollowerHistorical
              dailyFollowers={filterDataByRange(dailyFollowers, range)}
              maxScale={maxScale}
              isChannel={isChannel}
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
        {dailyOpenrankStrategies?.engagementRanks?.length > 0 &&
          dailyOpenrankStrategies?.followRanks?.length > 0 && (
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Your reputation in the network</CardTitle>
                <CardDescription>
                  OpenRank score over the past {range} days
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
                  openrankText={openrankText}
                />
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}
