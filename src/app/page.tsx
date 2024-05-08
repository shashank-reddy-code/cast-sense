"use client";

import { Search } from "@/components/search";

export default function LoginPage() {
  return (
    <div className="p-4 lg:p-8 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-6">
          {" "}
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
