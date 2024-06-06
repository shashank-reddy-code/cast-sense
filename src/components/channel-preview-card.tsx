import { ChannelPreview } from "@/lib/types";
import { HoverCardContent } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

export function ChannelPreviewCard({
  liteChannel,
}: {
  liteChannel: ChannelPreview;
}) {
  return (
    <HoverCardContent className="p-4 w-auto max-w-md">
      <div className="flex justify-between space-x-4">
        <Avatar>
          <AvatarImage src={liteChannel.channel.image_url} />
          <AvatarFallback>{liteChannel.channel.id}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">/{liteChannel.channel.id}</h4>
          <p className="text-sm">{liteChannel.channel.description}</p>
          <div className="flex items-center pt-2">
            <span className="text-xs text-muted-foreground">
              {formatNumber(liteChannel.channel.follower_count)} followers
            </span>
          </div>
          <p className="text-sm">
            Top users:{" "}
            {liteChannel.top_casters.map((fname, index) => (
              <Link
                href={`https://warpcast.com/${fname}`}
                key={index}
                rel="noopener noreferrer"
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                {fname}
                {index < liteChannel.top_casters.length - 1 && ", "}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </HoverCardContent>
  );
}
