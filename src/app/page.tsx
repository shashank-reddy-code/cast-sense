import { Metadata } from "next";
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopLevel } from "@/components/top-level";
import { UserNav } from "@/components/user-nav";
import { Historical } from "@/components/historical";
import { Engagement } from "next/font/google";
import { FollowerCarousel } from "@/components/follower-carousel";
import { EngagementCarousel } from "@/components/engagement-carousel";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default function DashboardPage() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">CastSense</h2>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">dwr.eth</h2>
              </div>
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="followers">Followers</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="recommendation" disabled>
                Recommendations
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <TopLevel />
              <Historical />
            </TabsContent>
            <TabsContent value="followers" className="space-y-4">
              <FollowerCarousel />
            </TabsContent>
            <TabsContent value="engagement" className="space-y-4">
              <EngagementCarousel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
