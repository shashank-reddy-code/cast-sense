import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/lib/types";

export function UserNav({ profile }: { profile: Profile }) {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={profile.pfp_url} alt="@shadcn" />
      <AvatarFallback>{profile.username}</AvatarFallback>
    </Avatar>
  );
}
