"use client";

const BASE_URL = process.env["NEXT_PUBLIC_BASE_URL"];
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopLevel } from "@/components/top-level";
import { Historical } from "@/components/historical";
import { FollowerCarousel } from "@/components/follower-carousel";
import { EngagementCarousel } from "@/components/engagement-carousel";
import Link from "next/link";
import { Profile } from "@/lib/types";
import { fetchData } from "@/lib/utils";
import {
  NeynarAuthButton,
  SIWN_variant,
  useNeynarContext,
} from "@neynar/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DailyActivity,
  DailyEngagement,
  DailyFollower,
  FollowerActiveHours,
  FollowerTier,
  TopAndBottomCasts,
  TopChannel,
  TopEngager,
  TopLevelStats,
} from "@/lib/types";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LockIcon } from "lucide-react";
import { ProContentLock } from "@/components/pro-content-lock";

interface BaseDataState {
  profile: any;
  channelStats: TopLevelStats;
  dailyEngagement: DailyEngagement[];
  dailyPowerBadgeEngagement: DailyEngagement[];
  dailyCasters: DailyFollower[];
  dailyActivity: DailyActivity[];
}

interface PremiumDataState {
  topEngagersAndInfluencers: {
    topEngagers: TopEngager[];
    topInfluencers: TopEngager[];
  };
  followerTiers: FollowerTier[];
  topAndBottomCasts: TopAndBottomCasts;
  followerActiveHours: FollowerActiveHours;
  similarChannels: TopChannel[];
}

type DataState = {
  baseData: BaseDataState | null;
  premiumData: PremiumDataState | null;
  isPro: boolean;
};

export default function DashboardChannel({
  params,
  searchParams,
}: {
  params: { name: string };
  searchParams: { tz?: string };
}) {
  const [data, setData] = useState<DataState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useNeynarContext();

  const fetchAllData = useCallback(async (): Promise<void> => {
    const name = decodeURIComponent(params.name);
    const tz = searchParams?.tz || "UTC";
    const channel = await fetchData(`${BASE_URL}/api/channel/${name}`);
    try {
      let userIsPro = false;
      if (user && isAuthenticated) {
        const proStatus = await fetchData(
          `${BASE_URL}/api/user/${user.fid}/account-status`
        );
        userIsPro = proStatus?.isPro || false;
      }

      const commonApiCalls = [
        fetchData(`${BASE_URL}/api/channel/${name}/stats`),
        fetchData(`${BASE_URL}/api/channel/${name}/historical-engagement`),
        fetchData(`${BASE_URL}/api/channel/${name}/historical-casters`),
      ];

      const results = await Promise.all(commonApiCalls);

      const [
        channelStats,
        [dailyEngagement, dailyPowerBadgeEngagement],
        [dailyCasters, dailyActivity],
      ] = results;

      const profile: Profile = {
        fid: channel.url,
        display_name: channel.name,
        pfp_url: channel.image_url,
        username: channel.name,
        follower_count: channel.follower_count,
        profile: { bio: { text: channel.description } },
        power_badge: false,
      };

      const baseDataState: BaseDataState = {
        profile,
        channelStats,
        dailyEngagement,
        dailyPowerBadgeEngagement,
        dailyCasters,
        dailyActivity,
      };

      if (userIsPro) {
        const premiumApiCalls = [
          fetchData(
            `${BASE_URL}/api/channel/${name}/top-engagers-and-influencers`
          ),
          fetchData(`${BASE_URL}/api/channel/${name}/follower-tiers`),
          fetchData(`${BASE_URL}/api/channel/${name}/casts`),
          fetchData(`${BASE_URL}/api/channel/${name}/active-hours?tz=${tz}`),
          fetchData(`${BASE_URL}/api/channel/${name}/overlapping-channels`),
        ];

        const premiumResults = await Promise.all(premiumApiCalls);
        const [
          topEngagersAndInfluencers,
          followerTiers,
          topAndBottomCasts,
          followerActiveHours,
          similarChannels,
        ] = premiumResults;

        const premiumDataState: PremiumDataState = {
          ...baseDataState,
          topEngagersAndInfluencers,
          followerTiers,
          topAndBottomCasts,
          followerActiveHours,
          similarChannels,
        };

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
  }, [params.name, searchParams.tz, user, isAuthenticated]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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
          <div className="ml-auto flex items-center space-x-4">
            <NeynarAuthButton label="Login" variant={SIWN_variant.FARCASTER} />
          </div>
        </div>
      </div>
      {data.baseData && (
        <div className="flex-1 space-y-4 p-8 pt-6">
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
              <TopLevel
                fidStats={data.baseData.channelStats}
                isChannel={true}
              />
              <Historical
                dailyEngagement={data.baseData.dailyEngagement}
                dailyPowerBadgeEngagement={
                  data.baseData.dailyPowerBadgeEngagement
                }
                dailyFollowers={data.baseData.dailyCasters}
                dailyActivity={data.baseData.dailyActivity}
                isChannel={true}
              />
            </TabsContent>
            <TabsContent value="followers" className="space-y-4">
              {data.isPro && data.premiumData ? (
                <FollowerCarousel
                  followerTiers={data.premiumData.followerTiers}
                  topEngagers={
                    data.premiumData.topEngagersAndInfluencers.topEngagers
                  }
                  topInfluencers={
                    data.premiumData.topEngagersAndInfluencers.topInfluencers
                  }
                  similarChannels={data.premiumData.similarChannels}
                  followerActiveHours={data.premiumData.followerActiveHours}
                  isChannel={true}
                />
              ) : (
                <ProContentLock
                  upgradeUrl={"https://hypersub.withfabric.xyz/s/castsense/1"}
                  dayPassUrl={"https://hypersub.withfabric.xyz/s/castsense/2"}
                />
              )}
            </TabsContent>
            <TabsContent value="engagement" className="space-y-4">
              {data.isPro && data.premiumData ? (
                <EngagementCarousel
                  casts={data.premiumData.topAndBottomCasts}
                  topChannels={[] as TopChannel[]}
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
