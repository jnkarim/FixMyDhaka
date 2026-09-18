import {
  ChevronLeft,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import demoReports from "../../data/demoReports";
import ReportListItem from "./ReportListItem";

function ReportsSidebar({
  isOpen,
  onToggle,
  onSelectReport,
}) {
  return (
    <aside
      className={`
        hidden
        min-h-0
        shrink-0
        overflow-hidden
        bg-white
        transition-[width,opacity,border]
        duration-300
        ease-in-out
        lg:flex
        lg:flex-col

        ${
          isOpen
            ? "w-[320px] border-r border-zinc-200 opacity-100"
            : "w-0 border-r-0 opacity-0"
        }
      `}
    >
      <div
        className="
          flex
          h-full
          w-[320px]
          min-w-[320px]
          flex-col
        "
      >
        <div
          className="
            flex
            h-[74px]
            shrink-0
            items-center
            justify-between
            bg-[#E8FF00]
            px-5
            text-sm
            font-black
            text-black
          "
        >
          <span>
            Click map to report
          </span>

          <button
            type="button"
            onClick={onToggle}
            title="Close reports sidebar"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-black
              text-[#E8FF00]
              transition
              hover:scale-105
              hover:bg-zinc-900
              active:scale-95
            "
          >
            <ChevronLeft
              size={20}
            />
          </button>
        </div>

        <div className="border-b border-zinc-200 bg-white p-5">
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
              placeholder="Search reports"
              className="
                w-full
                rounded-xl
                border
                border-zinc-200
                bg-zinc-50
                py-3
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
                focus:ring-[#E8FF00]/25
              "
            />
          </div>

          <div
            className="
              mt-5
              flex
              items-center
              gap-2
              text-[10px]
              font-extrabold
              uppercase
              tracking-[0.16em]
              text-zinc-400
            "
          >
            <SlidersHorizontal
              size={14}
            />

            Filters
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <select
              className="
                rounded-xl
                border
                border-zinc-200
                bg-white
                px-3
                py-3
                text-xs
                font-medium
                text-zinc-700
                outline-none
                focus:border-black
              "
            >
              <option>
                Open reports
              </option>

              <option>
                Fixed
              </option>

              <option>
                Everything
              </option>
            </select>

            <select
              className="
                rounded-xl
                border
                border-zinc-200
                bg-white
                px-3
                py-3
                text-xs
                font-medium
                text-zinc-700
                outline-none
                focus:border-black
              "
            >
              <option>
                All categories
              </option>

              <option>
                Road / Pothole
              </option>

              <option>
                Garbage
              </option>

              <option>
                Streetlight
              </option>

              <option>
                Waterlogging
              </option>
            </select>
          </div>
        </div>

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-zinc-100
            bg-zinc-50
            px-5
            py-4
          "
        >
          <div>
            <p className="text-xs font-bold text-zinc-800">
              Recent reports
            </p>

            <p className="mt-1 text-[10px] text-zinc-400">
              Latest issues around Dhaka
            </p>
          </div>

          <span
            className="
              rounded-full
              bg-black
              px-3
              py-1.5
              text-[10px]
              font-bold
              text-[#E8FF00]
            "
          >
            {demoReports.length}
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {demoReports.map(
            (report) => (
              <ReportListItem
                key={report.id}
                report={report}
                onSelect={
                  onSelectReport
                }
              />
            )
          )}
        </div>
      </div>
    </aside>
  );
}

export default ReportsSidebar;