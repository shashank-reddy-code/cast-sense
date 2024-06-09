export const fetchChannel = async (parent_url: string) => {
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/channel?id=${parent_url}&type=parent_url`,
    {
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.NEYNAR_API_KEY as string,
      },
      next: { revalidate: 86500 },
    }
  );
  // log error if response is not ok
  if (!response.ok) {
    console.error(`Failed to fetch channel ${parent_url}`, response);
    return null;
  }
  const data = await response.json();
  return data.channel;
};

export const fetchProfileByFid = async (fid: number) => {
  // viewer_fid param is a hack to distinguish caching entries between fetchProfileByFid and fetchProfileByFidBatch
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}&viewer_fid=3`,
    {
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.NEYNAR_API_KEY as string,
        cache: "no-store",
      },
    }
  );

  if (!response.ok) {
    console.error(`Failed to fetch profile by fid ${fid}`, response);
    return null;
  }
  const data = await response.json();
  return data.users[0];
};

export const fetchProfileByName = async (name: string) => {
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/search?q=${name}`,
    {
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.NEYNAR_API_KEY as string,
      },
      next: { revalidate: 86500 },
    }
  );
  // log error if response is not ok
  if (!response.ok) {
    console.error(`Failed to fetch profile by name for ${name}`, response);
    return null;
  }
  const data = await response.json();
  // todo: handle empty result
  return data.result.users[0];
};

export const autocompleteUserSearch = async (name: string) => {
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/search?q=${name}&viewer_fid=3`,
    {
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.NEXT_PUBLIC_NEYNAR_API_KEY as string,
      },
      next: { revalidate: 86500 },
    }
  );
  // log error if response is not ok
  if (!response.ok) {
    console.error(`Failed to fetch profile by name for ${name}`, response);
    return null;
  }
  const data = await response.json();
  return data.result.users;
};

export const autocompleteChannelSearch = async (name: string) => {
  const encodedName = encodeURIComponent(name);
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/channel/search?q=${encodedName}`,
    {
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.NEXT_PUBLIC_NEYNAR_API_KEY as string,
        cache: "no-store",
      },
      // next: { revalidate: 86500 },
    }
  );
  // log error if response is not ok
  if (!response.ok) {
    console.error(`Failed to fetch channel ${name}`, response);
    return null;
  }
  const data = await response.json();
  // todo: handle empty result
  return data.channels.length > 0 ? data.channels.slice(0, 5) : data.channels;
};

export const fetchChannelByName = async (name: string) => {
  const encodedName = encodeURIComponent(name);
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/channel/search?q=${encodedName}`,
    {
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.NEYNAR_API_KEY as string,
        cache: "no-store",
      },
    }
  );
  // log error if response is not ok
  if (!response.ok) {
    console.error(`Failed to fetch channel ${name}`, response);
    return null;
  }
  const data = await response.json();
  // todo: handle empty result
  return data.channels[0];
};

export const fetchCastByHash = async (hash: string) => {
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/cast?identifier=${hash}&type=hash`,
    {
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.NEYNAR_API_KEY as string,
      },
      next: { revalidate: 86500 },
    }
  );
  // log error if response is not ok
  if (!response.ok) {
    console.error(`Failed to fetch channel ${hash}`, response.status);
    return null;
  }
  const data = await response.json();
  return data;
};

export const fetchChannelsByParentUrlsBatch = async (parentUrls: string[]) => {
  const encodedParams = encodeURIComponent(parentUrls.join(","));
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/channel/bulk?ids=${encodedParams}&type=parent_url`,
    {
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.NEYNAR_API_KEY as string,
      },
      next: { revalidate: 86500 },
    }
  );
  // log error if response is not ok
  if (!response.ok) {
    console.error(`Failed to fetch channels by ids ${parentUrls}`, response);
    return null;
  }
  const data = await response.json();
  return data.channels;
};

export const fetchUsersByFidBatch = async (fids: number[]) => {
  // return empty promise if fids is empty
  if (fids.length == 0) {
    return Promise.resolve([]);
  }
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids.join(",")}`,
    {
      headers: {
        "Content-Type": "application/json",
        api_key: process.env.NEYNAR_API_KEY as string,
      },
      next: { revalidate: 86500 },
    }
  );
  // log error if response is not ok
  if (!response.ok) {
    console.error(`Failed to fetch channels by ids ${fids}`, response);
    return null;
  }
  const data = await response.json();
  return data.users;
};
