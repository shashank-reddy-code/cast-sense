const DUNE_API_KEY = process.env["DUNE_API_KEY"];
import {
  DailyEngagement,
  DailyFollower,
  FollowerActiveHours,
  FollowerTier,
  Profile,
  TopAndBottomCasts,
  TopLevelStats,
} from "./types";
import { fetchChannelByName, fetchProfileByName } from "./neynar";

export async function getChannelStats(
  channelUrl: string
): Promise<TopLevelStats> {
  // schedule the query on a 24 hour interval, and then fetch by filtering for the user fid within the query results
  // dune query: https://dune.com/queries/3714673
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const encodedChannelUrl = encodeURIComponent(channelUrl);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3714673/results?&filters=channel_url="${encodedChannelUrl}"`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  const body = await latest_response.text();
  const trends = JSON.parse(body).result.rows[0];
  return trends;
}

export async function getTopEngagersAndInfluencers(
  channelUrl: string
): Promise<{ topEngagers: Profile[]; topInfluencers: Profile[] }> {
  // dune query: https://dune.com/queries/3715815
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const encodedChannelUrl = encodeURIComponent(channelUrl);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3715815/results?&filters=channel_url="${encodedChannelUrl}"`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  const body = await latest_response.text();
  const topEngagersAndInfluencers = JSON.parse(body).result.rows[0];

  const engagerPromises = topEngagersAndInfluencers.top_casters.map(
    (topEngager: string) => fetchProfileByName(topEngager)
  );
  const influencerPromises = topEngagersAndInfluencers.influential_casters.map(
    (influential_caster: string) => fetchProfileByName(influential_caster)
  );

  const [topEngagers, topInfluencers] = await Promise.all([
    Promise.all(engagerPromises),
    Promise.all(influencerPromises),
  ]);

  return {
    topEngagers,
    topInfluencers,
  };
}

// todo: fix this
export async function getPowerbadgeFollowers(
  channelUrl: string
): Promise<FollowerTier> {
  // dune query: https://dune.com/queries/3715907
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const encodedChannelUrl = encodeURIComponent(channelUrl);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3715907/results?&filters=channel_url="${encodedChannelUrl}"`,
    {
      method: "GET",
      headers: header,
    }
  );
  const body = await latest_response.text();
  const powerbadgeFollowers = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid
  const tier = "💪 power badge";
  return {
    tier,
    count: powerbadgeFollowers?.count || 0,
    percentage: parseFloat(powerbadgeFollowers?.percentage || 0),
  };
}

// todo:fix this
// export async function getBenchmarks(fid: number): Promise<Benchmark> {
// }

// todo: update to also call powerbadge followers
export async function getFollowerTiers(
  channelUrl: string
): Promise<FollowerTier[]> {
  // schedule the query on a 24 hour interval, and then fetch by filtering for the user fid within the query results
  // dune query: // https://dune.com/queries/3715790
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const encodedChannelUrl = encodeURIComponent(channelUrl);
  const queryResponse = await Promise.all([
    fetch(
      `https://api.dune.com/api/v1/query/3715790/results?&filters=channel_url="${encodedChannelUrl}"`,
      {
        method: "GET",
        headers: header,
        cache: "no-store",
      }
    ),
    getPowerbadgeFollowers(channelUrl),
  ]);

  const latest_response = queryResponse[0];
  const powerbadgeFollowers = queryResponse[1];

  const body = await latest_response.text();
  const followerTiers = JSON.parse(body).result.rows[0];
  const tierCounts: { [key: string]: number } = followerTiers.tier_name_counts;
  const tierPercentages: { [key: string]: number } =
    followerTiers.tier_name_percentages;

  const tierMap: FollowerTier[] = [];

  for (const tier in tierCounts) {
    const count = tierCounts[tier];
    const percentage = tierPercentages[tier] || 0;
    tierMap.push({ tier, count, percentage });
  }

  const sortedMap = tierMap.sort((a, b) => {
    return b.percentage - a.percentage;
  });

  return [powerbadgeFollowers, ...sortedMap];
}

