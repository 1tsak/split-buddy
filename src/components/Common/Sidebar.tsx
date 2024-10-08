import { Avatar, Box, CircularProgress, Typography } from "@mui/material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";

import UserInfoModal from "../Profile/UserInfoModal";
import { auth } from "../../firebaseConfig";
import { signOut, User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useTranslation } from "react-i18next";

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const [authUser, loading] = useAuthState(auth);
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleUserProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    handleModalClose();
  };

  const navLinks = [
    { path: "/dashboard", name: t("home"), icon: <HomeIcon /> },
    { path: "/group", name: t("groups"), icon: <GroupIcon /> },
    {
      path: "/notifications",
      name: t("notifications"),
      icon: <NotificationsIcon />,
    },
  ];

  return (
    <Box
      className="step2"
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f1f5f9",
        padding: "20px",
        justifyContent: "space-between",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Navigation Links */}
      <Box className="flex-grow overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink
            to={link.path}
            key={link.name}
            className={`text-white mb-4 block ${
              link.name === t("groups") && "step3"
            }`}
            style={{
              color: location.pathname === link.path ? "#576cce" : "#9ca3af",
              textDecoration: "none",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              className={`p-2 rounded-full`}
            >
              {link.icon}
              <Typography
                className="hidden sm:inline"
                variant="subtitle1"
                style={{ marginLeft: "10px" }}
              >
                {link.name}
              </Typography>
            </Box>
          </NavLink>
        ))}
      </Box>

      {/* Avatar and User Info */}
      <Box className="flex items-center mb-5">
        {loading ? (
          <CircularProgress className="text-white" />
        ) : (
          <Avatar
            src={user?.photoURL || ""}
            alt={user?.displayName || ""}
            className="w-12 h-12 cursor-pointer"
            onClick={handleModalOpen}
          />
        )}
      </Box>

      {/* User Info Modal */}
      <UserInfoModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        user={user as User}
        onLogout={handleLogout}
        onUserProfileUpdate={handleUserProfileUpdate}
      />
    </Box>
  );
};

export default Sidebar;
