"use client"; // if you use app dir, don't forget this line

import { DailyActivity } from "@/lib/types";
import { getDayLabel, getMonthLabel } from "@/lib/utils";
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function DailyActivityHeatMap({
  dailyActivity,
}: {
  dailyActivity: DailyActivity[];
}) {
  const formatSeriesData = () => {
    const numWeeks = Math.ceil(dailyActivity.length / 7);

    let series: any = [];
    let weekData: DailyActivity[][] = [];
    let gridCol = 0;

    dailyActivity.forEach((activity, index) => {
      if (!weekData[gridCol]) {
        weekData[gridCol] = [];
      }
      weekData[gridCol].push(activity);
      gridCol = (gridCol + 1) % 7;
    });

    // iterate over weekData and create series
    for (let i = weekData.length - 1; i >= 0; i--) {
      let weekSeries = {
        name: weekData[i][0].date,
        data: weekData[i].map((activity) => ({
          x: activity.date,
          y: activity.casts,
          date: activity.date,
        })),
      };
      series.push(weekSeries);
    }
    return series;
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
      custom: function (opts: any) {
        const date =
          opts.ctx.w.config.series[opts.seriesIndex].data[opts.dataPointIndex]
            .date;
        const value = opts.series[opts.seriesIndex][opts.dataPointIndex];

        return date + ": " + value;
      },
      x: {
        formatter: function (value: any) {
          return "";
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: "#ffffff", // White color for y-axis labels
        },
        hideOverlappingLabels: true, // Hide overlapping labels
        formatter: function (value: any, opts?: any) {
          return getDayLabel(value);
        },
      },
    },
    xaxis: {
      labels: {
        show: true,
        style: {
          colors: "#ffffff", // White color for y-axis labels
        },
        hideOverlappingLabels: true, // Hide overlapping labels
        formatter: function (value: string, timestamp: any, opts: any) {
          return getMonthLabel(value);
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
