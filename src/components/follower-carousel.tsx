"use client";
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
  FollowerLocation,
  FollowerTier,
  TopChannel,
  TopEngager,
} from "@/lib/types";
import { TopChannels } from "./top-channels";
import { GlobalFrequencyMap } from "./global-frequency-map";

export function FollowerCarousel({
  topEngagers,
  followerTiers,
  followerActiveHours,
  followerLocations = [],
  topInfluencers = [],
  similarChannels = [],
  isChannel = false,
}: {
  topEngagers: TopEngager[];
  followerTiers: FollowerTier[];
  followerActiveHours: FollowerActiveHours;
  followerLocations?: FollowerLocation[];
  topInfluencers?: TopEngager[];
  similarChannels?: TopChannel[];
  isChannel?: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="relative px-4 py-2 flex-grow">
        <Carousel
          opts={{
            align: "start",
          }}
          className="h-full"
        >
          <CarouselContent className="h-full">
            <CarouselItem
              key="best-time-to-post"
              className="basis-full lg:basis-1/2 h-full"
            >
              <BestTimeToPost
                followerActiveHours={followerActiveHours}
                isChannel={isChannel}
              />
            </CarouselItem>
            {!isChannel && (
              <CarouselItem
                key="global-frequency-map"
                className="basis-full lg:basis-1/2 h-full"
              >
                <GlobalFrequencyMap cities={followerLocations} />
              </CarouselItem>
            )}
            <CarouselItem
              key="followers-by-tier"
              className="basis-full lg:basis-1/2 h-full"
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
      </div>
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
            title="Similar channels by user overlap"
            description="Casters who cast in your channel are more likely to cast in these channels"
            metricName="score"
          />
        </>
      )}
    </div>
  );
}
