import {
    ArrowLeft,
    Building2,
    Check,
    Clipboard,
    ExternalLink,
    FileText,
    Mail,
    MapPin,
    Phone,
    X,
} from "lucide-react";

import {
    useState,
} from "react";

function ResultPanel({
    result,
    onBack,
    onClose,
}) {
    const [
        copied,
        setCopied,
    ] = useState(false);

    const handleCopy =
        async () => {
            if (
                !result.copyable_complaint
            ) {
                return;
            }

            try {
                await navigator.clipboard.writeText(
                    result.copyable_complaint
                );

                setCopied(
                    true
                );

                window.setTimeout(
                    () =>
                        setCopied(
                            false
                        ),
                    1800
                );
            } catch {
                setCopied(
                    false
                );
            }
        };

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
                        onClick={
                            onBack
                        }
                        className="
              flex
              items-center
              gap-1.5
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

                        Edit report
                    </button>

                    {onClose && (
                        <button
                            type="button"
                            onClick={
                                onClose
                            }
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
                                size={19}
                            />
                        </button>
                    )}
                </div>

                <div
                    className="
            mb-3
            inline-flex
            items-center
            gap-2
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
                    <Check
                        size={12}
                    />

                    Route found
                </div>

                <h2
                    className="
            text-[27px]
            font-black
            tracking-[-0.04em]
          "
                >
                    Your report route
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Based on jurisdiction and verified
                    civic responsibility information.
                </p>
            </div>

            <div
                className="
          min-h-0
          flex-1
          space-y-5
          overflow-y-auto
          p-6
        "
            >
                <div
                    className="
            rounded-2xl
            border
            border-[#E8FF00]
            bg-[#FBFFE6]
            p-4
          "
                >
                    <div className="flex items-start gap-3">
                        <div
                            className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-black
                text-[#E8FF00]
              "
                        >
                            <Building2
                                size={20}
                            />
                        </div>

                        <div>
                            <p
                                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-zinc-500
                "
                            >
                                Responsible authority
                            </p>

                            <p
                                className="
                  mt-1
                  text-xl
                  font-black
                  tracking-tight
                  text-black
                "
                            >
                                {result.authority ||
                                    "Not verified"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div
                        className="
              rounded-xl
              border
              border-zinc-200
              bg-zinc-50
              p-3
            "
                    >
                        <p
                            className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.14em]
                text-zinc-400
              "
                        >
                            Category
                        </p>

                        <p className="mt-1.5 text-xs font-bold text-zinc-900">
                            {result.detected_category ||
                                "Unknown"}
                        </p>
                    </div>

                    <div
                        className="
              rounded-xl
              border
              border-zinc-200
              bg-zinc-50
              p-3
            "
                    >
                        <p
                            className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.14em]
                text-zinc-400
              "
                        >
                            Jurisdiction
                        </p>

                        <p className="mt-1.5 text-xs font-bold text-zinc-900">
                            {result.jurisdiction ||
                                "Unknown"}
                        </p>
                    </div>
                </div>

                {result.authority_evidence && (
                    <div>
                        <div
                            className="
                mb-2
                flex
                items-center
                gap-2
                text-xs
                font-black
                uppercase
                tracking-wide
                text-zinc-700
              "
                        >
                            <FileText
                                size={15}
                            />

                            Why this authority?
                        </div>

                        <div
                            className="
                rounded-xl
                border
                border-zinc-200
                bg-zinc-50
                p-4
                text-xs
                leading-6
                text-zinc-600
              "
                        >
                            {
                                result.authority_evidence
                            }
                        </div>

                        {result.authority_source && (
                            <p className="mt-2 text-[10px] leading-5 text-zinc-400">
                                Source:{" "}
                                {
                                    result.authority_source
                                }
                            </p>
                        )}
                    </div>
                )}

                {result.next_step && (
                    <div
                        className="
              rounded-xl
              bg-black
              p-4
              text-white
            "
                    >
                        <p
                            className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.16em]
                text-[#E8FF00]
              "
                        >
                            Next step
                        </p>

                        <p className="mt-2 text-sm leading-6 text-zinc-200">
                            {
                                result.next_step
                            }
                        </p>
                    </div>
                )}

                {(result.reporting_phone ||
                    result.reporting_email) && (
                        <div
                            className="
              divide-y
              divide-zinc-100
              rounded-xl
              border
              border-zinc-200
              bg-white
              px-4
            "
                        >
                            {result.reporting_phone && (
                                <div className="flex items-center gap-3 py-3 text-sm text-zinc-700">
                                    <Phone
                                        size={15}
                                        className="text-zinc-400"
                                    />

                                    {
                                        result.reporting_phone
                                    }
                                </div>
                            )}

                            {result.reporting_email && (
                                <div className="flex items-center gap-3 py-3 text-sm text-zinc-700">
                                    <Mail
                                        size={15}
                                        className="text-zinc-400"
                                    />

                                    {
                                        result.reporting_email
                                    }
                                </div>
                            )}
                        </div>
                    )}

                {result.copyable_complaint && (
                    <div>
                        <p
                            className="
                mb-2
                text-xs
                font-black
                uppercase
                tracking-wide
                text-zinc-700
              "
                        >
                            Ready-to-copy complaint
                        </p>

                        <div
                            className="
                max-h-48
                overflow-y-auto
                whitespace-pre-wrap
                rounded-xl
                border
                border-zinc-200
                bg-zinc-50
                p-4
                text-xs
                leading-6
                text-zinc-600
              "
                        >
                            {
                                result.copyable_complaint
                            }
                        </div>

                        <button
                            type="button"
                            onClick={
                                handleCopy
                            }
                            className="
                mt-3
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-black
                bg-white
                px-4
                py-3
                text-sm
                font-bold
                text-black
                transition
                hover:bg-zinc-50
              "
                        >
                            {copied ? (
                                <>
                                    <Check
                                        size={16}
                                    />

                                    Copied
                                </>
                            ) : (
                                <>
                                    <Clipboard
                                        size={16}
                                    />

                                    Copy complaint
                                </>
                            )}
                        </button>
                    </div>
                )}

                {result.reporting_url && (
                    <a
                        href={
                            result.reporting_url
                        }
                        target="_blank"
                        rel="noreferrer"
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
              shadow-[0_10px_25px_rgba(232,255,0,0.2)]
              transition
              hover:bg-[#F1FF59]
            "
                    >
                        Open official reporting site

                        <ExternalLink
                            size={16}
                        />
                    </a>
                )}

                {!result.location_valid && (
                    <div
                        className="
              flex
              gap-3
              rounded-xl
              border
              border-[#E8FF00]
              bg-[#FBFFE6]
              p-4
              text-sm
              text-zinc-800
            "
                    >
                        <MapPin
                            size={18}
                            className="shrink-0"
                        />

                        {
                            result.clarification_question
                        }
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResultPanel;