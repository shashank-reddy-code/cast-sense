import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

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
          <CardTitle className="mb-4">Follower fanfare</CardTitle>
          <CardDescription className="text-lg">
            Different types of followers
          </CardDescription>
        </CardHeader>
        <CardContent className="flex p-6 flex flex-col space-y-5  ">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Definition</TableHead>
                <TableHead># of followers</TableHead>
                <TableHead>% of followers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow key="power-badge">
                <TableCell>💪 Power Badge</TableCell>
                <TableCell>Warpcast Algorithm</TableCell>
                <TableCell>
                  {powerbadgeFollowers.count.toLocaleString()}
                </TableCell>
                <TableCell>{powerbadgeFollowers.percentage}%</TableCell>
              </TableRow>
              {Object.entries(followerTiers).map(
                ([tier, data]: [string, any]) => (
                  <TableRow key={tier}>
                    <TableCell>{tier}</TableCell>
                    <TableCell>{getDescription(tier)}</TableCell>
                    <TableCell>{data.count.toLocaleString()}</TableCell>
                    <TableCell>{data.percentage.toFixed(2)}%</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
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
