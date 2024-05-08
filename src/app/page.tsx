"use client";

import { Search } from "@/components/search";

export default function LoginPage() {
  return (
    <div className="lg:p-8 flex items-center justify-center h-screen">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-6 text-center">
          {" "}
          {/* Increased margin between elements */}
          <h1 className="text-5xl tracking-tight">CastSense</h1>
          <p className="text-muted-foreground">
            Easily get a pulse on your farcaster activity and followers
          </p>
        </div>
        <div className="mt-8">
          {" "}
          <Search />
        </div>
      </div>
    </div>
  );
}
