import {
  Clock3,
  MapPin,
} from "lucide-react";

function ReportListItem({
  report,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onSelect(report)
      }
      className="
        group
        w-full
        border-b
        border-zinc-100
        bg-white
        px-4
        py-4
        text-left
        transition
        duration-200
        hover:bg-[#FBFFE6]
      "
    >
      <div className="flex items-start gap-3">
        <div
          className="
            mt-1.5
            h-2.5
            w-2.5
            shrink-0
            rounded-full
            bg-[#E8FF00]
            ring-4
            ring-[#E8FF00]/15
          "
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3
              className="
                line-clamp-2
                text-[13px]
                font-bold
                leading-5
                text-zinc-900
                transition
                group-hover:text-black
              "
            >
              {report.title}
            </h3>

            <span
              className="
                shrink-0
                rounded-full
                bg-black
                px-3
                py-1.5
                text-[9px]
                font-black
                uppercase
                tracking-wide
                text-[#E8FF00]
                transition
                group-hover:bg-zinc-800
              "
            >
              {report.status}
            </span>
          </div>

          <div
            className="
              mt-2
              flex
              items-center
              gap-1.5
              text-[11px]
              text-zinc-500
            "
          >
            <MapPin size={12} />

            <span className="truncate">
              {report.location}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span
              className="
                truncate
                rounded-md
                border
                border-zinc-200
                bg-zinc-50
                px-2
                py-1
                text-[10px]
                font-semibold
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
                text-[10px]
                text-zinc-400
              "
            >
              <Clock3 size={11} />

              {report.time}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default ReportListItem;