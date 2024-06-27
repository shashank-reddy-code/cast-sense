"use client";

const BASE_URL = process.env["NEXT_PUBLIC_BASE_URL"];
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopLevel } from "@/components/top-level";
import { Historical } from "@/components/historical";
import { FollowerCarousel } from "@/components/follower-carousel";
import { EngagementCarousel } from "@/components/engagement-carousel";
import { Benchmark } from "@/components/benchmark";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchData } from "@/lib/utils";
import { useEffect, useState } from "react";
import { NeynarAuthButton, SIWN_variant } from "@neynar/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Benchmark as BenchmarkType,
  DailyActivity,
  DailyEngagement,
  DailyFollower,
  DailyOpenrankStrategies,
  FollowerActiveHours,
  FollowerTier,
  TopAndBottomCasts,
  TopChannel,
  TopEngager,
  TopLevelStats,
} from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { LockIcon } from "lucide-react";

interface DataState {
  profile: any;
  fidStats: TopLevelStats;
  topEngagersAndChannels: {
    topEngagers: TopEngager[];
    channels: TopChannel[];
  };
  followerTiers: FollowerTier[];
  topAndBottomCasts: TopAndBottomCasts;
  dailyEngagement: DailyEngagement[];
  dailyPowerBadgeEngagement: DailyEngagement[];
  dailyFollowers: DailyFollower[];
  dailyactivity: DailyActivity[];
  dailyOpenrankStrategies: DailyOpenrankStrategies;
  followerActiveHours: FollowerActiveHours;
  benchmarks: BenchmarkType;
  isPro: boolean;
}

export default function DashboardUser({
  params,
  searchParams,
}: {
  params: { fid: string };
  searchParams: { tz?: string };
}) {
  const [data, setData] = useState<DataState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchAllData = async (): Promise<void> => {
      const fid = parseInt(params.fid, 10);
      if (isNaN(fid) || fid <= 0) {
        notFound();
      }
      const tz = searchParams?.tz || "UTC";
      const isPro = false;
      try {
        const [
          profile,
          fidStats,
          topEngagersAndChannels,
          followerTiers,
          topAndBottomCasts,
          [dailyEngagement, dailyPowerBadgeEngagement],
          dailyFollowers,
          dailyactivity,
          dailyOpenrankStrategies,
          followerActiveHours,
          benchmarks,
          // user needs to be signed in to view this data
          // isPro,
        ] = await Promise.all([
          fetchData(`${BASE_URL}/api/user/${fid}`),
          fetchData(`${BASE_URL}/api/user/${fid}/stats`),
          fetchData(
            `${BASE_URL}/api/user/${fid}/top-engagers-and-follower-channels`
          ),
          fetchData(`${BASE_URL}/api/user/${fid}/follower-tiers`),
          fetchData(`${BASE_URL}/api/user/${fid}/casts`),
          fetchData(`${BASE_URL}/api/user/${fid}/historical-engagement`),
          fetchData(`${BASE_URL}/api/user/${fid}/historical-followers`),
          fetchData(`${BASE_URL}/api/user/${fid}/historical-activity`),
          fetchData(`${BASE_URL}/api/user/${fid}/historical-openrank`),
          fetchData(`${BASE_URL}/api/user/${fid}/active-hours?tz=${tz}`),
          fetchData(`${BASE_URL}/api/user/${fid}/benchmarks`),
          // fetchData(`${BASE_URL}/api/user/[fid]/account-status`)
        ]);
        // const maxScale = getMaxValue(dailyEngagement, dailyFollowers);
        // todo: fix this as it is a bit jank to get real-time follower data from neynar but use daily jobs for the rest
        fidStats.total_followers = profile.follower_count;
        console.log("Finished fetching data for", fid);
        setData({
          profile,
          fidStats: { ...fidStats, total_followers: profile.follower_count },
          topEngagersAndChannels,
          followerTiers,
          topAndBottomCasts,
          dailyEngagement,
          dailyPowerBadgeEngagement,
          dailyFollowers,
          dailyactivity,
          dailyOpenrankStrategies,
          followerActiveHours,
          benchmarks,
          isPro,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [params.fid, searchParams.tz]);
  if (loading) {
    return (
      <>
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-[200px] w-full" />{" "}
              {/* TopLevel skeleton */}
              <Skeleton className="h-[150px] w-full" />{" "}
              {/* Benchmark skeleton */}
              <Skeleton className="h-[300px] w-full" />{" "}
              {/* Historical skeleton */}
            </div>
          </TabsContent>
          <TabsContent value="followers">
            <Skeleton className="h-[400px] w-full" />{" "}
            {/* FollowerCarousel skeleton */}
          </TabsContent>
          <TabsContent value="engagement">
            <Skeleton className="h-[400px] w-full" />{" "}
            {/* EngagementCarousel skeleton */}
          </TabsContent>
        </Tabs>
      </>
    );
  }
  if (!data) {
    return <div>Error loading data</div>;
  }
  const {
    profile,
    fidStats,
    topEngagersAndChannels,
    followerTiers,
    topAndBottomCasts,
    dailyEngagement,
    dailyPowerBadgeEngagement,
    dailyFollowers,
    dailyactivity,
    dailyOpenrankStrategies,
    followerActiveHours,
    benchmarks,
    isPro,
  } = data;
  return (
    <div className="flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-8">
          <div className="flex items-center justify-between space-y-2">
            <Link href="/">
              <h2 className="text-xl sm:text-2xl md:text-3xl tracking-tight">
                CastSense
              </h2>
            </Link>
          </div>
          {/* <Search /> */}
          <div className="ml-auto flex items-center space-x-4">
            <NeynarAuthButton label="Login" variant={SIWN_variant.FARCASTER} />
          </div>
        </div>
      </div>
      <div className="flex-col space-y-4 p-8 pt-6">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={profile.pfp_url} alt="Image" />
            <AvatarFallback>{profile.username}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">
              {profile.display_name}
              {profile.power_badge && (
                <Image
                  src="/power-badge.png"
                  alt="Power Badge"
                  className="w-4 h-4 ml-1 inline"
                  width={16}
                  height={16}
                />
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {profile.profile.bio.text}
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="followers">
              Followers{!isPro && <LockIcon className="ml-1 h-4 w-4" />}
            </TabsTrigger>
            <TabsTrigger value="engagement">
              Engagement{!isPro && <LockIcon className="ml-1 h-4 w-4" />}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <TopLevel fidStats={fidStats} />
            <Benchmark data={benchmarks} />
            <Historical
              dailyEngagement={dailyEngagement}
              dailyPowerBadgeEngagement={dailyPowerBadgeEngagement}
              dailyFollowers={dailyFollowers}
              dailyActivity={dailyactivity}
              dailyOpenrankStrategies={dailyOpenrankStrategies}
            />
          </TabsContent>
          <TabsContent value="followers">
            <FollowerCarousel
              followerTiers={followerTiers}
              topEngagers={
                topEngagersAndChannels && topEngagersAndChannels.topEngagers
              }
              followerActiveHours={followerActiveHours}
            />
          </TabsContent>
          <TabsContent value="engagement">
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
  );
}
