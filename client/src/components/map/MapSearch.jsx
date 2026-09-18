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

function MapSearch({
    onSelectPosition,
}) {
    const map = useMap();

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

            const trimmedQuery =
                query.trim();

            if (!trimmedQuery) {
                return;
            }

            setSearching(true);
            setError("");
            setResults([]);

            try {
                const searchQuery =
                    `${trimmedQuery}, Dhaka, Bangladesh`;

                const response =
                    await fetch(
                        "https://nominatim.openstreetmap.org/search?" +
                        new URLSearchParams({
                            q: searchQuery,
                            format: "json",
                            addressdetails: "1",
                            limit: "5",
                            countrycodes: "bd",
                        })
                    );

                if (!response.ok) {
                    throw new Error(
                        "Search failed"
                    );
                }

                const data =
                    await response.json();

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
            } catch {
                setError(
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

        map.flyTo(
            [
                lat,
                lng,
            ],
            16,
            {
                duration:
                    1.2,
            }
        );

        onSelectPosition({
            lat,
            lng,
        });

        setQuery(
            result.display_name
        );

        setResults([]);
    };

    const handleClear = () => {
        setQuery("");
        setResults([]);
        setError("");
    };

    return (
        <div
            className="
        absolute
        left-1/2
        top-5
        z-[700]
        w-[calc(100%-2rem)]
        max-w-[500px]
        -translate-x-1/2
      "
        >
            <form
                onSubmit={
                    handleSearch
                }
                className="
          flex
          items-center
          gap-2
          rounded-2xl
          border
          border-white/20
          bg-black/95
          p-2
          shadow-2xl
          backdrop-blur-xl
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
                    <Search
                        size={18}
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
            px-1
            text-sm
            font-medium
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
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-zinc-500
              transition
              hover:bg-white/10
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
            h-10
            items-center
            justify-center
            rounded-xl
            bg-[#E8FF00]
            px-4
            text-xs
            font-black
            text-black
            transition
            hover:bg-[#F1FF59]
            disabled:opacity-60
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
            rounded-2xl
            border
            border-zinc-200
            bg-white
            shadow-2xl
          "
                    >
                        {error && (
                            <div className="px-4 py-4 text-sm text-zinc-500">
                                {error}
                            </div>
                        )}

                        {results.map(
                            (result) => (
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
                  hover:bg-[#FBFFE6]
                "
                                >
                                    <div
                                        className="
                    mt-0.5
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
                                            size={15}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p
                                            className="
                      line-clamp-2
                      text-xs
                      font-bold
                      leading-5
                      text-zinc-900
                    "
                                        >
                                            {
                                                result.display_name
                                            }
                                        </p>
                                    </div>
                                </button>
                            )
                        )}
                    </div>
                )}
        </div>
    );
}

export default MapSearch;