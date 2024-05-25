import { ProfilePreview } from "@/lib/types";
import { HoverCardContent } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

export function ProfilePreviewCard({
  liteProfile,
}: {
  liteProfile: ProfilePreview;
}) {
  return (
    <HoverCardContent className="p-4 w-auto max-w-md">
      <div className="flex justify-between space-x-4">
        <Avatar>
          <AvatarImage src={liteProfile.avatar_url} />
          <AvatarFallback>{liteProfile.fname}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">@{liteProfile.fname}</h4>
          <p className="text-sm">{liteProfile.bio}</p>
          <div className="flex items-center pt-2">
            <span className="text-xs text-muted-foreground">
              {formatNumber(liteProfile.follower_count)} followers
            </span>
          </div>
          <p className="text-sm">
            Top Channels:{" "}
            {liteProfile.top_channels.map((channel, index) => (
              <Link
                href={`https://nook.social/channels/${channel}`}
                key={index}
                rel="noopener noreferrer"
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                {channel}
                {index < liteProfile.top_channels.length - 1 && ", "}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </HoverCardContent>
  );
}
