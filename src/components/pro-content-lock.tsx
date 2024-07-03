import { LockIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { useNeynarContext } from "@neynar/react";

interface ProContentLockProps {
  children: ReactNode;
  isPro: boolean;
  upgradeUrl: string;
  dayPassUrl: string;
}

export function ProContentLock({
  children,
  isPro,
  upgradeUrl,
  dayPassUrl,
}: ProContentLockProps) {
  const { isAuthenticated } = useNeynarContext();

  if (isPro) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4">
        <LockIcon className="w-12 h-12 text-yellow-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Premium Feature</h2>
        <p className="text-white text-center mb-4">
          {isAuthenticated
            ? "Upgrade to access advanced analytics"
            : "Sign in and upgrade to access advanced analytics"}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="secondary" asChild>
            <Link href={upgradeUrl} target="_blank" rel="noopener noreferrer">
              Subscribe for $10/month
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={dayPassUrl} target="_blank" rel="noopener noreferrer">
              Try $2 Day Pass
            </Link>
          </Button>
        </div>
      </div>
      <div className="filter blur-md">{children}</div>
    </div>
  );
}
