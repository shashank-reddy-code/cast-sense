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
import { FollowerActiveHours, FollowerTier, Profile } from "@/lib/types";

export function FollowerCarousel({
  topEngagers,
  followerTiers,
  followerActiveHours,
  topInfluencers = [],
  isChannel = false,
}: {
  topEngagers: Profile[];
  followerTiers: FollowerTier[];
  followerActiveHours: FollowerActiveHours;
  topInfluencers?: Profile[];
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
            className="basis-1/1 lg:basis-1/2"
          >
            <BestTimeToPost followerActiveHours={followerActiveHours} />
          </CarouselItem>
          <CarouselItem
            key="followers-by-tier"
            className="sm:basis-1/1 lg:basis-1/2"
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
              isChannel ? "Most active casters in the past month" : undefined
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
            description="Top influencers who casted in the past month"
          />
        </>
      )}
    </>
  );
}
