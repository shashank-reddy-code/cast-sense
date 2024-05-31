import { ProfilePreview } from "@/lib/types";
import { HoverCardContent } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatNumber, getOpenrankText } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export function ProfilePreviewCard({
  profilePreview,
}: {
  profilePreview: ProfilePreview;
}) {
  const openrankText = getOpenrankText(profilePreview.openrank_percentile);
  return (
    <HoverCardContent className="p-4 w-auto max-w-md">
      <div className="flex justify-between space-x-4">
        <Avatar>
          <AvatarImage src={profilePreview.profile.pfp_url} />
          <AvatarFallback>{profilePreview.profile.display_name}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">
            @{profilePreview.profile.username}{" "}
            {profilePreview.profile.power_badge && (
              <Image
                src="/power-badge.png"
                alt="Power Badge"
                className="w-4 h-4 ml-1 inline"
                width={16}
                height={16}
              />
            )}
          </h4>
          <p className="text-sm">{profilePreview.profile.profile.bio.text}</p>
          <div className="flex items-center pt-2">
            <span className="text-xs text-muted-foreground">
              {formatNumber(profilePreview.profile.follower_count)} followers
            </span>
          </div>
          {openrankText && (
            <p className="text-sm">OpenRank reputation: {openrankText}</p>
          )}
          <p className="text-sm">
            Top Channels:{" "}
            {profilePreview.top_channels.map((channel, index) => (
              <Link
                href={`https://nook.social/channels/${channel}`}
                key={index}
                rel="noopener noreferrer"
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                {channel}
                {index < profilePreview.top_channels.length - 1 && ", "}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </HoverCardContent>
  );
}
