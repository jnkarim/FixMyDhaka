import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock3,
  FileText,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Header from "../components/layout/Header";

import {
  getReports,
} from "../services/api";


function ReportsPage() {
  const [
    reports,
    setReports,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("All");

  const [
    sortOrder,
    setSortOrder,
  ] = useState("Newest");


  useEffect(() => {
    const loadReports =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getReports();

          setReports(data);
        } catch (err) {
          setError(
            err.message ||
              "Unable to load reports."
          );
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

      let result =
        reports.filter(
          (report) => {
            const matchesSearch =
              !query ||
              report.title
                ?.toLowerCase()
                .includes(query) ||
              report.description
                ?.toLowerCase()
                .includes(query) ||
              report.location
                ?.toLowerCase()
                .includes(query) ||
              report.category
                ?.toLowerCase()
                .includes(query) ||
              report.authority
                ?.toLowerCase()
                .includes(query) ||
              report.reportId
                ?.toLowerCase()
                .includes(query);

            const matchesStatus =
              statusFilter === "All" ||
              report.status ===
                statusFilter;

            const matchesCategory =
              categoryFilter === "All" ||
              report.category ===
                categoryFilter;

            return (
              matchesSearch &&
              matchesStatus &&
              matchesCategory
            );
          }
        );

      result = [...result];

      if (
        sortOrder === "Oldest"
      ) {
        result.reverse();
      }

      return result;
    }, [
      reports,
      searchQuery,
      statusFilter,
      categoryFilter,
      sortOrder,
    ]);


  const openReports =
    reports.filter(
      (report) =>
        report.status === "Open"
    ).length;


  const resolvedReports =
    reports.filter(
      (report) =>
        report.status ===
        "Resolved"
    ).length;


  const authorityCount =
    new Set(
      reports
        .map(
          (report) =>
            report.authority
        )
        .filter(Boolean)
    ).size;


  const hasFilters =
    searchQuery ||
    statusFilter !== "All" ||
    categoryFilter !== "All" ||
    sortOrder !== "Newest";


  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setSortOrder("Newest");
  };


  return (
    <div
      className="
        min-h-dvh
        bg-[#F7F7F4]
        text-zinc-950
      "
    >
      <Header />

      <main
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-5
          pb-16
          pt-8
          sm:px-7
          lg:px-10
        "
      >
        {/* PAGE HEADER */}
        <section
          className="
            flex
            flex-col
            gap-6
            border-b
            border-zinc-200
            pb-7
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div>
            <div
              className="
                mb-3
                flex
                items-center
                gap-2
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-zinc-400
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-[#E8FF00]
                  ring-4
                  ring-[#E8FF00]/20
                "
              />

              Public civic registry
            </div>

            <h1
              className="
                text-4xl
                font-black
                tracking-[-0.05em]
                text-black
                sm:text-5xl
              "
            >
              All reports
            </h1>

            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-6
                text-zinc-500
              "
            >
              Explore civic issues reported
              through FixMyDhaka and see where
              they happened, who is responsible,
              and their current reporting status.
            </p>
          </div>

          <Link
            to="/report"
            className="
              inline-flex
              h-12
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#E8FF00]
              px-5
              text-sm
              font-black
              text-black
              transition
              hover:bg-[#F1FF59]
              active:scale-[0.98]
            "
          >
            <Plus
              size={17}
            />

            Report a problem
          </Link>
        </section>


        {/* STAT STRIP */}
        <section
          className="
            grid
            grid-cols-2
            gap-3
            py-6
            lg:grid-cols-4
          "
        >
          <StatCard
            label="Total reports"
            value={reports.length}
            icon={FileText}
          />

          <StatCard
            label="Open issues"
            value={openReports}
            icon={CircleDot}
            accent
          />

          <StatCard
            label="Resolved"
            value={resolvedReports}
            icon={CheckCircle2}
          />

          <StatCard
            label="Authorities"
            value={authorityCount}
            icon={Building2}
          />
        </section>


        {/* FILTER BAR */}
        <section
          className="
            rounded-2xl
            border
            border-zinc-200
            bg-white
            p-4
            shadow-[0_4px_18px_rgba(0,0,0,0.025)]
          "
        >
          <div
            className="
              mb-3
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <SlidersHorizontal
                size={15}
                className="text-zinc-400"
              />

              <p
                className="
                  text-xs
                  font-bold
                  text-zinc-700
                "
              >
                Find reports
              </p>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="
                  text-xs
                  font-semibold
                  text-zinc-400
                  transition
                  hover:text-black
                "
              >
                Reset
              </button>
            )}
          </div>

          <div
            className="
              grid
              gap-2
              lg:grid-cols-[minmax(320px,1fr)_180px_220px_170px]
            "
          >
            <div className="relative">
              <Search
                size={17}
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
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search report, area, category or authority"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-zinc-200
                  bg-[#FAFAF8]
                  pl-11
                  pr-4
                  text-sm
                  text-zinc-900
                  outline-none
                  transition
                  placeholder:text-zinc-400
                  focus:border-black
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#E8FF00]/15
                "
              />
            </div>


            <FilterSelect
              value={statusFilter}
              onChange={
                setStatusFilter
              }
            >
              <option value="All">
                All statuses
              </option>

              <option value="Open">
                Open
              </option>

              <option value="Resolved">
                Resolved
              </option>
            </FilterSelect>


            <FilterSelect
              value={categoryFilter}
              onChange={
                setCategoryFilter
              }
            >
              <option value="All">
                All categories
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}
            </FilterSelect>


            <FilterSelect
              value={sortOrder}
              onChange={
                setSortOrder
              }
            >
              <option value="Newest">
                Newest first
              </option>

              <option value="Oldest">
                Oldest first
              </option>
            </FilterSelect>
          </div>
        </section>


        {/* REGISTRY HEADER */}
        <section
          className="
            mt-8
            mb-3
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.15em]
                text-zinc-400
              "
            >
              Report registry
            </p>

            {!loading &&
              !error && (
                <h2
                  className="
                    mt-1
                    text-lg
                    font-black
                    tracking-[-0.025em]
                    text-zinc-900
                  "
                >
                  {
                    filteredReports.length
                  }{" "}
                  {filteredReports.length ===
                  1
                    ? "report"
                    : "reports"}
                </h2>
              )}
          </div>

          {!loading &&
            !error && (
              <p
                className="
                  hidden
                  text-xs
                  text-zinc-400
                  sm:block
                "
              >
                {
                  filteredReports.length
                }{" "}
                of {reports.length} visible
              </p>
            )}
        </section>


        {/* LOADING */}
        {loading && (
          <LoadingTable />
        )}


        {/* ERROR */}
        {error && (
          <div
            className="
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-5
            "
          >
            <AlertCircle
              size={19}
              className="
                mt-0.5
                shrink-0
                text-red-500
              "
            />

            <div>
              <p
                className="
                  text-sm
                  font-bold
                  text-red-700
                "
              >
                Could not load reports
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-red-600
                "
              >
                {error}
              </p>
            </div>
          </div>
        )}


        {/* DESKTOP REGISTRY */}
        {!loading &&
          !error &&
          filteredReports.length >
            0 && (
            <>
              <div
                className="
                  hidden
                  overflow-hidden
                  rounded-2xl
                  border
                  border-zinc-200
                  bg-white
                  shadow-[0_4px_18px_rgba(0,0,0,0.025)]
                  lg:block
                "
              >
                <div
                  className="
                    grid
                    grid-cols-[minmax(300px,1.5fr)_190px_180px_140px_130px_180px]
                    gap-4
                    border-b
                    border-zinc-200
                    bg-[#FAFAF8]
                    px-5
                    py-3.5
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-zinc-400
                  "
                >
                  <span>
                    Report
                  </span>

                  <span>
                    Location
                  </span>

                  <span>
                    Category
                  </span>

                  <span>
                    Authority
                  </span>

                  <span>
                    Status
                  </span>

                  <span>
                    Official submission
                  </span>
                </div>

                {filteredReports.map(
                  (report) => (
                    <ReportRow
                      key={report.id}
                      report={report}
                    />
                  )
                )}
              </div>


              {/* MOBILE */}
              <div
                className="
                  grid
                  gap-3
                  lg:hidden
                "
              >
                {filteredReports.map(
                  (report) => (
                    <MobileReportCard
                      key={report.id}
                      report={report}
                    />
                  )
                )}
              </div>
            </>
          )}


        {/* EMPTY */}
        {!loading &&
          !error &&
          filteredReports.length ===
            0 && (
            <div
              className="
                flex
                min-h-[320px]
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-dashed
                border-zinc-300
                bg-white
                px-6
                text-center
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-zinc-100
                  text-zinc-400
                "
              >
                <Search
                  size={20}
                />
              </div>

              <h3
                className="
                  mt-4
                  text-sm
                  font-black
                  text-zinc-900
                "
              >
                No matching reports
              </h3>

              <p
                className="
                  mt-1
                  max-w-xs
                  text-xs
                  leading-5
                  text-zinc-400
                "
              >
                Try changing your search
                query or filters.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="
                    mt-5
                    rounded-lg
                    bg-black
                    px-4
                    py-2.5
                    text-xs
                    font-bold
                    text-[#E8FF00]
                  "
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
      </main>
    </div>
  );
}


function ReportRow({
  report,
}) {
  const isResolved =
    report.status ===
    "Resolved";

  const submitted =
    report.officialSubmissionStatus ===
    "Submitted externally";

  return (
    <article
      className="
        grid
        grid-cols-[minmax(300px,1.5fr)_190px_180px_140px_130px_180px]
        items-center
        gap-4
        border-b
        border-zinc-100
        px-5
        py-5
        transition
        last:border-b-0
        hover:bg-[#FCFCF8]
      "
    >
      {/* REPORT */}
      <div
        className="
          flex
          min-w-0
          items-start
          gap-3
        "
      >
        <span
          className="
            mt-1.5
            h-2.5
            w-2.5
            shrink-0
            rounded-full
            bg-[#E8FF00]
            ring-4
            ring-[#E8FF00]/20
          "
        />

        <div className="min-w-0">
          <p
            className="
              truncate
              text-sm
              font-bold
              text-zinc-900
            "
          >
            {report.title ||
              "Untitled report"}
          </p>

          <div
            className="
              mt-1.5
              flex
              items-center
              gap-2
              text-[10px]
              text-zinc-400
            "
          >
            <span
              className="
                font-semibold
                text-zinc-500
              "
            >
              {report.reportId ||
                "Civic report"}
            </span>

            <span>
              •
            </span>

            <span
              className="
                flex
                items-center
                gap-1
              "
            >
              <Clock3
                size={11}
              />

              {report.time ||
                "Recently"}
            </span>
          </div>
        </div>
      </div>


      {/* LOCATION */}
      <div
        className="
          flex
          min-w-0
          items-center
          gap-2
        "
      >
        <MapPin
          size={14}
          className="
            shrink-0
            text-zinc-400
          "
        />

        <span
          className="
            truncate
            text-xs
            text-zinc-600
          "
        >
          {report.location ||
            "Unknown"}
        </span>
      </div>


      {/* CATEGORY */}
      <span
        className="
          w-fit
          max-w-full
          truncate
          rounded-lg
          border
          border-zinc-200
          bg-white
          px-2.5
          py-1.5
          text-[10px]
          font-semibold
          text-zinc-600
        "
      >
        {report.category ||
          "Uncategorized"}
      </span>


      {/* AUTHORITY */}
      <div
        className="
          flex
          min-w-0
          items-center
          gap-2
        "
      >
        <Building2
          size={14}
          className="
            shrink-0
            text-zinc-400
          "
        />

        <span
          className="
            truncate
            text-xs
            font-bold
            text-zinc-700
          "
        >
          {report.authority ||
            "Pending"}
        </span>
      </div>


      {/* STATUS */}
      <StatusBadge
        status={
          report.status ||
          "Open"
        }
        resolved={
          isResolved
        }
      />


      {/* SUBMISSION */}
      <SubmissionBadge
        submitted={
          submitted
        }
      />
    </article>
  );
}


function MobileReportCard({
  report,
}) {
  const isResolved =
    report.status ===
    "Resolved";

  const submitted =
    report.officialSubmissionStatus ===
    "Submitted externally";

  return (
    <article
      className="
        rounded-2xl
        border
        border-zinc-200
        bg-white
        p-5
        shadow-[0_4px_18px_rgba(0,0,0,0.025)]
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
        <div className="min-w-0">
          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-zinc-400
            "
          >
            {report.reportId ||
              "Civic report"}
          </p>

          <h3
            className="
              mt-2
              text-base
              font-black
              leading-6
              text-zinc-900
            "
          >
            {report.title ||
              "Untitled report"}
          </h3>
        </div>

        <StatusBadge
          status={
            report.status ||
            "Open"
          }
          resolved={
            isResolved
          }
        />
      </div>


      <div
        className="
          mt-4
          flex
          items-center
          gap-2
          text-xs
          text-zinc-500
        "
      >
        <MapPin
          size={14}
        />

        {report.location ||
          "Unknown"}
      </div>


      <div
        className="
          mt-4
          grid
          grid-cols-2
          gap-2
        "
      >
        <InfoBox
          label="Category"
          value={
            report.category ||
            "Uncategorized"
          }
        />

        <InfoBox
          label="Authority"
          value={
            report.authority ||
            "Pending"
          }
        />
      </div>


      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          gap-3
          border-t
          border-zinc-100
          pt-4
        "
      >
        <span
          className="
            flex
            items-center
            gap-1.5
            text-[10px]
            text-zinc-400
          "
        >
          <Clock3
            size={11}
          />

          {report.time ||
            "Recently"}
        </span>

        <SubmissionBadge
          submitted={
            submitted
          }
        />
      </div>
    </article>
  );
}


function InfoBox({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-xl
        bg-[#F7F7F4]
        p-3
      "
    >
      <p
        className="
          text-[9px]
          font-bold
          uppercase
          tracking-[0.12em]
          text-zinc-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          truncate
          text-xs
          font-semibold
          text-zinc-700
        "
      >
        {value}
      </p>
    </div>
  );
}


function StatusBadge({
  status,
  resolved,
}) {
  return (
    <span
      className={`
        inline-flex
        w-fit
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1.5
        text-[9px]
        font-black
        uppercase
        tracking-[0.08em]

        ${
          resolved
            ? `
                bg-emerald-50
                text-emerald-700
              `
            : `
                bg-black
                text-[#E8FF00]
              `
        }
      `}
    >
      <span
        className={`
          h-1.5
          w-1.5
          rounded-full

          ${
            resolved
              ? "bg-emerald-500"
              : "bg-[#E8FF00]"
          }
        `}
      />

      {status}
    </span>
  );
}


function SubmissionBadge({
  submitted,
}) {
  return (
    <span
      className={`
        inline-flex
        w-fit
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1.5
        text-[9px]
        font-bold

        ${
          submitted
            ? `
                bg-emerald-50
                text-emerald-700
              `
            : `
                bg-zinc-100
                text-zinc-500
              `
        }
      `}
    >
      {submitted && (
        <CheckCircle2
          size={11}
        />
      )}

      {submitted
        ? "Submitted externally"
        : "Not submitted"}
    </span>
  );
}


function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
}) {
  return (
    <div
      className={`
        rounded-2xl
        border
        p-5

        ${
          accent
            ? `
                border-[#E8FF00]
                bg-[#E8FF00]
              `
            : `
                border-zinc-200
                bg-white
              `
        }
      `}
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
          <p
            className={`
              text-[9px]
              font-bold
              uppercase
              tracking-[0.14em]

              ${
                accent
                  ? "text-black/50"
                  : "text-zinc-400"
              }
            `}
          >
            {label}
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-black
              tracking-[-0.05em]
              text-black
            "
          >
            {value}
          </p>
        </div>

        <div
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl

            ${
              accent
                ? `
                    bg-black
                    text-[#E8FF00]
                  `
                : `
                    bg-zinc-100
                    text-zinc-500
                  `
            }
          `}
        >
          <Icon
            size={18}
          />
        </div>
      </div>
    </div>
  );
}


function FilterSelect({
  value,
  onChange,
  children,
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          h-12
          w-full
          appearance-none
          rounded-xl
          border
          border-zinc-200
          bg-[#FAFAF8]
          px-4
          pr-10
          text-sm
          text-zinc-700
          outline-none
          transition
          focus:border-black
          focus:bg-white
          focus:ring-4
          focus:ring-[#E8FF00]/15
        "
      >
        {children}
      </select>

      <ChevronDown
        size={15}
        className="
          pointer-events-none
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-zinc-400
        "
      />
    </div>
  );
}


function LoadingTable() {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-zinc-200
        bg-white
      "
    >
      {[1, 2, 3, 4].map(
        (item) => (
          <div
            key={item}
            className="
              flex
              animate-pulse
              items-center
              gap-4
              border-b
              border-zinc-100
              px-5
              py-6
              last:border-b-0
            "
          >
            <div
              className="
                h-3
                w-3
                rounded-full
                bg-zinc-200
              "
            />

            <div className="flex-1">
              <div
                className="
                  h-3
                  w-[32%]
                  rounded
                  bg-zinc-200
                "
              />

              <div
                className="
                  mt-2
                  h-2.5
                  w-[18%]
                  rounded
                  bg-zinc-100
                "
              />
            </div>
          </div>
        )
      )}
    </div>
  );
}


export default ReportsPage;