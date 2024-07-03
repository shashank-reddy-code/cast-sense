"use client";
import * as React from "react";

import { CastsCarousel } from "./casts-carousel";
import { Separator } from "@/components/ui/separator";
import { TopChannels } from "./top-channels";
import {
  CastEngagementCount,
  TopAndBottomCasts,
  TopChannel,
} from "@/lib/types";
import { ProContentLock } from "./pro-content-lock";

const upgradeUrl =
  "https://hypersub.withfabric.xyz/s/castsense-pro-15wp2j294k9a8/1";
const dayPassUrl =
  "https://hypersub.withfabric.xyz/s/castsense-pro-15wp2j294k9a8/2";

export function EngagementCarousel({
  casts,
  topChannels,
  mentions = [],
  isPro = false,
}: {
  casts: TopAndBottomCasts;
  topChannels: TopChannel[];
  mentions?: CastEngagementCount[];
  isPro?: boolean;
}) {
  return (
    <ProContentLock
      isPro={isPro}
      upgradeUrl={upgradeUrl}
      dayPassUrl={dayPassUrl}
    >
      <CastsCarousel
        hashes={casts?.top_hash}
        header="Bangers"
        title="Most engaging casts in the past month"
      />
      <Separator className="my-4" />
      <CastsCarousel
        hashes={casts?.bottom_hash}
        header="Meh"
        title="Least engaging casts in the past month"
        // todo: cant turn this on because of neynar rate limits
        // validateHash={true}
      />
      <Separator className="my-4" />
      {mentions && mentions.length > 0 && (
        <>
          <CastsCarousel
            hashes={mentions}
            header="Mentions"
            title="Recent mentions of the channel"
            // todo: cant turn this on because of neynar rate limits
            // validateHash={true}
          />
          <Separator className="my-4" />
        </>
      )}
      <TopChannels channels={topChannels} />
    </ProContentLock>
  );
}
