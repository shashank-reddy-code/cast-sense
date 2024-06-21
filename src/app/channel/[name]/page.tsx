const BASE_URL = process.env["BASE_URL"];
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopLevel } from "@/components/top-level";
import { UserNav } from "@/components/user-nav";
import { Historical } from "@/components/historical";
import { FollowerCarousel } from "@/components/follower-carousel";
import { EngagementCarousel } from "@/components/engagement-carousel";
import { fetchChannelByName } from "@/lib/neynar";
import Link from "next/link";
import { Profile } from "@/lib/types";
import { fetchData } from "@/lib/utils";
import { searchChannelMentions } from "@/lib/alertcaster";

export default async function DashboardChannel({
  params,
  searchParams,
}: {
  params: { name: string };
  searchParams: { tz?: string };
}) {
  const name = decodeURIComponent(params.name);
  const tz = searchParams?.tz || "UTC";
  const channel = await fetchChannelByName(name);
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
    fetchData(`${BASE_URL}/api/channel/${name}/top-engagers-and-influencers`),
    fetchData(`${BASE_URL}/api/channel/${name}/follower-tiers`),
    fetchData(`${BASE_URL}/api/channel/${name}/casts`),
    fetchData(`${BASE_URL}/api/channel/${name}/historical-engagement`),
    fetchData(`${BASE_URL}/api/channel/${name}/historical-casters`),
    fetchData(`${BASE_URL}/api/channel/${name}/active-hours?tz=${tz}`),
    fetchData(`${BASE_URL}/api/channel/${name}/overlapping-channels`),
    searchChannelMentions(name, channel.url, channel.lead.username),
  ]);

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
  if (channel == null || channelStats == null) {
    return <div>Channel data not found</div>;
  }

  // todo: fix this as it is a bit jank to get real-time follower data from neynar but use daily jobs for the rest
  channelStats.total_followers = channel.follower_count;

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
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="flex items-center justify-between space-y-2">
              <h3 className="text-3xl tracking-tight">Proof of work 💪</h3>
            </div>
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
