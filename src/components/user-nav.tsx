import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserNav({ profile }) {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={profile.pfp_url} alt="@shadcn" />
      <AvatarFallback>{profile.username}</AvatarFallback>
    </Avatar>
  );
}
