import { fetchProfileByFid } from "@/lib/neynar";
import type { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: any;
}): Promise<Metadata> => {
  const { fid } = params;
  // ideally we dont use cache here but vercel doesnt like using caching and no caching on the same path
  const profile = await fetchProfileByFid(fid);
  return {
    title: fid ? `CastSense - ${profile.username}` : "CastSense",
  };
};

export default function ChannelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
