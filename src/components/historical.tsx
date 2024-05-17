import { FollowerHistorical } from "@/components/follower-historical";
import { EngagementHistorical } from "@/components/engagement-historical";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DailyEngagement, DailyFollower } from "@/lib/types";

export function Historical({
  dailyEngagement,
  dailyFollowers,
  maxScale,
  isChannel = false,
}: {
  dailyEngagement: DailyEngagement[];
  dailyFollowers: DailyFollower[];
  maxScale?: number;
  isChannel?: boolean;
}) {
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
            maxScale={maxScale}
          />
        </CardContent>
      </Card>
    </div>
  );
}
