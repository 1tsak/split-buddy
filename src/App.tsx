import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutWrapper from "./components/LayoutWrapper";
import HomePage from "./pages/HomePage";
import GroupPage from "./pages/Group/GroupPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<LayoutWrapper />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/group/:gId" element={<GroupPage />} />
        </Route>
      </Route>
      <Route path="/" element={<HomePage/>} />
    </Routes>
  );
}

export default App;
