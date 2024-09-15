// /app/api/user/[fid]/follower-tiers/route.ts
import { NextResponse } from "next/server";
import { fetchFirstFidFromDune } from "@/lib/dune";
import { FollowerLocation } from "@/lib/types";
import placeCoordinatesData from "@/data/coordinates.json";
import { geocodeLocation } from "@/lib/geolocation";

// Load coordinates for popular locations from JSON file
const placeIdToCoordinates: { [key: string]: [number, number] } = {};
placeCoordinatesData.placeCoordinates.forEach((place) => {
  placeIdToCoordinates[place.placeId] = [place.lng, place.lat];
});

export async function GET(
  req: Request,
  { params }: { params: { fid: string } }
) {
  const fid = parseInt(params.fid);
  const data = await fetchFirstFidFromDune(4070525, fid);

  const headers = new Headers();
  headers.set("Cache-Control", "s-maxage=3600");
  if (!data) {
    return new NextResponse(null, { status: 404 });
  }

  const result = await processFollowerLocations(data);

  return new NextResponse(JSON.stringify(result), { headers });
}

async function processFollowerLocations(
  data: any
): Promise<FollowerLocation[]> {
  const followerLocations: FollowerLocation[] = await Promise.all(
    data?.follower_locations.map(async (item: string[]) => {
      const placeId = item[0];
      const locationName = item[1];
      const count = item[2];

      let coordinates: [number, number] | null;
      if (placeIdToCoordinates[placeId]) {
        coordinates = placeIdToCoordinates[placeId];
      } else {
        console.warn(`No coordinates found for ${locationName} (${placeId})`);
        return null;
      }

      return {
        placeId,
        locationName,
        count,
        coordinates,
      };
    })
  );
  return followerLocations
    .filter((item): item is FollowerLocation => item !== null)
    .sort((a, b) => b.count - a.count);
}
