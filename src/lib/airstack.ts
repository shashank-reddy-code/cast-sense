import { init } from "@airstack/node";
import { fetchQuery } from "@airstack/node";

init(process.env.AIRSTACK_API_KEY || "");

export const fetchMoxieEarnings = async (fid: number): Promise<number> => {
  const query = `
    query EarningsQuery {
        FarcasterMoxieEarningStats(
            input: {
                timeframe: LIFETIME,
                blockchain: ALL,
                filter: {
                    entityType: {_eq: USER},
                    entityId: {_eq: "${fid}"}
                }
            }
        ) {
            FarcasterMoxieEarningStat {
                allEarningsAmount
            }
        }
    }
    `;
  const { data, error } = await fetchQuery(query);
  if (error) {
    console.error("Error fetching Moxie earnings:", error);
    return 0;
  }

  const earnings =
    data?.FarcasterMoxieEarningStats?.FarcasterMoxieEarningStat?.[0]
      ?.allEarningsAmount || 0;

  return earnings;
};

export const fetchMoxieCastEarnings = async (
  hashes: string[]
): Promise<Map<string, number>> => {
  const query = `
    query CastEarningsQuery {
        FarcasterCasts(
            input: {
            filter: {
                hash: {
                _in: ${JSON.stringify(hashes)}
                }
            },
            blockchain: ALL
            }
        ) {
            Cast {
                hash
                moxieEarningsSplit {
                    earningsAmount
                }
            }
        }
    }
    `;
  const { data, error } = await fetchQuery(query);
  if (error) {
    console.error("Error fetching Moxie cast earnings:", error);
    return new Map();
  }

  const earningsMap = new Map<string, number>();
  data?.FarcasterCasts?.Cast?.forEach((cast: any) => {
    if (cast && cast.moxieEarningsSplit) {
      const totalEarnings = cast.moxieEarningsSplit.reduce(
        (sum: number, split: any) =>
          sum + (parseFloat(split.earningsAmount) || 0),
        0
      );
      earningsMap.set(cast.hash, totalEarnings);
    } else {
      earningsMap.set(cast.hash, 0);
    }
  });

  return earningsMap;
};
