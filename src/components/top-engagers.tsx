import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Profile } from "./profile";
import { fetchProfileByName } from "@/lib/neynar";
import { profile } from "console";

type ProfileDataType = {
  id: number;
  name: string;
  image_url: string;
};

export async function TopEngagers({ topEngagers }) {
  const engagerPromises = topEngagers.map((topEngager) =>
    fetchProfileByName(topEngager)
  );
  const engagerProfiles = await Promise.all(engagerPromises);
  // const profiles: ProfileDataType[] = [
  //   {
  //     id: 1,
  //     name: "dwr",
  //     image_url:
  //       "https://lh3.googleusercontent.com/MyUBL0xHzMeBu7DXQAqv0bM9y6s4i4qjnhcXz5fxZKS3gwWgtamxxmxzCJX7m2cuYeGalyseCA2Y6OBKDMR06TWg2uwknnhdkDA1AA",
  //   },
  //   {
  //     id: 2,
  //     name: "v",
  //     image_url:
  //       "https://i.seadn.io/gae/sYAr036bd0bRpj7OX6B-F-MqLGznVkK3--DSneL_BT5GX4NZJ3Zu91PgjpD9-xuVJtHq0qirJfPZeMKrahz8Us2Tj_X8qdNPYC-imqs?w=500&auto=format",
  //   },
  //   {
  //     id: 3,
  //     name: "gakonst",
  //     image_url:
  //       "https://i.seadn.io/gcs/files/cfb802c4ff9c6cc2fedd01707c897715.png?w=500&auto=format",
  //   },
  //   {
  //     id: 4,
  //     name: "0xen",
  //     image_url:
  //       "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/254e8cd6-7e4d-47b9-8aeb-49bebf2dbf00/original",
  //   },
  //   {
  //     id: 5,
  //     name: "linda",
  //     image_url:
  //       "https://i.seadn.io/gae/r6CW_kgQygQhI7-4JdWt_Nbf_bjFNnEM7dSns1nZGrijJvUMaLnpAFuBLwjsHXTkyX8zfgpRJCYibtm7ojeA2_ASQwSJgh7yKEFVMOI?w=500&auto=format",
  //   },
  // ];

  return (
    <>
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Loyal fans</h2>
        <p className="text-sm text-muted-foreground">
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
