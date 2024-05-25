const DUNE_API_KEY = process.env["DUNE_API_KEY"];
import {
  Benchmark,
  CastEngagementCount,
  DailyActivity,
  DailyEngagement,
  DailyFollower,
  FollowerActiveHours,
  FollowerTier,
  ProfilePreview,
  TopAndBottomCasts,
  TopChannel,
  TopEngager,
  TopLevelStats,
} from "./types";
import { fetchChannelByName, fetchProfileByName } from "./neynar";
import moment from "moment-timezone";
import { fillMissingDates } from "./utils";

export async function getFidStats(fid: number): Promise<TopLevelStats> {
  // schedule the query on a 24 hour interval, and then fetch by filtering for the user fid within the query results
  // dune query: https://dune.com/queries/3555616
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3555616/results?&filters=fid=${fid}`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  if (latest_response.status !== 200) {
    console.error("Failed to fetch fid stats", latest_response);
    //return;
  }
  const body = await latest_response.text();
  const trends = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid
  return trends;
}

export async function getTopEngagersAndChannels(
  fid: number
): Promise<{ topEngagers: TopEngager[]; channels: TopChannel[] }> {
  // dune query: https://dune.com/queries/3738107
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3738107/results?&filters=fid=${fid}`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  if (latest_response.status !== 200) {
    console.error("Failed to fetch top engagers and channels", latest_response);
    return {
      topEngagers: [],
      channels: [],
    };
  }
  const body = await latest_response.text();
  const topEngagersAndChannels = JSON.parse(body).result.rows[0];

  // topEngagers are formatted as [name, likes, recasts, replies]
  const engagerPromises = topEngagersAndChannels.top_engagers.map(
    async (item: string[]) => {
      const profile = await fetchProfileByName(item[0]);
      return { profile, likes: item[1], recasts: item[2], replies: item[3] };
    }
  );
  // topChannels are formatted as [channelName, casts]
  // todo: use batch endpoint
  const channelPromises = topEngagersAndChannels.top_channels.map(
    async (item: string[]) => {
      const channel = await fetchChannelByName(item[0]);
      return { channel, casts: item[1] };
    }
  );

  const [topEngagers, channels] = await Promise.all([
    Promise.all(engagerPromises),
    Promise.all(channelPromises),
  ]);

  return {
    topEngagers,
    channels,
  };
}

export async function getPowerbadgeFollowers(
  fid: number
): Promise<FollowerTier> {
  // dune query: https://dune.com/queries/3696361
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3696361/results?&filters=fid=${fid}`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  if (latest_response.status !== 200) {
    console.error("Failed to fetch powerbadge followers", latest_response);
    return {
      tier: "⚡ power badge",
      count: 0,
      percentage: 0,
    };
  }
  const body = await latest_response.text();
  const powerbadgeFollowers = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid
  const tier = "⚡ power badge";
  return {
    tier,
    count: powerbadgeFollowers?.count || 0,
    percentage: parseFloat(powerbadgeFollowers?.percentage || 0),
  };
}

export async function getBenchmarks(fid: number): Promise<Benchmark> {
  // dune query: https://dune.com/queries/3696719
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3696719/results?&filters=fid=${fid}`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  const body = await latest_response.text();
  const benchmark = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid
  return benchmark;
}

