//"use client";
//import React from "react";
// import { useState } from "react";
// import { useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopLevel } from "@/components/top-level";
import { UserNav } from "@/components/user-nav";
import { Historical } from "@/components/historical";
import { FollowerCarousel } from "@/components/follower-carousel";
import { EngagementCarousel } from "@/components/engagement-carousel";
import {
  getFidStats,
  getTopEngagersAndChannels,
  getFollowerTiers,
  getTopAndBottomCasts,
  getEngagingChannels,
  getDailyEngagement,
  getDailyFollowerCount,
  getFollowerActiveHours,
  getPowerbadgeFollowers,
  getBenchmarks,
} from "@/lib/dune";
import { fetchProfileByFid } from "@/lib/neynar";
import { Benchmark } from "@/components/benchmark";

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Example dashboard app built using the components.",
// };

export default async function DashboardPage({
  params,
}: {
  params: { fid: string };
}) {
  const fid = parseFloat(params.fid);
  const [
    profile,
    fidStats,
    topEngagersAndChannels,
    followerTiers,
    topAndBottomCasts,
    engagingChannels,
    dailyEngagement,
    dailyFollowers,
    followerActiveHours,
    powerbadgeFollowers,
    benchmarks,
  ] = await Promise.all([
    fetchProfileByFid(fid),
    getFidStats(fid),
    getTopEngagersAndChannels(fid),
    getFollowerTiers(fid),
    getTopAndBottomCasts(fid),
    getEngagingChannels(fid),
    getDailyEngagement(fid),
    getDailyFollowerCount(fid),
    getFollowerActiveHours(fid),
    getPowerbadgeFollowers(fid),
    getBenchmarks(fid),
  ]);

  console.log(
    "debugging follower active hours in page.tsx: ",
    followerActiveHours
  );
  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">CastSense</h2>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  {profile.display_name}
                </h2>
              </div>
              <UserNav profile={profile} />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="followers">Followers</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="recommendation" disabled>
                Recommendations
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <TopLevel fidStats={fidStats} />
              <Benchmark data={benchmarks} />
              <Historical
                dailyEngagement={dailyEngagement}
                dailyFollowers={dailyFollowers}
              />
            </TabsContent>
            <TabsContent value="followers" className="space-y-4">
              <FollowerCarousel
                followerTiers={followerTiers}
                topEngagers={
                  topEngagersAndChannels &&
                  topEngagersAndChannels["top_engagers"]
                }
                followerActiveHours={followerActiveHours}
                powerbadgeFollowers={powerbadgeFollowers}
              />
            </TabsContent>
            <TabsContent value="engagement" className="space-y-4">
              <EngagementCarousel
                casts={topAndBottomCasts}
                topChannels={
                  topEngagersAndChannels &&
                  topEngagersAndChannels["top_channels"]
                }
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
