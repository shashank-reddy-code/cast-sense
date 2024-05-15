import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TopLevelStats } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 21a8 8 0 0 1 13.292-6" />
            <circle cx="10" cy="8" r="5" />
            <path d="M19 16v6" />
            <path d="M22 19h-6" />
          </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
            <path d="M2 12a9 9 0 0 1 8 8" />
            <path d="M2 16a5 5 0 0 1 4 4" />
            <line x1="2" x2="2.01" y1="20" y2="20" />
          </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 2.1l4 4-4 4" />
            <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4" />
            <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2" />
          </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
            </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
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
