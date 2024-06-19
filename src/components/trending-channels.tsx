"use client";

import React, { useState, useEffect } from "react";

import { Channel } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { useRouter } from "next/navigation";

export function TrendingChannels({ channels }: { channels: Channel[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleLinkClick = (url: string) => {
    setIsLoading(true);
    router.push(url);
  };

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < 90) {
            return prevProgress + 5;
          }
          clearInterval(interval);
          return prevProgress;
        });
      }, 100);
    }
  }, [isLoading]);

  if (isLoading) {
    return <Progress value={progress} />;
  }

  return (
    <div>
      <h3 className="tracking-tight text-left mb-4 mt-12">Trending Channels</h3>
      <div className="grid grid-cols-3 gap-4">
        {channels.map((channel) => (
          <div key={channel.id} className="flex items-center">
            <Avatar className="w-6 h-6 mr-2">
              <AvatarImage src={channel.image_url} />
              <AvatarFallback>{channel.id}</AvatarFallback>
            </Avatar>
            <div
              className="flex-grow"
              onClick={() => {
                const timeZone =
                  Intl.DateTimeFormat().resolvedOptions().timeZone;
                handleLinkClick(`/channel/${channel.id}?tz=${timeZone}`);
              }}
            >
              {/* <Link href={`/channel/${channel.id}`}> */}
              <h4 className="text-sm font-semibold hover:underline text-muted-foreground">{`/${channel.id}`}</h4>
              {/* </Link> */}
              {/* <h4 className="text-sm font-semibold">/{channel.id}</h4> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
