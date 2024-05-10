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
  getDailyEngagement,
  getDailyFollowerCount,
  getFollowerActiveHours,
  getBenchmarks,
  getMaxValue,
} from "@/lib/dune";
import { fetchProfileByFid } from "@/lib/neynar";
import { Benchmark } from "@/components/benchmark";
import Link from "next/link";

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
    dailyEngagement,
    dailyFollowers,
    followerActiveHours,
    benchmarks,
  ] = await Promise.all([
    fetchProfileByFid(fid),
    getFidStats(fid),
    getTopEngagersAndChannels(fid),
    getFollowerTiers(fid),
    getTopAndBottomCasts(fid),
    getDailyEngagement(fid),
    getDailyFollowerCount(fid),
    getFollowerActiveHours(fid),
    getBenchmarks(fid),
  ]);

  const maxScale = getMaxValue(dailyEngagement, dailyFollowers);
  console.log("Finished fetching data for", fid);

  return (
    <>
      <div className="flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center justify-between space-y-2">
              <Link href="/">
                <h2 className="text-xl sm:text-2xl md:text-3xl tracking-tight">
                  CastSense
                </h2>
              </Link>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl tracking-tight">
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
                Recommendations (soon)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="flex items-center justify-between space-y-2">
                <h3 className="text-3xl tracking-tight">Proof of work 💪</h3>
              </div>
              <TopLevel fidStats={fidStats} />
              <Benchmark data={benchmarks} />
              <Historical
                dailyEngagement={dailyEngagement}
                dailyFollowers={dailyFollowers}
                maxScale={maxScale}
              />
            </TabsContent>
            <TabsContent value="followers" className="space-y-4">
              <FollowerCarousel
                followerTiers={followerTiers}
                topEngagers={
                  topEngagersAndChannels && topEngagersAndChannels.topEngagers
                }
                followerActiveHours={followerActiveHours}
              />
            </TabsContent>
            <TabsContent value="engagement" className="space-y-4">
              <EngagementCarousel
                casts={topAndBottomCasts}
                topChannels={
                  topEngagersAndChannels && topEngagersAndChannels.channels
                }
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
