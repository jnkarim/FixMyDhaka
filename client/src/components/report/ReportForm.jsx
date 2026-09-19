import {
  Camera,
  CheckCircle2,
  LoaderCircle,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  analyzeReport,
} from "../../services/api";


function ReportForm({
  selectedPosition,
  onSuccess,
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
    error,
    setError,
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

        onSuccess(
          result
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to submit the report."
        );
      } finally {
        setLoading(false);
      }
    };


  return (
    <div
      className="
        h-full
        bg-white
      "
    >
      <div
        className="
          border-b
          border-zinc-200
          px-6
          py-6
          lg:px-8
        "
      >
        <div
          className="
            mb-4
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-black
            px-3
            py-1.5
            text-[10px]
            font-bold
            uppercase
            tracking-[0.14em]
            text-[#E8FF00]
          "
        >
          <ShieldCheck
            size={13}
          />

          Civic report
        </div>

        <h2
          className="
            text-2xl
            font-bold
            tracking-[-0.03em]
            text-zinc-950
          "
        >
          Tell us what happened
        </h2>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-zinc-500
          "
        >
          Select a location on the map and
          describe the civic issue.
        </p>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="
          space-y-6
          px-6
          py-6
          lg:px-8
        "
      >
        <div
          className="
            grid
            grid-cols-3
            gap-3
          "
        >
          <div
            className="
              rounded-lg
              border
              border-[#E8FF00]
              bg-[#FBFFE6]
              p-3
            "
          >
            <span
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-[#E8FF00]
                text-[10px]
                font-black
                text-black
              "
            >
              1
            </span>

            <p
              className="
                mt-2
                text-[11px]
                font-semibold
              "
            >
              Location
            </p>
          </div>

          <div
            className="
              rounded-lg
              border
              border-zinc-200
              bg-zinc-50
              p-3
            "
          >
            <span
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-white
                text-[10px]
                font-bold
                text-zinc-500
              "
            >
              2
            </span>

            <p
              className="
                mt-2
                text-[11px]
                font-semibold
                text-zinc-500
              "
            >
              Details
            </p>
          </div>

          <div
            className="
              rounded-lg
              border
              border-zinc-200
              bg-zinc-50
              p-3
            "
          >
            <span
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-white
                text-[10px]
                font-bold
                text-zinc-500
              "
            >
              3
            </span>

            <p
              className="
                mt-2
                text-[11px]
                font-semibold
                text-zinc-500
              "
            >
              Authority
            </p>
          </div>
        </div>

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
              <MapPin
                size={18}
              />
            </div>

            <div className="min-w-0">
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

            {!selectedPosition
              .isResolvingLocation && (
              <CheckCircle2
                size={17}
                className="
                  ml-auto
                  shrink-0
                  text-zinc-800
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

          <input
            id="location"
            type="text"
            value={
              location
            }
            onChange={(
              event
            ) =>
              setLocation(
                event.target.value
              )
            }
            placeholder={
              selectedPosition
                ?.isResolvingLocation
                ? "Finding area..."
                : "e.g. Mirpur 10"
            }
            className="
              w-full
              rounded-lg
              border
              border-zinc-300
              bg-white
              px-4
              py-3
              text-sm
              text-zinc-900
              outline-none
              transition
              placeholder:text-zinc-400
              focus:border-black
              focus:ring-4
              focus:ring-[#E8FF00]/25
            "
          />
        </div>

        <div>
          <div
            className="
              mb-2
              flex
              items-center
              justify-between
            "
          >
            <label
              htmlFor="description"
              className="
                text-xs
                font-bold
                uppercase
                text-zinc-800
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
            rows={6}
            placeholder="Describe the issue clearly..."
            className="
              w-full
              resize-none
              rounded-lg
              border
              border-zinc-300
              bg-white
              px-4
              py-3
              text-sm
              leading-6
              outline-none
              placeholder:text-zinc-400
              focus:border-black
              focus:ring-4
              focus:ring-[#E8FF00]/25
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
                text-zinc-800
              "
            >
              Photo evidence
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
              rounded-lg
              border
              border-dashed
              border-zinc-300
              bg-zinc-50
              px-4
              py-4
              text-left
              transition
              hover:bg-white
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

            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  text-zinc-900
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
              rounded-lg
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
            selectedPosition
              ?.isResolvingLocation
          }
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-[#E8FF00]
            px-5
            py-3.5
            text-sm
            font-bold
            text-black
            transition
            hover:bg-[#F1FF59]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading && (
            <LoaderCircle
              size={17}
              className="animate-spin"
            />
          )}

          {loading
            ? "Creating report..."
            : "Report & find authority"}
        </button>
      </form>
    </div>
  );
}


export default ReportForm;