import {
  ArrowLeft,
  MapPin,
  MousePointer2,
  Route,
  ShieldCheck,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Header from "../components/layout/Header";
import MapView from "../components/map/MapView";
import ReportForm from "../components/report/ReportForm";
import ResultPanel from "../components/report/ResultPanel";

function ReportPage() {
  const [
    selectedPosition,
    setSelectedPosition,
  ] = useState(null);

  const [
    analysisResult,
    setAnalysisResult,
  ] = useState(null);

  const handleMapSelect = (
    position
  ) => {
    setSelectedPosition(
      position
    );

    setAnalysisResult(
      null
    );
  };

  return (
    <div
      className="
        min-h-dvh
        bg-[#F5F5F2]
      "
    >
      <Header />

      <main
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-4
          py-6
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            mb-6
            flex
            flex-col
            justify-between
            gap-5
            lg:flex-row
            lg:items-end
          "
        >
          <div>
            <Link
              to="/"
              className="
                mb-4
                inline-flex
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

              Back to map
            </Link>

            <h1
              className="
                text-3xl
                font-bold
                tracking-[-0.04em]
                text-zinc-950
                md:text-4xl
              "
            >
              Report a civic issue
            </h1>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-zinc-500
              "
            >
              Select where the problem is located,
              provide the details, and FixMyDhaka
              will identify who is responsible.
            </p>
          </div>

          <div
            className="
              hidden
              items-center
              gap-6
              lg:flex
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                text-xs
                font-medium
                text-zinc-500
              "
            >
              <MapPin
                size={15}
              />

              Choose location
            </div>

            <div
              className="
                h-4
                w-px
                bg-zinc-300
              "
            />

            <div
              className="
                flex
                items-center
                gap-2
                text-xs
                font-medium
                text-zinc-500
              "
            >
              <ShieldCheck
                size={15}
              />

              Verified routing
            </div>
          </div>
        </div>

        <div
          className="
            grid
            h-[calc(100dvh-13.5rem)]
            min-h-[650px]
            max-h-[820px]
            overflow-hidden
            rounded-2xl
            border
            border-zinc-200
            bg-white
            shadow-sm
            lg:grid-cols-[minmax(0,1.15fr)_minmax(430px,0.85fr)]
          "
        >
          <section
            className="
              flex
              min-h-0
              flex-col
              overflow-hidden
              border-b
              border-zinc-200
              lg:border-b-0
              lg:border-r
            "
          >
            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-zinc-200
                bg-white
                px-5
                py-4
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-zinc-900
                  "
                >
                  Where is the issue?
                </p>

                <p
                  className="
                    mt-0.5
                    text-[11px]
                    text-zinc-400
                  "
                >
                  Search an area or click directly on the map
                </p>
              </div>

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-black
                  text-[#E8FF00]
                "
              >
                <MousePointer2
                  size={17}
                />
              </div>
            </div>

            <div
              className="
                relative
                min-h-0
                flex-1
              "
            >
              <MapView
                sidebarOpen
                selectedPosition={
                  selectedPosition
                }
                onSelectPosition={
                  handleMapSelect
                }
              />
            </div>

            <div
              className="
                grid
                shrink-0
                grid-cols-3
                divide-x
                divide-zinc-200
                border-t
                border-zinc-200
                bg-[#FAFAFA]
              "
            >
              <div
                className="
                  px-4
                  py-3
                "
              >
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-zinc-400
                  "
                >
                  Step 1
                </p>

                <p
                  className="
                    mt-1
                    text-[11px]
                    font-semibold
                    text-zinc-700
                  "
                >
                  Select location
                </p>
              </div>

              <div
                className="
                  px-4
                  py-3
                "
              >
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-zinc-400
                  "
                >
                  Step 2
                </p>

                <p
                  className="
                    mt-1
                    text-[11px]
                    font-semibold
                    text-zinc-700
                  "
                >
                  Describe issue
                </p>
              </div>

              <div
                className="
                  px-4
                  py-3
                "
              >
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-zinc-400
                  "
                >
                  Step 3
                </p>

                <p
                  className="
                    mt-1
                    text-[11px]
                    font-semibold
                    text-zinc-700
                  "
                >
                  Get route
                </p>
              </div>
            </div>
          </section>

          <section
            className="
              min-h-0
              overflow-hidden
              bg-white
            "
          >
            {analysisResult ? (
              <ResultPanel
                result={
                  analysisResult
                }
                onBack={() =>
                  setAnalysisResult(
                    null
                  )
                }
              />
            ) : (
              <div
                className="
                  h-full
                  overflow-y-auto
                "
              >
                <ReportForm
                  selectedPosition={
                    selectedPosition
                  }
                  onSuccess={
                    setAnalysisResult
                  }
                />
              </div>
            )}
          </section>
        </div>

        <div
          className="
            mt-5
            grid
            gap-3
            md:grid-cols-3
          "
        >
          <div
            className="
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-zinc-200
              bg-white
              p-4
            "
          >
            <MapPin
              size={18}
              className="
                mt-0.5
                shrink-0
                text-zinc-700
              "
            />

            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  text-zinc-900
                "
              >
                Location aware
              </p>

              <p
                className="
                  mt-1
                  text-[11px]
                  leading-5
                  text-zinc-400
                "
              >
                Your selected area helps determine
                the correct jurisdiction.
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-zinc-200
              bg-white
              p-4
            "
          >
            <ShieldCheck
              size={18}
              className="
                mt-0.5
                shrink-0
                text-zinc-700
              "
            />

            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  text-zinc-900
                "
              >
                Evidence based
              </p>

              <p
                className="
                  mt-1
                  text-[11px]
                  leading-5
                  text-zinc-400
                "
              >
                Authority routing uses verified
                civic responsibility information.
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-zinc-200
              bg-white
              p-4
            "
          >
            <Route
              size={18}
              className="
                mt-0.5
                shrink-0
                text-zinc-700
              "
            />

            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  text-zinc-900
                "
              >
                Official route
              </p>

              <p
                className="
                  mt-1
                  text-[11px]
                  leading-5
                  text-zinc-400
                "
              >
                Continue directly to the relevant
                official complaint system.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReportPage;