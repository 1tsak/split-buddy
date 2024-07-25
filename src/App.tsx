import 'rsuite/dist/rsuite.min.css';

import { Route, Routes } from "react-router-dom";

import BillDetails from "./components/Bill/BillDetails";
import Chat from "./components/Group/Chat";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import GroupHome from "./pages/Group/GroupHomePage";
import GroupHomePage from './pages/Group/GroupHomePage';
import GroupLayout from './layouts/GroupLayout';
import GroupProvider from "./context/GroupProvider";
import GroupsPage from './pages/Group/GroupsPage';
import HomePage from './pages/Home/HomePage';
import LayoutWrapper from "./layouts/LayoutWrapper";
import LoginPage from "./pages/Login/LoginPage";
import NotificationPage from "./components/Notification/NotificationPage";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import RedirectToDashboard from "./components/Auth/RedirectToDashboard";
import SignUpPage from "./pages/Signup/SignUpPage";
import UserProfile from './components/Profile/UserProfile';
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
          <Route path="/profile" element={<UserProfile />} />

          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/group/:groupId" element={<GroupLayout />}>
            <Route index element={<GroupHome />} />
            <Route path="bill/:billId" element={<BillDetails />} />
            <Route path="chat" element={<Chat />} />
          </Route>
          <Route path="/group" element={<GroupsPage />} />
        </Route>
      </Route>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
