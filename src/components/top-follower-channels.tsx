import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { fetchChannel } from "@/lib/utils";
import { useEffect, useState } from "react";

export async function TopFollowerChannels() {
  //TODO: add in parent url fetching logic as a prop

  const parentUrls = [
    "chain://eip155:7777777/erc721:0x4f86113fc3e9783cf3ec9a552cbb566716a57628",
    "https://warpcast.com/~/channel/bounty",
    "https://www.nba.com",
    "chain://eip155:7777777/erc721:0x5747eef366fd36684e8893bf4fe628efc2ac2d10",
    "chain://eip155:7777777/erc721:0x3d037b11c5359fac54c3928dfad0b9512695d392",
  ];

  const channels = await Promise.all(parentUrls.map(fetchChannel));

  return (
    <div className="space-y-8 flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Top channels</CardTitle>
          <CardDescription>
            Channels where your followers hang out the most
          </CardDescription>
        </CardHeader>
        <CardContent className="flex aspect-square  justify-center p-6 flex flex-col space-y-5">
          {channels.map((channel) => (
            <div key={channel.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={channel.image_url} alt={channel.name} />
                <AvatarFallback>{channel.id}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {channel.name}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
