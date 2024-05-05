import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { fetchChannelByName } from "@/lib/neynar";
import { Profile } from "./profile";

export async function TopChannels({ channelIds }: { channelIds: string[] }) {
  if (channelIds == null || channelIds.length === 0) {
    return <></>;
  }
  console.log(`fetching top channel info for ${channelIds}`);
  const channelPromises = channelIds.map((channelId: string) =>
    fetchChannelByName(channelId)
  );
  const channels = await Promise.all(channelPromises);

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
