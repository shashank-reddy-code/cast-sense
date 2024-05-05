const DUNE_API_KEY = process.env["DUNE_API_KEY"];

import { DuneClient } from "@duneanalytics/client-sdk";

const client = new DuneClient(DUNE_API_KEY ?? "");

export async function getFidStats(fid: number) {
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
    }
  );
  const body = await latest_response.text();
  const trends = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid
  if (trends && "fid" in trends) {
    delete trends.fid; //pop off the fid column that was used for filtering
  }
  console.log("fetched fid stats");
  console.log(trends);
  return trends;
}

export async function getTopEngagersAndChannels(fid: number) {
  // dune query: https://dune.com/queries/3693992
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3693992/results?&filters=fid=${fid}`,
    {
      method: "GET",
      headers: header,
    }
  );
  const body = await latest_response.text();
  const topEngagersAndChannels = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid
  if (topEngagersAndChannels && "fid" in topEngagersAndChannels) {
    delete topEngagersAndChannels.fid; //pop off the fid column that was used for filtering
  }
  console.log("fetched top engagers and channels");
  console.log(topEngagersAndChannels);
  return topEngagersAndChannels;
}

export async function getPowerbadgeFollowers(fid: number) {
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
    }
  );
  const body = await latest_response.text();
  const powerbadgeFollowers = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid
  if (powerbadgeFollowers && "fid" in powerbadgeFollowers) {
    delete powerbadgeFollowers.fid; //pop off the fid column that was used for filtering
  }
  console.log("fetched powerbadge followers");
  console.log(powerbadgeFollowers);
  return powerbadgeFollowers;
}

export async function getBenchmarks(fid: number) {
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
    }
  );
  const body = await latest_response.text();
  const benchmark = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid
  if (benchmark && "fid" in benchmark) {
    delete benchmark.fid; //pop off the fid column that was used for filtering
  }
  console.log("fetched benchmark");
  console.log(benchmark);
  return benchmark;
}

export async function getFollowerTiers(fid: number) {
  // schedule the query on a 24 hour interval, and then fetch by filtering for the user fid within the query results
  // dune query: // https://dune.com/queries/3697320
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3697320/results?&filters=fid=${fid}`,
    {
      method: "GET",
      headers: header,
    }
  );
  const body = await latest_response.text();
  const followerTiers = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid
  if (followerTiers && "fid" in followerTiers) {
    delete followerTiers.fid; //pop off the fid column that was used for filtering
  }

  const tierCounts = followerTiers.tier_name_counts;
  const tierPercentages = followerTiers.tier_name_percentages;

  const tierMap: { [key: string]: { count: number; percentage: number } } = {};

  for (const tier in tierCounts) {
    const count = tierCounts[tier];
    const percentage = tierPercentages[tier] || 0;
    tierMap[tier] = { count, percentage };
  }

  const sortedKeys = Object.keys(tierMap).sort((a, b) => {
    return tierMap[b].percentage - tierMap[a].percentage;
  });

  const sortedTierMap: {
    [key: string]: { count: number; percentage: number };
  } = {};
  sortedKeys.forEach((key) => {
    sortedTierMap[key] = tierMap[key];
  });

  console.log("fetched follower tiers");
  console.log(sortedTierMap);
  return sortedTierMap;
}

export async function getFollowerActiveHours(fid: number) {
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
    }
  );

  // Parse the JSON response.
  const data = await response.json();
  const result = data.result.rows[0]; // Assume there's only one row in the result for the filtered fid

  // Delete 'fid' key if it exists in the result.
  if (result && "fid" in result) {
    delete result.fid;
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

  console.log("Fetched follower active hours");
  console.log(output);
  return output;
}

export async function getTopAndBottomCasts(fid: number) {
  // https://dune.com/queries/3692188
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const latest_response = await fetch(
    `https://api.dune.com/api/v1/query/3692188/results?&filters=fid=${fid}`,
    {
      method: "GET",
      headers: header,
    }
  );
  const body = await latest_response.text();
  const topAndBottomCasts = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid
  if (topAndBottomCasts && "fid" in topAndBottomCasts) {
    delete topAndBottomCasts.fid; //pop off the fid column that was used for filtering
  }
  console.log("fetched top and bottom casts");
  console.log(topAndBottomCasts);
  return topAndBottomCasts;
}

export async function getEngagingChannels(fid: number) {
  // https://dune.com/queries/3690289
}

export async function getDailyEngagement(fid: number) {
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
    }
  );
  const body = await latest_response.text();
  const dailyEngagement = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid
  if (dailyEngagement && "fid" in dailyEngagement) {
    delete dailyEngagement.fid; //pop off the fid column that was used for filtering
  }
  console.log("fetched daily engagement");
  console.log(dailyEngagement);
  return dailyEngagement?.daily_engagement;
}

export async function getDailyFollowerCount(fid: number) {
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
    }
  );
  const body = await latest_response.text();
  const dailyFollower = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid
  if (dailyFollower && "fid" in dailyFollower) {
    delete dailyFollower.fid; //pop off the fid column that was used for filtering
  }
  console.log("fetched daily follower");
  console.log(dailyFollower);
  return dailyFollower?.daily_followers;
}
