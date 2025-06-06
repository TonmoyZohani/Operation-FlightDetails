import { Box, Drawer, SwipeableDrawer } from "@mui/material";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as DashboardIcon } from "../../../assets/svg/dashboard.svg?react";
import { ReactComponent as DatabaseIcon } from "../../../assets/svg/database.svg?react";
import { ReactComponent as HomeIcon } from "../../../assets/svg/home.svg?react";
import { ReactComponent as SettingIcon } from "../../../assets/svg/setting.svg?react";
import { useAuth } from "../../../context/AuthProvider";
import { NotificationBox } from "../../Dashboard/Notification";
import Notice from "../../Notice/Notice";
import SideNavbar from "../SideNavbar/SideNavbar";

const BottomNavbar = () => {
  const [open, setOpen] = useState(false);
  const [openNotice, setOpenNotice] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const toggleDrawer = (newOpen) => () => setOpen(newOpen);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isShowNotice } = useAuth();

  return (
    <Box
      sx={{
        display: {
          xs: "block",
          lg: "none",
        },
        height: "70px",
        bgcolor: "var(--white)",
        position: "fixed",
        bottom: 0,
        width: "100%",
        zIndex: 100,
        px: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: "100%",
          alignItems: "center",
          position: "relative",
        }}
      >
        {navList?.map((nav, index) => {
          const isActive = pathname
            .toLowerCase()
            .startsWith(nav?.href.toLowerCase());

          return (
            <Link
              key={index}
              to={nav?.href}
              style={{
                display: "block",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  bgcolor: isActive && "var(--primary-light)",
                  display: "flex",
                  width: "40px",
                  height: "40px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "3px",
                  fill: isActive ? "var(--primary-color)" : "#5F6368",
                  color: isActive ? "" : "#5F6368",
                }}
                onClick={(e) => {
                  if (index === 3) {
                    e.preventDefault();
                    toggleDrawer(true)();
                  } else {
                    navigate(nav.href);
                  }
                }}
              >
                {nav?.icon}
              </Box>
            </Link>
          );
        })}
      </Box>
      <SwipeableDrawer
        anchor="right"
        open={notificationOpen}
        PaperProps={{
          sx: { width: "100%", zIndex: 1300 },
        }}
      >
        {notificationOpen && <NotificationBox setOpen={setNotificationOpen} />}
      </SwipeableDrawer>
      <Drawer
        anchor="left"
        sx={{ ...drawerStyle, zIndex: 1300 }}
        open={open}
        onClose={toggleDrawer(false)}
      >
        <SideNavbar
          setNotificationOpen={setNotificationOpen}
          toggleDrawer={toggleDrawer}
          setOpenNotice={setOpenNotice}
        />
      </Drawer>

      {(openNotice || isShowNotice) && (
        <Notice open={openNotice || isShowNotice} setOpen={setOpenNotice} />
      )}
    </Box>
  );
};

const iconStyle = {
  width: "25px",
  height: "20px",
};

const drawerStyle = {
  "& .MuiDrawer-paper": {
    width: "inherit",
    bgcolor: "var(--pink-color)",
    height: "98%",
    top: "1%",
    transform: "translateY(-50%)",
    borderRadius: "6px",
    overflow: "hidden",
  },
};

const navList = [
  {
    id: 1,
    href: "/dashboard/searchs",
    icon: <HomeIcon sx={iconStyle} />,
  },
  {
    id: 2,
    href: "/dashboard/booking/airtickets/all",
    icon: (
      <DatabaseIcon
        style={{
          ...iconStyle,
          strokeWidth: 2,
        }}
      />
    ),
  },
  {
    id: 3,
    href: "/dashboard/generalreport/All",
    icon: <SettingIcon sx={iconStyle} />,
  },
  {
    id: 4,
    href: "#",
    icon: <DashboardIcon sx={iconStyle} />,
  },
];

export default BottomNavbar;
