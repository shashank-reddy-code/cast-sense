import Image from "next/image";
import { PlusCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";

interface ProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  name: string;
  description?: string;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export function Profile({
  imageUrl,
  name,
  description,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: ProfileProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className={cn(
                "h-auto w-auto object-cover transition-all hover:scale-105 object-center"
              )}
            />
          </div>
        </ContextMenuTrigger>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{name}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