export async function getFollowerActiveHours(
  channelUrl: string
): Promise<FollowerActiveHours> {
  // https://dune.com/queries/3715688
  // Prepare headers for the request.
  const headers = new Headers({
    "x-dune-api-key": DUNE_API_KEY || "",
  });
  const encodedChannelUrl = encodeURIComponent(channelUrl);

  // Fetch the data.
  const response = await fetch(
    `https://api.dune.com/api/v1/query/3715688/results?&filters=channel_url="${encodedChannelUrl}"`,
    {
      method: "GET",
      headers: headers,
      cache: "no-store",
    }
  );

  // Parse the JSON response.
  const data = await response.json();
  const result = data.result.rows[0];
  if ("channel_url" in result) {
    delete result["channel_url"];
  }

  // Initialize an object to hold the final counts for all days of the week.
  const weeklyHourlyCounts: { [key: string]: { [key: number]: number } } = {};

  // Process each day's hourly counts.
  Object.keys(result).forEach((day) => {
    const dayCounts = result[day];
    weeklyHourlyCounts[day] = {};

    // Set default count for each hour.
    for (let hour = 0; hour < 24; hour++) {
      weeklyHourlyCounts[day][hour] = dayCounts[hour] ?? 0;
    }
  });

  // Find the best 3 times to post
  let bestTimes = [];
  for (let day in weeklyHourlyCounts) {
    for (let hour in weeklyHourlyCounts[day]) {
      bestTimes.push({ day, hour, count: weeklyHourlyCounts[day][hour] });
    }
  }

  // Sort the times by follower count in descending order and take the top three
  bestTimes.sort((a, b) => b.count - a.count);
  bestTimes = bestTimes.slice(0, 3);

  // Map to readable format
  const readableBestTimes =
    bestTimes
      .map((time) => {
        let hour = parseInt(time.hour);
        let ampm = hour >= 12 ? "pm" : "am";
        hour = hour % 12 || 12; // Convert 24h to 12h format
        let day = time.day.replace("_hourly_counts", ""); // Remove the suffix
        day = day.charAt(0).toUpperCase() + day.slice(1); // Capitalize the first letter
        return `${day} at ${hour}${ampm}`;
      })
      .join(", ") + " PST";

  const output = {
    activeHours: weeklyHourlyCounts,
    bestTimesToPost: readableBestTimes,
  };
  return output;
}

export async function getTopAndBottomCasts(
  channelUrl: string
): Promise<TopAndBottomCasts> {
  // https://dune.com/queries/3715759
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const encodedChannelUrl = encodeURIComponent(channelUrl);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3715759/results?&filters=channel_url="${encodedChannelUrl}"`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  const body = await latest_response.text();
  const topAndBottomCasts = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid

  return topAndBottomCasts;
}

export async function getEngagingChannels(fid: number) {
  // https://dune.com/queries/3690289
}

export async function getDailyEngagement(
  channelUrl: string
): Promise<DailyEngagement[]> {
  // https://dune.com/queries/3715718
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const encodedChannelUrl = encodeURIComponent(channelUrl);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3715718/results?&filters=channel_url="${encodedChannelUrl}"`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  const body = await latest_response.text();
  const result = JSON.parse(body).result.rows[0];

  const dailyEngagement: DailyEngagement[] = result?.daily_engagement.map(
    (item: string[]) => {
      const date = new Date(item[0]); // Create a date object from the datetime string
      const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

      return {
        name: formattedDate,
        total: item[1],
      };
    }
  );
  return dailyEngagement;
}

export async function getDailyCastersCount(
  channelUrl: string
): Promise<DailyFollower[]> {
  // https://dune.com/queries/3715676
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const encodedChannelUrl = encodeURIComponent(channelUrl);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3715676/results?&filters=channel_url="${encodedChannelUrl}"`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  const body = await latest_response.text();
  const dailyFollower = JSON.parse(body).result.rows[0];

  const dailyFollowers: DailyFollower[] = dailyFollower?.daily_casters.map(
    (item: any) => {
      const date = new Date(item[0]); // Create a date object from the datetime string
      const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

      return {
        date: formattedDate,
        followers: item[1], // Index 1 for followers
        unfollowers: 0, // this data is not on-hub yet
      };
    }
  );
  return dailyFollowers;
}

export function getMaxValue(
  engagementData: DailyEngagement[],
  followersData: DailyFollower[]
) {
  const maxEngagement = Math.max(...engagementData.map((e) => e.total));
  const maxFollowers = Math.max(...followersData.map((f) => f.followers));
  const maxUnfollowers = Math.max(...followersData.map((f) => f.unfollowers));
  return Math.max(Math.max(maxEngagement, maxFollowers), maxUnfollowers);
}
