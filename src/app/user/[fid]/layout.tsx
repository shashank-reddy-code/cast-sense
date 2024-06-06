import { fetchProfileByFid } from "@/lib/neynar";
import type { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: any;
}): Promise<Metadata> => {
  const { fid } = params;
  const profile = await fetchProfileByFid({ fid, useCache: true });
  return {
    title: fid ? `CastSense - ${profile.display_name}` : "CastSense",
  };
};

export default function ChannelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
