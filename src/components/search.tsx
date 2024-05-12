import React, { useState, useEffect, useCallback } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  autocompleteUserSearch,
  autocompleteChannelSearch,
} from "@/lib/neynar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { debounce } from "lodash";

export function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [channelResults, setChannelResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Create a debounced function that will be invoked after the specified delay
  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (searchTerm.length > 0) {
        setIsSearching(true);
        const fetchUser = autocompleteUserSearch(searchTerm);
        const fetchChannel = autocompleteChannelSearch(searchTerm);
        try {
          const [userData, channelData] = await Promise.all([
            fetchUser,
            fetchChannel,
          ]);
          setUserResults(userData);
          setChannelResults(channelData);
        } catch (error) {
          console.error("Error fetching data:", error);
          setUserResults([]);
          setChannelResults([]);
        }
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

  return (
    <Command>
      <CommandInput
        placeholder="Search by username or channel"
        onValueChange={(e) => setSearchTerm(e)}
      />
      <CommandList>
        {channelResults.length > 0 && (
          <CommandGroup heading="Channels">
            {channelResults.map((channel: any) => (
              <Link href={`/channel/${channel.id}`} key={channel.id}>
                <CommandItem
                  value={channel.name}
                  className="flex items-center gap-2 data-[disabled]:opacity-100"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={channel.image_url} alt={channel.name} />
                    <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {channel.name}
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
        )}
        {userResults.length > 0 && (
          <CommandGroup heading="Users">
            {userResults.map((user: any) => (
              <Link href={`/${user.fid}`} key={user.fid}>
                <CommandItem
                  value={user.username}
                  className="flex items-center gap-2 data-[disabled]:opacity-100"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.pfp_url} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {user.display_name || user.username}
                </CommandItem>
              </Link>
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
  );
}
