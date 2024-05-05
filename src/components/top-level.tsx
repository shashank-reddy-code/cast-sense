import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TopLevel({ fidStats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Casts</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M3 13v-2h5l-1.5-1.5 1.42-1.42L12.84 12l-4.92 4.92-1.42-1.42L8 13H3zm18-2v2h-5l1.5 1.5-1.42 1.42L11.16 12l4.92-4.92 1.42 1.42L16 11h5z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {fidStats.current_period_casts}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatNumber(fidStats.casts_percentage_change)}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recasts</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M3 13v-2h5l-1.5-1.5 1.42-1.42L12.84 12l-4.92 4.92-1.42-1.42L8 13H3zm18-2v2h-5l1.5 1.5-1.42 1.42L11.16 12l4.92-4.92 1.42 1.42L16 11h5z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {fidStats.current_period_recasts}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatNumber(fidStats.recasts_percentage_change)}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mentions</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {fidStats.current_period_mentions}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatNumber(fidStats.mentions_percentage_change)}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Replies</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5-1.6 11-5.9 -1.3 4.6-4 7-11 7v-3" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {fidStats.current_period_replies}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatNumber(fidStats.replies_percentage_change)}% since last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Likes</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 21.5a6 6 0 0 1-6-6 6 6 0 0 1 6-6 6 6 0 0 1 6 6 6 6 0 0 1-6 6Z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {fidStats.current_period_likes}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatNumber(fidStats.likes_percentage_change)}% since last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function formatNumber(number: string) {
  // parse string as number and truncate decimals
  return parseFloat(number).toFixed(0);
}
