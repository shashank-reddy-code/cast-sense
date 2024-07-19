"use client";
const BASE_URL = process.env["NEXT_PUBLIC_BASE_URL"];
import React, { useState, useEffect, useCallback } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { debounce } from "lodash";
import { Progress } from "@/components/ui/progress";

import { useRouter, usePathname } from "next/navigation";
import ShineBorder from "./ui/shine-border";
import { fetchData } from "@/lib/utils";
import { useNeynarContext } from "@neynar/react";
import { RecentSearch } from "@/lib/types";

export function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [channelResults, setChannelResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user: authUser, isAuthenticated } = useNeynarContext();

  const router = useRouter();
  const pathname = usePathname();

  // Create a debounced function that will be invoked after the specified delay
  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (searchTerm.length > 0) {
        setIsSearching(true);
        const { users, channels } = await fetchData(
          `${BASE_URL}/api/autocomplete?q=${searchTerm}`
        );
        setUserResults(users);
        setChannelResults(channels);
        setIsSearching(false);
      } else {
        setUserResults([]);
        setChannelResults([]);
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const handleLinkClick = async (
    fid: number | undefined,
    url: string,
    item: RecentSearch | undefined
  ) => {
    setIsLoading(true);

    if (isAuthenticated && item && fid) {
      console.log("Updating recent searches for user", fid);
      try {
        await fetch(`${BASE_URL}/api/user/${fid}/recent-searches`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fid,
            ...item,
          }),
        });
      } catch (error) {
        console.error("Failed to update recent searches:", error);
      }
      console.log("Recent searches updated for user", fid);
    }

    router.push(url);
  };

  useEffect(() => {
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
      return () => clearInterval(interval);
    } else {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  // Use pathname to detect route changes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  if (isLoading) {
    return <Progress value={progress} />;
  }

  return (
    <ShineBorder color="#E6E6FA" className="w-full">
      <Command className="relative bg-white text-black">
        <CommandInput
          className="text-lg text-black"
          placeholder="Search by username or channel"
          onValueChange={(e) => setSearchTerm(e)}
        />
        <CommandList>
          {channelResults.length > 0 && (
            <CommandGroup heading="Channels">
              {channelResults.map((channel: any) => (
                <div
                  key={`channel-${channel.id}`}
                  onClick={() => {
                    const timeZone =
                      Intl.DateTimeFormat().resolvedOptions().timeZone;
                    const url = `/channel/${channel.id}?tz=${timeZone}`;
                    handleLinkClick(authUser?.fid, url, {
                      type: "channel",
                      identifier: channel.name,
                      name: channel.id,
                      imageUrl: channel.image_url,
                    });
                  }}
                >
                  <CommandItem
                    value={channel.id}
                    className="flex items-center gap-2 data-[disabled]:opacity-100 text-lg text-black"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={channel.image_url} alt={channel.name} />
                      <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {channel.name}
                  </CommandItem>
                </div>
              ))}
            </CommandGroup>
          )}
          {userResults.length > 0 && (
            <CommandGroup heading="Users">
              {userResults.map((user: any) => (
                <div
                  onClick={() => {
                    const timeZone =
                      Intl.DateTimeFormat().resolvedOptions().timeZone;
                    const url = `/user/${user.fid}?tz=${timeZone}`;
                    handleLinkClick(authUser?.fid, url, {
                      type: "user",
                      identifier: user.fid.toString(),
                      name: user.username,
                      imageUrl: user.pfp_url,
                    });
                  }}
                  key={user.fid}
                >
                  <CommandItem
                    value={`user-${user.username}`}
                    className="flex items-center gap-2 data-[disabled]:opacity-100 text-lg text-black"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.pfp_url} alt={user.username} />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user.display_name || user.username}
                  </CommandItem>
                </div>
              ))}
            </CommandGroup>
          )}
          {isSearching && <CommandEmpty>Searching...</CommandEmpty>}
          {/* {isSearching &&
          userResults.length === 0 &&
          channelResults.length === 0 && (
            <CommandEmpty>No results found</CommandEmpty>
          )} */}
        </CommandList>
      </Command>
    </ShineBorder>
  );
}
