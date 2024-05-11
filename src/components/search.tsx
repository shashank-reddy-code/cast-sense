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
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isChannelSearch, setIsChannelSearch] = useState(false);

  useEffect(() => {
    setIsChannelSearch(searchTerm.startsWith("/"));
  }, [searchTerm]);

  // Create a debounced function that will be invoked after the specified delay
  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (searchTerm.length > 0) {
        setIsSearching(true);
        const fetchData = async () => {
          try {
            let data;
            if (isChannelSearch) {
              data = await autocompleteChannelSearch(searchTerm.slice(1));
              console.log("channel data:", data);
            } else {
              data = await autocompleteUserSearch(searchTerm);
            }
            setResults(data);
          } catch (error) {
            console.error("Error fetching data:", error);
            setResults([]);
          }
        };
        fetchData();
      } else {
        setResults([]);
        setIsSearching(false); // Reset searching state if search term is empty
      }
    }, 300),
    [
      isChannelSearch,
      setIsSearching,
      setResults,
      autocompleteUserSearch,
      autocompleteChannelSearch,
    ]
  );

  useEffect(() => {
    // Call the debounced search function
    debouncedSearch(searchTerm);

    // Optional: Cleanup on component unmount
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  return (
    <Command>
      <CommandInput
        placeholder="Search by username or channel"
        onValueChange={(e) => setSearchTerm(e)}
      />
      <CommandList>
        {results && results.length > 0 ? (
          isChannelSearch ? (
            <CommandGroup heading="">
              {results.map((channel: any) => (
                <Link href={`/channel/${channel.name}`} key={channel.id}>
                  <CommandItem
                    value={channel.name}
                    className="flex items-center gap-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={channel.image_url} alt={channel.name} />
                      <AvatarFallback>
                        {channel.name ? channel.name.charAt(0) : "C"}
                      </AvatarFallback>
                    </Avatar>
                    {channel.name}
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          ) : (
            <CommandGroup heading="">
              {results.map((user: any) => (
                <Link href={`/${user.fid}`} key={user.fid}>
                  <CommandItem
                    value={user.username}
                    className="flex items-center gap-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.pfp_url} alt={user.username} />
                      <AvatarFallback>
                        {user.username ? user.username.charAt(0) : "C"}
                      </AvatarFallback>
                    </Avatar>
                    {user.display_name}
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          )
        ) : isSearching ? (
          <CommandEmpty>No results found</CommandEmpty>
        ) : null}
      </CommandList>
    </Command>
  );
}
