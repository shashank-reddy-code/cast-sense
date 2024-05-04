import * as React from "react";

import { TopCastsCarousel } from "./top-casts-carousel";
import { BottomCastsCarousel } from "./bottom-casts-carousel";
import { Separator } from "@/components/ui/separator";

export function EngagementCarousel() {
  return (
    <>
      <TopCastsCarousel />
      <Separator className="my-4" />
      <BottomCastsCarousel />
    </>
  );
}
