import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutWrapper from "./components/LayoutWrapper";
import GroupPage from "./pages/Group/GroupPage";
import GroupProvider from "./context/GroupProvider";
import HomePage from "./pages/HomePage";

import GroupHomePage from "./pages/GroupHomePage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <GroupProvider>
              <LayoutWrapper />
            </GroupProvider>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/notifications" element={<DashboardPage/>}/>
          <Route
            path="/group/:groupId"
            element={
              <GroupProvider>
                <GroupPage />
              </GroupProvider>
            }
          />
          <Route path="/group" element={<GroupHomePage />} />
          <Route path="/group/:gId" element={<GroupPage />}></Route>
        </Route>
      </Route>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
