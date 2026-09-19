import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import ReportPage from "./pages/ReportPage";
import ReportsPage from "./pages/ReportsPage";

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