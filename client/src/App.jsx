import { useState } from "react";
import {
  PanelLeftOpen,
} from "lucide-react";

import Header from "./components/layout/Header";
import MapView from "./components/map/MapView";

import ReportsSidebar from "./components/reports/ReportsSidebar";
import ReportDetailsPanel from "./components/reports/ReportDetailsPanel";

import ReportPanel from "./components/report/ReportPanel";
import ResultPanel from "./components/report/ResultPanel";

function App() {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(true);

  const [
    selectedPosition,
    setSelectedPosition,
  ] = useState(null);

  const [
    selectedReport,
    setSelectedReport,
  ] = useState(null);

  const [
    analysisResult,
    setAnalysisResult,
  ] = useState(null);

  const [
    mobilePanelOpen,
    setMobilePanelOpen,
  ] = useState(false);

  const handleMapSelect = (
    position
  ) => {
    setSelectedPosition(
      position
    );

    setSelectedReport(
      null
    );

    setAnalysisResult(
      null
    );
  };

  const handleSelectReport = (
    report
  ) => {
    setSelectedReport(
      report
    );

    setAnalysisResult(
      null
    );

    setSelectedPosition({
      lat: report.lat,
      lng: report.lng,
    });

    setMobilePanelOpen(
      true
    );
  };

  const handleReportButton = () => {
    setSelectedReport(
      null
    );

    setAnalysisResult(
      null
    );

    setMobilePanelOpen(
      true
    );
  };

  const handleAnalysisSuccess = (
    result
  ) => {
    setSelectedReport(
      null
    );

    setAnalysisResult(
      result
    );
  };

  let rightPanel;

  if (selectedReport) {
    rightPanel = (
      <ReportDetailsPanel
        report={
          selectedReport
        }
        onBack={() =>
          setSelectedReport(
            null
          )
        }
        onClose={() =>
          setMobilePanelOpen(
            false
          )
        }
      />
    );
  } else if (
    analysisResult
  ) {
    rightPanel = (
      <ResultPanel
        result={
          analysisResult
        }
        onBack={() =>
          setAnalysisResult(
            null
          )
        }
        onClose={() =>
          setMobilePanelOpen(
            false
          )
        }
      />
    );
  } else {
    rightPanel = (
      <ReportPanel
        selectedPosition={
          selectedPosition
        }
        onSuccess={
          handleAnalysisSuccess
        }
        onClose={() =>
          setMobilePanelOpen(
            false
          )
        }
      />
    );
  }

  return (
    <div className="h-dvh w-full overflow-hidden bg-zinc-100">
      <Header
        onReportClick={
          handleReportButton
        }
      />

      <div className="flex h-[calc(100dvh-4rem)] w-full overflow-hidden">
        <ReportsSidebar
          isOpen={
            sidebarOpen
          }
          onToggle={() =>
            setSidebarOpen(
              false
            )
          }
          onSelectReport={
            handleSelectReport
          }
        />

        <main
          className="
            relative
            min-w-0
            flex-1
            overflow-hidden
          "
        >
          {!sidebarOpen && (
            <button
              type="button"
              onClick={() =>
                setSidebarOpen(
                  true
                )
              }
              title="Open reports sidebar"
              className="
                absolute
                left-4
                top-4
                z-[800]
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                border
                border-white/20
                bg-black
                text-[#E8FF00]
                shadow-2xl
                transition
                hover:scale-105
              "
            >
              <PanelLeftOpen
                size={21}
              />
            </button>
          )}

          <MapView
            sidebarOpen={
              sidebarOpen
            }
            selectedPosition={
              selectedPosition
            }
            onSelectPosition={
              handleMapSelect
            }
          />
        </main>

        <aside
          className="
            hidden
            w-[390px]
            min-w-[390px]
            shrink-0
            overflow-hidden
            border-l
            border-zinc-200
            bg-white
            xl:block
          "
        >
          {rightPanel}
        </aside>
      </div>

      {mobilePanelOpen && (
        <div className="fixed inset-0 z-[1200] xl:hidden">
          <button
            type="button"
            aria-label="Close panel"
            onClick={() =>
              setMobilePanelOpen(
                false
              )
            }
            className="
              absolute
              inset-0
              bg-black/60
              backdrop-blur-[2px]
            "
          />

          <aside
            className="
              absolute
              right-0
              top-0
              h-full
              w-full
              max-w-[420px]
              overflow-hidden
              bg-white
              shadow-2xl
            "
          >
            {rightPanel}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;