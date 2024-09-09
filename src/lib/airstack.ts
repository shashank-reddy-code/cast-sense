import { fetchData } from "@/lib/utils";

export const fetchMoxieEarnings = async (fid: number): Promise<number> => {
  try {
    // tmp endpoint. replace with airstack
    const url = `https://moxiescout.xyz/api/moxie-earnings?entityIds=${fid}&entityType=USER`;
    const response = await fetchData(url);

    if (response && response.length > 0) {
      const earnings = response[0].allEarningsAmount;
      return earnings;
    }

    return 0;
  } catch (error) {
    console.error("Error fetching Moxie earnings:", error);
    return 0;
  }
};
