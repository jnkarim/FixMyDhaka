import {
  ExternalLink,
  ShieldCheck,
  X,
} from "lucide-react";

function OfficialFormModal({
  authority,
  url,
  onClose,
}) {
  if (!url) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[3000]
        flex
        items-center
        justify-center
        bg-black/60
        p-3
        backdrop-blur-sm
        sm:p-5
      "
    >
      <div
        className="
          flex
          h-[94dvh]
          w-full
          max-w-[1500px]
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-zinc-300
          bg-white
          shadow-2xl
        "
      >
        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            gap-4
            border-b
            border-zinc-200
            bg-white
            px-5
            py-4
            sm:px-6
          "
        >
          <div className="flex min-w-0 items-center gap-3">
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
              <ShieldCheck
                size={19}
              />
            </div>

            <div className="min-w-0">
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <h2
                  className="
                    truncate
                    text-sm
                    font-bold
                    text-zinc-950
                    sm:text-base
                  "
                >
                  {authority} official complaint form
                </h2>

                <span
                  className="
                    hidden
                    rounded-md
                    bg-[#E8FF00]
                    px-2
                    py-1
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-black
                    sm:inline-flex
                  "
                >
                  Official site
                </span>
              </div>

              <p
                className="
                  mt-1
                  truncate
                  text-[10px]
                  text-zinc-400
                  sm:text-xs
                "
              >
                You are viewing the official government form.
              </p>
            </div>
          </div>

          <div
            className="
              flex
              shrink-0
              items-center
              gap-2
            "
          >
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="
                hidden
                items-center
                gap-2
                rounded-lg
                border
                border-zinc-300
                bg-white
                px-4
                py-2.5
                text-xs
                font-semibold
                text-zinc-800
                transition
                hover:bg-zinc-50
                sm:flex
              "
            >
              Open in new tab

              <ExternalLink
                size={14}
              />
            </a>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close official form"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                border-zinc-200
                bg-white
                text-zinc-500
                transition
                hover:bg-zinc-100
                hover:text-black
              "
            >
              <X
                size={18}
              />
            </button>
          </div>
        </div>

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            gap-4
            border-b
            border-yellow-200
            bg-[#FBFFE6]
            px-5
            py-2.5
            text-[11px]
            text-zinc-600
            sm:px-6
          "
        >
          <p>
            Complete and submit this form on the official website.
          </p>

          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="
              shrink-0
              font-semibold
              text-zinc-900
              underline
              underline-offset-2
              sm:hidden
            "
          >
            Open separately
          </a>
        </div>

        <div
          className="
            relative
            min-h-0
            flex-1
            bg-zinc-100
          "
        >
          <iframe
            src={url}
            title={`${authority} official complaint form`}
            className="
              absolute
              inset-0
              h-full
              w-full
              border-0
              bg-white
            "
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <div
          className="
            shrink-0
            border-t
            border-zinc-200
            bg-zinc-50
            px-5
            py-2.5
            text-[10px]
            leading-4
            text-zinc-400
            sm:px-6
          "
        >
          If the official website does not appear above, it is
          blocking embedded pages. Use “Open in new tab” to submit
          directly on the government website.
        </div>
      </div>
    </div>
  );
}

export default OfficialFormModal;