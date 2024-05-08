import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Profile } from "./profile";
import { fetchProfileByName } from "@/lib/neynar";

type ProfileDataType = {
  id: number;
  name: string;
  image_url: string;
};

export async function TopEngagers({ topEngagers }: { topEngagers: string[] }) {
  if (topEngagers == null || topEngagers.length === 0) {
    return <></>;
  }
  const engagerPromises = topEngagers.map((topEngager) =>
    fetchProfileByName(topEngager)
  );
  const engagerProfiles = await Promise.all(engagerPromises);

  return (
    <>
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Loyal fans</h2>
        <p className="text-lg text-muted-foreground">
          Followers who engage with you the most in the past month
        </p>
      </div>
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {engagerProfiles
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
    </>
  );
}
