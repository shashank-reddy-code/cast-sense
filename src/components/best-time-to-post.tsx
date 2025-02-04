import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ActiveHoursHeatMap } from "./active-hours-heatmap";
import { FollowerActiveHours } from "@/lib/types";

export function BestTimeToPost({
  followerActiveHours,
  isChannel,
}: {
  followerActiveHours: FollowerActiveHours;
  isChannel: boolean;
}) {
  // Function to calculate the overall max and min across all days
  const calculateMaxMin = () => {
    let allCounts: number[] = [];
    Object.values(followerActiveHours.activeHours).forEach(
      (dailyCounts: any) => {
        allCounts = allCounts.concat(Object.values(dailyCounts));
      }
    );
    const maxCount = Math.max(...allCounts);
    const minCount = Math.min(...allCounts);
    return { maxCount, minCount };
  };

  // Now use the function in your existing code
  const { maxCount, minCount } = calculateMaxMin();
  // Function to interpolate between colors
  const interpolateColor = (value: number, max: number) => {
    const saturation = Math.round((value / max) * 100); // Calculate saturation as a percentage of the max
    const lightness = 100 - saturation; // Inverse relationship for lightness
    return `hsl(280, ${saturation}%, ${lightness}%)`; // Hue for purple is around 280
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-4">Best time to post</CardTitle>
        <CardDescription className="text-lg">
          {isChannel
            ? "Engagement activity is highest on "
            : "Your followers are most active on "}
          <span
            style={{
              fontWeight: "bold",
              color: "green",
            }}
          >
            {followerActiveHours.bestTimesToPost}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ActiveHoursHeatMap followerActiveHours={followerActiveHours} />
      </CardContent>
    </Card>
  );
}
