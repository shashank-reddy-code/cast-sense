const DUNE_API_KEY = process.env["DUNE_API_KEY"];
import {
  CastEngagementCount,
  DailyActivity,
  DailyEngagement,
  DailyFollower,
  FollowerActiveHours,
  FollowerTier,
  TopAndBottomCasts,
  TopChannel,
  TopEngager,
  TopLevelStats,
} from "./types";
import { fetchChannel, fetchUsersByFidBatch } from "./neynar";
import moment from "moment-timezone";
import { fillMissingDates } from "./utils";

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
  const [channelStatsResponse, churnRate] = await Promise.all([
    fetch(
      `https://api.dune.com/api/v1/query/3714673/results?&filters=channel_url="${encodedChannelUrl}"`,
      {
        method: "GET",
        headers: header,
        cache: "no-store",
      }
    ),
    getChurnRate(channelUrl),
  ]);
  const statsBody = await channelStatsResponse.text();
  const trends = JSON.parse(statsBody).result.rows[0];

  return { ...trends, churn_rate: churnRate };
}

export async function getTopEngagersAndInfluencers(
  channelUrl: string
): Promise<{ topEngagers: TopEngager[]; topInfluencers: TopEngager[] }> {
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

  const topCastersArray = topEngagersAndInfluencers.top_caster_fids || [];
  const influentialCastersArray =
    topEngagersAndInfluencers.influential_caster_fids || [];

  // rows are formatted as [fid, likes, recasts, replies]
  const topCastersPromise = fetchUsersByFidBatch(
    topCastersArray.map((item: number[]) => item[0])
  );
  const influentialCastersPromise = fetchUsersByFidBatch(
    influentialCastersArray.map((item: number[]) => item[0])
  );

  const [topCastersResult, influentialCastersResult] = await Promise.all([
    topCastersPromise,
    influentialCastersPromise,
  ]);

  // Map the additional properties back to the corresponding result
  const topEngagers = topCastersResult.map((profile: any, index: number) => {
    const original = topCastersArray[index];
    return {
      profile,
      likes: original[1],
      recasts: original[2],
      replies: original[3],
    };
  });

  const topInfluencers = influentialCastersResult.map(
    (profile: any, index: number) => {
      const original = influentialCastersArray[index];
      return {
        profile,
        likes: original[1],
        recasts: original[2],
        replies: original[3],
      };
    }
  );

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
  const tier = "⚡ power badge";
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
  channelUrl: string,
  timezone: string
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
  if (result === undefined) {
    console.error("No active hours data found for channel", channelUrl);
    return {
      bestTimesToPost: "",
      activeHours: {},
    };
  }
  if ("channel_url" in result) {
    delete result["channel_url"];
  }

  // Determine the offset for the timezone
  const offset = Math.ceil(moment.tz(timezone).utcOffset() / 60);
  // Initialize an object to hold the final counts for all days of the week.
  const weeklyHourlyCounts: { [key: string]: { [key: number]: number } } = {};
  // Days of the week array for easier manipulation
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // Process each day's hourly counts.
  daysOfWeek.forEach((day) => {
    const dayCounts = result[`${day}_hourly_counts`] || {};
    weeklyHourlyCounts[day] = weeklyHourlyCounts[day] || {};

    // Set default count for each hour.
    for (let hour = 0; hour < 24; hour++) {
      let adjustedHour = (hour + offset + 24) % 24; // Adjust hour for timezone offset, ensure it wraps correctly
      let adjustedDayIndex =
        (daysOfWeek.indexOf(day) + Math.floor((hour + offset) / 24)) % 7;
      let adjustedDay = daysOfWeek[adjustedDayIndex];

      if (!weeklyHourlyCounts[adjustedDay]) {
        weeklyHourlyCounts[adjustedDay] = {};
      }
      weeklyHourlyCounts[adjustedDay][adjustedHour] =
        (weeklyHourlyCounts[adjustedDay][adjustedHour] || 0) +
        (dayCounts[hour] || 0);
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
  const readableBestTimes = bestTimes
    .map((time) => {
      let hour = parseInt(time.hour);
      let ampm = hour >= 12 ? "pm" : "am";
      hour = hour % 12 || 12; // Convert 24h to 12h format
      let day = time.day.charAt(0).toUpperCase() + time.day.slice(1); // Capitalize the first letter
      return `${day} at ${hour}${ampm}`;
    })
    .join(", ");

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
  if (topAndBottomCasts === undefined) {
    console.error("top and bottom casts not found for channel", channelUrl);
    return {
      top_hash: [],
      bottom_hash: [],
    };
  }

  const topHash: CastEngagementCount[] =
    topAndBottomCasts?.top_hash?.map((item: string[]) => {
      return {
        hash: item[0],
        engagement_count: item[1],
        like_count: item[2],
        recast_count: item[3],
        reply_count: item[4],
      };
    }) || [];

  const bottomHash: CastEngagementCount[] =
    topAndBottomCasts?.bottom_hash?.map((item: string[]) => {
      return {
        hash: item[0],
        engagement_count: item[1],
        like_count: item[2],
        recast_count: item[3],
        reply_count: item[4],
      };
    }) || [];

  return {
    top_hash: topHash,
    bottom_hash: bottomHash,
  };
}

export async function getChurnRate(channelUrl: string): Promise<number> {
  // https://dune.com/queries/3766009
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const encodedChannelUrl = encodeURIComponent(channelUrl);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3766009/results?&filters=channel_url="${encodedChannelUrl}"`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  const body = await latest_response.text();
  const result = JSON.parse(body).result.rows[0];
  if (result === undefined) {
    console.error("No churn rate data found for channel", channelUrl);
    return 0;
  }
  return parseFloat(result.churn_rate);
}

export async function getDailyEngagement(
  channelUrl: string
): Promise<[DailyEngagement[], DailyEngagement[]]> {
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
  if (result === undefined) {
    console.error("No daily engagement data found for channel", channelUrl);
    return [[], []];
  }

  const dailyEngagement: DailyEngagement[] = result?.daily_engagement.map(
    (item: string[]) => {
      const date = new Date(item[0]); // Create a date object from the datetime string
      const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

      return {
        name: formattedDate,
        total: item[1],
        replies: item[2],
        recasts: item[3],
        likes: item[4],
      };
    }
  );
  // todo: optimize this repetitive loop
  const dailyPowerBadgeEngagement: DailyEngagement[] =
    result?.daily_engagement.map((item: string[]) => {
      const date = new Date(item[0]); // Create a date object from the datetime string
      const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

      return {
        name: formattedDate,
        total: item[5],
        replies: item[6],
        recasts: item[7],
        likes: item[8],
      };
    });
  return [dailyEngagement, dailyPowerBadgeEngagement];
}

export async function getDailyCastersCount(
  channelUrl: string
): Promise<[DailyFollower[], DailyActivity[]]> {
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
  if (dailyFollower === undefined) {
    console.error("No daily caster data found for channel", channelUrl);
    return [[], []];
  }

  let dailyFollowers: DailyFollower[] = [];
  let dailyActivity: DailyActivity[] = [];

  dailyFollower?.daily_casters.forEach((item: any) => {
    const date = new Date(item[0]); // Create a date object from the datetime string
    const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

    dailyFollowers.push({
      date: formattedDate,
      followers: item[1], // Index 1 for followers
      unfollowers: 0, // this data is not on-hub yet
    });

    dailyActivity.push({
      date: formattedDate,
      casts: item[2],
    });
  });
  const dailyActivityFilled = fillMissingDates(dailyActivity);
  return [dailyFollowers, dailyActivityFilled];
}

export async function getChannelsWithSimilarCasters(
  channelUrl: string
): Promise<TopChannel[]> {
  // https://dune.com/queries/3746998
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const encodedChannelUrl = encodeURIComponent(channelUrl);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3746998/results?&filters=channel_url="${encodedChannelUrl}"`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  const body = await latest_response.text();
  const result = JSON.parse(body).result.rows[0];
  if (result === undefined) {
    console.error("No similar channels found for channel", channelUrl);
    return [];
  }

  // todo: switch to batch endpoint
  const channelPromises = result.top_similar_channels.map(
    async (item: string[]) => {
      const channel = await fetchChannel(item[0]);
      return { channel, casts: item[1] };
    }
  );

  const similarChannels: TopChannel[] = await Promise.all(channelPromises);
  return similarChannels;
}

export async function getTopCastersBatch(
  channelUrls: string[]
): Promise<{ [key: string]: string[] }> {
  // dune query: https://dune.com/queries/3715815
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);

  const channelFilter = `channel_url in (${channelUrls
    .map((url) => `"${url}"`)
    .join(",")})`;
  const encodedChannelFilter = encodeURIComponent(channelFilter);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3715815/results?&filters=${encodedChannelFilter}`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  const body = await latest_response.text();
  const result = JSON.parse(body).result.rows;

  const topCasters: { [key: string]: string[] } = {};
  result.forEach((item: any) => {
    const channelUrl = item.channel_url;
    topCasters[channelUrl] = item.top_casters
      .slice(0, 5)
      .map((casterCount: string[]) => casterCount[0]);
  });
  return topCasters;
}

// https://dune.com/queries/3781870

export function getMaxValue(
  engagementData: DailyEngagement[],
  followersData: DailyFollower[]
) {
  const maxEngagement = Math.max(...engagementData.map((e) => e.total));
  const maxFollowers = Math.max(...followersData.map((f) => f.followers));
  const maxUnfollowers = Math.max(...followersData.map((f) => f.unfollowers));
  return Math.max(Math.max(maxEngagement, maxFollowers), maxUnfollowers);
}
