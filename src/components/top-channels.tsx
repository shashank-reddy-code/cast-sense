import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Profile } from "./profile";
import { TopChannel } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export async function TopChannels({
  channels,
  title = "Top Channels",
  description = "Channels where you cast the most",
}: {
  channels: TopChannel[];
  title?: string;
  description?: string;
}) {
  if (channels == null || channels.length === 0) {
    return <></>;
  }

  return (
    <div className="space-y-4">
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {channels.map((tc: TopChannel) => (
              <div key={tc.channel.id}>
                <Profile
                  name={tc.channel.name}
                  imageUrl={tc.channel.image_url}
                  width={150}
                  height={150}
                />
                <p className="text-sm text-muted-foreground items-center flex justify-center space-y-1">
                  # casts: {formatNumber(tc.casts)}
                </p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
