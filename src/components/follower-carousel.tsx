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
}: {
  topEngagers: Profile[];
  followerTiers: FollowerTier[];
  followerActiveHours: FollowerActiveHours;
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
            <FollowersByTier followerTiers={followerTiers} />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <Separator className="my-4" />
      <TopEngagers topEngagers={topEngagers} />
    </>
  );
}
