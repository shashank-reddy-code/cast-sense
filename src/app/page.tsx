"use client";
const BASE_URL = process.env["NEXT_PUBLIC_BASE_URL"];

import { Search } from "@/components/search";
import { TrendingChannels } from "@/components/trending-channels";
import TypingAnimation from "@/components/ui/typing-animation";
import { Channel } from "@/lib/types";
import { fetchData } from "@/lib/utils";
import { NeynarAuthButton, SIWN_variant } from "@neynar/react";
import React, { useEffect, useState } from "react";

export default function LoginPage() {
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    const fetchChannels = async () => {
      const fetchedChannels = await fetchData(
        `${BASE_URL}/api/channel/trending`
      );
      setChannels(fetchedChannels);
    };

    fetchChannels();
  }, []);

  return (
    <div className="p-4 lg:p-8 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div />
        <NeynarAuthButton label="Login" variant={SIWN_variant.FARCASTER} />
      </div>
      <div className="flex items-center justify-center flex-1">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-6">
            <TypingAnimation text="CastSense" />
            <p>Easily get a pulse on your farcaster activity and followers</p>
          </div>
          <div className="mt-8">
            <Search />
          </div>
          <TrendingChannels channels={channels} />
        </div>
      </div>
    </div>
  );
}
