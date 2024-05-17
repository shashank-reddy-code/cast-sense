import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Profile } from "./profile";
import { fetchProfileByName } from "@/lib/neynar";
import { TopEngager } from "@/lib/types";
import { SvgIcons } from "./svg-icons";

export async function TopEngagers({
  topEngagers,
  title = "Loyal fans",
  description = "Followers who engage with you the most in the past month",
}: {
  topEngagers: TopEngager[];
  title?: string;
  description?: string;
}) {
  if (topEngagers == null || topEngagers.length === 0) {
    return <></>;
  }

  return (
    <div className="space-y-4">
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {topEngagers
              .filter((te) => te.profile != null)
              .map((te) => (
                <div key={te.profile.fid}>
                  <Profile
                    name={te.profile.display_name}
                    imageUrl={te.profile.pfp_url}
                    width={150}
                    height={150}
                  />
                  <div className="text-sm text-muted-foreground items-center flex justify-center space-x-1 md:space-x-4 lg:space-x-4">
                    {te.likes > 0 && (
                      <div className="flex items-center space-x-1">
                        <SvgIcons.likes />
                        <span>{te.likes}</span>
                      </div>
                    )}
                    {te.recasts > 0 && (
                      <div className="flex items-center space-x-1">
                        <SvgIcons.recasts />
                        <span>{te.recasts}</span>
                      </div>
                    )}
                    {te.replies > 0 && (
                      <div className="flex items-center space-x-1">
                        <SvgIcons.replies />
                        <span>{te.replies}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
