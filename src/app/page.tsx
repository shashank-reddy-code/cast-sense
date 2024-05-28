"use client";

import { Search } from "@/components/search";
import TypingAnimation from "@/components/ui/typing-animation";

export default function LoginPage() {
  return (
    <div className="p-4 lg:p-8 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-6">
          {" "}
          <TypingAnimation text="CastSense" />
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
