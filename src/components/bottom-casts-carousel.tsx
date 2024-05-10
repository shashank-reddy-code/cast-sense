import * as React from "react";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function BottomCastsCarousel({ hashes }: { hashes: string[] }) {
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
              <Image
                unoptimized
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
