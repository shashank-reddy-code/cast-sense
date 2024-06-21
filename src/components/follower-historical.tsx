"use client";

import { CastEngagementCount, DailyFollower } from "@/lib/types";
import {
  Bar,
  BarChart,
  ScatterChart,
  Layer,
  Legend,
  ComposedChart,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FarcasterEmbed } from "react-farcaster-embed/dist/client";
import "react-farcaster-embed/dist/styles.css"; // include default styles or write your own

export function FollowerHistorical({
  dailyFollowers,
  maxScale,
  casts = [],
}: {
  dailyFollowers: DailyFollower[];
  maxScale?: number;
  casts?: CastEngagementCount[];
}) {
  // Combine followers and casts data for scatter points
  let combinedData = dailyFollowers.map((entry, index) => {
    const entryCasts = casts.filter(
      (cast) =>
        new Date(cast.created_at).toLocaleDateString() ===
        new Date(entry.date).toLocaleDateString()
    );
    return {
      id: `data-${index}`,
      date: new Date(entry.date).toLocaleDateString(),
      followers: entry.followers,
      unfollowers: entry.unfollowers,
      cast: entryCasts[0] || null, // Only take the first cast if available
    };
  });

  // Custom tooltip for scatter points
  // const CustomScatterTooltip = ({
  //   active,
  //   payload,
  // }: {
  //   active?: boolean;
  //   payload?: any;
  // }) => {
  //   if (active && payload && payload.length) {
  //     const { cast } = payload[0].payload;
  //     return (
  //       <div className="custom-tooltip">
  //         {cast && <FarcasterEmbed username={cast.fname} hash={cast.hash} />}
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      if (data.castPoint) {
        return (
          <FarcasterEmbed username={data.cast.fname} hash={data.cast.hash} />
          // <div>
          //   <image
          //     xlinkHref="https://client.warpcast.com/v2/cast-image?castHash=${data.hash}"
          //     width={20}
          //     height={20}
          //   />
          // </div>
        );
      }

      return (
        <div
          style={{
            backgroundColor: "#9a4dce",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <p>{label}</p>
          <p>{`New Followers: ${data.followers}`}</p>
          {data.unfollowers > 0 && <p>{`Unfollowers: ${data.unfollowers}`}</p>}
        </div>
      );
    }

    return null;
  };

  // Custom scatter point component (can be an icon or image)
  const CustomScatterPoint = (props: { cx?: number; cy?: number }) => {
    const { cx, cy } = props;
    if (!cx || !cy) {
      return null;
    }
    return (
      <svg x={cx - 10} y={cy - 10} width={20} height={20} viewBox="0 0 24 24">
        <image xlinkHref="/favicon.png" width={20} height={20} />
      </svg>
    );
  };
  const maxFollowers = Math.max(...combinedData.map((item) => item.followers));
  combinedData = combinedData.map((item) => ({
    ...item,
    castPoint: item.cast !== null ? 0.1 * maxFollowers : null,
  }));
  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={combinedData}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={maxScale ? [0, maxScale] : [0, "auto"]}
        />
        {/* <Tooltip
          cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
          contentStyle={{ backgroundColor: "#9a4dce" }}
          labelStyle={{ color: "white" }}
          itemStyle={{ color: "black" }}
        /> */}
        {/* <Legend /> */}
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="followers"
          stackId="a"
          fill="#008080"
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey="unfollowers"
          stackId="a"
          fill="#D2B48C"
          radius={[10, 10, 0, 0]}
        />

        <Scatter
          name="Banger"
          data={combinedData}
          //data={combinedData.filter((entry) => entry.cast !== null)} // Only include entries with casts
          dataKey="castPoint"
          fill="#ff7300"
          shape="star"
        >
          {/* <Tooltip content={<CustomScatterTooltip />} /> */}
        </Scatter>
      </ComposedChart>
    </ResponsiveContainer>
  );
}
