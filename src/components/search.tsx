import { Input } from "@/components/ui/input";
import { fetchProfileByName } from "@/lib/neynar";
import router from "next/router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  const handleSearch = async () => {
    if (searchTerm !== "") {
      try {
        // Optionally, you can fetch and pass user data or use the searchTerm
        // for any server-side validation or checks before redirecting
        const data = await fetchProfileByName(searchTerm);
        if (data && data.result.users.length > 0) {
          const user = data.result.users[0];
          router.push(`/${user.fid}`); // Redirect to the user's dashboard
        } else {
          // Handle case where no user is found or decide on a fallback URL
          router.push("/not-found"); // Redirect to a not-found page or another fallback
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        // Optionally handle errors, maybe redirect to an error page
        router.push("/error"); // Redirect to an error page
      }
    }
  };

  useEffect(() => {
    console.log("Search term has changed:", searchTerm);
    const fetchUsers = async () => {
      try {
        const data = await fetchProfileByName(searchTerm, true);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (searchTerm.length > 0) {
      fetchUsers();
    }
  }, [searchTerm]);

  return (
    <div>
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        {users && (
          <CommandList>
            {users.map((user: any) => (
              <CommandItem key={user.fid}>
                {user.username} - {user.display_name}
              </CommandItem>
            ))}
          </CommandList>
        )}
      </Command>
      {/* <Input
        type="search"
        placeholder="Search by username"
        className="md:w-[100px] lg:w-[300px]"
        value={searchTerm}
        onChange={(e) => {
          console.log("Input changed:", e.target.value);
          setSearchTerm(e.target.value);
        }}
      />
      {/* <Button onClick={handleSearch} variant="outline">
        Search
      </Button> */}
    </div>
  );
}
