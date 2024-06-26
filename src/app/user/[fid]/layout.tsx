import { fetchData } from "@/lib/utils";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const generateMetadata = async ({
  params,
}: {
  params: any;
}): Promise<Metadata> => {
  const { fid } = params;
  // ideally we dont use cache here but vercel doesnt like using caching and no caching on the same path
  const profile = await fetchData(`${BASE_URL}/api/user/${fid}`);
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
