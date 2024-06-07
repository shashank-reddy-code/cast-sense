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
  getDailyactivity,
  getFollowerActiveHours,
  getBenchmarks,
  getDailyOpenrank,
} from "@/lib/dune-fid";
import { fetchProfileByFid } from "@/lib/neynar";
import { Benchmark } from "@/components/benchmark";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function DashboardUser({
  params,
  searchParams,
}: {
  params: { fid: string };
  searchParams: { tz?: string };
}) {
  const fid = parseInt(params.fid, 10);
  if (isNaN(fid) || fid <= 0) {
    notFound();
  }
  const tz = searchParams?.tz || "UTC";
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
  ] = await Promise.all([
    fetchProfileByFid({ fid, useCache: false }),
    getFidStats(fid),
    getTopEngagersAndChannels(fid),
    getFollowerTiers(fid),
    getTopAndBottomCasts(fid),
    getDailyEngagement(fid),
    getDailyFollowerCount(fid),
    getDailyactivity(fid),
    getDailyOpenrank(fid),
    getFollowerActiveHours(fid, tz),
    getBenchmarks(fid),
  ]);

  // const maxScale = getMaxValue(dailyEngagement, dailyFollowers);
  // todo: fix this as it is a bit jank to get real-time follower data from neynar but use daily jobs for the rest
  fidStats.total_followers = profile.follower_count;
  console.log("Finished fetching data for", fid);

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
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl tracking-tight">
                {profile.display_name}
              </h2>
            </div>
            <UserNav profile={profile} />
          </div>
        </div>
      </div>
      <div className="flex-col space-y-4 p-8 pt-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="flex items-center justify-between space-y-2">
              <h3 className="text-3xl tracking-tight">Proof of work 💪</h3>
            </div>
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
