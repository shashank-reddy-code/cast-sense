"use client";

import { Search } from "@/components/search";

export default function LoginPage() {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">CastSense</h1>
          <p className="text-sm text-muted-foreground">
            Easily get a pulse on your farcaster activity and followers
          </p>
        </div>
        <Search />
      </div>
    </div>
  );
}
