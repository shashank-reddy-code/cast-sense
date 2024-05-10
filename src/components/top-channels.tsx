import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { fetchChannelByName } from "@/lib/neynar";
import { Profile } from "./profile";
import { Channel } from "@/lib/types";

export async function TopChannels({ channels }: { channels: Channel[] }) {
  if (channels == null || channels.length === 0) {
    return <></>;
  }

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
