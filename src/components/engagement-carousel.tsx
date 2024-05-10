import * as React from "react";

import { TopCastsCarousel } from "./top-casts-carousel";
import { BottomCastsCarousel } from "./bottom-casts-carousel";
import { Separator } from "@/components/ui/separator";
import { TopChannels } from "./top-channels";
import { Channel, TopAndBottomCasts } from "@/lib/types";

export function EngagementCarousel({
  casts,
  topChannels,
}: {
  casts: TopAndBottomCasts;
  topChannels: Channel[];
}) {
  return (
    <>
      <TopCastsCarousel hashes={casts?.top_hash} />
      <Separator className="my-4" />
      <BottomCastsCarousel hashes={casts?.bottom_hash} />
      <Separator className="my-4" />
      <TopChannels channels={topChannels} />
    </>
  );
}
