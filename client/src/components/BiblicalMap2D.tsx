import React, { useState } from 'react';
import { Map, Marker } from 'pigeon-maps';
import { Maximize2 } from 'lucide-react';
import { biblicalLocations } from '../data/biblicalLocations';

interface BiblicalMap2DProps {
  onExpand: () => void;
}

export function BiblicalMap2D({ onExpand }: BiblicalMap2DProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  // Calculate center of all biblical locations
  const centerLat = biblicalLocations.reduce((sum, loc) => sum + loc.lat, 0) / biblicalLocations.length;
  const centerLng = biblicalLocations.reduce((sum, loc) => sum + loc.lng, 0) / biblicalLocations.length;

  // Calculate bounds to determine optimal zoom
  const lats = biblicalLocations.map(loc => loc.lat);
  const lngs = biblicalLocations.map(loc => loc.lng);
  const latSpan = Math.max(...lats) - Math.min(...lats);
  const lngSpan = Math.max(...lngs) - Math.min(...lngs);

  // Calculate zoom level to fit all markers with minimal padding
  const maxSpan = Math.max(latSpan, lngSpan);
  const optimalZoom = Math.max(1, Math.log2(360 / maxSpan) - 0.33);

  return (
    <div className="relative group">
      {/* Expand button */}
      <button
        onClick={onExpand}
        className="absolute top-2 right-2 z-[1000] p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:shadow-lg transition-all opacity-0 group-hover:opacity-100"
        aria-label="Expand to 3D view"
      >
        <Maximize2 className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
      </button>

      {/* Pigeon Map */}
      <div className="relative w-full h-64 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden pigeon-map-container">
        <Map
          center={[centerLat, centerLng]}
          zoom={optimalZoom}
          height={256}
          attribution={false}
        >
          {biblicalLocations.map((location, idx) => (
            <Marker
              key={idx}
              anchor={[location.lat, location.lng]}
              color={hoveredLocation === location.name ? '#93c5fd' : '#60a5fa'}
              onClick={() => {
                setHoveredLocation(hoveredLocation === location.name ? null : location.name);
              }}
            />
          ))}
        </Map>

        {/* Hover tooltip */}
        {hoveredLocation && (
          <div className="absolute bottom-2 left-2 right-2 bg-white dark:bg-zinc-900 p-2 rounded shadow-lg border border-zinc-200 dark:border-zinc-700 z-[1000]">
            <div className="text-xs">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                {biblicalLocations.find((l) => l.name === hoveredLocation)?.name}
              </div>
              <div className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                {biblicalLocations.find((l) => l.name === hoveredLocation)?.description}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS for grayscale styling */}
      <style>{`
        .pigeon-map-container {
          filter: grayscale(100%) contrast(110%);
        }

        .pigeon-map-container canvas {
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}
