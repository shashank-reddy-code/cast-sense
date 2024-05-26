export type TopLevelStats = {
  total_followers: number | null;
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
  churn_rate: number | null;
};

export type TopAndBottomCasts = {
  // full cast hash
  top_hash: CastEngagementCount[];
  bottom_hash: CastEngagementCount[];
};

export type CastEngagementCount = {
  hash: string;
  engagement_count: number;
  like_count: number;
  recast_count: number;
  reply_count: number;
};

// channel url
export type Channel = {
  id: string;
  name: string;
  image_url: string;
  parent_url: string;
  follower_count: number;
  description: string;
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
  follower_count: number | null;
  // neynar uses profile.bio.text for the bio
  // todo: clean this up
  profile: any;
  power_badge: boolean;
};

export type TopEngager = {
  profile: Profile;
  likes: number | undefined;
  recasts: number | undefined;
  replies: number | undefined;
};

export type TopChannel = {
  channel: Channel;
  casts: number;
};

export type DailyEngagement = {
  date: string;
  total: number;
  replies: number;
  recasts: number;
  likes: number;
};

export type DailyActivity = {
  date: string;
  casts: number;
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

export type ProfilePreview = {
  profile: Profile;
  top_channels: string[];
};

export type ChannelPreview = {
  channel: Channel;
  top_casters: string[];
};
