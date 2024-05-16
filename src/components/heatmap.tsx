"use client"; // if you use app dir, don't forget this line

import { FollowerActiveHours } from "@/lib/types";
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function HeatMap({
  followerActiveHours,
}: {
  followerActiveHours: FollowerActiveHours;
}) {
  // Function to format the series data for the heatmap
  const formatSeriesData = () => {
    const daysOfWeek = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    return daysOfWeek.map((day) => ({
      name: day,
      data: Object.entries(followerActiveHours.activeHours[day]).map(
        ([hour, count]) => ({
          x: `${hour}:00`,
          y: count,
        })
      ),
    }));
  };

  const option = {
    chart: {
      toolbar: {
        show: false,
        tools: {
          download: false,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#800080"], // purple hue
    title: {
      text: "",
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
    yaxis: {
      categories: [
        "sunday",
        "saturday",
        "friday",
        "thursday",
        "wednesday",
        "tuesday",
        "monday",
      ],
      labels: {
        show: true,
        style: {
          colors: "#ffffff", // White color for y-axis labels
        },
      },
    },
    xaxis: {
      labels: {
        show: true,
        style: {
          colors: "#ffffff", // White color for y-axis labels
        },
      },
    },
  };
  const series = formatSeriesData();

  return (
    <div className="w-full h-60 sm:h-80 md:h-96 lg:h-120 xl:h-144 2xl:h-160">
      <ApexChart
        type="heatmap"
        options={option}
        series={series}
        height="100%"
        width="100%"
      />
    </div>
  );
}

function generateData(length: number, range: { min: number; max: number }) {
  const data = [];
  for (let i = 0; i < length; i++) {
    const value = Math.floor(
      Math.random() * (range.max - range.min + 1) + range.min
    );
    data.push(value);
  }
  return data;
}
