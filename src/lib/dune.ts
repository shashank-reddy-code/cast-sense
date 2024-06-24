const DUNE_API_KEY = process.env.NEXT_PUBLIC_DUNE_API_KEY || "";

export async function fetchFirstFidFromDune(queryId: number, fid: number) {
  const headers = new Headers({
    "x-dune-api-key": DUNE_API_KEY,
  });
  const response = await fetch(
    `https://api.dune.com/api/v1/query/${queryId}/results?&filters=fid=${fid}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    }
  );

  if (response.status !== 200) {
    console.error(`Failed to fetch data for query ${queryId}`, response);
    return null;
  }

  const data = await response.json();

  if (!data.result.rows || data.result.rows.length === 0) {
    console.error(`No rows found for query ${queryId} and fid ${fid}`);
    return null;
  }

  return data.result.rows[0];
}

export async function fetchFirstChannelFromDune(
  queryId: number,
  channelUrl: string
) {
  const meta = {
    "x-dune-api-key": DUNE_API_KEY || "",
  };
  const header = new Headers(meta);
  const encodedChannelUrl = encodeURIComponent(channelUrl);
  const response = await fetch(
    `https://api.dune.com/api/v1/query/${queryId}/results?&filters=channel_url="${encodedChannelUrl}"`,
    {
      method: "GET",
      headers: header,
      cache: "no-store",
    }
  );
  const data = await response.json();
  if (!data.result.rows || data.result.rows.length === 0) {
    console.error(
      `No rows found for query ${queryId} and channel url ${channelUrl}`
    );
    return null;
  }

  return data.result.rows[0];
}
