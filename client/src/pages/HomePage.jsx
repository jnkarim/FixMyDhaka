import {
  FileText,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import MapView from "../components/map/MapView";

import ReportsSidebar from "../components/reports/ReportsSidebar";

import ReportPanel from "../components/report/ReportPanel";
import ResultPanel from "../components/report/ResultPanel";


function HomePage() {
  const [
    desktopSidebarOpen,
    setDesktopSidebarOpen,
  ] = useState(true);

  const [
    mobileReportsOpen,
    setMobileReportsOpen,
  ] = useState(false);

  const [
    mobileReportOpen,
    setMobileReportOpen,
  ] = useState(false);

  const [
    selectedPosition,
    setSelectedPosition,
  ] = useState(null);

  const [
    analysisResult,
    setAnalysisResult,
  ] = useState(null);


  const handleSelectPosition =
    (position) => {
      setSelectedPosition({
        ...position,

        selectionId:
          Date.now(),
      });
    };


  const handleAnalysisSuccess =
    (result) => {
      setAnalysisResult(
        result
      );

      setMobileReportOpen(
        true
      );
    };


  const handleEditReport =
    () => {
      setAnalysisResult(
        null
      );
    };


  const openReportPanel =
    () => {
      setMobileReportOpen(
        true
      );
    };


  return (
    <div
      className="
        flex
        h-dvh
        flex-col
        overflow-hidden
        bg-white
      "
    >
      <Header
        onReportClick={
          openReportPanel
        }
      />


      <main
        className="
          relative
          flex
          min-h-0
          flex-1
          overflow-hidden
        "
      >
        {/* DESKTOP LEFT SIDEBAR */}
        <aside
          className={`
            relative
            z-[700]
            hidden
            h-full
            shrink-0
            overflow-hidden
            border-r
            border-zinc-200
            bg-white
            transition-[width]
            duration-300
            xl:block

            ${
              desktopSidebarOpen
                ? "w-[330px]"
                : "w-0"
            }
          `}
        >
          <div
            className="
              h-full
              w-[330px]
            "
          >
            <ReportsSidebar
              onClose={() =>
                setDesktopSidebarOpen(
                  false
                )
              }
            />
          </div>
        </aside>


        {/* DESKTOP SIDEBAR REOPEN */}
        {!desktopSidebarOpen && (
          <button
            type="button"
            onClick={() =>
              setDesktopSidebarOpen(
                true
              )
            }
            aria-label="Show reports"
            className="
              absolute
              left-4
              top-4
              z-[1000]
              hidden
              h-11
              items-center
              gap-2
              rounded-xl
              bg-black
              px-4
              text-xs
              font-bold
              text-[#E8FF00]
              shadow-xl
              xl:flex
            "
          >
            <FileText
              size={16}
            />

            Reports
          </button>
        )}


        {/* MAP */}
        <section
          className="
            relative
            min-w-0
            flex-1
            overflow-hidden
          "
        >
          <MapView
            sidebarOpen={
              desktopSidebarOpen
            }
            selectedPosition={
              selectedPosition
            }
            onSelectPosition={
              handleSelectPosition
            }
          />


          {/* TABLET / MOBILE REPORTS BUTTON */}
          <button
            type="button"
            onClick={() =>
              setMobileReportsOpen(
                true
              )
            }
            className="
              absolute
              left-3
              top-3
              z-[900]
              flex
              h-11
              items-center
              gap-2
              rounded-xl
              bg-black
              px-4
              text-xs
              font-bold
              text-[#E8FF00]
              shadow-xl
              xl:hidden
            "
          >
            <FileText
              size={16}
            />

            Reports
          </button>


          {/* MOBILE SELECTED LOCATION ACTION */}
          {selectedPosition && (
            <button
              type="button"
              onClick={() =>
                setMobileReportOpen(
                  true
                )
              }
              className="
                absolute
                bottom-4
                left-1/2
                z-[900]
                flex
                -translate-x-1/2
                items-center
                justify-center
                whitespace-nowrap
                rounded-xl
                bg-[#E8FF00]
                px-5
                py-3
                text-xs
                font-black
                text-black
                shadow-2xl
                sm:hidden
              "
            >
              Report this location
            </button>
          )}
        </section>


        {/* DESKTOP RIGHT PANEL */}
        <aside
          className="
            relative
            z-[700]
            hidden
            h-full
            w-[420px]
            shrink-0
            overflow-hidden
            border-l
            border-zinc-200
            bg-white
            xl:block
            2xl:w-[440px]
          "
        >
          {analysisResult ? (
            <ResultPanel
              result={
                analysisResult
              }
              onBack={
                handleEditReport
              }
            />
          ) : (
            <ReportPanel
              selectedPosition={
                selectedPosition
              }
              onSelectPosition={
                handleSelectPosition
              }
              onSuccess={
                handleAnalysisSuccess
              }
            />
          )}
        </aside>


        {/* MOBILE/TABLET REPORTS DRAWER */}
        {mobileReportsOpen && (
          <div
            className="
              fixed
              inset-0
              z-[2500]
              xl:hidden
            "
          >
            <button
              type="button"
              aria-label="Close reports"
              onClick={() =>
                setMobileReportsOpen(
                  false
                )
              }
              className="
                absolute
                inset-0
                bg-black/50
                backdrop-blur-[2px]
              "
            />

            <aside
              className="
                absolute
                bottom-0
                left-0
                top-0
                w-[88vw]
                max-w-[360px]
                overflow-hidden
                bg-white
                shadow-2xl
              "
            >
              <ReportsSidebar
                onClose={() =>
                  setMobileReportsOpen(
                    false
                  )
                }
              />
            </aside>
          </div>
        )}


        {/* MOBILE/TABLET REPORT PANEL DRAWER */}
        {mobileReportOpen && (
          <div
            className="
              fixed
              inset-0
              z-[2600]
              xl:hidden
            "
          >
            <button
              type="button"
              aria-label="Close report panel"
              onClick={() =>
                setMobileReportOpen(
                  false
                )
              }
              className="
                absolute
                inset-0
                bg-black/50
                backdrop-blur-[2px]
              "
            />

            <aside
              className="
                absolute
                bottom-0
                right-0
                top-0
                w-full
                overflow-hidden
                bg-white
                shadow-2xl
                sm:w-[520px]
              "
            >
              <button
                type="button"
                onClick={() =>
                  setMobileReportOpen(
                    false
                  )
                }
                aria-label="Close"
                className="
                  absolute
                  right-3
                  top-3
                  z-[50]
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-zinc-200
                  bg-white
                  text-zinc-500
                  shadow-sm
                  sm:hidden
                "
              >
                <X
                  size={17}
                />
              </button>


              {analysisResult ? (
                <ResultPanel
                  result={
                    analysisResult
                  }
                  onBack={
                    handleEditReport
                  }
                  onClose={() =>
                    setMobileReportOpen(
                      false
                    )
                  }
                />
              ) : (
                <ReportPanel
                  selectedPosition={
                    selectedPosition
                  }
                  onSelectPosition={
                    handleSelectPosition
                  }
                  onSuccess={
                    handleAnalysisSuccess
                  }
                  onClose={() =>
                    setMobileReportOpen(
                      false
                    )
                  }
                />
              )}
            </aside>
          </div>
        )}
      </main>


      <Footer />
    </div>
  );
}


export default HomePage;