import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import ReactApexChart from "react-apexcharts";
import React from "react";

export function BestTimeToPost({ followerActiveHours }) {
  // Function to calculate the overall max and min across all days
  const calculateMaxMin = () => {
    let allCounts: number[] = [];
    Object.values(followerActiveHours).forEach((dailyCounts) => {
      allCounts = allCounts.concat(Object.values(dailyCounts));
    });
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
    <div className="space-y-8 flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Best time to post</CardTitle>
          <CardDescription>
            When are your followers most active? (time is in PST)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex aspect-square p-6 flex flex-col space-y-5  ">
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <div
                key={day}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "transparent",
                    margin: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    paddingRight: "20px",
                  }}
                >
                  {day.slice(0, 3)}{" "}
                </div>
                {Object.entries(
                  followerActiveHours[`${day.toLowerCase()}_hourly_counts`]
                ).map(([hour, count]) => (
                  <div
                    key={`${day}_${hour}`}
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: interpolateColor(count, maxCount),
                      margin: "2px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color:
                        count > (maxCount - minCount) / 2 ? "white" : "black",
                      fontWeight: "bold",
                    }}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
