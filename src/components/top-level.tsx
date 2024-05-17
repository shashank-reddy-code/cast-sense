import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TopLevelStats } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { SvgIcons } from "./svg-icons";

export function TopLevel({
  fidStats,
  isChannel = false,
}: {
  fidStats: TopLevelStats;
  isChannel?: boolean;
}) {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total followers</CardTitle>
          <SvgIcons.followers />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(fidStats.total_followers)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Casts</CardTitle>
          <SvgIcons.casts />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(fidStats.current_period_casts)}
          </div>
          <p className="text-xs text-muted-foreground">
            {fidStats.casts_percentage_change?.toFixed(0)}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recasts</CardTitle>
          <SvgIcons.recasts />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(fidStats.current_period_recasts)}
          </div>
          <p className="text-xs text-muted-foreground">
            {fidStats.recasts_percentage_change?.toFixed(0)}% from last month
          </p>
        </CardContent>
      </Card>
      {!isChannel && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mentions</CardTitle>
            <SvgIcons.mentions />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(fidStats.current_period_mentions)}
            </div>
            <p className="text-xs text-muted-foreground">
              {fidStats.mentions_percentage_change?.toFixed(0)}% from last month
            </p>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Replies</CardTitle>
          <SvgIcons.replies />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(fidStats.current_period_replies)}
          </div>
          <p className="text-xs text-muted-foreground">
            {fidStats.replies_percentage_change?.toFixed(0)}% since last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Likes</CardTitle>
          <SvgIcons.likes />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(fidStats.current_period_likes)}
          </div>
          <p className="text-xs text-muted-foreground">
            {fidStats.likes_percentage_change?.toFixed(0)}% since last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
