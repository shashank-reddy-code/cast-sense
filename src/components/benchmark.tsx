import {
  ChevronDownIcon,
  CircleIcon,
  PlusIcon,
  StarIcon,
} from "@radix-ui/react-icons";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function Benchmark({ data }: { data: any }) {
  const engagementSign =
    parseFloat(data?.pct_engagement_diff) > 0 ? "more" : "less";
  const followersSign =
    parseFloat(data?.pct_followers_diff) > 0 ? "more" : "fewer";
  const formattedEngagementDiff =
    isNaN(data?.pct_engagement_diff) || data?.pct_engagement_diff === null
      ? "NaN"
      : data?.pct_engagement_diff?.toFixed(2);
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader className="grid items-start gap-4 space-y-0">
          <CardDescription>
            You have {engagementSign} engagement compared to users with similar
            following by{" "}
            <span
              style={{
                fontWeight: "bold",
                color: engagementSign === "more" ? "green" : "red",
              }}
            >
              {formattedEngagementDiff}%
            </span>
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="grid  items-start gap-4 space-y-0">
          {/* <CardTitle>Relative follower growth</CardTitle> */}
          <CardDescription>
            You add {followersSign} followers compared to users with similar
            following by{" "}
            <span
              style={{
                fontWeight: "bold",
                color: followersSign === "more" ? "green" : "red",
              }}
            >
              {data?.pct_followers_diff.toFixed(2)}%
            </span>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
