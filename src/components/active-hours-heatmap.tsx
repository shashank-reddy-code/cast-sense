"use client"; // if you use app dir, don't forget this line

import { FollowerActiveHours } from "@/lib/types";
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function ActiveHoursHeatMap({
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
      name: day.slice(0, 3),
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
        height: 'auto',
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
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: {
        show: true,
        style: {
          colors: "#ffffff", // White color for y-axis labels
        },
        hideOverlappingLabels: true, // Hide overlapping labels
        className: "text-sm md:text-base",
      },
    },
    xaxis: {
      labels: {
        show: true,
        style: {
          colors: "#ffffff", // White color for y-axis labels
        },
        hideOverlappingLabels: true,
        className: "text-sm md:text-base",
      },
      tickAmount: 12,
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
