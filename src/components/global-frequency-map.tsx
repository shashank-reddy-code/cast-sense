import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { animated, useSpring } from "@react-spring/web";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface City {
  name: string;
  coordinates: [number, number];
  frequency: number;
}

const cities: City[] = [
  { name: "New York", coordinates: [-74.006, 40.7128], frequency: 1000 },
  { name: "London", coordinates: [-0.1276, 51.5074], frequency: 850 },
  { name: "Tokyo", coordinates: [139.6917, 35.6895], frequency: 1200 },
  { name: "Sydney", coordinates: [151.2093, -33.8688], frequency: 600 },
  { name: "Rio de Janeiro", coordinates: [-43.1729, -22.9068], frequency: 450 },
];

const AnimatedMarker = animated(Marker);

export function GlobalFrequencyMap() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const markerSpring = useSpring({
    to: { scale: selectedCity ? 1.5 : 1 },
    config: { tension: 300, friction: 10 },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-4">Your Worldwide Fan Club</CardTitle>
      </CardHeader>
      <CardContent>
        <ComposableMap projection="geoMercator">
          <ZoomableGroup>
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
            {cities.map((city) => (
              <AnimatedMarker
                key={city.name}
                coordinates={city.coordinates}
                onMouseEnter={() => setSelectedCity(city)}
                onMouseLeave={() => setSelectedCity(null)}
              >
                <animated.circle
                  r={5}
                  fill={
                    selectedCity?.name === city.name ? "#FFA000" : "#FF5722"
                  }
                  stroke="#FFF"
                  strokeWidth={2}
                  style={{
                    transform:
                      selectedCity?.name === city.name
                        ? markerSpring.scale.to((s) => `scale(${s})`)
                        : "scale(1)",
                  }}
                />
                {selectedCity?.name === city.name && (
                  <g transform="translate(-50, -40)">
                    <rect
                      x="0"
                      y="0"
                      width="100"
                      height="30"
                      fill="#2c2e33"
                      rx="4"
                      ry="4"
                    />
                    <text
                      textAnchor="middle"
                      y="12"
                      x="50"
                      fill="#fff"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {city.name}
                    </text>
                    <text
                      textAnchor="middle"
                      y="24"
                      x="50"
                      fill="#fff"
                      fontSize="8"
                    >
                      Frequency: {city.frequency}
                    </text>
                  </g>
                )}
              </AnimatedMarker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </CardContent>
    </Card>
  );
}
