import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import IframeDashboard from "./pages/iframeDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/home";
import DashboardContainer from "./pages/dashboardContainer";
import SambhavDashboard from "./pages/sambhavDashboard";
import Demo from "./pages/demo";
import Login from "./components/login/login";
import ProjectReport from "./pages/projectReport";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<DashboardContainer />} />
        <Route path="/projectReport" element={<ProjectReport />} />
        <Route path="/login" element={<Login />} />
        <Route
          path={`/superset/dashboard/:dbId`}
          element={<IframeDashboard />}
        />
        <Route path="/sambhavDashboard" element={<SambhavDashboard />} />
        <Route path="/demo" element={<Demo />} />
      </Routes>
    </>
  );
}

export default App;
