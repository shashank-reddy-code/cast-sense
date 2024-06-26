"use client";

const BASE_URL = process.env["NEXT_PUBLIC_BASE_URL"];
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopLevel } from "@/components/top-level";
import { Historical } from "@/components/historical";
import { FollowerCarousel } from "@/components/follower-carousel";
import { EngagementCarousel } from "@/components/engagement-carousel";
import Link from "next/link";
import { CastEngagementCount, Profile } from "@/lib/types";
import { fetchData } from "@/lib/utils";
import { NeynarAuthButton, SIWN_variant } from "@neynar/react";
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
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface DataState {
  profile: any;
  channelStats: TopLevelStats;
  topEngagersAndInfluencers: {
    topEngagers: TopEngager[];
    topInfluencers: TopEngager[];
  };
  followerTiers: FollowerTier[];
  topAndBottomCasts: TopAndBottomCasts;
  dailyEngagement: DailyEngagement[];
  dailyPowerBadgeEngagement: DailyEngagement[];
  dailyCasters: DailyFollower[];
  dailyActivity: DailyActivity[];
  followerActiveHours: FollowerActiveHours;
  similarChannels: TopChannel[];
  channelMentions: CastEngagementCount[];
}

export default function DashboardChannel({
  params,
  searchParams,
}: {
  params: { name: string };
  searchParams: { tz?: string };
}) {
  const [data, setData] = useState<DataState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchAllData = async (): Promise<void> => {
      const name = decodeURIComponent(params.name);
      const tz = searchParams?.tz || "UTC";
      const channel = await fetchData(`${BASE_URL}/api/channel/${name}`);
      try {
        const [
          channelStats,
          topEngagersAndInfluencers,
          followerTiers,
          topAndBottomCasts,
          [dailyEngagement, dailyPowerBadgeEngagement],
          [dailyCasters, dailyActivity],
          followerActiveHours,
          similarChannels,
          channelMentions,
        ] = await Promise.all([
          fetchData(`${BASE_URL}/api/channel/${name}/stats`),
          fetchData(
            `${BASE_URL}/api/channel/${name}/top-engagers-and-influencers`
          ),
          fetchData(`${BASE_URL}/api/channel/${name}/follower-tiers`),
          fetchData(`${BASE_URL}/api/channel/${name}/casts`),
          fetchData(`${BASE_URL}/api/channel/${name}/historical-engagement`),
          fetchData(`${BASE_URL}/api/channel/${name}/historical-casters`),
          fetchData(`${BASE_URL}/api/channel/${name}/active-hours?tz=${tz}`),
          fetchData(`${BASE_URL}/api/channel/${name}/overlapping-channels`),
          fetchData(`${BASE_URL}/api/channel/${name}/search-mentions`),
        ]);

        // const channelMentions: CastEngagementCount[] = [];
        //const maxScale = getMaxValue(dailyEngagement, dailyCasters);
        console.log("Finished fetching data for", channel.url);
        // todo: clean this up
        const profile: Profile = {
          fid: channel.url,
          display_name: channel.name,
          pfp_url: channel.image_url,
          username: channel.name,
          follower_count: channel.follower_count,
          profile: { bio: { text: channel.description } },
          power_badge: false,
        };
        // if (channel == null || channelStats == null) {
        //   return <div>Channel data not found</div>;
        // }

        // todo: fix this as it is a bit jank to get real-time follower data from neynar but use daily jobs for the rest
        channelStats.total_followers = channel.follower_count;

        setData({
          profile,
          channelStats,
          topEngagersAndInfluencers,
          followerTiers,
          topAndBottomCasts,
          dailyEngagement,
          dailyPowerBadgeEngagement,
          dailyCasters,
          dailyActivity,
          followerActiveHours,
          similarChannels,
          channelMentions,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [params.name, searchParams.tz]);

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
    channelStats,
    topEngagersAndInfluencers,
    followerTiers,
    topAndBottomCasts,
    dailyEngagement,
    dailyPowerBadgeEngagement,
    dailyCasters,
    dailyActivity,
    followerActiveHours,
    similarChannels,
    channelMentions,
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
          <div className="ml-auto flex items-center space-x-4">
            <NeynarAuthButton label="Login" variant={SIWN_variant.FARCASTER} />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
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
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <TopLevel fidStats={channelStats} isChannel={true} />
            {/* <Benchmark data={benchmarks} /> */}
            <Historical
              dailyEngagement={dailyEngagement}
              dailyPowerBadgeEngagement={dailyPowerBadgeEngagement}
              dailyFollowers={dailyCasters}
              dailyActivity={dailyActivity}
              isChannel={true}
            />
          </TabsContent>
          <TabsContent value="followers" className="space-y-4">
            <FollowerCarousel
              followerTiers={followerTiers}
              topEngagers={
                topEngagersAndInfluencers &&
                topEngagersAndInfluencers.topEngagers
              }
              topInfluencers={
                topEngagersAndInfluencers &&
                topEngagersAndInfluencers.topInfluencers
              }
              similarChannels={similarChannels}
              followerActiveHours={followerActiveHours}
              isChannel={true}
            />
          </TabsContent>
          <TabsContent value="engagement" className="space-y-4">
            <EngagementCarousel
              casts={topAndBottomCasts}
              topChannels={[]}
              mentions={channelMentions}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