// todo: update to also call powerbadge followers
export async function getFollowerTiers(fid: number): Promise<FollowerTier[]> {
  // schedule the query on a 24 hour interval, and then fetch by filtering for the user fid within the query results
  // dune query: // https://dune.com/queries/3697320
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const queryResponse = await Promise.all([
    fetch(
      `https://api.dune.com/api/v1/query/3697320/results?&filters=fid=${fid}`,
      {
        method: "GET",
        headers: header,
        cache: "no-store",
      }
    ),
    getPowerbadgeFollowers(fid),
  ]);
  if (queryResponse[0].status !== 200) {
    console.error("Failed to fetch follower tiers", queryResponse[0]);
    return [];
  }

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
  fid: number,
  timezone: string
): Promise<FollowerActiveHours> {
  // https://dune.com/queries/3697395
  // https://dune.com/queries/3679974 (deprecated)
  // Prepare headers for the request.
  const headers = new Headers({
    "x-dune-api-key": DUNE_API_KEY || "",
  });

  // Fetch the data.
  const response = await fetch(
    `https://api.dune.com/api/v1/query/3697395/results?&filters=fid=${fid}`,
    {
      method: "GET",
      headers: headers,
      cache: "no-store",
    }
  );
  if (response.status !== 200) {
    console.error("Failed to fetch follower active hours", response);
    return {
      bestTimesToPost: "",
      activeHours: {},
    };
  }

  // Parse the JSON response.
  const data = await response.json();
  const result = data.result.rows[0];
  if ("fid" in result) {
    delete result["fid"];
  }

  // Determine the offset for the timezone
  const offset = Math.ceil(moment.tz(timezone).utcOffset() / 60);
  console.log("using timezone offset", offset, timezone, " for fid", fid);
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
    const dayCounts = result[`${day}_hourly_counts`];
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
  fid: number
): Promise<TopAndBottomCasts> {
  // https://dune.com/queries/3697964
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3697964/results?&filters=fid=${fid}`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  if (latest_response.status !== 200) {
    console.error("Failed to fetch top and bottom casts", latest_response);
    return {
      top_hash: [],
      bottom_hash: [],
    };
  }
  const body = await latest_response.text();
  const topAndBottomCasts = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid

  const topHash: CastEngagementCount[] = topAndBottomCasts?.top_hash.map(
    (item: string[]) => {
      return {
        hash: item[0],
        engagement_count: item[1],
        like_count: item[2],
        recast_count: item[3],
        reply_count: item[4],
      };
    }
  );

  const bottomHash: CastEngagementCount[] = topAndBottomCasts?.bottom_hash.map(
    (item: string[]) => {
      return {
        hash: item[0],
        engagement_count: item[1],
        like_count: item[2],
        recast_count: item[3],
        reply_count: item[4],
      };
    }
  );

  return {
    top_hash: topHash,
    bottom_hash: bottomHash,
  };
}

export async function getEngagingChannels(fid: number) {
  // https://dune.com/queries/3690289
}

export async function getDailyEngagement(
  fid: number
): Promise<[DailyEngagement[], DailyEngagement[]]> {
  // https://dune.com/queries/3693328
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3693328/results?&filters=fid=${fid}`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  if (latest_response.status !== 200) {
    console.error("Failed to fetch daily engagement", latest_response);
    return [[], []];
  }
  const body = await latest_response.text();
  const result = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid

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

export async function getDailyFollowerCount(
  fid: number
): Promise<DailyFollower[]> {
  // https://dune.com/queries/3693389
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3693389/results?&filters=fid=${fid}`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  if (latest_response.status !== 200) {
    console.error("Failed to fetch daily follower count", latest_response);
    return [];
  }
  const body = await latest_response.text();
  const dailyFollower = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid

  const dailyFollowers: DailyFollower[] = dailyFollower?.daily_followers.map(
    (item: any) => {
      const date = new Date(item[0]); // Create a date object from the datetime string
      const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

      return {
        date: formattedDate,
        followers: item[1], // Index 1 for followers
        unfollowers: item[2], // Index 2 for unfollowers
      };
    }
  );
  return dailyFollowers;
}

export async function getDailyactivity(fid: number): Promise<DailyActivity[]> {
  // schedule the query on a 24 hour interval, and then fetch by filtering for the user fid within the query results
  // dune query: https://dune.com/queries/3744055
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3744055/results?&filters=fid=${fid}`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  if (latest_response.status !== 200) {
    console.error("Failed to fetch daily activity", latest_response);
    return [];
  }
  const body = await latest_response.text();
  const result = JSON.parse(body).result.rows[0];

  const dailyActivity: DailyActivity[] = result?.daily_casts.map(
    (item: string[]) => {
      const date = new Date(item[0]); // Create a date object from the datetime string
      const formattedDate = date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

      return {
        date: formattedDate,
        casts: item[1],
      };
    }
  );
  return fillMissingDates(dailyActivity);
}

export async function getFollowersAndTopChannelsBatch(
  fids: number[]
): Promise<{ [key: number]: ProfilePreview }> {
  // dune query: https://dune.com/queries/3738107
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);

  const fidFilter = `fid in (${fids.join(",")})`;
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3738107/results?&filters=${fidFilter}`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  if (latest_response.status !== 200) {
    console.error("Failed to fetch profile previews", latest_response);
    return {};
  }
  const body = await latest_response.text();
  const result = JSON.parse(body).result.rows;

  const profilePreviews: { [key: number]: ProfilePreview } = {};
  result.forEach((item: any) => {
    const fid = item.fid;
    profilePreviews[fid] = {
      fname: item.fname,
      follower_count: item.followers,
      top_channels: item.top_channels
        .slice(0, 5)
        .map((channelCounts: string[]) => channelCounts[0]),
      bio: item.bio,
      avatar_url: item.avatar_url,
    };
  });
  return profilePreviews;
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
