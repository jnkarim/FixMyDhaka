import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import ReportPage from "./pages/ReportPage";
import ReportsPage from "./pages/ReportsPage";
import InsightsPage from "./pages/InsightsPage";
import HowItWorksPage from "./pages/HowItWorksPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/report"
        element={<ReportPage />}
      />

      <Route
        path="/reports"
        element={<ReportsPage />}
      />

      <Route
        path="/insights"
        element={<InsightsPage />}
      />

      <Route
        path="/how-it-works"
        element={<HowItWorksPage />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;