export type TopLevelStats = {
  current_period_casts: number | null;
  casts_percentage_change: number | null;
  current_period_recasts: number | null;
  recasts_percentage_change: number | null;
  current_period_mentions: number | null;
  mentions_percentage_change: number | null;
  current_period_replies: number | null;
  replies_percentage_change: number | null;
  current_period_likes: number | null;
  likes_percentage_change: number | null;
};

export type TopAndBottomCasts = {
  // full cast hash
  top_hash: string[];
  bottom_hash: string[];
};

// channel url
export type Channel = {
  id: string;
  name: string;
  image_url: string;
};

export type FollowerActiveHours = {
  bestTimesToPost: string;
  activeHours: {
    // todo: consider making this { week: { hour: number }}
    // monday_hourly_count: { 0: 23, 1: 45, ...}
    [key: string]: { [hour: string]: number };
  };
};

export type FollowerTier = {
  tier: string;
  count: number;
  percentage: number;
};

export type Profile = {
  fid: number;
  display_name: string;
  username: string;
  pfp_url: string;
};

export type DailyEngagement = {
  date: string;
  total: number;
};

export type DailyFollower = {
  date: string;
  followers: number;
  unfollowers: number;
};

export type Benchmark = {
  pct_engagement_diff: number | undefined;
  pct_followers_diff: number | undefined;
};