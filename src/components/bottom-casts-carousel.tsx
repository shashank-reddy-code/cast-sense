import * as React from "react";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FarcasterEmbed } from "react-farcaster-embed";

export function BottomCastsCarousel({
  hashes,
  username,
}: {
  hashes: string[];
  username: string;
}) {
  if (!hashes || hashes.length == 0) return <> </>;
  return (
    <>
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Meh</h2>
        <p className="text-sm text-muted-foreground">
          Least engaging casts in the past month
        </p>
      </div>
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          {hashes.map((hash) => (
            <CarouselItem key={hash} className="md:basis-1/2 lg:basis-1/3">
              <FarcasterEmbed
                username={username}
                hash={hash.substring(0, 10)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}
