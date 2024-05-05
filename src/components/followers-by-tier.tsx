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
                <div key={tier} className="flex justify-between">
                  <div className="space-y-1">
                    <p className="font-medium leading-none">{tier}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium leading-none">
                      {getDescription(tier)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
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
                <p className="font-medium leading-none">💪 power badge</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium leading-none">
                  {getDescription("💪 power badge")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">
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

function getDescription(tier: string) {
  switch (tier) {
    case "🤖 npc":
      return "< 400 followers";
    case "🥉 active":
      return "> 400  followers";
    case "🥈 star":
      return "> 1000 followers";
    case "🥇 influencer":
      return "> 10000 followers";
    case "💎 vip":
      return "> 50000 followers";
    case "💪 power badge":
      return "warpcast algorithm";
  }
}
