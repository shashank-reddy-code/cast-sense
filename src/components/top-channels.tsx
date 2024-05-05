import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { fetchChannelByName } from "@/lib/neynar";
import { Profile } from "./profile";

export async function TopChannels({ channelIds }: { channelIds: string[] }) {
  console.log(`fetching top channel info for ${channelIds}`);
  //TODO: add in parent url fetching logic as a prop

  // const parentUrls = [
  //   "chain://eip155:7777777/erc721:0x4f86113fc3e9783cf3ec9a552cbb566716a57628",
  //   "https://warpcast.com/~/channel/bounty",
  //   "https://www.nba.com",
  //   "chain://eip155:7777777/erc721:0x5747eef366fd36684e8893bf4fe628efc2ac2d10",
  //   "chain://eip155:7777777/erc721:0x3d037b11c5359fac54c3928dfad0b9512695d392",
  // ];
  const channelPromises = channelIds.map((channelId: string) =>
    fetchChannelByName(channelId)
  );
  const channels = await Promise.all(channelPromises);
  //const channels = await Promise.all(parentUrls.map(fetchChannel));

  return (
    <>
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Top Channels</h2>
        <p className="text-sm text-muted-foreground">
          Channels where you get the most engagement
        </p>
      </div>
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {channels.map((channel) => (
              <Profile
                key={channel.id}
                name={channel.name}
                imageUrl={channel.image_url}
                width={150}
                height={150}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}
