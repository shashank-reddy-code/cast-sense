import { CastEngagementCount } from "./types";

export const searchChannelMentions = async (
  channelId: string,
  channelUrl: string,
  channelLeadUserName: string
): Promise<CastEngagementCount[]> => {
  console.log(
    `searching for recent mentiions of ${channelId} , ${channelUrl}, ${channelLeadUserName}`
  );
  const response = await fetch(
    `https://alertcaster.xyz/api/search?q=/${channelId}&type=channel`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      //next: { revalidate: 86500 },
    }
  );
  // log error if response is not ok
  if (!response.ok) {
    console.error(`Failed to fetch channel ${channelId}`, response);
    return [];
  }
  const data = await response.json();
  const mentions = data
    .filter((item: any) => {
      const shouldRemove =
        item._source.root_parent_url === channelUrl ||
        item._source.author_username === channelLeadUserName ||
        item._source.author_power_badge === false;
      return !shouldRemove;
    })
    .map((item: any) => ({
      hash: item._source.hash,
      fname: item._source.author_username,
    }))
    .slice(0, 15);
  return mentions;
};