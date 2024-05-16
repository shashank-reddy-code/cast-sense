import * as React from "react";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CastEngagementCount } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function TopCastsCarousel({
  hashes,
}: {
  hashes: CastEngagementCount[];
}) {
  if (!hashes || hashes.length == 0) return <> </>;
  return (
    <div className="space-y-4">
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Bangers</h2>
        <p className="text-sm text-muted-foreground">
          Most engaging casts in the past month
        </p>
      </div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="relative mx-8"
      >
        <CarouselContent>
          {hashes.map((castEngagementCount: CastEngagementCount) => (
            <CarouselItem
              key={castEngagementCount.hash}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Image
                unoptimized
                src={`https://client.warpcast.com/v2/cast-image?castHash=${castEngagementCount.hash}`}
                width={1280}
                height={866}
                alt="Cast"
              />
              <p className="text-sm text-muted-foreground items-center flex justify-center space-y-1">
                Total impressions:{" "}
                {formatNumber(castEngagementCount.engagement_count)}
              </p>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
