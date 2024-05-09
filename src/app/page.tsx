"use client";

import { Search } from "@/components/search";

export default function LoginPage() {
  return (
    <div
      className="px-4 lg:px-8 flex flex-col items-center justify-center"
      style={{ height: "calc(100vh - 20px)", minHeight: "500px" }}
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-6">
          {" "}
          <h1 className="text-5xl tracking-tight">CastSense</h1>
          <p className="text-muted-foreground">
            Easily get a pulse on your farcaster activity and followers
          </p>
        </div>
        <Search />
      </div>
    </div>
  );
}
