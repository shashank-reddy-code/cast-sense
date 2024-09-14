export async function geocodeLocation(
  cityName: string
): Promise<[number, number] | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${cityName}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "castsense",
        },
      }
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return [parseFloat(result.lon), parseFloat(result.lat)];
    }

    if (data && data.length > 0) {
      const result = data[0];
      return [parseFloat(result.lon), parseFloat(result.lat)];
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}
