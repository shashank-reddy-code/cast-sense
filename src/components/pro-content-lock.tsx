import React, { useState } from "react";
import {
  LockIcon,
  Clock,
  Users,
  CheckCircle,
  Zap,
  Group,
  Loader,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProContentLockProps {
  upgradeUrl: string;
  dayPassUrl: string;
}

export function ProContentLock({
  upgradeUrl,
  dayPassUrl,
}: ProContentLockProps) {
  const features = [
    { icon: Clock, text: "Best times to post" },
    { icon: Users, text: "Real follower counts" },
    {
      icon: CheckCircle,
      text: "Loyal fans and their top channels, openrank reputation",
    },
    {
      icon: Group,
      text: "Discovery of similar channels",
    },
    {
      icon: Zap,
      text: "Engagement from power badge users on your posts",
    },
    {
      icon: Loader,
      text: "And more...",
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto text-white mt-20">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <LockIcon className="mr-3" /> Unlock Advanced Analytics
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <feature.icon className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
            <span className="text-sm">{feature.text}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Button
          asChild
          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
        >
          <Link href={upgradeUrl} target="_blank">
            Subscribe at 0.003 ETH /month
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
        >
          <Link href={dayPassUrl} target="_blank">
            Try 0.0005 ETH Day Pass
          </Link>
        </Button>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Unlock detailed insights on your farcaster activity and engagement.
      </p>
    </div>
  );
}
