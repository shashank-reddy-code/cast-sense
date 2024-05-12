import * as React from "react";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function TopCastsCarousel({ hashes }: { hashes: string[] }) {
  if (!hashes || hashes.length == 0) return <> </>;
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
        className="relative mx-8"
      >
        <CarouselContent>
          {hashes.map((hash: string) => (
            <CarouselItem key={hash} className="md:basis-1/2 lg:basis-1/4">
              <Image
                unoptimized
                src={`https://client.warpcast.com/v2/cast-image?castHash=${hash}`}
                width={1280}
                height={866}
                // layout="fill"
                // objectFit="cover"
                // className="rounded-lg"
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
