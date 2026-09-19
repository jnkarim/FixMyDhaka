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
} from "lucide-react";

import {
  useEffect,
} from "react";

import "leaflet/dist/leaflet.css";

import demoReports from "../../data/demoReports";
import MapSearch from "./MapSearch";

import {
  reverseGeocodeLocation,
} from "../../services/geocoding";


const DHAKA_CENTER = [
  23.8103,
  90.4125,
];


function MapClickHandler({
  onSelectPosition,
}) {
  useMapEvents({
    async click(event) {
      const lat =
        event.latlng.lat;

      const lng =
        event.latlng.lng;

      onSelectPosition({
        lat,
        lng,

        location: null,

        displayName: null,

        isResolvingLocation:
          true,

        source:
          "map-click",
      });

      try {
        const result =
          await reverseGeocodeLocation(
            lat,
            lng
          );

        onSelectPosition({
          lat,
          lng,

          location:
            result.location,

          displayName:
            result.displayName,

          isResolvingLocation:
            false,

          source:
            "map-click",
        });
      } catch {
        onSelectPosition({
          lat,
          lng,

          location:
            `${lat.toFixed(
              5
            )}, ${lng.toFixed(
              5
            )}`,

          displayName:
            null,

          isResolvingLocation:
            false,

          source:
            "map-click",
        });
      }
    },
  });

  return null;
}


function MapController({
  selectedPosition,
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
        300
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [
    sidebarOpen,
    map,
  ]);


  useEffect(() => {
    if (
      !selectedPosition
    ) {
      return;
    }

    const latitude =
      Number(
        selectedPosition.lat
      );

    const longitude =
      Number(
        selectedPosition.lng
      );

    if (
      !Number.isFinite(
        latitude
      ) ||
      !Number.isFinite(
        longitude
      )
    ) {
      console.log(
        "INVALID MAP POSITION:",
        selectedPosition
      );

      return;
    }

    console.log(
      "MAP FLY TO:",
      latitude,
      longitude
    );

    map.invalidateSize();

    map.flyTo(
      [
        latitude,
        longitude,
      ],
      16,
      {
        animate: true,
        duration: 1.25,
      }
    );

  }, [
    selectedPosition?.lat,
    selectedPosition?.lng,
    selectedPosition?.selectionId,
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
    <div
      className="
        relative
        h-full
        w-full
      "
    >
      <MapContainer
        center={
          DHAKA_CENTER
        }
        zoom={12}
        minZoom={10}
        maxZoom={19}
        scrollWheelZoom
        zoomControl
        className="
          z-0
          h-full
          w-full
        "
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        <MapController
          selectedPosition={
            selectedPosition
          }
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
                Number(
                  report.lat
                ),
                Number(
                  report.lng
                ),
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
                  <p
                    className="
                      font-bold
                      text-zinc-950
                    "
                  >
                    {
                      report.title
                    }
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-zinc-500
                    "
                  >
                    {
                      report.location
                    }
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          )
        )}


        {selectedPosition &&
          Number.isFinite(
            Number(
              selectedPosition.lat
            )
          ) &&
          Number.isFinite(
            Number(
              selectedPosition.lng
            )
          ) && (
            <CircleMarker
              center={[
                Number(
                  selectedPosition.lat
                ),
                Number(
                  selectedPosition.lng
                ),
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
                {selectedPosition
                  .isResolvingLocation
                  ? "Finding location..."
                  : selectedPosition.location ||
                    "Selected location"}
              </Popup>
            </CircleMarker>
          )}
      </MapContainer>


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
          bg-white
          p-3
          shadow-xl
          md:block
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
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
            <p
              className="
                text-xs
                font-black
                text-zinc-900
              "
            >
              Dhaka City
            </p>

            <p
              className="
                mt-0.5
                text-[10px]
                text-zinc-400
              "
            >
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
            max-w-[320px]
            rounded-2xl
            bg-black
            px-4
            py-3
            text-white
            shadow-2xl
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
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

            <div
              className="
                min-w-0
              "
            >
              <p
                className="
                  truncate
                  text-xs
                  font-bold
                "
              >
                {selectedPosition
                  .isResolvingLocation
                  ? "Finding area..."
                  : selectedPosition.location ||
                    "Selected location"}
              </p>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  text-zinc-400
                "
              >
                {Number(
                  selectedPosition.lat
                ).toFixed(5)}
                ,{" "}
                {Number(
                  selectedPosition.lng
                ).toFixed(5)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default MapView;