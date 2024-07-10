import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutWrapper from "./components/LayoutWrapper";
import GroupPage from "./pages/Group/GroupPage";
import GroupProvider from "./context/GroupProvider";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<LayoutWrapper />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/group/:groupId"
            element={
              <GroupProvider>
                <GroupPage />
              </GroupProvider>
            }
          />
        </Route>
      </Route>
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
