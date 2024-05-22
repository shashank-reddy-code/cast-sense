import * as React from "react";

import { CastsCarousel } from "./casts-carousel";
import { Separator } from "@/components/ui/separator";
import { TopChannels } from "./top-channels";
import { TopAndBottomCasts, TopChannel } from "@/lib/types";

export function EngagementCarousel({
  casts,
  topChannels,
}: {
  casts: TopAndBottomCasts;
  topChannels: TopChannel[];
}) {
  return (
    <>
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
      <TopChannels channels={topChannels} />
    </>
  );
}
