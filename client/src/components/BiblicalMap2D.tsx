import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { biblicalLocations } from '../data/biblicalLocations';

interface BiblicalMap2DProps {
  onExpand: () => void;
}

export function BiblicalMap2D({ onExpand }: BiblicalMap2DProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  // Map bounds (Middle East region)
  const bounds = {
    minLat: 25,
    maxLat: 40,
    minLng: 25,
    maxLng: 50,
  };

  // Convert lat/lng to SVG coordinates
  const latLngToXY = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 400;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 300;
    return { x, y };
  };

  return (
    <div className="relative group">
      {/* Expand button */}
      <button
        onClick={onExpand}
        className="absolute top-2 right-2 z-10 p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:shadow-lg transition-all opacity-0 group-hover:opacity-100"
        aria-label="Expand to 3D view"
      >
        <Maximize2 className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
      </button>

      {/* 2D Map */}
      <div className="relative w-full h-64 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full"
        >
          {/* Background */}
          <rect width="400" height="300" fill="#27272a" />

          {/* Earth land/ocean mask - simplified two-tone */}
          <defs>
            <filter id="twoToneMask">
              {/* Convert to grayscale */}
              <feColorMatrix
                type="matrix"
                values="0.3333 0.3333 0.3333 0 0
                        0.3333 0.3333 0.3333 0 0
                        0.3333 0.3333 0.3333 0 0
                        0 0 0 1 0"
              />
              {/* Invert and apply two-tone: bright in mask = ocean (dark grey), dark in mask = land (light grey) */}
              <feComponentTransfer>
                <feFuncR type="discrete" tableValues="0.85 0.2"/>
                <feFuncG type="discrete" tableValues="0.85 0.2"/>
                <feFuncB type="discrete" tableValues="0.85 0.2"/>
              </feComponentTransfer>
            </filter>
            <clipPath id="mapBounds">
              <rect x="0" y="0" width="400" height="300" />
            </clipPath>
          </defs>

          {/* Map image centered on Middle East - using proper land/ocean mask */}
          {/* Equirectangular: Middle East is ~25-50°E (0.58-0.64 normalized), 25-40°N (0.36-0.47 normalized) */}
          <image
            href="/textures/earth_mask.jpg"
            x="-1100"
            y="-200"
            width="2400"
            height="1200"
            preserveAspectRatio="xMidYMid slice"
            filter="url(#twoToneMask)"
            clipPath="url(#mapBounds)"
          />

          {/* Grid pattern overlay */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 30"
                fill="none"
                stroke="#52525b"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#grid)" />

          {/* Location markers */}
          {biblicalLocations.map((location, idx) => {
            const { x, y } = latLngToXY(location.lat, location.lng);
            const isHovered = hoveredLocation === location.name;

            return (
              <g key={idx}>
                {/* Marker dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? '#fbbf24' : '#ef4444'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredLocation(location.name)}
                  onMouseLeave={() => setHoveredLocation(null)}
                />

                {/* Label */}
                {isHovered && (
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    className="text-xs font-medium"
                    fill="#ffffff"
                    stroke="#000000"
                    strokeWidth="0.5"
                  >
                    {location.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredLocation && (
          <div className="absolute bottom-2 left-2 right-2 bg-white dark:bg-zinc-900 p-2 rounded shadow-lg border border-zinc-200 dark:border-zinc-700">
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
    </div>
  );
}
