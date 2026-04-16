import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReportFound from "./pages/ReportFound";
import SearchMissing from "./pages/SearchMissing";
import PoliceDashboard from "./pages/PoliceDashboard";
import CreateMissing from "./pages/CreateMissing";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>

      {/* 🔥 FULL PAGE LAYOUT */}
      <div className="flex flex-col min-h-screen">

        {/* 🔝 NAVBAR */}
        <Navbar />

        {/* 📄 MAIN CONTENT */}
        <div className="flex-grow ">

          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchMissing />
                </ProtectedRoute>
              }
            />

            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <ReportFound />
                </ProtectedRoute>
              }
            />

            <Route
              path="/police-dashboard"
              element={
                <ProtectedRoute allowedRole="police">
                  <PoliceDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-missing"
              element={
                <ProtectedRoute allowedRole="police">
                  <CreateMissing />
                </ProtectedRoute>
              }
            />

          </Routes>

        </div>

        {/* 🔻 FOOTER (SCROLLABLE) */}
        <Footer />

      </div>

    </BrowserRouter>
  );
}

export default App;