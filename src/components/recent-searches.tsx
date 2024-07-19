"use client";

import React from "react";
import { RecentSearch } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "next/navigation";

export function RecentSearches({ searches }: { searches: RecentSearch[] }) {
  const router = useRouter();

  const handleLinkClick = (url: string) => {
    router.push(url);
  };

  return (
    <div>
      <h3 className="tracking-tight text-left mb-4 mt-12">Recent searches</h3>
      <div className="grid grid-cols-3 gap-4">
        {searches.map((search) => (
          <div
            key={search.identifier + "-" + search.type}
            className="flex items-center"
          >
            <Avatar className="w-6 h-6 mr-2">
              <AvatarImage src={search.imageUrl} />
              <AvatarFallback>{search.name}</AvatarFallback>
            </Avatar>
            <div
              className="flex-grow"
              onClick={() => {
                const timeZone =
                  Intl.DateTimeFormat().resolvedOptions().timeZone;
                handleLinkClick(
                  `/${search.type}/${search.identifier}?tz=${timeZone}`
                );
              }}
            >
              <h4 className="text-sm font-semibold hover:underline text-muted-foreground">{`${
                search.type === "channel" ? "/" : "@"
              }${search.name}`}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
