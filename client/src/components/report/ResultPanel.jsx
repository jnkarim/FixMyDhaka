import {
  ArrowLeft,
  Building2,
  Check,
  Clipboard,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  Route,
  ShieldCheck,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  updateReportStatus,
} from "../../services/api";


function ResultPanel({
  result,
  onBack,
}) {
  const [
    copied,
    setCopied,
  ] = useState(false);

  const [
    copyError,
    setCopyError,
  ] = useState("");

  const [
    openingForm,
    setOpeningForm,
  ] = useState(false);

  const [
    submissionStatus,
    setSubmissionStatus,
  ] = useState(
    result.official_submission_status ||
      "Not submitted"
  );

  const [
    updatingStatus,
    setUpdatingStatus,
  ] = useState(false);


  const copyTextToClipboard =
    async (text) => {
      if (!text) {
        return false;
      }

      try {
        if (
          navigator.clipboard &&
          window.isSecureContext
        ) {
          await navigator.clipboard.writeText(
            text
          );

          return true;
        }
      } catch (error) {
        console.error(
          "Clipboard API failed:",
          error
        );
      }

      try {
        const textarea =
          document.createElement(
            "textarea"
          );

        textarea.value =
          text;

        textarea.style.position =
          "fixed";

        textarea.style.left =
          "-9999px";

        textarea.style.top =
          "0";

        textarea.setAttribute(
          "readonly",
          ""
        );

        document.body.appendChild(
          textarea
        );

        textarea.focus();
        textarea.select();

        textarea.setSelectionRange(
          0,
          textarea.value.length
        );

        const successful =
          document.execCommand(
            "copy"
          );

        document.body.removeChild(
          textarea
        );

        return successful;
      } catch (error) {
        console.error(
          "Clipboard fallback failed:",
          error
        );

        return false;
      }
    };


  const showCopiedState =
    () => {
      setCopied(true);
      setCopyError("");

      window.setTimeout(
        () => {
          setCopied(false);
        },
        2500
      );
    };


  const handleCopy =
    async () => {
      setCopyError("");

      const success =
        await copyTextToClipboard(
          result.copyable_complaint
        );

      if (success) {
        showCopiedState();
        return;
      }

      setCopyError(
        "Could not copy automatically. Please copy the prepared complaint manually."
      );
    };


  const handleContinue =
    async () => {
      if (
        !result.reporting_url
      ) {
        return;
      }

      setOpeningForm(true);
      setCopyError("");

      /*
       * Open the tab immediately while the click
       * is still considered a direct user action.
       * This avoids popup blockers.
       */
      const officialWindow =
        window.open(
          "",
          "_blank"
        );

      const success =
        await copyTextToClipboard(
          result.copyable_complaint
        );

      if (!success) {
        if (officialWindow) {
          officialWindow.close();
        }

        setOpeningForm(false);

        setCopyError(
          "The complaint could not be copied. Please use the Copy complaint button first."
        );

        return;
      }

      showCopiedState();

      /*
       * Only go to the government website
       * after the clipboard copy succeeds.
       */
      if (officialWindow) {
        officialWindow.opener =
          null;

        officialWindow.location.href =
          result.reporting_url;
      } else {
        window.location.href =
          result.reporting_url;
      }

      window.setTimeout(
        () => {
          setOpeningForm(false);
        },
        700
      );
    };


  const handleMarkSubmitted =
    async () => {
      if (
        !result.report_id
      ) {
        return;
      }

      try {
        setUpdatingStatus(
          true
        );

        await updateReportStatus(
          result.report_id,
          {
            official_submission_status:
              "Submitted externally",
          }
        );

        setSubmissionStatus(
          "Submitted externally"
        );
      } catch (error) {
        console.error(
          "Status update failed:",
          error
        );
      } finally {
        setUpdatingStatus(
          false
        );
      }
    };


  return (
    <div
      className="
        flex
        h-full
        min-h-0
        flex-col
        bg-white
      "
    >
      <div
        className="
          shrink-0
          border-b
          border-zinc-200
          px-6
          py-6
          lg:px-8
        "
      >
        <button
          type="button"
          onClick={onBack}
          className="
            mb-5
            flex
            items-center
            gap-2
            text-xs
            font-semibold
            text-zinc-500
            transition
            hover:text-black
          "
        >
          <ArrowLeft
            size={15}
          />

          Edit report
        </button>

        {result.report_id && (
          <p
            className="
              mb-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.13em]
              text-zinc-400
            "
          >
            FixMyDhaka report{" "}
            {result.report_id}
          </p>
        )}

        <div
          className="
            mb-4
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-black
            px-3
            py-1.5
            text-[10px]
            font-bold
            uppercase
            tracking-[0.14em]
            text-[#E8FF00]
          "
        >
          <Check
            size={13}
          />

          Authority found
        </div>

        <h2
          className="
            text-2xl
            font-black
            tracking-[-0.035em]
            text-zinc-950
          "
        >
          Your reporting route
        </h2>

        <p
          className="
            mt-2
            max-w-lg
            text-sm
            leading-6
            text-zinc-500
          "
        >
          Copy your prepared complaint
          and continue to the official
          authority website.
        </p>
      </div>


      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overscroll-contain
          px-6
          py-6
          lg:px-8
        "
      >
        <div
          className="
            space-y-5
            pb-12
          "
        >
          <div
            className="
              rounded-xl
              border
              border-[#E8FF00]
              bg-[#FBFFE6]
              p-5
            "
          >
            <div
              className="
                flex
                items-start
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
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
                    font-semibold
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
                    text-2xl
                    font-black
                    text-zinc-950
                  "
                >
                  {result.authority ||
                    "Not verified"}
                </p>

                {result.reporting_method && (
                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-zinc-500
                    "
                  >
                    {
                      result.reporting_method
                    }
                  </p>
                )}
              </div>
            </div>
          </div>


          <div
            className="
              grid
              grid-cols-2
              gap-3
            "
          >
            <InfoCard
              label="Category"
              value={
                result.detected_category
              }
            />

            <InfoCard
              label="Jurisdiction"
              value={
                result.jurisdiction
              }
            />
          </div>


          {result.next_step && (
            <div
              className="
                rounded-xl
                border
                border-zinc-200
                bg-zinc-50
                p-4
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >
                <Route
                  size={17}
                  className="
                    mt-0.5
                    shrink-0
                    text-zinc-500
                  "
                />

                <div>
                  <p
                    className="
                      text-xs
                      font-bold
                      text-zinc-900
                    "
                  >
                    Next step
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-zinc-500
                    "
                  >
                    {
                      result.next_step
                    }
                  </p>
                </div>
              </div>
            </div>
          )}


          {result.authority_evidence && (
            <div>
              <div
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                "
              >
                <FileText
                  size={15}
                  className="text-zinc-500"
                />

                <p
                  className="
                    text-xs
                    font-bold
                    text-zinc-800
                  "
                >
                  Why this authority?
                </p>
              </div>

              <div
                className="
                  max-h-44
                  overflow-y-auto
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
                <p
                  className="
                    mt-2
                    text-[10px]
                    leading-5
                    text-zinc-400
                  "
                >
                  Source:{" "}
                  {
                    result.authority_source
                  }
                </p>
              )}
            </div>
          )}


          {result.copyable_complaint && (
            <div>
              <p
                className="
                  mb-2
                  text-xs
                  font-bold
                  text-zinc-800
                "
              >
                Prepared complaint
              </p>

              <div
                className="
                  max-h-52
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
                  border-zinc-300
                  bg-white
                  px-4
                  py-3
                  text-xs
                  font-bold
                  text-zinc-800
                  transition
                  hover:bg-zinc-50
                "
              >
                {copied ? (
                  <>
                    <Check
                      size={15}
                    />

                    Complaint copied
                  </>
                ) : (
                  <>
                    <Clipboard
                      size={15}
                    />

                    Copy complaint
                  </>
                )}
              </button>
            </div>
          )}


          {copyError && (
            <div
              className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-xs
                leading-5
                text-red-700
              "
            >
              {copyError}
            </div>
          )}


          {(result.reporting_phone ||
            result.reporting_email) && (
            <div
              className="
                divide-y
                divide-zinc-100
                overflow-hidden
                rounded-xl
                border
                border-zinc-200
                bg-white
              "
            >
              {result.reporting_phone && (
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3.5
                    text-xs
                    text-zinc-600
                  "
                >
                  <Phone
                    size={14}
                    className="text-zinc-400"
                  />

                  {
                    result.reporting_phone
                  }
                </div>
              )}

              {result.reporting_email && (
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3.5
                    text-xs
                    text-zinc-600
                  "
                >
                  <Mail
                    size={14}
                    className="text-zinc-400"
                  />

                  {
                    result.reporting_email
                  }
                </div>
              )}
            </div>
          )}


          {result.reporting_url && (
            <div
              className="
                rounded-xl
                border
                border-zinc-200
                bg-white
                p-5
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >
                <ShieldCheck
                  size={19}
                  className="
                    mt-0.5
                    shrink-0
                    text-zinc-700
                  "
                />

                <div>
                  <p
                    className="
                      text-sm
                      font-bold
                      text-zinc-950
                    "
                  >
                    Submit on official website
                  </p>

                  <p
                    className="
                      mt-1
                      text-[11px]
                      leading-5
                      text-zinc-500
                    "
                  >
                    Your prepared complaint
                    will be copied first. Then
                    the official government
                    form will open in a new tab.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  handleContinue
                }
                disabled={
                  openingForm
                }
                className="
                  mt-4
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#E8FF00]
                  px-5
                  py-3.5
                  text-sm
                  font-black
                  text-black
                  transition
                  hover:bg-[#F1FF59]
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {openingForm
                  ? "Preparing complaint..."
                  : `Copy & continue to ${result.authority}`}

                {!openingForm && (
                  <ExternalLink
                    size={16}
                  />
                )}
              </button>

              {copied && (
                <div
                  className="
                    mt-3
                    flex
                    items-start
                    gap-2
                    rounded-xl
                    border
                    border-[#E8FF00]/60
                    bg-[#FBFFE6]
                    px-4
                    py-3
                  "
                >
                  <Check
                    size={15}
                    className="
                      mt-0.5
                      shrink-0
                      text-zinc-800
                    "
                  />

                  <p
                    className="
                      text-[10px]
                      leading-5
                      text-zinc-600
                    "
                  >
                    Complaint copied. On the
                    official form, fill in your
                    Name and Email, then paste
                    the complaint into the
                    Message field.
                  </p>
                </div>
              )}

              {result.report_id &&
                submissionStatus !==
                  "Submitted externally" && (
                  <button
                    type="button"
                    onClick={
                      handleMarkSubmitted
                    }
                    disabled={
                      updatingStatus
                    }
                    className="
                      mt-3
                      w-full
                      rounded-xl
                      border
                      border-zinc-300
                      bg-white
                      px-4
                      py-3
                      text-xs
                      font-bold
                      text-zinc-700
                      transition
                      hover:bg-zinc-50
                      disabled:opacity-50
                    "
                  >
                    {updatingStatus
                      ? "Updating..."
                      : "I submitted this on the official site"}
                  </button>
                )}

              {submissionStatus ===
                "Submitted externally" && (
                <div
                  className="
                    mt-3
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-emerald-50
                    px-4
                    py-3
                    text-xs
                    font-bold
                    text-emerald-700
                  "
                >
                  <Check
                    size={15}
                  />

                  Submitted externally
                </div>
              )}
            </div>
          )}


          <p
            className="
              px-4
              text-center
              text-[10px]
              leading-5
              text-zinc-400
            "
          >
            Final submission happens on
            the authority's official website.
            FixMyDhaka does not submit the
            government complaint on your behalf.
          </p>
        </div>
      </div>
    </div>
  );
}


function InfoCard({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-zinc-200
        bg-zinc-50
        p-4
      "
    >
      <p
        className="
          text-[9px]
          font-bold
          uppercase
          tracking-[0.14em]
          text-zinc-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1.5
          text-xs
          font-semibold
          text-zinc-900
        "
      >
        {value ||
          "Unknown"}
      </p>
    </div>
  );
}


export default ResultPanel;