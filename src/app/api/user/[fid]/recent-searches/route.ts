import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export type RecentSearch = {
  type: string;
  identifier: string;
  url: string;
};

export async function POST(req: Request) {
  try {
    const { fid, type, identifier, url } = await req.json();

    // Validate input
    if (!fid || !Number.isInteger(fid)) {
      return NextResponse.json({ error: "Invalid FID" }, { status: 400 });
    }

    // Store the recent search
    await storeRecentSearch(fid, { type, identifier, url });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to store recent search:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function storeRecentSearch(fid: number, search: RecentSearch) {
  const key = `user:${fid}:recent_searches`;

  // Get current recent searches
  let recentSearches: RecentSearch[] = (await kv.get(key)) || [];

  // Remove the search if it already exists (to avoid duplicates)
  recentSearches = recentSearches.filter(
    (s) => s.identifier !== search.identifier
  );

  // Add the new search to the beginning of the array
  recentSearches.unshift(search);

  // Keep only the 5 most recent searches
  recentSearches = recentSearches.slice(0, 5);

  // Store the updated list
  await kv.set(key, JSON.stringify(recentSearches));
}

export async function GET(req: Request) {
  try {
    // Extract FID from query parameters
    const url = new URL(req.url);
    const fid = url.searchParams.get("fid");

    // Validate FID
    if (!fid || isNaN(Number(fid))) {
      return NextResponse.json(
        { error: "Invalid or missing FID" },
        { status: 400 }
      );
    }

    // Fetch recent searches
    const recentSearches = await getRecentSearches(Number(fid));

    return NextResponse.json({ recentSearches });
  } catch (error) {
    console.error("Failed to fetch recent searches:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function getRecentSearches(fid: number): Promise<RecentSearch[]> {
  const key = `user:${fid}:recent_searches`;

  // Retrieve recent searches from KV store
  const storedSearches = await kv.get(key);

  // Parse the stored JSON string, or return an empty array if no searches found
  return storedSearches ? JSON.parse(storedSearches as string) : [];
}
