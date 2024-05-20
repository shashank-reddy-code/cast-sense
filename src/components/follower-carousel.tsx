import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { TopEngagers } from "./top-engagers";
import { BestTimeToPost } from "./best-time-to-post";
import { FollowersByTier } from "./followers-by-tier";
import {
  FollowerActiveHours,
  FollowerTier,
  Profile,
  TopChannel,
  TopEngager,
} from "@/lib/types";
import { TopChannels } from "./top-channels";

export function FollowerCarousel({
  topEngagers,
  followerTiers,
  followerActiveHours,
  topInfluencers = [],
  similarChannels = [],
  isChannel = false,
}: {
  topEngagers: TopEngager[];
  followerTiers: FollowerTier[];
  followerActiveHours: FollowerActiveHours;
  topInfluencers?: TopEngager[];
  similarChannels?: TopChannel[];
  isChannel?: boolean;
}) {
  return (
    <>
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          <CarouselItem
            key="best-time-to-post"
            className="basis-1/1 lg:basis-1/2 h-full w-full"
          >
            <BestTimeToPost followerActiveHours={followerActiveHours} />
          </CarouselItem>
          <CarouselItem
            key="followers-by-tier"
            className="sm:basis-1/1 lg:basis-1/2 h-full w-full"
          >
            <FollowersByTier
              followerTiers={followerTiers}
              isChannel={isChannel}
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {topEngagers.length > 0 && (
        <>
          <Separator className="my-4" />
          <TopEngagers
            topEngagers={topEngagers}
            title={isChannel ? "Loyal fans" : undefined}
            description={
              isChannel
                ? "Casters with the most engaging casts in the past month"
                : undefined
            }
          />
        </>
      )}

      {topInfluencers.length > 0 && (
        <>
          <Separator className="my-4" />
          <TopEngagers
            topEngagers={topInfluencers}
            title="Top Influencers"
            description="Top influencers who had the most engaging casts in the past month"
          />
        </>
      )}

      {similarChannels.length > 0 && (
        <>
          <Separator className="my-4" />
          <TopChannels
            channels={similarChannels}
            title="Similar Channels"
            description="Channels with the most overlap in casters over the past month"
          />
        </>
      )}
    </>
  );
}
