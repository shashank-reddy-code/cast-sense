import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { FollowerTier } from "@/lib/types";

export function FollowersByTier({
  followerTiers,
  isChannel = false,
}: {
  followerTiers: FollowerTier[];
  isChannel?: boolean;
}) {
  const description = isChannel
    ? "Different types of casters"
    : "Different types of followers";
  return (
    <div className="space-y-8 flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle className="mb-4">Follower fanfare</CardTitle>
          <CardDescription className="text-lg">{description}</CardDescription>
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
              {followerTiers.map((followerTier) => (
                <TableRow key={followerTier.tier}>
                  <TableCell>{followerTier.tier}</TableCell>
                  <TableCell>{getDescription(followerTier.tier)}</TableCell>
                  <TableCell>{followerTier.count.toLocaleString()}</TableCell>
                  <TableCell>{followerTier.percentage.toFixed(2)}%</TableCell>
                </TableRow>
              ))}
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
