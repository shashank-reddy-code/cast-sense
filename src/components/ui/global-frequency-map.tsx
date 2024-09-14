import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { animated, useSpring } from "@react-spring/web";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const cities = [
  { name: "New York", coordinates: [-74.006, 40.7128], frequency: 1000 },
  { name: "London", coordinates: [-0.1276, 51.5074], frequency: 850 },
  { name: "Tokyo", coordinates: [139.6917, 35.6895], frequency: 1200 },
  { name: "Sydney", coordinates: [151.2093, -33.8688], frequency: 600 },
  { name: "Rio de Janeiro", coordinates: [-43.1729, -22.9068], frequency: 450 },
];

const AnimatedMarker = animated(Marker);

const GlobalFrequencyMap = () => {
  const [selectedCity, setSelectedCity] = useState(null);

  const markerSpring = useSpring({
    to: { scale: selectedCity ? 1.5 : 1 },
    config: { tension: 300, friction: 10 },
  });

  return (
    <div className="w-full h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Global Frequency Map</h1>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 100,
        }}
        className="w-full h-[calc(100vh-8rem)]"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#2C3E50"
                stroke="#FFF"
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
              fill={selectedCity === city ? "#FFA000" : "#FF5722"}
              stroke="#FFF"
              strokeWidth={2}
              style={{
                transform:
                  selectedCity === city
                    ? markerSpring.scale.to((s) => `scale(${s})`)
                    : "scale(1)",
              }}
            />
          </AnimatedMarker>
        ))}
      </ComposableMap>
      <div className="absolute bottom-4 left-4 bg-gray-800 p-4 rounded-lg shadow-lg">
        {selectedCity ? (
          <>
            <h2 className="text-xl font-semibold">{selectedCity.name}</h2>
            <p className="text-lg">Frequency: {selectedCity.frequency}</p>
          </>
        ) : (
          <p className="text-lg">Hover over a city to see details</p>
        )}
      </div>
    </div>
  );
};

export default GlobalFrequencyMap;
