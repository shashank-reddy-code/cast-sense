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
  console.log("Parsed Moxie earnings:", earnings);

  return earnings;
};
