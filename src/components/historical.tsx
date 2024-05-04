import { FollowerHistorical } from "@/components/follower-historical";
import { EngagementHistorical } from "@/components/engagement-historical";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Historical() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>You are making new friends</CardTitle>
          <CardDescription>Followers over the last month</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <FollowerHistorical />
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>You are buzzzing</CardTitle>
          <CardDescription>Engagement over the last month</CardDescription>
        </CardHeader>
        <CardContent>
          <EngagementHistorical />
        </CardContent>
      </Card>
    </div>
  );
}
