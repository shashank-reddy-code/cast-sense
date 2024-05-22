import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Profile } from "./profile";
import { TopChannel } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

export async function TopChannels({
  channels,
  title = "Top Channels",
  description = "Channels where you cast the most",
  metricName = "casts",
}: {
  channels: TopChannel[];
  title?: string;
  description?: string;
  metricName?: string;
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
              <Link
                href={`https://nook.social/channels/${tc.channel.id}`}
                rel="noopener noreferrer"
                target="_blank"
                key={tc.channel.id}
              >
                <div>
                  <Profile
                    name={tc.channel.name}
                    imageUrl={tc.channel.image_url}
                    width={150}
                    height={150}
                  />
                  <p className="text-sm text-muted-foreground items-center flex justify-center space-y-1">
                    # {metricName}: {formatNumber(tc.casts)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
