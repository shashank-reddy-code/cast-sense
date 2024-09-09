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
import {
  NeynarAuthButton,
  SIWN_variant,
  useNeynarContext,
} from "@neynar/react";
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
import { ProContentLock } from "@/components/pro-content-lock";

interface BaseDataState {
  profile: any;
  fidStats: TopLevelStats;
  dailyEngagement: DailyEngagement[];
  dailyPowerBadgeEngagement: DailyEngagement[];
  dailyFollowers: DailyFollower[];
  dailyactivity: DailyActivity[];
  dailyOpenrankStrategies: DailyOpenrankStrategies;
  benchmarks: BenchmarkType;
}

interface PremiumDataState {
  topEngagersAndChannels: {
    topEngagers: TopEngager[];
    channels: TopChannel[];
  };
  followerTiers: FollowerTier[];
  topAndBottomCasts: TopAndBottomCasts;
  followerActiveHours: FollowerActiveHours;
}

export default function DashboardUser({
  params,
  searchParams,
}: {
  params: { fid: string };
  searchParams: { tz?: string };
}) {
  const [data, setData] = useState<{
    baseData: BaseDataState | null;
    premiumData: PremiumDataState | null;
    isPro: boolean;
  }>({
    baseData: null,
    premiumData: null,
    isPro: false,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useNeynarContext();

  useEffect(() => {
    setLoading(true);
    const fetchAllData = async (): Promise<void> => {
      const fid = parseInt(params.fid, 10);
      if (isNaN(fid) || fid <= 0) {
        notFound();
      }
      const tz = searchParams?.tz || "UTC";
      try {
        let userIsPro = false;
        if (user && isAuthenticated) {
          const proStatus = await fetchData(
            `${BASE_URL}/api/user/${user.fid}/account-status`
          );
          userIsPro = proStatus?.isPro || false;
        }
        const commonApiCalls = [
          fetchData(`${BASE_URL}/api/user/${fid}`),
          fetchData(`${BASE_URL}/api/user/${fid}/stats`),
          fetchData(`${BASE_URL}/api/user/${fid}/historical-engagement`),
          fetchData(`${BASE_URL}/api/user/${fid}/historical-followers`),
          fetchData(`${BASE_URL}/api/user/${fid}/historical-activity`),
          fetchData(`${BASE_URL}/api/user/${fid}/historical-openrank`),
          fetchData(`${BASE_URL}/api/user/${fid}/benchmarks`),
        ];

        const results = await Promise.all(commonApiCalls);

        const [
          profile,
          fidStats,
          [dailyEngagement, dailyPowerBadgeEngagement],
          dailyFollowers,
          dailyactivity,
          dailyOpenrankStrategies,
          benchmarks,
        ] = results;

        fidStats.total_followers = profile.follower_count;

        const baseDataState: BaseDataState = {
          profile,
          fidStats: { ...fidStats, total_followers: profile.follower_count },
          dailyEngagement,
          dailyPowerBadgeEngagement,
          dailyFollowers,
          dailyactivity,
          dailyOpenrankStrategies,
          benchmarks,
        };

        if (userIsPro) {
          const premiumApiCalls = [
            fetchData(
              `${BASE_URL}/api/user/${fid}/top-engagers-and-follower-channels`
            ),
            fetchData(`${BASE_URL}/api/user/${fid}/follower-tiers`),
            fetchData(`${BASE_URL}/api/user/${fid}/casts`),
            fetchData(`${BASE_URL}/api/user/${fid}/active-hours?tz=${tz}`),
            fetchData(`${BASE_URL}/api/user/${fid}/earnings`),
          ];

          const premiumResults = await Promise.all(premiumApiCalls);
          const [
            topEngagersAndChannels,
            followerTiers,
            topAndBottomCasts,
            followerActiveHours,
            earnings,
          ] = premiumResults;

          const premiumDataState: PremiumDataState = {
            topEngagersAndChannels,
            followerTiers,
            topAndBottomCasts,
            followerActiveHours,
          };

          baseDataState.fidStats.total_earnings = earnings.total_earnings;

          setData({
            baseData: baseDataState,
            premiumData: premiumDataState,
            isPro: true,
          });
        } else {
          setData({ baseData: baseDataState, premiumData: null, isPro: false });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [params.fid, searchParams.tz, user, isAuthenticated]);

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
      {data.baseData && (
        <div className="flex-col space-y-4 p-8 pt-6">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={data.baseData.profile.pfp_url} alt="Image" />
              <AvatarFallback>{data.baseData.profile.username}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">
                {data.baseData.profile.display_name}
                {data.baseData.profile.power_badge && (
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
                {data.baseData.profile.profile.bio.text}
              </p>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="followers">
                Followers{!data.isPro && <LockIcon className="ml-1 h-4 w-4" />}
              </TabsTrigger>
              <TabsTrigger value="engagement">
                Engagement{!data.isPro && <LockIcon className="ml-1 h-4 w-4" />}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <TopLevel fidStats={data.baseData.fidStats} isPro={data.isPro} />
              <Benchmark data={data.baseData.benchmarks} />
              <Historical
                dailyEngagement={data.baseData.dailyEngagement}
                dailyPowerBadgeEngagement={
                  data.baseData.dailyPowerBadgeEngagement
                }
                dailyFollowers={data.baseData.dailyFollowers}
                dailyActivity={data.baseData.dailyactivity}
                dailyOpenrankStrategies={data.baseData.dailyOpenrankStrategies}
              />
            </TabsContent>
            <TabsContent value="followers">
              {data.isPro && data.premiumData ? (
                <FollowerCarousel
                  followerTiers={data.premiumData.followerTiers}
                  topEngagers={
                    data.premiumData.topEngagersAndChannels.topEngagers
                  }
                  followerActiveHours={data.premiumData.followerActiveHours}
                  isPro={data.isPro}
                />
              ) : (
                <ProContentLock
                  upgradeUrl={"https://hypersub.withfabric.xyz/s/castsense/1"}
                  dayPassUrl={"https://hypersub.withfabric.xyz/s/castsense/2"}
                />
              )}
            </TabsContent>
            <TabsContent value="engagement">
              {data.isPro && data.premiumData ? (
                <EngagementCarousel
                  casts={data.premiumData.topAndBottomCasts}
                  topChannels={data.premiumData.topEngagersAndChannels.channels}
                  isPro={data.isPro}
                />
              ) : (
                <ProContentLock
                  upgradeUrl={"https://hypersub.withfabric.xyz/s/castsense/1"}
                  dayPassUrl={"https://hypersub.withfabric.xyz/s/castsense/2"}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
