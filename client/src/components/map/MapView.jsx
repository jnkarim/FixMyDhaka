import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import {
  Crosshair,
  MapPin,
  PanelLeftOpen,
} from "lucide-react";

import {
  useEffect,
} from "react";

import "leaflet/dist/leaflet.css";

import demoReports from "../../data/demoReports";
import MapSearch from "./MapSearch";

const DHAKA_CENTER = [
  23.8103,
  90.4125,
];

function MapClickHandler({
  onSelectPosition,
}) {
  useMapEvents({
    click(event) {
      onSelectPosition({
        lat:
          event.latlng.lat,

        lng:
          event.latlng.lng,
      });
    },
  });

  return null;
}

function MapResizeHandler({
  sidebarOpen,
}) {
  const map =
    useMap();

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          map.invalidateSize();
        },
        350
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    sidebarOpen,
    map,
  ]);

  return null;
}

function MapView({
  sidebarOpen,
  selectedPosition,
  onSelectPosition,
}) {
  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={
          DHAKA_CENTER
        }
        zoom={12}
        scrollWheelZoom
        zoomControl
        className="z-0 h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapResizeHandler
          sidebarOpen={
            sidebarOpen
          }
        />

        <MapClickHandler
          onSelectPosition={
            onSelectPosition
          }
        />

        <MapSearch
          onSelectPosition={
            onSelectPosition
          }
        />

        {demoReports.map(
          (report) => (
            <CircleMarker
              key={
                report.id
              }
              center={[
                report.lat,
                report.lng,
              ]}
              radius={8}
              pathOptions={{
                color:
                  "#070707",

                fillColor:
                  "#E8FF00",

                fillOpacity:
                  1,

                weight:
                  3,
              }}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <p className="font-bold text-zinc-950">
                    {
                      report.title
                    }
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    {
                      report.location
                    }
                  </p>

                  <div
                    className="
                      mt-2
                      inline-block
                      rounded
                      bg-black
                      px-2
                      py-1
                      text-[10px]
                      font-bold
                      text-[#E8FF00]
                    "
                  >
                    {
                      report.category
                    }
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )
        )}

        {selectedPosition && (
          <CircleMarker
            center={[
              selectedPosition.lat,
              selectedPosition.lng,
            ]}
            radius={12}
            pathOptions={{
              color:
                "#ffffff",

              fillColor:
                "#070707",

              fillOpacity:
                1,

              weight:
                4,
            }}
          >
            <Popup>
              Selected report location
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>

      {!sidebarOpen && (
        <button
          type="button"
          title="Open sidebar"
          className="
            absolute
            left-4
            top-4
            z-[700]
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            bg-black
            text-[#E8FF00]
            shadow-xl
            transition
            hover:scale-105
            hover:bg-zinc-900
          "
        >
          <PanelLeftOpen
            size={20}
          />
        </button>
      )}

      <div
        className="
          absolute
          bottom-5
          left-5
          z-[500]
          hidden
          rounded-2xl
          border
          border-zinc-200
          bg-white/95
          p-3
          shadow-xl
          backdrop-blur
          md:block
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-black
              text-[#E8FF00]
            "
          >
            <Crosshair
              size={18}
            />
          </div>

          <div>
            <p className="text-xs font-black text-zinc-900">
              Dhaka City
            </p>

            <p className="mt-0.5 text-[10px] text-zinc-400">
              Interactive civic map
            </p>
          </div>
        </div>
      </div>

      {selectedPosition && (
        <div
          className="
            absolute
            bottom-5
            right-5
            z-[500]
            rounded-2xl
            border
            border-[#E8FF00]
            bg-black
            px-4
            py-3
            text-white
            shadow-2xl
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-[#E8FF00]
                text-black
              "
            >
              <MapPin
                size={18}
              />
            </div>

            <div>
              <p className="text-xs font-black">
                Selected location
              </p>

              <p className="mt-0.5 text-[10px] text-zinc-400">
                {
                  selectedPosition.lat.toFixed(
                    5
                  )
                }
                ,{" "}
                {
                  selectedPosition.lng.toFixed(
                    5
                  )
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapView;