import ApartmentIcon from "@mui/icons-material/Apartment";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FollowTheSignsIcon from "@mui/icons-material/FollowTheSigns";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Divider,
  IconButton,
  Popover,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Logo from "../../../assets/logo/logo.png";

import {
  Home as HomeIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { useAuth } from "../../../context/AuthProvider";
import useToast from "../../../hook/useToast";
import CustomAlert from "../../Alert/CustomAlert";
import CustomToast from "../../Alert/CustomToast";
import UniversalSearchBox from "../../UniversalSearchBox/UniversalSearchBox";

const SideNavbar = ({ setNotificationOpen, toggleDrawer, setOpenNotice }) => {
  const { agentData } = useOutletContext();
  const [showChevronLeft, setShowChevronLeft] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(74);
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);
  const [selectedSettingMenu, setSelectedSettingMenu] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorSettingEl, setAnchorSettingEl] = useState(null);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const { jsonHeader } = useAuth();

  // Navigate
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // TODO:: Fetching Notification data
  const { data: notifications } = useQuery({
    queryKey: ["user/notifications/stats"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/notifications/stats`,
        jsonHeader()
      );

      return data?.data;
    },
    staleTime: 0,
  });

  const handleClick = (event, subMenu) => {
    setAnchorEl(event.currentTarget);
    setSelectedSubMenu(subMenu);
  };

  const handleClickSettingMenu = (event, settingMenu) => {
    setAnchorSettingEl(event.currentTarget);
    setSelectedSettingMenu(settingMenu);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedSubMenu(null);
    setSelectedSettingMenu(null);
    setAnchorSettingEl(null);
  };

  const handleLogout = async (e) => {
    e.stopPropagation();
    CustomAlert({
      success: "warning",
      message: "Are you sure you want to log out?",
    }).then(async (res) => {
      if (res?.isConfirmed) {
        try {
          const response = await axios.patch(
            `${process.env.REACT_APP_BASE_URL}/api/v1/agent/auth/logout`,
            {},
            jsonHeader()
          );

          const responseData = response?.data;
          if (responseData?.success === true) {
            secureLocalStorage.removeItem("agent-token");
            showToast("sucess", responseData?.message);
            navigate("/");
            window.location.reload();
            queryClient.removeQueries("agent-info/agent-profile");
          }
        } catch (err) {
          showToast("error", err?.response?.data?.message);
          console.error("Logout error:", err?.response?.data?.message);
        }
      }
    });
  };

  const toggleIcon = () => setShowChevronLeft((prev) => !prev);

  useEffect(() => {
    if (showChevronLeft) {
      setDrawerWidth(265);
    } else {
      setDrawerWidth(70);
    }
  }, [showChevronLeft]);

  const id = selectedSubMenu ? "menu-id" : undefined;
  const settingId = selectedSettingMenu ? "setting-id" : undefined;

  return (
    <Box
      sx={{
        height: "100vh",
        width: drawerWidth,
        bgcolor: "var(--secondary-color)",
        color: "var(--white)",
        px: 1.6,
        py: 1.5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        transition: "width 0.3s ease",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ ...logoContainerStyle }}>
            <Box sx={{ ml: 0.5 }}>
              <img
                src={Logo}
                style={{
                  objectFit: "fill",
                  width: "35px",
                  height: "35px",
                }}
                alt="logo"
              />
            </Box>
            {showChevronLeft ? (
              <Typography sx={{ fontSize: "15px" }}>
                {agentData?.companyName}Fly Far International
              </Typography>
            ) : (
              ""
            )}
          </Box>
          {showChevronLeft ? (
            <SearchIcon
              onClick={() => {
                toggleDrawer()(false);
                navigate("/dashboard/UniversalSearchBox");
              }}
            />
          ) : (
            ""
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "92%",
          }}
        >
          <Box>
            <Divider sx={{ mt: 2, mb: 1, bgcolor: "white" }} />
            <Box
              sx={{
                height: "40vh",
                overflowY: "auto",
                scrollbarWidth: "none",
              }}
            >
              <Box id="box2" sx={{ ...menuContainerStyle }}>
                {menuItems?.map((menu, idx) => (
                  <Box key={idx} sx={flexStyle}>
                    <Link
                      to={`${menu?.to}`}
                      style={{
                        width: "100%",
                        textDecoration: "none",
                        color: "var(--white)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 3.5,
                          width: "100%",
                          fontSize: "14px",
                          fontWeight: "100",
                          mt: 0.6,
                        }}
                      >
                        {menu?.icon} {menu?.label}
                      </Box>
                    </Link>

                    {menu?.subMenu?.length > 0 && (
                      <IconButton
                        aria-describedby={id}
                        onClick={(e) => handleClick(e, menu?.subMenu)}
                      >
                        <ArrowDropDownIcon
                          sx={{ color: "#EDF2FA", borderRadius: "50%" }}
                        />
                      </IconButton>
                    )}

                    <Popover
                      id={id}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      sx={{
                        zIndex: 1300,
                      }}
                    >
                      <Box sx={{ padding: 1.5, width: "210px" }}>
                        {selectedSubMenu
                          ? selectedSubMenu?.map((submenuItem, subIdx) => (
                              <Link
                                to={`${submenuItem?.to}`}
                                key={subIdx}
                                style={{
                                  display: "block",
                                  textDecoration: "none",
                                  color: "var(--secondary-color)",
                                  fontWeight: 500,
                                  padding: "3px 0",
                                  fontSize: "14px",
                                  fontWeight: "300",
                                }}
                              >
                                {submenuItem?.label}
                              </Link>
                            ))
                          : null}
                      </Box>
                    </Popover>
                  </Box>
                ))}
              </Box>
            </Box>
            <Divider sx={{ my: 2, bgcolor: "white" }} />
          </Box>
          <Box
            id="box1"
            sx={{ ...menuContainerStyle, gap: 1, pb: 1, marginTop: "auto" }}
          >
            {settingMenus?.map((menu, idx) => (
              <Box key={idx} sx={{ ...flexStyle }}>
                <Link
                  to={`${menu?.to}`}
                  style={{
                    width: "100%",
                    textDecoration: "none",
                    color: "var(--white)",
                    fontSize: "14px",
                    fontWeight: "100",
                  }}
                  onClick={() => {
                    if (menu?.label?.toLowerCase() === "notifications") {
                      setNotificationOpen(true);
                      toggleDrawer()(false);
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3.5,
                      width: "100%",
                      position: "relative",
                      fontSize: "14px",
                      fontWeight: "100",
                    }}
                  >
                    {menu?.icon} {menu?.label}{" "}
                    {menu?.label?.toLowerCase() === "notifications" &&
                      notifications?.unseen > 0 && (
                        <span
                          style={{
                            backgroundColor: "var(--primary-color)",
                            padding: "0px 15px",
                            height: "15px",
                            fontSize: "12px",
                            borderRadius: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "14px",
                            fontWeight: "100",
                          }}
                        >
                          {notifications?.unseen}
                        </span>
                      )}
                    {menu?.label?.toLowerCase() === "notifications" &&
                      notifications?.unseen > 0 && (
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            backgroundColor: "var(--primary-color)",
                            position: "absolute",
                            top: "-3px",
                            left: "-3px",
                            zIndex: 1000,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        ></span>
                      )}
                  </Box>
                </Link>

                {menu?.subMenu?.length > 0 && (
                  <IconButton
                    aria-describedby={id}
                    onClick={(e) => handleClickSettingMenu(e, menu?.subMenu)}
                  >
                    <ArrowDropDownIcon
                      sx={{ color: "#EDF2FA", borderRadius: "50%" }}
                    />
                  </IconButton>
                )}

                <Popover
                  id={settingId}
                  open={Boolean(anchorSettingEl)}
                  onClose={handleClose}
                  anchorEl={anchorSettingEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  sx={{
                    zIndex: 1300,
                  }}
                >
                  <Box sx={{ padding: 1.5, width: "210px" }}>
                    {selectedSettingMenu
                      ? selectedSettingMenu?.map((submenuItem, subIdx) => (
                          <Link
                            to={`${submenuItem?.to}`}
                            key={subIdx}
                            style={{
                              display: "block",
                              textDecoration: "none",
                              color: "var(--secondary-color)",
                              fontWeight: 500,
                              padding: "3px 0",
                              fontSize: "14px",
                              fontWeight: "300",
                            }}
                          >
                            {submenuItem?.label}
                          </Link>
                        ))
                      : null}
                  </Box>
                </Popover>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box>
        <Box sx={{ ...profileContainerStyle }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: showChevronLeft ? 2 : 3.4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2.2,
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!agentData ? (
                "..."
              ) : (
                <Typography
                  sx={{
                    ...profileTextStyle,
                    bgcolor: showChevronLeft ? "var(--white)" : "var(--gray)",
                    color: showChevronLeft
                      ? "var(--black)"
                      : "var(--secondary-color)",
                  }}
                  onClick={() => {
                    toggleDrawer()(false);
                    setOpenNotice(true);
                  }}
                >
                  {agentData?.firstName?.charAt(0) +
                    agentData?.lastName?.charAt(0)}
                </Typography>
              )}

              {!showChevronLeft && (
                <LogoutIcon
                  onClick={handleLogout}
                  sx={{ fontSize: "17px", color: "var(--white)" }}
                />
              )}
            </Box>
            <Box>
              <Typography sx={nameStyle} onClick={() => setOpenNotice(true)}>
                {agentData?.firstName} {agentData?.lastName}
              </Typography>
              <Typography sx={idStyle}>{agentData?.agent?.agentId}</Typography>
            </Box>
          </Box>

          <LogoutIcon
            onClick={handleLogout}
            sx={{ fontSize: "17px", color: "var(--white)", fontWeight: 600 }}
          />
        </Box>
        <Divider sx={{ my: 2, bgcolor: "var(--white)" }} />
        <Box
          sx={{
            ...toggleButtonStyle,
            justifyContent: showChevronLeft ? "end" : "center",
          }}
          onClick={toggleIcon}
        >
          <KeyboardArrowRightIcon
            sx={{
              color: "var(--white)",
              fontSize: "18px",
              transform: showChevronLeft ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </Box>
      </Box>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

// Styles
const flexStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  gap: 3.5,
};

const logoContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
};

const titleStyle = (showChevronLeft) => ({
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  maxWidth: showChevronLeft ? "calc(100% - 74px)" : "10px",
  fontSize: "1.2rem",
});

const menuContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
  pl: 1.6,
  justifyContent: "center",
  width: "100%",
};

const profileContainerStyle = {
  display: "flex",
  alignItems: "center",
  bgcolor: "transparent",
  justifyContent: "space-between",
  p: 1.1,
  borderRadius: "18px",
  bgcolor: "rgb(255, 255, 255, 0.102)",
};

const profileTextStyle = {
  fontSize: "17px",
  fontWeight: "500",
  lineHeight: "normal",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: "50px",
  px: 0.6,
  ml: -0.2,
};

const nameStyle = {
  fontSize: "12px",
  color: "var(--white)",
  fontWeight: "500",
  lineHeight: "14px",
  marginLeft: "3px",
};

const idStyle = {
  fontSize: "10px",
  color: "var(--gray)",
  fontWeight: "500",
  lineHeight: "14px",
  marginLeft: "3px",
};

const toggleButtonStyle = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  height: "15px",
};

// Menu Items
const menuItems = [
  {
    icon: <HomeIcon sx={{ fontSize: "18px" }} />,
    label: "Dashboard",
    to: "#",
    subMenu: [
      {
        label: "Live Dashboard",
        to: "/dashboard/live",
      },
      {
        label: "Branch Dashboard",
        to: "/dashboard/branchDashboard",
      },
      {
        label: "Operations Calendar",
        to: "/dashboard/operation-calendar",
      },
    ],
  },
  {
    icon: <SearchOutlinedIcon sx={{ fontSize: "18px" }} />,
    label: "Search",
    to: "/dashboard/searchs",
  },
  {
    icon: <ViewAgendaIcon sx={{ fontSize: "18px" }} />,
    label: "Booking",
    to: "#",
    subMenu: [
      {
        label: "Airticket",
        to: "/dashboard/booking/airtickets/all",
      },
    ],
  },
  {
    icon: <RequestQuoteIcon sx={{ fontSize: "18px" }} />,
    label: "Accounts",
    to: "#",
    subMenu: [
      {
        label: "Deposit Requests",
        to: "/dashboard/deposits/all",
      },
      {
        label: "Add Deposit",
        to: "/dashboard/add-Deposit/cash",
      },
      {
        label: "Balance Transfer",
        to: "/dashboard/balanceTransfer",
      },
    ],
  },
  {
    icon: <ApartmentIcon sx={{ fontSize: "18px" }} />,
    label: "Branch",
    to: "#",
    subMenu: [
      {
        label: "Branch Management",
        to: "/dashboard/wingManagement/status/active",
      },
      {
        label: "Add Branch",
        to: "/dashboard/wingManagement/add-Branch",
      },
    ],
  },
  {
    icon: <PeopleAltIcon sx={{ fontSize: "18px" }} />,
    label: "Staff",
    to: "#",
    subMenu: [
      {
        label: "Staff Management",
        to: "/dashboard/staffManagement/active",
      },
      {
        label: "Add Staff",
        to: "/dashboard/staffManagement/add-staff",
      },
    ],
  },
  {
    icon: <ManageAccountsIcon sx={{ fontSize: "18px" }} />,
    label: "Manage",
    to: "#",
    subMenu: [
      // {
      //   label: "SMTP Email Configuration",
      //   to: "/dashboard/emailConfiguration",
      // },
      {
        label: "My Bank Account",
        to: "/dashboard/bankAccount/all",
      },
      {
        label: "Add Bank",
        to: "/dashboard/addBankAccount",
      },
      {
        label: "Company Profile",
        to: "/dashboard/companyProfile",
      },
      {
        label: "Client Profile",
        to: "/dashboard/clientProfile/active",
      },
    ],
  },
  {
    icon: <FollowTheSignsIcon sx={{ fontSize: "18px" }} />,
    label: "ActivityLog",
    to: "/dashboard/activityLog/all",
  },
  {
    icon: <AssessmentIcon sx={{ fontSize: "18px" }} />,
    label: "Reports",
    to: "#",
    subMenu: [
      // {
      //   label: "Search History Report",
      //   to: "/dashboard/searchreport",
      // },
      // {
      //   label: "Sales Report",
      //   to: "/dashboard/salesreport",
      // },
      // {
      //   label: "Branch Reports",
      //   to: "/dashboard/branchReport",
      // },
      {
        label: "General Ledger Report",
        to: "/dashboard/generalreport/all",
      },
    ],
  },
  {
    icon: <FollowTheSignsIcon sx={{ fontSize: "18px" }} />,
    label: "ActivityLog",
    to: "/dashboard/activityLog/all",
  },
  {
    icon: <HeadsetMicIcon sx={{ fontSize: "18px" }} />,
    label: "Support",
    to: "/dashboard/support/all",
  },
];

// Menu Items
const settingMenus = [
  {
    icon: <NotificationsIcon sx={{ fontSize: "18px" }} />,
    label: "Notifications",
    to: "#",
  },
  {
    icon: <SettingsIcon sx={{ fontSize: "18px" }} />,
    label: "Setting",
    to: "#",
    subMenu: [
      {
        label: "User Profile",
        to: "/dashboard/userProfile",
      },
    ],
  },
];

export default SideNavbar;
