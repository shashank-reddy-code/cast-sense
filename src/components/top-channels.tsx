"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Profile } from "./profile";
import { TopChannel, ChannelPreview } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { ChannelPreviewCard } from "./channel-preview-card";
import { getTopCastersBatch } from "@/lib/dune-channels";

export function TopChannels({
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
  const [channelPreviews, setChannelPreviews] = useState<{
    [key: string]: ChannelPreview;
  }>({});

  useEffect(() => {
    if (channels == null || channels.length === 0) {
      return;
    }

    const fetchChannelPreviews = async () => {
      const topCasters = await getTopCastersBatch(
        channels
          .filter((c: TopChannel) => c != null)
          .map((c) => c.channel.parent_url)
      );
      const previews = channels.reduce(
        (acc: { [key: string]: ChannelPreview }, c) => {
          const channelPreview = {
            channel: c.channel,
            top_casters: topCasters[c.channel.parent_url] || [],
          };
          acc[c.channel.id] = channelPreview;
          return acc;
        },
        {}
      );
      setChannelPreviews(previews);
    };

    fetchChannelPreviews();
  }, [channels]);

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
              <HoverCard key={tc.channel.id}>
                <HoverCardTrigger asChild>
                  <Link
                    href={`https://warpcast.com/~/channel/${tc.channel.id}`}
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
                </HoverCardTrigger>
                {channelPreviews[tc.channel.id] && (
                  <ChannelPreviewCard
                    liteChannel={channelPreviews[tc.channel.id]}
                  />
                )}
              </HoverCard>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
