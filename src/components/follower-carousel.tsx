import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TopEngagers } from "./top-engagers";
import { TopFollowerChannels } from "./top-follower-channels";
import { BestTimeToPost } from "./best-time-to-post";
import { FollowersByTier } from "./followers-by-tier";

export function FollowerCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
    >
      <CarouselContent>
        <CarouselItem key="top-engagers" className="md:basis-1/2 lg:basis-1/3">
          <TopEngagers />
        </CarouselItem>
        <CarouselItem
          key="top-follower-channels"
          className="md:basis-1/2 lg:basis-1/3"
        >
          <TopFollowerChannels />
        </CarouselItem>
        <CarouselItem
          key="best-time-to-post"
          className="md:basis-1/2 lg:basis-1/3"
        >
          <BestTimeToPost />
        </CarouselItem>
        <CarouselItem
          key="followers-by-tier"
          className="md:basis-1/2 lg:basis-1/3"
        >
          <FollowersByTier />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
