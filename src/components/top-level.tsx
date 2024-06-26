import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopLevelStats } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { SvgIcons } from "./svg-icons";
import NumberTicker from "./ui/number-ticker";

export function TopLevel({
  fidStats,
  isChannel = false,
}: {
  fidStats: TopLevelStats;
  isChannel?: boolean;
}) {
  const getPercentageChangeClass = (change: number | null) => {
    if (!change) {
      return "text-muted-foreground";
    }
    if (change > 0) {
      return "text-green-500";
    } else if (change < 0) {
      return "text-red-500";
    } else {
      return "";
    }
  };
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-7">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total followers</CardTitle>
          <SvgIcons.followers />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <NumberTicker value={fidStats.total_followers || 0} />
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
          <p
            className={`text-xs ${getPercentageChangeClass(
              fidStats.casts_percentage_change
            )}`}
          >
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
          <p
            className={`text-xs ${getPercentageChangeClass(
              fidStats.recasts_percentage_change
            )}`}
          >
            {fidStats.recasts_percentage_change?.toFixed(0)}% from last month
          </p>
        </CardContent>
      </Card>
      {/* {!isChannel && ( */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mentions</CardTitle>
          <SvgIcons.mentions />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(fidStats.current_period_mentions)}
          </div>
          {fidStats.mentions_percentage_change && (
            <p
              className={`text-xs ${getPercentageChangeClass(
                fidStats.mentions_percentage_change
              )}`}
            >
              {fidStats.mentions_percentage_change?.toFixed(0)}% from last month
            </p>
          )}
        </CardContent>
      </Card>
      {/* )} */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Replies</CardTitle>
          <SvgIcons.replies />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(fidStats.current_period_replies)}
          </div>
          <p
            className={`text-xs ${getPercentageChangeClass(
              fidStats.replies_percentage_change
            )}`}
          >
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
          <p
            className={`text-xs ${getPercentageChangeClass(
              fidStats.likes_percentage_change
            )}`}
          >
            {fidStats.likes_percentage_change?.toFixed(0)}% since last month
          </p>
        </CardContent>
      </Card>
      {fidStats.churn_rate !== undefined &&
        fidStats.churn_rate !== null &&
        fidStats.churn_rate > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Churn rate</CardTitle>
              <SvgIcons.churn />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {fidStats.churn_rate?.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
        )}
      {fidStats.subscribers !== undefined &&
        fidStats.subscribers !== null &&
        fidStats.subscribers > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
              <SvgIcons.subscribers />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fidStats.subscribers}</div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
