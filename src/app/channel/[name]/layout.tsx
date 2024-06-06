import type { Metadata } from "next";

export const generateMetadata = ({ params }: { params: any }): Metadata => {
  const { name } = params;
  return {
    title: name ? `CastSense - ${name}` : "CastSense",
  };
};

export default function ChannelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
