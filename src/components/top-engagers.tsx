import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Profile } from "./profile";
import { fetchProfileByName } from "@/lib/neynar";
import { Profile as ProfileDataType } from "@/lib/types";

export async function TopEngagers({
  topEngagers,
  title = "Loyal fans",
  description = "Followers who engage with you the most in the past month",
}: {
  topEngagers: ProfileDataType[];
  title?: string;
  description?: string;
}) {
  if (topEngagers == null || topEngagers.length === 0) {
    return <></>;
  }

  return (
    <div className="space-y-4">
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {topEngagers
              .filter((profile) => profile != null)
              .map((profile) => (
                <Profile
                  key={profile.fid}
                  name={profile.display_name}
                  imageUrl={profile.pfp_url}
                  width={150}
                  height={150}
                />
              ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
