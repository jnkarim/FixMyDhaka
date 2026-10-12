import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

const DHAKA_CENTER = [23.8103, 90.4125];

function ViewportController({ hotspots }) {
  const map = useMap();

  useEffect(() => {
    if (!hotspots.length) return;

    if (hotspots.length === 1) {
      map.setView([hotspots[0].lat, hotspots[0].lng], 12);
      return;
    }

    map.fitBounds(
      hotspots.map((point) => [point.lat, point.lng]),
      { padding: [38, 38], maxZoom: 13, animate: false },
    );
  }, [hotspots, map]);

  return null;
}

/** Circular markers are proportional hotspot indicators, not a continuous heatmap. */
export default function IssueDensityMap({
  hotspots,
  selectedKey,
  onSelectHotspot,
}) {
  return (
    <div className="relative h-full min-h-[340px] w-full overflow-hidden rounded-[20px] bg-[#EDEFE8]">
      <MapContainer
        center={DHAKA_CENTER}
        zoom={11}
        scrollWheelZoom={false}
        className="z-0 h-full min-h-[340px] w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ViewportController hotspots={hotspots} />
        {hotspots.map((spot) => {
          const isSelected = spot.key === selectedKey;
          return (
            <CircleMarker
              key={spot.key}
              center={[spot.lat, spot.lng]}
              radius={Math.min(32, 9 + Math.sqrt(spot.count) * 5)}
              pathOptions={{
                color: isSelected ? "#111111" : "#555E00",
                weight: isSelected ? 3 : 1.4,
                fillColor: "#E8FF00",
                fillOpacity: isSelected ? 0.85 : 0.55,
              }}
              eventHandlers={{ click: () => onSelectHotspot(spot.key) }}
            >
              <Tooltip direction="top" opacity={1}>
                <strong>{spot.count} report{spot.count === 1 ? "" : "s"}</strong>
                <div>{spot.label}</div>
                <div>Click to explore</div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
      {hotspots.length === 0 && (
        <div className="pointer-events-none absolute inset-x-4 top-1/2 z-[500] -translate-y-1/2 rounded-xl bg-white/95 px-5 py-4 text-center text-sm font-medium text-zinc-700 shadow-lg">
          No reports with coordinates match these filters.
        </div>
      )}
      <div className="pointer-events-none absolute bottom-5 left-5 z-[500] rounded-xl border border-white/80 bg-white/95 px-4 py-3 shadow-sm">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-zinc-500">Density markers</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-700">
          <span className="h-3 w-3 rounded-full border border-[#8F9900] bg-[#E8FF00]/60" />
          Larger circles = more reports nearby
        </div>
      </div>
    </div>
  );
}
