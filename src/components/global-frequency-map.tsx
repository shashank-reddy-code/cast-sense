import React, { useState, useMemo, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { animated, useSpring } from "@react-spring/web";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FollowerLocation } from "@/lib/types";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const MARKER_COLOR = "#B57EDC";
const MARKER_HIGHLIGHT_COLOR = "#A020F0";

const AnimatedMarker = animated(Marker);

export function GlobalFrequencyMap({ cities }: { cities: FollowerLocation[] }) {
  const [selectedCity, setSelectedCity] = useState<FollowerLocation | null>(
    null
  );

  const markerSpring = useSpring({
    to: { scale: selectedCity ? 1.5 : 1 },
    config: { tension: 300, friction: 10 },
  });

  const { minCount, maxCount } = useMemo(() => {
    const counts = cities.map((city) => city.count);
    return {
      minCount: Math.min(...counts),
      maxCount: Math.max(...counts),
    };
  }, [cities]);

  const getMarkerSize = useCallback(
    (count: number) => {
      const minSize = 2;
      const maxSize = 10;
      return (
        minSize +
        ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize)
      );
    },
    [minCount, maxCount]
  );

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="py-2">
        <CardTitle className="text-lg">Your Worldwide Fan Club</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-2">
        <div className="relative w-full h-full" style={{ minHeight: "200px" }}>
          <ComposableMap projection="geoMercator" className="w-full h-full">
            <ZoomableGroup center={[0, 20]} zoom={0.8}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#2C3E50"
                      stroke="#3f4652"
                      strokeWidth={0.5}
                    />
                  ))
                }
              </Geographies>
              {cities.map((city) => {
                const size = getMarkerSize(city.count);
                return (
                  <AnimatedMarker
                    key={city.placeId}
                    coordinates={city.coordinates}
                    onMouseEnter={() => setSelectedCity(city)}
                    onMouseLeave={() => setSelectedCity(null)}
                    onClick={() => setSelectedCity(city)}
                  >
                    <animated.circle
                      r={size}
                      fill={
                        selectedCity?.locationName === city.locationName
                          ? MARKER_HIGHLIGHT_COLOR
                          : MARKER_COLOR
                      }
                      stroke="#FFF"
                      strokeWidth={1}
                      style={{
                        transform:
                          selectedCity?.locationName === city.locationName
                            ? markerSpring.scale.to((s) => `scale(${s})`)
                            : "scale(1)",
                      }}
                    />
                  </AnimatedMarker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>
        </div>
        {selectedCity && (
          <div className="mt-2 p-2 bg-gray-800 rounded-md text-sm">
            <p className="font-bold">{selectedCity.locationName}</p>
            <p>Followers: {selectedCity.count}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
