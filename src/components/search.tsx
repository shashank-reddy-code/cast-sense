import React, { useState, useEffect } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { autocompleteUserSearch } from "@/lib/neynar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  //const router = useRouter();

  useEffect(() => {
    if (searchTerm.length > 0) {
      setIsSearching(true);
      const fetchUsers = async () => {
        try {
          const data = await autocompleteUserSearch(searchTerm);
          setUsers(data);
        } catch (error) {
          console.error("Error fetching users:", error);
          setUsers([]);
        }
      };
      fetchUsers();
    } else {
      setUsers([]);
      setIsSearching(false); // Reset searching state if search term is empty
    }
  }, [searchTerm]);

  // const handleSelectUser = (fid: number) => {
  //   router.push(`/${fid}`);
  // };

  return (
    <Command>
      <CommandInput
        placeholder="Search by username"
        onValueChange={(e) => setSearchTerm(e)}
      />
      <CommandList>
        {users.length > 0 ? (
          <CommandGroup heading="">
            {users.map((user: any) => (
              <Link href={`/${user.fid}`} key={user.fid}>
                <CommandItem
                  value={user.username}
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.pfp_url} alt="@shadcn" />
                    <AvatarFallback>{user.username}</AvatarFallback>
                  </Avatar>
                  {user.display_name}
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
        ) : isSearching ? (
          <CommandEmpty>No users found.</CommandEmpty> // Only show this if a search has been made
        ) : null}
      </CommandList>
    </Command>
  );
}
