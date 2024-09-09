import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Benchmark as BenchmarkDataType } from "@/lib/types";

export function Benchmark({ data }: { data: BenchmarkDataType }) {
  const engagementDiff = data?.pct_engagement_diff ?? 0;
  const followersDiff = data?.pct_followers_diff ?? 0;

  const engagementSign = engagementDiff > 0 ? "more" : "less";
  const followersSign = followersDiff > 0 ? "is better" : "could be better";

  const formattedEngagementDiff =
    isNaN(engagementDiff) || engagementDiff === 0
      ? "NaN"
      : Math.abs(engagementDiff).toFixed(2);
  const formattedFollowersDiff =
    isNaN(followersDiff) || followersDiff === 0
      ? "NaN"
      : Math.abs(followersDiff).toFixed(2);
  if (formattedEngagementDiff === "NaN" || formattedFollowersDiff === "NaN") {
    return null;
  }
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader className="grid  items-start gap-4 space-y-0">
          <CardDescription>
            Your follower growth {followersSign} by{" "}
            <span
              style={{
                fontWeight: "bold",
                color: followersSign === "is better" ? "green" : "red",
              }}
            >
              {formattedFollowersDiff}%
            </span>{" "}
            compared to users with similar following
          </CardDescription>
        </CardHeader>
      </Card>

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
    </div>
  );
}
