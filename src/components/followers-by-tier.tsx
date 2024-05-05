import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function FollowersByTier({
  followerTiers,
  powerbadgeFollowers,
}: {
  followerTiers: any;
  powerbadgeFollowers: any;
}) {
  return (
    <div className="space-y-8 flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Follower breakdown by tier</CardTitle>
          <CardDescription>Different types of followers</CardDescription>
        </CardHeader>
        <CardContent className="flex aspect-square p-6 flex flex-col space-y-5  ">
          <div className="space-y-8 flex flex-col">
            {Object.entries(followerTiers).map(
              ([tier, data]: [string, any]) => (
                <div key={tier} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{tier}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {data.count.toLocaleString()} (
                      {data.percentage.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              )
            )}
            <div
              key="power-badge"
              className="flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  💪 power badge
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {powerbadgeFollowers.count} ({powerbadgeFollowers.percentage}
                  %)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
