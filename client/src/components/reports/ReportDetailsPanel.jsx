import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Hash,
  MapPin,
  Navigation,
  Tag,
  X,
} from "lucide-react";

function ReportDetailsPanel({
  report,
  onBack,
  onClose,
}) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div
        className="
          border-b
          border-zinc-200
          bg-black
          px-6
          py-5
          text-white
        "
      >
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="
              flex
              items-center
              gap-2
              text-xs
              font-bold
              text-zinc-400
              transition
              hover:text-white
            "
          >
            <ArrowLeft
              size={16}
            />

            Back
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-lg
                p-2
                text-zinc-500
                transition
                hover:bg-white/10
                hover:text-white
                xl:hidden
              "
            >
              <X
                size={18}
              />
            </button>
          )}
        </div>

        <div
          className="
            mb-4
            inline-flex
            rounded-full
            bg-[#E8FF00]
            px-3
            py-1.5
            text-[10px]
            font-black
            uppercase
            tracking-[0.14em]
            text-black
          "
        >
          {report.status}
        </div>

        <h2
          className="
            text-[25px]
            font-black
            leading-[1.15]
            tracking-[-0.035em]
          "
        >
          {report.title}
        </h2>

        <div
          className="
            mt-4
            flex
            items-center
            gap-2
            text-sm
            text-zinc-400
          "
        >
          <MapPin
            size={15}
          />

          {report.location}
        </div>
      </div>

      <div
        className="
          min-h-0
          flex-1
          space-y-6
          overflow-y-auto
          p-6
        "
      >
        <section>
          <p
            className="
              mb-2
              text-[10px]
              font-black
              uppercase
              tracking-[0.16em]
              text-zinc-400
            "
          >
            Description
          </p>

          <p
            className="
              text-sm
              leading-7
              text-zinc-700
            "
          >
            {report.description}
          </p>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <div
            className="
              rounded-xl
              border
              border-zinc-200
              bg-zinc-50
              p-4
            "
          >
            <Tag
              size={16}
              className="text-zinc-400"
            />

            <p
              className="
                mt-3
                text-[9px]
                font-black
                uppercase
                tracking-[0.14em]
                text-zinc-400
              "
            >
              Category
            </p>

            <p
              className="
                mt-1
                text-xs
                font-bold
                text-zinc-900
              "
            >
              {report.category}
            </p>
          </div>

          <div
            className="
              rounded-xl
              border
              border-zinc-200
              bg-zinc-50
              p-4
            "
          >
            <Building2
              size={16}
              className="text-zinc-400"
            />

            <p
              className="
                mt-3
                text-[9px]
                font-black
                uppercase
                tracking-[0.14em]
                text-zinc-400
              "
            >
              Authority
            </p>

            <p
              className="
                mt-1
                text-xs
                font-bold
                text-zinc-900
              "
            >
              {report.authority}
            </p>
          </div>
        </div>

        <div
          className="
            divide-y
            divide-zinc-100
            rounded-xl
            border
            border-zinc-200
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              px-4
              py-4
            "
          >
            <Hash
              size={16}
              className="text-zinc-400"
            />

            <div>
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-zinc-400
                "
              >
                Report ID
              </p>

              <p className="mt-1 text-xs font-bold text-zinc-800">
                {report.reportId}
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
              px-4
              py-4
            "
          >
            <CalendarDays
              size={16}
              className="text-zinc-400"
            />

            <div>
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-zinc-400
                "
              >
                Reported
              </p>

              <p className="mt-1 text-xs font-bold text-zinc-800">
                {report.reportedAt}
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
              px-4
              py-4
            "
          >
            <Navigation
              size={16}
              className="text-zinc-400"
            />

            <div>
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-zinc-400
                "
              >
                Coordinates
              </p>

              <p className="mt-1 text-xs font-bold text-zinc-800">
                {report.lat}, {report.lng}
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            rounded-xl
            border
            border-[#E8FF00]
            bg-[#FBFFE6]
            p-4
          "
        >
          <p
            className="
              text-[9px]
              font-black
              uppercase
              tracking-[0.15em]
              text-zinc-500
            "
          >
            Current status
          </p>

          <div className="mt-2 flex items-center gap-2">
            <div
              className="
                h-2.5
                w-2.5
                rounded-full
                bg-[#E8FF00]
                ring-4
                ring-[#E8FF00]/20
              "
            />

            <p className="text-sm font-black text-black">
              {report.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportDetailsPanel;