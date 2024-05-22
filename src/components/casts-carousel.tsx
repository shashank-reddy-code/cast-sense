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
import { SvgIcons } from "./svg-icons";
import { fetchCastByHash } from "@/lib/neynar";
import Link from "next/link";

export async function CastsCarousel({
  hashes,
  header,
  title,
  validateHash = false,
}: {
  hashes: CastEngagementCount[];
  header: string;
  title: string;
  validateHash?: boolean;
}) {
  if (!hashes) return <> </>;
  if (validateHash) {
    const castPromises = await Promise.all(
      hashes.map(async (item: CastEngagementCount) => {
        const cast = await fetchCastByHash(item.hash);
        return cast !== null ? item : null;
      })
    );
    // @ts-ignore
    hashes = castPromises?.filter(
      (item: CastEngagementCount | null) => item !== null
    );
    console.log("update hashes with valid cast", hashes?.length);
  }
  if (hashes.length === 0) return <> </>;
  return (
    <div className="space-y-4">
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{header}</h2>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="relative mx-8"
      >
        <CarouselContent>
          {hashes.map((item: CastEngagementCount) => (
            <CarouselItem key={item.hash} className="md:basis-1/2 lg:basis-1/3">
              <div className="space-y-4">
                <Link
                  href={`https://nook.social/casts/${item.hash}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Image
                    unoptimized
                    src={`https://client.warpcast.com/v2/cast-image?castHash=${item.hash}`}
                    width={1280}
                    height={866}
                    alt="Cast"
                  />
                </Link>
                <div className="text-sm text-muted-foreground items-center flex justify-center space-x-4 ">
                  {item.like_count > 0 && (
                    <div className="flex items-center space-x-1">
                      <SvgIcons.likes />
                      <span>{formatNumber(item.like_count)}</span>
                    </div>
                  )}
                  {item.recast_count > 0 && (
                    <div className="flex items-center space-x-1">
                      <SvgIcons.recasts />
                      <span>{formatNumber(item.recast_count)}</span>
                    </div>
                  )}
                  {item.reply_count > 0 && (
                    <div className="flex items-center space-x-1">
                      <SvgIcons.replies />
                      <span>{formatNumber(item.reply_count)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
