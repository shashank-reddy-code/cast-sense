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
  DailyOpenrank,
} from "@/lib/types";
import { DailyActivityHeatMap } from "./daily-activity-heatmap";
import { OpenrankHistorical } from "./openrank-historical";
import { getOpenrankText } from "@/lib/utils";

export function Historical({
  dailyEngagement,
  dailyFollowers,
  dailyActivity,
  dailyPowerBadgeEngagement = [],
  dailyOpenrank = [],
  maxScale,
  isChannel = false,
}: {
  dailyEngagement: DailyEngagement[];
  dailyFollowers: DailyFollower[];
  dailyActivity: DailyActivity[];
  dailyPowerBadgeEngagement?: DailyEngagement[];
  dailyOpenrank?: DailyOpenrank[];
  maxScale?: number;
  isChannel?: boolean;
}) {
  const openrankText = getOpenrankText(
    dailyOpenrank[dailyOpenrank.length - 1].percentile
  );
  const description = isChannel
    ? "Unique casters over the last 90 days"
    : "Followers over the last 90 days";
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-8">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>You are reaching new users</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <FollowerHistorical
            dailyFollowers={dailyFollowers}
            maxScale={maxScale}
          />
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>You are buzzzing</CardTitle>
          <CardDescription>Engagement over the last 90 days</CardDescription>
        </CardHeader>
        <CardContent>
          <EngagementHistorical
            dailyEngagement={dailyEngagement}
            powerBadgeEngagement={dailyPowerBadgeEngagement}
            maxScale={maxScale}
          />
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Your daily streak</CardTitle>
          <CardDescription>
            Cast frequency over the past 90 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DailyActivityHeatMap dailyActivity={dailyActivity} />
        </CardContent>
      </Card>
      {dailyOpenrank && dailyOpenrank.length > 0 && (
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Your reputation in the network</CardTitle>
            <CardDescription>
              OpenRank score over the past 90 days
              {openrankText && (
                <p className="text-sm mt-1">
                  You are in the the {openrankText}
                </p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OpenrankHistorical dailyOpenrank={dailyOpenrank} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
