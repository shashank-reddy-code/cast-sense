"use client";
const BASE_URL = process.env["NEXT_PUBLIC_BASE_URL"];

import { RecentSearches } from "@/components/recent-searches";
import { Search } from "@/components/search";
import { TrendingChannels } from "@/components/trending-channels";
import TypingAnimation from "@/components/ui/typing-animation";
import { Channel, RecentSearch } from "@/lib/types";
import { fetchData } from "@/lib/utils";
import {
  NeynarAuthButton,
  SIWN_variant,
  useNeynarContext,
} from "@neynar/react";
import React, { useEffect, useState } from "react";

export default function LoginPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const { user } = useNeynarContext();

  useEffect(() => {
    const fetchChannels = async () => {
      const fetchedChannels = await fetchData(
        `${BASE_URL}/api/channel/trending`
      );
      setChannels(fetchedChannels);
    };

    fetchChannels();
  }, []);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      if (user) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/user/${user.fid}/recent-searches`
          );
          if (response.ok) {
            const data = await response.json();
            setRecentSearches(data.recentSearches);
          }
        } catch (error) {
          console.error("Failed to fetch recent searches:", error);
        }
      }
    };

    fetchRecentSearches();
  }, [user]);

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
          {recentSearches.length > 0 && (
            <RecentSearches searches={recentSearches} />
          )}
          {channels.length > 0 && <TrendingChannels channels={channels} />}
        </div>
      </div>
    </div>
  );
}
