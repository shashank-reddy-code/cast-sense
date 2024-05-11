import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopLevel } from "@/components/top-level";
import { UserNav } from "@/components/user-nav";
import { Historical } from "@/components/historical";
import { FollowerCarousel } from "@/components/follower-carousel";
import { EngagementCarousel } from "@/components/engagement-carousel";
import {
  getChannelStats,
  getTopEngagersAndInfluencers,
  getFollowerTiers,
  getTopAndBottomCasts,
  getDailyEngagement,
  getDailyCastersCount,
  getFollowerActiveHours,
  getMaxValue,
} from "@/lib/dune-channels";
import { fetchChannelByName } from "@/lib/neynar";
import Link from "next/link";
import { Profile } from "@/lib/types";

export default async function DashboardChannel({
  params,
}: {
  params: { name: string };
}) {
  const name = params.name;
  const channel = await fetchChannelByName(name);
  const [
    channelStats,
    topEngagersAndInfluencers,
    followerTiers,
    topAndBottomCasts,
    dailyEngagement,
    dailyCasters,
    followerActiveHours,
  ] = await Promise.all([
    getChannelStats(channel.url),
    getTopEngagersAndInfluencers(channel.url),
    getFollowerTiers(channel.url),
    getTopAndBottomCasts(channel.url),
    getDailyEngagement(channel.url),
    getDailyCastersCount(channel.url),
    getFollowerActiveHours(channel.url),
  ]);

  const maxScale = getMaxValue(dailyEngagement, dailyCasters);
  console.log("Finished fetching data for", channel.url);
  // todo: clean this up
  const profile: Profile = {
    fid: channel.url,
    display_name: channel.name,
    pfp_url: channel.image_url,
    username: channel.name,
  };

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
                  {channel.name}
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
              <TopLevel fidStats={channelStats} isChannel={true} />
              {/* <Benchmark data={benchmarks} /> */}
              <Historical
                dailyEngagement={dailyEngagement}
                dailyFollowers={dailyCasters}
                maxScale={maxScale}
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
                followerActiveHours={followerActiveHours}
                isChannel={true}
              />
            </TabsContent>
            <TabsContent value="engagement" className="space-y-4">
              <EngagementCarousel casts={topAndBottomCasts} topChannels={[]} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
