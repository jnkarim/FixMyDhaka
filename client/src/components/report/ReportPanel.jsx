import {
  Camera,
  CheckCircle2,
  LocateFixed,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  analyzeReport,
} from "../../services/api";

import {
  getCompactLocation,
  searchLocations,
} from "../../services/geocoding";


function ReportPanel({
  selectedPosition,
  onSelectPosition,
  onSuccess,
  onClose,
}) {
  const fileInputRef =
    useRef(null);

  const [
    location,
    setLocation,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    photo,
    setPhoto,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    locatingArea,
    setLocatingArea,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    locationError,
    setLocationError,
  ] = useState("");


  useEffect(() => {
    if (
      selectedPosition?.location
    ) {
      setLocation(
        selectedPosition.location
      );
    }
  }, [
    selectedPosition?.location,
  ]);


  const handleLocateArea =
    async () => {
      const query =
        location.trim();

      if (!query) {
        setLocationError(
          "Enter an area first."
        );

        return;
      }

      try {
        setLocatingArea(true);
        setLocationError("");

        const results =
          await searchLocations(
            query
          );

        if (
          !results ||
          results.length === 0
        ) {
          setLocationError(
            "Could not find this area."
          );

          return;
        }

        const bestResult =
          results[0];

        const lat =
          Number(
            bestResult.lat
          );

        const lng =
          Number(
            bestResult.lon
          );

        const resolvedLocation =
          getCompactLocation(
            bestResult.address,
            bestResult.display_name
          ) || query;

        setLocation(
          resolvedLocation
        );

        onSelectPosition?.({
          lat,
          lng,

          location:
            resolvedLocation,

          displayName:
            bestResult.display_name,

          isResolvingLocation:
            false,

          source:
            "location-search",
        });
      } catch (err) {
        setLocationError(
          err.message ||
          "Unable to locate this area."
        );
      } finally {
        setLocatingArea(false);
      }
    };


  const handleLocationKeyDown =
    (event) => {
      if (
        event.key === "Enter"
      ) {
        event.preventDefault();

        handleLocateArea();
      }
    };


  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

      if (!location.trim()) {
        setError(
          "Please enter the area or location."
        );

        return;
      }

      if (
        !description.trim()
      ) {
        setError(
          "Please describe the problem."
        );

        return;
      }

      try {
        setLoading(true);

        const result =
          await analyzeReport({
            location:
              location.trim(),

            description:
              description.trim(),

            photo,

            latitude:
              selectedPosition?.lat ??
              null,

            longitude:
              selectedPosition?.lng ??
              null,
          });

        onSuccess?.(
          result
        );
      } catch (err) {
        setError(
          err.message ||
          "Unable to analyze the report."
        );
      } finally {
        setLoading(false);
      }
    };


  return (
    <div
      className="
        flex
        h-full
        min-h-0
        flex-col
        bg-white
      "
    >
      <div
        className="
          shrink-0
          border-b
          border-zinc-200
          px-5
          py-5
          sm:px-7
          sm:py-6
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div>
            <div
              className="
                mb-3
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-black
                px-3
                py-1.5
                text-[9px]
                font-bold
                uppercase
                tracking-[0.14em]
                text-[#E8FF00]
                sm:mb-4
                sm:text-[10px]
              "
            >
              <MapPin
                size={12}
              />

              New civic report
            </div>

            <h2
              className="
                text-2xl
                font-black
                tracking-[-0.04em]
                text-zinc-950
                sm:text-[28px]
              "
            >
              Report a problem
            </h2>

            <p
              className="
                mt-2
                max-w-[360px]
                text-xs
                leading-5
                text-zinc-500
                sm:text-sm
                sm:leading-6
              "
            >
              Tell us what happened.
              We will identify the
              correct authority and
              reporting route.
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={
                onClose
              }
              className="
                hidden
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-zinc-200
                text-zinc-500
                sm:flex
                xl:hidden
              "
            >
              <X
                size={17}
              />
            </button>
          )}
        </div>


        <div
          className="
            mt-5
            flex
            items-center
            gap-2
          "
        >
          <Step
            number="1"
            label="Location"
            active
          />

          <div
            className="
              h-px
              flex-1
              bg-zinc-200
            "
          />

          <Step
            number="2"
            label="Details"
          />

          <div
            className="
              h-px
              flex-1
              bg-zinc-200
            "
          />

          <Step
            number="3"
            label="Route"
          />
        </div>
      </div>


      <form
        onSubmit={
          handleSubmit
        }
        className="
          min-h-0
          flex-1
          space-y-5
          overflow-y-auto
          overscroll-contain
          px-5
          py-5
          sm:space-y-6
          sm:px-7
          sm:py-6
        "
      >
        {selectedPosition && (
          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-[#E8FF00]
              bg-[#FBFFE6]
              px-4
              py-3
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
                rounded-lg
                bg-black
                text-[#E8FF00]
              "
            >
              {selectedPosition
                .isResolvingLocation ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <MapPin
                  size={18}
                />
              )}
            </div>

            <div
              className="
                min-w-0
                flex-1
              "
            >
              <p
                className="
                  truncate
                  text-xs
                  font-bold
                  text-zinc-900
                "
              >
                {selectedPosition
                  .isResolvingLocation
                  ? "Finding area..."
                  : selectedPosition.location ||
                  "Map location selected"}
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-zinc-500
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

            {!selectedPosition
              .isResolvingLocation && (
                <CheckCircle2
                  size={17}
                  className="
                  shrink-0
                "
                />
              )}
          </div>
        )}


        <div>
          <label
            htmlFor="location"
            className="
              mb-2
              block
              text-xs
              font-bold
              uppercase
              text-zinc-800
            "
          >
            Area or location
          </label>

          <div className="relative">
            <input
              id="location"
              type="text"
              value={
                location
              }
              onChange={(
                event
              ) => {
                setLocation(
                  event.target.value
                );

                setLocationError(
                  ""
                );
              }}
              onKeyDown={
                handleLocationKeyDown
              }
              placeholder="e.g. Mirpur 10"
              className="
                h-13
                w-full
                rounded-xl
                border
                border-zinc-300
                bg-white
                py-3.5
                pl-4
                pr-14
                text-sm
                outline-none
                placeholder:text-zinc-400
                focus:border-black
                focus:ring-4
                focus:ring-[#E8FF00]/20
              "
            />

            <button
              type="button"
              onClick={
                handleLocateArea
              }
              disabled={
                locatingArea
              }
              className="
                absolute
                right-2
                top-1/2
                flex
                h-9
                w-9
                -translate-y-1/2
                items-center
                justify-center
                rounded-lg
                bg-black
                text-[#E8FF00]
                disabled:opacity-50
              "
            >
              {locatingArea ? (
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <LocateFixed
                  size={17}
                />
              )}
            </button>
          </div>

          <p
            className="
              mt-2
              text-[10px]
              text-zinc-400
            "
          >
            Type an area and press
            Enter or use the location
            button.
          </p>

          {locationError && (
            <p
              className="
                mt-2
                text-[10px]
                font-medium
                text-red-600
              "
            >
              {locationError}
            </p>
          )}
        </div>


        <div>
          <div
            className="
              mb-2
              flex
              justify-between
            "
          >
            <label
              htmlFor="description"
              className="
                text-xs
                font-bold
                uppercase
              "
            >
              What is the problem?
            </label>

            <span
              className="
                text-[10px]
                text-zinc-400
              "
            >
              Required
            </span>
          </div>

          <textarea
            id="description"
            rows={5}
            value={
              description
            }
            onChange={(
              event
            ) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Describe the issue clearly..."
            className="
              w-full
              resize-none
              rounded-xl
              border
              border-zinc-300
              px-4
              py-3.5
              text-sm
              leading-6
              outline-none
              placeholder:text-zinc-400
              focus:border-black
              focus:ring-4
              focus:ring-[#E8FF00]/20
              sm:min-h-[170px]
            "
          />
        </div>


        <div>
          <div
            className="
              mb-2
              flex
              justify-between
            "
          >
            <label
              className="
                text-xs
                font-bold
                uppercase
              "
            >
              Photo
            </label>

            <span
              className="
                text-[10px]
                text-zinc-400
              "
            >
              Optional
            </span>
          </div>

          <input
            ref={
              fileInputRef
            }
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(
              event
            ) =>
              setPhoto(
                event.target.files?.[
                0
                ] || null
              )
            }
            className="hidden"
          />

          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="
              flex
              w-full
              items-center
              gap-4
              rounded-xl
              border
              border-dashed
              border-zinc-300
              bg-zinc-50
              px-4
              py-4
              text-left
            "
          >
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-black
                text-[#E8FF00]
              "
            >
              <Camera
                size={19}
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-xs
                  font-semibold
                "
              >
                {photo
                  ? photo.name
                  : "Upload a photo"}
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-zinc-400
                "
              >
                JPEG, PNG or WebP · max 5 MB
              </p>
            </div>
          </button>
        </div>


        {error && (
          <div
            className="
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-xs
              leading-5
              text-red-700
            "
          >
            {error}
          </div>
        )}


        <button
          type="submit"
          disabled={
            loading ||
            locatingArea ||
            selectedPosition
              ?.isResolvingLocation
          }
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#E8FF00]
            px-5
            py-3.5
            text-sm
            font-black
            text-black
            disabled:opacity-50
          "
        >
          {loading ? (
            <>
              <LoaderCircle
                size={17}
                className="animate-spin"
              />

              Analyzing report...
            </>
          ) : (
            <>
              <ShieldCheck
                size={17}
              />

              Report & find authority
            </>
          )}
        </button>

        <div className="h-3" />
      </form>
    </div>
  );
}


function Step({
  number,
  label,
  active = false,
}) {
  return (
    <div
      className="
        flex
        shrink-0
        items-center
        gap-1.5
      "
    >
      <span
        className={`
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          text-[10px]
          font-black

          ${active
            ? "bg-[#E8FF00] text-black"
            : "bg-zinc-100 text-zinc-500"
          }
        `}
      >
        {number}
      </span>

      <span
        className={`
          hidden
          text-[10px]
          font-bold
          min-[360px]:inline

          ${active
            ? "text-zinc-900"
            : "text-zinc-400"
          }
        `}
      >
        {label}
      </span>
    </div>
  );
}


export default ReportPanel;