import * as React from "react";

import { TopCastsCarousel } from "./top-casts-carousel";
import { BottomCastsCarousel } from "./bottom-casts-carousel";
import { Separator } from "@/components/ui/separator";
import { TopChannels } from "./top-channels";

export function EngagementCarousel({
  casts,
  topChannels,
  username,
}: {
  casts: any;
  topChannels: any;
  username: string;
}) {
  return (
    <>
      <TopCastsCarousel hashes={casts?.top_hash} username={username} />
      <Separator className="my-4" />
      <BottomCastsCarousel hashes={casts?.bottom_hash} username={username} />
      <Separator className="my-4" />
      <TopChannels channelIds={topChannels} />
    </>
  );
}
