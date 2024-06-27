import { LockIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ProContentLockProps {
  children: ReactNode;
  isPro: boolean;
  upgradeUrl: string;
}

export function ProContentLock({
  children,
  isPro,
  upgradeUrl,
}: ProContentLockProps) {
  if (isPro) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
        <LockIcon className="w-12 h-12 text-yellow-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Pro Feature</h2>
        <p className="text-white text-center mb-4">
          Upgrade to Pro to access advanced analytics
        </p>
        <Button variant="secondary" asChild>
          <Link href={upgradeUrl} target="_blank" rel="noopener noreferrer">
            Upgrade to Pro
          </Link>
        </Button>
      </div>
      <div className="filter blur-md">{children}</div>
    </div>
  );
}
