import {
  ChevronLeft,
  Clock3,
  LoaderCircle,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getReports,
} from "../../services/api";


function ReportsSidebar({
  onClose,
}) {
  const [
    reports,
    setReports,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("Open");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("All");


  useEffect(() => {
    const loadReports =
      async () => {
        try {
          setLoading(true);

          const data =
            await getReports();

          setReports(data);
        } catch {
          setReports([]);
        } finally {
          setLoading(false);
        }
      };

    loadReports();
  }, []);


  const categories =
    useMemo(() => {
      return [
        ...new Set(
          reports
            .map(
              (report) =>
                report.category
            )
            .filter(Boolean)
        ),
      ];
    }, [reports]);


  const filteredReports =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      return reports.filter(
        (report) => {
          const matchesSearch =
            !query ||
            report.title
              ?.toLowerCase()
              .includes(query) ||
            report.location
              ?.toLowerCase()
              .includes(query) ||
            report.category
              ?.toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter ===
            "All" ||
            report.status ===
            statusFilter;

          const matchesCategory =
            categoryFilter ===
            "All" ||
            report.category ===
            categoryFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesCategory
          );
        }
      );
    }, [
      reports,
      searchQuery,
      statusFilter,
      categoryFilter,
    ]);


  return (
    <div
      className="
        flex
        h-full
        min-h-0
        w-full
        flex-col
        bg-white
      "
    >
      <div
        className="
          flex
          shrink-0
          items-center
          justify-between
          bg-[#E8FF00]
          px-4
          py-4
          sm:px-5
        "
      >
        <div>
          <p
            className="
              text-sm
              font-black
              text-black
              sm:text-base
            "
          >
            Click map to report
          </p>

          <p
            className="
              mt-1
              text-[10px]
              font-medium
              text-black/50
            "
          >
            Select a location on the map
          </p>
        </div>

        <button
          type="button"
          onClick={
            onClose
          }
          aria-label="Close reports sidebar"
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-black
            text-[#E8FF00]
          "
        >
          <ChevronLeft
            size={21}
            className="
              hidden
              xl:block
            "
          />

          <X
            size={19}
            className="
              xl:hidden
            "
          />
        </button>
      </div>


      <div
        className="
          shrink-0
          border-b
          border-zinc-200
          p-4
          sm:p-5
        "
      >
        <div className="relative">
          <Search
            size={16}
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-zinc-400
            "
          />

          <input
            type="search"
            value={
              searchQuery
            }
            onChange={(
              event
            ) =>
              setSearchQuery(
                event.target.value
              )
            }
            placeholder="Search reports"
            className="
              h-12
              w-full
              rounded-xl
              border
              border-zinc-200
              bg-zinc-50
              pl-11
              pr-4
              text-sm
              outline-none
              placeholder:text-zinc-400
              focus:border-black
              focus:bg-white
              focus:ring-4
              focus:ring-[#E8FF00]/20
            "
          />
        </div>


        <div
          className="
            mt-4
            flex
            items-center
            gap-2
          "
        >
          <SlidersHorizontal
            size={14}
            className="text-zinc-400"
          />

          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-zinc-400
            "
          >
            Filters
          </p>
        </div>


        <div
          className="
            mt-3
            grid
            grid-cols-2
            gap-2
          "
        >
          <select
            value={
              statusFilter
            }
            onChange={(
              event
            ) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="
              h-11
              min-w-0
              rounded-xl
              border
              border-zinc-200
              bg-white
              px-3
              text-xs
              outline-none
            "
          >
            <option value="All">
              All reports
            </option>

            <option value="Open">
              Open reports
            </option>

            <option value="Resolved">
              Resolved
            </option>
          </select>


          <select
            value={
              categoryFilter
            }
            onChange={(
              event
            ) =>
              setCategoryFilter(
                event.target.value
              )
            }
            className="
              h-11
              min-w-0
              rounded-xl
              border
              border-zinc-200
              bg-white
              px-3
              text-xs
              outline-none
            "
          >
            <option value="All">
              All categories
            </option>

            {categories.map(
              (category) => (
                <option
                  key={
                    category
                  }
                  value={
                    category
                  }
                >
                  {category}
                </option>
              )
            )}
          </select>
        </div>
      </div>


      <div
        className="
          flex
          shrink-0
          items-center
          justify-between
          border-b
          border-zinc-200
          bg-zinc-50
          px-4
          py-4
          sm:px-5
        "
      >
        <div>
          <p
            className="
              text-xs
              font-black
              text-zinc-900
            "
          >
            Recent reports
          </p>

          <p
            className="
              mt-1
              text-[10px]
              text-zinc-400
            "
          >
            Latest issues around Dhaka
          </p>
        </div>

        <div
          className="
            flex
            h-8
            min-w-8
            items-center
            justify-center
            rounded-full
            bg-black
            px-2
            text-[10px]
            font-black
            text-[#E8FF00]
          "
        >
          {
            filteredReports.length
          }
        </div>
      </div>


      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
        "
      >
        {loading ? (
          <div
            className="
              flex
              h-40
              items-center
              justify-center
            "
          >
            <LoaderCircle
              size={20}
              className="
                animate-spin
                text-zinc-400
              "
            />
          </div>
        ) : filteredReports.length >
          0 ? (
          filteredReports.map(
            (report) => (
              <article
                key={
                  report.id
                }
                className="
                  border-b
                  border-zinc-100
                  px-4
                  py-4
                  transition
                  hover:bg-[#FBFFE6]
                  sm:px-5
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <span
                    className="
                      mt-1
                      h-2.5
                      w-2.5
                      shrink-0
                      rounded-full
                      bg-[#E8FF00]
                      ring-4
                      ring-[#E8FF00]/20
                    "
                  />

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >
                      <p
                        className="
                          text-sm
                          font-black
                          leading-5
                          text-zinc-900
                        "
                      >
                        {report.title}
                      </p>

                      <span
                        className="
                          shrink-0
                          rounded-full
                          bg-black
                          px-2.5
                          py-1
                          text-[8px]
                          font-black
                          uppercase
                          text-[#E8FF00]
                        "
                      >
                        {report.status}
                      </span>
                    </div>


                    <div
                      className="
                        mt-3
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-zinc-500
                      "
                    >
                      <MapPin
                        size={13}
                      />

                      <span
                        className="
                          truncate
                        "
                      >
                        {report.location}
                      </span>
                    </div>


                    <div
                      className="
                        mt-4
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <span
                        className="
                          max-w-[150px]
                          truncate
                          rounded-lg
                          border
                          border-zinc-200
                          px-2.5
                          py-1.5
                          text-[9px]
                          text-zinc-600
                        "
                      >
                        {report.category}
                      </span>

                      <span
                        className="
                          flex
                          shrink-0
                          items-center
                          gap-1
                          text-[9px]
                          text-zinc-400
                        "
                      >
                        <Clock3
                          size={11}
                        />

                        {report.time}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            )
          )
        ) : (
          <div
            className="
              flex
              h-40
              items-center
              justify-center
              px-8
              text-center
              text-xs
              leading-5
              text-zinc-400
            "
          >
            No reports match your
            filters.
          </div>
        )}
      </div>
    </div>
  );
}


export default ReportsSidebar;