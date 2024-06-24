"use client";
import { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Profile } from "./profile";
import { ProfilePreview, TopEngager } from "@/lib/types";
import { SvgIcons } from "./svg-icons";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { getFidsOverviewBatch } from "@/lib/dune-fid";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { ProfilePreviewCard } from "./profile-preview-card";

export function TopEngagers({
  topEngagers,
  title = "Loyal fans",
  description = "Followers who engage with you the most in the past month",
}: {
  topEngagers: TopEngager[];
  title?: string;
  description?: string;
}) {
  const [profilePreviews, setProfilePreviews] = useState<{
    [key: number]: ProfilePreview;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (topEngagers && topEngagers.length > 0) {
        const fidsOverview = await getFidsOverviewBatch(
          topEngagers
            .filter((te) => te.profile != null)
            .map((te) => te.profile.fid)
        );

        const previews = topEngagers
          .filter((te) => te.profile != null)
          .reduce(
            (acc: { [key: number]: ProfilePreview }, te) => {
              const profilePreview = {
                profile: te.profile,
                top_channels:
                  fidsOverview[te.profile.fid]?.top_channel_names || [],
                openrank_percentile:
                  fidsOverview[te.profile.fid]?.openrank_percentile,
              };
              acc[te.profile.fid] = profilePreview;
              return acc;
            },
            {} // Initial value for the accumulator
          );

        setProfilePreviews(previews);
        setLoading(false);
      }
    }

    fetchData();
  }, [topEngagers]);

  if (loading) {
    return <p>Loading...</p>;
  }

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
              .filter((te) => te.profile != null)
              .map((te) => (
                <HoverCard key={te.profile.fid}>
                  <HoverCardTrigger asChild>
                    <Link
                      href={`https://warpcast.com/${te.profile.username}`}
                      rel="noopener noreferrer"
                      target="_blank"
                      key={te.profile.fid}
                    >
                      <div>
                        <Profile
                          name={te.profile.display_name}
                          imageUrl={te.profile.pfp_url}
                          powerBadge={te.profile.power_badge}
                          width={150}
                          height={150}
                        />
                        <div className="text-sm text-muted-foreground items-center flex justify-center space-x-1 md:space-x-4 lg:space-x-4">
                          {!!te.likes && te.likes > 0 && (
                            <div className="flex items-center space-x-1">
                              <SvgIcons.likes />
                              <span>{formatNumber(te.likes)}</span>
                            </div>
                          )}
                          {!!te.recasts && te.recasts > 0 && (
                            <div className="flex items-center space-x-1">
                              <SvgIcons.recasts />
                              <span>{formatNumber(te.recasts)}</span>
                            </div>
                          )}
                          {!!te.replies && te.replies > 0 && (
                            <div className="flex items-center space-x-1">
                              <SvgIcons.replies />
                              <span>{formatNumber(te.replies)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </HoverCardTrigger>
                  <ProfilePreviewCard
                    profilePreview={profilePreviews[te.profile.fid]}
                  />
                </HoverCard>
              ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
