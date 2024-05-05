import * as React from "react";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function TopCastsCarousel({ hashes }) {
  return (
    <>
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
      >
        <CarouselContent>
          {hashes.map((hash) => (
            <CarouselItem key={hash} className="md:basis-1/2 lg:basis-1/3">
              <Image
                src={`https://client.warpcast.com/v2/cast-image?castHash=${hash}`}
                width={1280}
                height={866}
                alt="Cast"
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
