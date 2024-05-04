import * as React from "react";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function BottomCastsCarousel() {
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
          <CarouselItem key="cast-1" className="md:basis-1/2 lg:basis-1/3">
            <Image
              src="https://client.warpcast.com/v2/cast-image?castHash=0x78baca887d15696d4682c56a7a21fc9c4c2f9b1d"
              width={1280}
              height={866}
              alt="Cast"
            />
          </CarouselItem>
          <CarouselItem key="cast-2" className="md:basis-1/2 lg:basis-1/3">
            <Image
              src="https://client.warpcast.com/v2/cast-image?castHash=0x79a52b9dfe8073723f3e79641593542be9e9cd29"
              width={1280}
              height={866}
              alt="Cast"
            />
          </CarouselItem>
          <CarouselItem key="cast-3" className="md:basis-1/2 lg:basis-1/3">
            <Image
              src="https://client.warpcast.com/v2/cast-image?castHash=0x78baca887d15696d4682c56a7a21fc9c4c2f9b1d"
              width={1280}
              height={866}
              alt="Cast"
            />
          </CarouselItem>
          <CarouselItem key="cast-4" className="md:basis-1/2 lg:basis-1/3">
            <Image
              src="https://client.warpcast.com/v2/cast-image?castHash=0x78baca887d15696d4682c56a7a21fc9c4c2f9b1d"
              width={1280}
              height={866}
              alt="Cast"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}
