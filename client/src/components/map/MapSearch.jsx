import {
    LoaderCircle,
    MapPin,
    Search,
    X,
} from "lucide-react";

import {
    useState,
} from "react";

import {
    useMap,
} from "react-leaflet";

import {
    getCompactLocation,
    searchLocations,
} from "../../services/geocoding";


function MapSearch({
    onSelectPosition,
}) {
    const map =
        useMap();

    const [
        query,
        setQuery,
    ] = useState("");

    const [
        results,
        setResults,
    ] = useState([]);

    const [
        searching,
        setSearching,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");


    const handleSearch =
        async (event) => {
            event.preventDefault();

            const value =
                query.trim();

            if (!value) {
                return;
            }

            setSearching(true);
            setResults([]);
            setError("");

            try {
                const data =
                    await searchLocations(
                        value
                    );

                if (
                    data.length === 0
                ) {
                    setError(
                        "No location found."
                    );

                    return;
                }

                setResults(
                    data
                );
            } catch (
            searchError
            ) {
                setError(
                    searchError.message ||
                    "Unable to search location."
                );
            } finally {
                setSearching(
                    false
                );
            }
        };


    const handleSelect = (
        result
    ) => {
        const lat =
            Number(
                result.lat
            );

        const lng =
            Number(
                result.lon
            );

        const location =
            getCompactLocation(
                result.address,
                result.display_name
            );

        map.flyTo(
            [
                lat,
                lng,
            ],
            16,
            {
                duration: 1,
            }
        );

        onSelectPosition({
            lat,
            lng,
            location,
            displayName:
                result.display_name,
            isResolvingLocation:
                false,
        });

        setQuery(
            location
        );

        setResults([]);
    };


    const handleClear =
        () => {
            setQuery("");
            setResults([]);
            setError("");
        };


    return (
        <div
            className="
        absolute
        left-1/2
        top-6
        z-[700]
        w-[calc(100%-2rem)]
        max-w-[620px]
        -translate-x-1/2
      "
        >
            <form
                onSubmit={
                    handleSearch
                }
                className="
          flex
          h-16
          items-center
          rounded-2xl
          border
          border-white/10
          bg-[#090909]
          p-2
          shadow-2xl
        "
            >
                <div
                    className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[#E8FF00]
            text-black
          "
                >
                    <Search
                        size={20}
                    />
                </div>

                <input
                    value={
                        query
                    }
                    onChange={(
                        event
                    ) =>
                        setQuery(
                            event.target.value
                        )
                    }
                    placeholder="Search Mirpur 10, Dhanmondi, Uttara..."
                    className="
            min-w-0
            flex-1
            bg-transparent
            px-4
            text-sm
            text-white
            outline-none
            placeholder:text-zinc-500
          "
                />

                {query && (
                    <button
                        type="button"
                        onClick={
                            handleClear
                        }
                        className="
              mr-1
              flex
              h-10
              w-10
              items-center
              justify-center
              text-zinc-500
              transition
              hover:text-white
            "
                    >
                        <X
                            size={16}
                        />
                    </button>
                )}

                <button
                    type="submit"
                    disabled={
                        searching
                    }
                    className="
            flex
            h-12
            min-w-[96px]
            items-center
            justify-center
            rounded-xl
            bg-[#E8FF00]
            px-5
            text-sm
            font-bold
            text-black
            transition
            hover:bg-[#F1FF59]
            disabled:opacity-50
          "
                >
                    {searching ? (
                        <LoaderCircle
                            size={17}
                            className="animate-spin"
                        />
                    ) : (
                        "Search"
                    )}
                </button>
            </form>

            {(results.length >
                0 ||
                error) && (
                    <div
                        className="
            mt-2
            overflow-hidden
            rounded-xl
            border
            border-zinc-200
            bg-white
            shadow-2xl
          "
                    >
                        {error && (
                            <div
                                className="
                px-4
                py-3
                text-xs
                text-zinc-500
              "
                            >
                                {error}
                            </div>
                        )}

                        {results.map(
                            (result) => {
                                const name =
                                    getCompactLocation(
                                        result.address,
                                        result.display_name
                                    );

                                return (
                                    <button
                                        key={
                                            result.place_id
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleSelect(
                                                result
                                            )
                                        }
                                        className="
                    flex
                    w-full
                    items-start
                    gap-3
                    border-b
                    border-zinc-100
                    px-4
                    py-3
                    text-left
                    transition
                    last:border-b-0
                    hover:bg-zinc-50
                  "
                                    >
                                        <MapPin
                                            size={16}
                                            className="
                      mt-0.5
                      shrink-0
                      text-zinc-500
                    "
                                        />

                                        <div className="min-w-0">
                                            <p
                                                className="
                        text-xs
                        font-semibold
                        text-zinc-900
                      "
                                            >
                                                {name}
                                            </p>

                                            <p
                                                className="
                        mt-1
                        line-clamp-1
                        text-[10px]
                        text-zinc-400
                      "
                                            >
                                                {
                                                    result.display_name
                                                }
                                            </p>
                                        </div>
                                    </button>
                                );
                            }
                        )}
                    </div>
                )}
        </div>
    );
}


export default MapSearch;