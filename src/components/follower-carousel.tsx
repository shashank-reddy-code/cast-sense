import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { TopEngagers } from "./top-engagers";
import { TopFollowerChannels } from "./top-follower-channels";
import { BestTimeToPost } from "./best-time-to-post";
import { FollowersByTier } from "./followers-by-tier";

export function FollowerCarousel({
  topEngagers,
  followerTiers,
  followerActiveHours,
  powerbadgeFollowers,
}: {
  topEngagers: any;
  followerTiers: any;
  followerActiveHours: any;
  powerbadgeFollowers: any;
}) {
  return (
    <>
      <Separator className="my-4" />
      <TopFollowerChannels />

      <Separator className="my-4" />
      <TopEngagers topEngagers={topEngagers} />

      <Separator className="my-4" />
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          <CarouselItem
            key="best-time-to-post"
            className="md:basis-1/2 lg:basis-1/2"
          >
            <BestTimeToPost followerActiveHours={followerActiveHours} />
          </CarouselItem>
          <CarouselItem
            key="followers-by-tier"
            className="md:basis-1/2 lg:basis-1/2"
          >
            <FollowersByTier
              followerTiers={followerTiers}
              powerbadgeFollowers={powerbadgeFollowers}
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}
