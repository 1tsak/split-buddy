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
import GroupHome from "./pages/Group/components/GroupHome";
import BillDetails from "./pages/Group/components/BillDetails";
import RedirectToDashboard from "./components/RedirectToDashboard";
import NotificationPage from "./components/NotificationPage";
import Chat from "./pages/Group/components/Chat";
import 'rsuite/dist/rsuite.min.css'; 
import { requestPermission } from "./services/notiService";

requestPermission()

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <RedirectToDashboard>
            <LoginPage />
          </RedirectToDashboard>
        }
      />
      <Route
        path="/signup"
        element={
          <RedirectToDashboard>
            <SignUpPage />
          </RedirectToDashboard>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <GroupProvider>
              <LayoutWrapper />
            </GroupProvider>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/group/:groupId" element={<GroupPage />}>
            <Route index element={<GroupHome />} />
            <Route path="bill/:billId" element={<BillDetails />} />
            <Route path="chat" element={<Chat />} />
          </Route>
          <Route path="/group" element={<GroupHomePage />} />
        </Route>
      </Route>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
