import { Search } from "@/components/search";
import { TrendingChannels } from "@/components/trending-channels";
import TypingAnimation from "@/components/ui/typing-animation";
import { fetchTrendingChannels } from "@/lib/neynar";
import { Channel } from "@/lib/types";

export default async function LoginPage() {
  const channels: Channel[] = await fetchTrendingChannels();

  return (
    <div className="p-4 lg:p-8 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-6">
          {" "}
          <TypingAnimation text="CastSense" />
          <p>Easily get a pulse on your farcaster activity and followers</p>
        </div>
        <div className="mt-8">
          {" "}
          <Search />
        </div>
        <TrendingChannels channels={channels} />
      </div>
    </div>
  );
}
