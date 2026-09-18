import {
    ImagePlus,
    LoaderCircle,
    MapPin,
    X,
} from "lucide-react";

import {
    useRef,
    useState,
} from "react";

import {
    analyzeReport,
} from "../../services/api";

function ReportPanel({
    selectedPosition,
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
        error,
        setError,
    ] = useState("");

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

            if (!description.trim()) {
                setError(
                    "Please describe the problem."
                );

                return;
            }

            try {
                setLoading(true);

                const result =
                    await analyzeReport({
                        description:
                            description.trim(),

                        location:
                            location.trim(),

                        photo,
                    });

                onSuccess(
                    result
                );
            } catch (err) {
                setError(
                    err.message ||
                    "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <div className="flex h-full flex-col bg-white">
            <div
                className="
          border-b
          border-zinc-200
          bg-gradient-to-b
          from-zinc-50
          to-white
          px-6
          py-6
        "
            >
                <div className="mb-5 flex items-center justify-between">
                    <div
                        className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-black
              px-3
              py-1.5
              text-[10px]
              font-extrabold
              uppercase
              tracking-[0.14em]
              text-[#E8FF00]
            "
                    >
                        <MapPin
                            size={12}
                        />

                        New civic report
                    </div>

                    {onClose && (
                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            className="
                rounded-lg
                p-2
                text-zinc-400
                transition
                hover:bg-zinc-100
                hover:text-black
                xl:hidden
              "
                        >
                            <X
                                size={19}
                            />
                        </button>
                    )}
                </div>

                <h2
                    className="
            text-[27px]
            font-black
            tracking-[-0.04em]
            text-black
          "
                >
                    Report a problem
                </h2>

                <p
                    className="
            mt-2
            max-w-[320px]
            text-sm
            leading-6
            text-zinc-500
          "
                >
                    Tell us what happened. We will identify
                    the correct authority and reporting route.
                </p>

                <div className="mt-5 flex items-center gap-2">
                    <div className="flex items-center gap-2">
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

                        <span className="text-[10px] font-bold text-zinc-700">
                            Location
                        </span>
                    </div>

                    <div className="h-px flex-1 bg-zinc-200" />

                    <div className="flex items-center gap-2">
                        <span
                            className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-zinc-100
                text-[10px]
                font-bold
                text-zinc-500
              "
                        >
                            2
                        </span>

                        <span className="text-[10px] font-bold text-zinc-400">
                            Details
                        </span>
                    </div>

                    <div className="h-px flex-1 bg-zinc-200" />

                    <div className="flex items-center gap-2">
                        <span
                            className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-zinc-100
                text-[10px]
                font-bold
                text-zinc-500
              "
                        >
                            3
                        </span>

                        <span className="text-[10px] font-bold text-zinc-400">
                            Route
                        </span>
                    </div>
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
          p-6
        "
            >
                {selectedPosition && (
                    <div
                        className="
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-[#E8FF00]
              bg-[#FBFFE6]
              p-3
            "
                    >
                        <div
                            className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-black
                text-[#E8FF00]
              "
                        >
                            <MapPin
                                size={16}
                            />
                        </div>

                        <div>
                            <p className="text-xs font-bold text-black">
                                Map location selected
                            </p>

                            <p className="mt-1 text-[11px] text-zinc-500">
                                {selectedPosition.lat.toFixed(
                                    5
                                )}
                                ,{" "}
                                {selectedPosition.lng.toFixed(
                                    5
                                )}
                            </p>
                        </div>
                    </div>
                )}

                <div>
                    <label
                        htmlFor="location"
                        className="
              mb-2
              block
              text-xs
              font-extrabold
              uppercase
              tracking-wide
              text-zinc-700
            "
                    >
                        Area or location
                    </label>

                    <input
                        id="location"
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
                        placeholder="e.g. Mirpur 10"
                        className="
              w-full
              rounded-xl
              border
              border-zinc-200
              bg-zinc-50
              px-4
              py-3
              text-sm
              text-black
              outline-none
              transition
              placeholder:text-zinc-400
              focus:border-black
              focus:bg-white
              focus:ring-4
              focus:ring-[#E8FF00]/30
            "
                    />
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="
              mb-2
              block
              text-xs
              font-extrabold
              uppercase
              tracking-wide
              text-zinc-700
            "
                    >
                        What is the problem?
                    </label>

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
                        rows={5}
                        placeholder="Describe the issue clearly..."
                        className="
              w-full
              resize-none
              rounded-xl
              border
              border-zinc-200
              bg-zinc-50
              px-4
              py-3
              text-sm
              leading-6
              text-black
              outline-none
              transition
              placeholder:text-zinc-400
              focus:border-black
              focus:bg-white
              focus:ring-4
              focus:ring-[#E8FF00]/30
            "
                    />
                </div>

                <div>
                    <label
                        className="
              mb-2
              block
              text-xs
              font-extrabold
              uppercase
              tracking-wide
              text-zinc-700
            "
                    >
                        Photo

                        <span className="ml-1 normal-case font-normal tracking-normal text-zinc-400">
                            optional
                        </span>
                    </label>

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
              flex-col
              items-center
              justify-center
              rounded-xl
              border-2
              border-dashed
              border-zinc-300
              bg-zinc-50
              px-4
              py-6
              text-center
              transition
              hover:border-[#E8FF00]
              hover:bg-[#FBFFE6]
            "
                    >
                        <div
                            className="
                mb-3
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
                            <ImagePlus
                                size={20}
                            />
                        </div>

                        <span className="max-w-full truncate text-sm font-bold text-zinc-800">
                            {photo
                                ? photo.name
                                : "Upload a photo"}
                        </span>

                        <span className="mt-1 text-[10px] text-zinc-400">
                            JPEG, PNG or WebP · max 5 MB
                        </span>
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
              text-sm
              text-red-700
            "
                    >
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={
                        loading
                    }
                    className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#E8FF00]
            px-4
            py-3.5
            text-sm
            font-black
            text-black
            shadow-[0_10px_25px_rgba(232,255,0,0.18)]
            transition
            hover:bg-[#F1FF59]
            hover:shadow-[0_12px_30px_rgba(232,255,0,0.28)]
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
                >
                    {loading && (
                        <LoaderCircle
                            size={18}
                            className="animate-spin"
                        />
                    )}

                    {loading
                        ? "Analyzing report..."
                        : "Analyze & find authority"}
                </button>
            </form>
        </div>
    );
}

export default ReportPanel;