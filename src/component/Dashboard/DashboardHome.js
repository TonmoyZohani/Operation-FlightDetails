import GppGoodIcon from "@mui/icons-material/GppGood";
import MenuIcon from "@mui/icons-material/Menu";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import {
  Box,
  Button,
  Popover,
  Skeleton,
  styled,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiSolidReport, BiSupport } from "react-icons/bi";
import { BsFillPeopleFill } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";
import {
  MdOutlineLogout,
  MdOutlineManageAccounts,
} from "react-icons/md";
import { PiBuildingApartment } from "react-icons/pi";
import { RxActivityLog } from "react-icons/rx";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import { ReactComponent as DropDownIcon } from "../../images/svg/dropdown.svg";
import useUnAuthorized from "../../shared/common/useUnAuthorized";
import useWindowSize from "../../shared/common/useWindowSize";
import CustomAlert from "../Alert/CustomAlert";
import CustomToast from "../Alert/CustomToast";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import Notice from "../Notice/Notice";
import DashboardSkeleton from "./components/DashboardSkeleton";
import LiveSupport from "./LiveSupport/LiveSupport";

const drawerWidth = 250;

const DashboardHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { checkUnAuthorized } = useUnAuthorized();
  const { isShowNotice, jsonHeader } = useAuth();
  const isMoreThan1900px = useMediaQuery("(min-width:1900px)");
  const [open, setOpen] = useState(true);
  const [openNotice, setOpenNotice] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const { isMobile } = useWindowSize();

  const { data: agentData, status } = useQuery({
    queryKey: ["user/account"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v2/user/account`,
        jsonHeader()
      );
      return data?.data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: balanceData, isLoading } = useQuery({
    queryKey: "balanceData",
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/v1/user/ledger/balance`,
          jsonHeader()
        );
        return data?.data;
      } catch (error) {
        if (error?.response?.status === 401) {
          showToast("error", "You are unauthorized to access this site.");
          checkUnAuthorized(error);
        }
        throw error;
      }
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { data: balanceInfo, refetch } = useQuery({
    queryKey: ["balanceInfo"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/branches/balance`,
        jsonHeader()
      );
      return data?.data;
    },
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    handleClose();
  }, [location.pathname]);

  const handleClick = (event, button) => {
    setAnchorEl(event.currentTarget);
    setSelectedButton(button);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedButton(null);
  };

  const openList = Boolean(anchorEl);
  const id = openList ? "popover" : undefined;

  const handleLogout = async (e) => {
    e.stopPropagation();
    CustomAlert({
      success: "warning",
      message: "Are you sure you want to log out?",
    }).then(async (res) => {
      if (res?.isConfirmed) {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/api/v2/user/auth/logout`,
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

  const name = agentData?.firstName + " " + agentData?.lastName;

  return (
    <Box
      sx={{
        display: "flex",
        ".active": {
          backgroundColor: "var(--primary-color)",
          color: "#ffffff !important",
          paddingLeft: "0px !important",
          transition: "0.5s",
        },
        "& .PrivateSwipeArea-root": {
          width: "0px",
        },
      }}
    >
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          display: {
            xs: isMobile ? "none" : "block",
          },
        }}
      >
        <DrawerHeader
          sx={{
            display: "flex",
            bgcolor: "white",
            borderBottom: "1px solid #E2EAF1",
            borderRight: "1px solid #E2EAF1",
            height: isMoreThan1900px ? "115px" : "91px",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            position: "relative",
          }}
          onClick={() => navigate("/dashboard/searchs")}
        >
          {open ? (
            <Box
              sx={{
                cursor: "pointer",
                width: "100%",
                height: "100%",
              }}
            >
              {agentData?.agent ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    padding: "5px 10px 5px 0px",
                  }}
                >
                  <img
                    alt="logo"
                    src={
                      agentData?.agent?.agencyInformation?.documents?.logoImage
                    }
                    style={{
                      width: "65%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                  <Box
                    sx={{
                      bgcolor: "var(--secondary-color)",
                      color: "white",
                      position: "absolute",
                      top: isMoreThan1900px ? "40px" : "30px",
                      right: 0,
                      borderRadius: "3px  0 0 3px",
                      display: "flex",
                      alignItems: "center",
                      width: "18px",
                      height: "23px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(!open);
                    }}
                  >
                    <PlayArrowIcon
                      sx={{
                        fontSize: "18px",
                        rotate: "180deg",
                        color: "white",
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Skeleton variant="rectangular" width={"100%"} height={60} />
              )}
            </Box>
          ) : (
            <MenuIcon
              sx={{
                color: "var(--primary-color)",
                width: "28px",
                height: "28px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
            />
          )}
        </DrawerHeader>

        <Box
          sx={{
            bgcolor: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100vh",
            p: "13px",
            pt: "5px",
            borderRight: "1px solid #E2EAF1",
          }}
        >
          {status === "pending" ? (
            <DashboardSkeleton />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                maxHeight: "78vh",
                overflowY: "scroll",
                overflowX: "hidden",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {navLists(agentData)?.map((nav, i) => {
                const isMatch = nav?.allKeys?.some((key) =>
                  location.pathname.includes(key)
                );

                return (
                  <Box
                    key={i}
                    sx={{
                      display:
                        agentData?.type === "staff" && nav?.title === "Staff"
                          ? "none"
                          : "static",
                    }}
                  >
                    {nav?.subRoutes?.length > 0 ? (
                      <Button
                        sx={navStyle(isMatch)?.btn}
                        onClick={(e) =>
                          nav?.subRoutes.length > 0 && handleClick(e, nav)
                        }
                      >
                        <Box sx={navStyle()?.iconContainer}>
                          {React.cloneElement(nav?.icon, {
                            sx: {
                              color: isMatch
                                ? "white"
                                : "var(--secondary-color)",
                            },
                            color: isMatch ? "white" : "var(--secondary-color)",
                          })}
                        </Box>
                        {open && (
                          <Box sx={navStyle()?.textContainer}>
                            <Typography sx={navStyle()?.title}>
                              {nav?.title}
                            </Typography>

                            {nav?.subRoutes.length > 0 && (
                              <DropDownIcon
                                fill={
                                  isMatch ? "white" : "var(--secondary-color)"
                                }
                                style={{
                                  width: "18px",
                                  height: "8px",
                                  marginLeft: "25px",
                                  transform:
                                    selectedButton?.id === nav?.id
                                      ? "rotate(0deg)"
                                      : "rotate(-90deg)",
                                  transition: "transform 0.3s ease-in-out",
                                }}
                              />
                            )}
                          </Box>
                        )}
                      </Button>
                    ) : (
                      <Link to={nav?.to} style={{ textDecoration: "none" }}>
                        <Button sx={navStyle(isMatch)?.btn}>
                          <Box sx={navStyle()?.iconContainer}>
                            {React.cloneElement(nav?.icon, {
                              sx: {
                                color: isMatch
                                  ? "white"
                                  : "var(--secondary-color)",
                              },
                              color: isMatch
                                ? "white"
                                : "var(--secondary-color)",
                            })}
                          </Box>
                          {open && (
                            <Box sx={navStyle()?.textContainer}>
                              <Typography sx={navStyle()?.title}>
                                {nav?.title}
                              </Typography>
                            </Box>
                          )}
                        </Button>
                      </Link>
                    )}
                  </Box>
                );
              })}

              <Button sx={navStyle()?.btn} onClick={handleLogout}>
                <Box sx={navStyle()?.iconContainer}>
                  {React.cloneElement(
                    <MdOutlineLogout
                      style={{
                        fontSize: "22px",
                        color: "var(--secondary-color)",
                      }}
                    />
                  )}
                </Box>
                {open && (
                  <Box sx={navStyle()?.textContainer}>
                    <Typography
                      sx={{
                        ...navStyle()?.title,
                        // color: "var(--primary-color)",
                      }}
                    >
                      Logout
                    </Typography>
                  </Box>
                )}
              </Button>
            </Box>
          )}

          <Box
            sx={{
              height: "80px",
              display: "flex",
              alignItems: "center",
              gap: 1,
              borderRadius: "5px",
              bgcolor: open && "#f5f5f5",
              padding: open ? 1 : 0,
            }}
          >
            {agentData?.firstName ? (
              <Box
                onClick={() => setOpenNotice(true)}
                sx={{
                  height: "40px",
                  width: "40px",
                  border: "2px solid var(--primary-color)",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: "var(--secondary-color)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                {agentData?.firstName?.charAt(0) +
                  agentData?.lastName?.charAt(0)}
              </Box>
            ) : (
              <Skeleton variant="circular" width={40} height={40} />
            )}

            {open && (
              <Box
                sx={{
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/dashboard/userProfile");
                }}
              >
                <Tooltip title={name?.length > 13 ? name : ""}>
                  <Typography
                    sx={{
                      ...navStyle()?.title,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {!agentData?.firstName ? (
                      <Skeleton variant="text" width={120} height={16} />
                    ) : name?.length > 13 ? (
                      name?.slice(0, 13) + "..."
                    ) : (
                      name
                    )}
                  </Typography>
                </Tooltip>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#9E9E9E",
                    fontWeight: 500,
                    textTransform: "capitalize",
                    mt: 0,
                  }}
                >
                  {agentData?.agent?.agencyInformation ? (
                    <span style={{ fontWeight: 600 }}>
                      {agentData?.agent?.agencyInformation?.agencyName}
                    </span>
                  ) : (
                    <Skeleton variant="text" width={120} height={16} />
                  )}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#9E9E9E",
                    fontWeight: 500,
                    textTransform: "capitalize",
                    mt: 0,
                  }}
                >
                  {agentData?.type}{" "}
                  {agentData?.agent?.agentId ? (
                    <span style={{ fontWeight: 600 }}>
                      {agentData.agent.agentId}
                    </span>
                  ) : (
                    <Skeleton variant="text" width={120} height={16} />
                  )}
                </Typography>

                {/* <Box sx={{ display: "flex", gap: "5px" }}>
                    <HomeIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/");
                      }}
                      sx={{ fontSize: "20px", cursor: "pointer" }}
                    />
                    <SettingsIcon
                      // onClick={handleClick}
                      sx={{
                        fontSize: "18px",
                        cursor: "pointer",
                      }}
                    />
                    <MdOutlineLogout
                      onClick={handleLogout}
                      style={{
                        fontSize: "18px",
                        cursor: "pointer",
                      }}
                    />
                  </Box> */}
              </Box>
            )}
          </Box>
        </Box>

        <Popover
          id={id}
          open={openList}
          anchorEl={anchorEl}
          onClose={handleClose}
          disableScrollLock={true}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            sx: { p: "12px 20px 16px 20px", borderRadius: "6px" },
          }}
        >
          <Box sx={{ width: "180px", maxHeight: "250px" }}>
            <Typography sx={popoverStyle?.title}>
              {selectedButton?.title}
            </Typography>

            {selectedButton?.subRoutes?.map((subRoute, i) => {
              return (
                <Link
                  to={subRoute?.to}
                  key={i}
                  style={{
                    ...popoverStyle?.subLinks,
                    color: location?.pathname?.includes(subRoute?.key)
                      ? "var(--primary-color)"
                      : "var(--gray-3)",
                    display: subRoute?.role?.includes("agent")
                      ? "flex"
                      : "none",
                  }}
                >
                  {subRoute?.title}
                </Link>
              );
            })}
          </Box>
        </Popover>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 0,
          bgcolor: "#F0F2F5",
          width: {
            md: `calc(100% - ${isMobile ? 0 : drawerWidth}px)`,
            sm: "100%",
            xs: "100%",
          },
          position: "relative",
        }}
      >
        {isMobile ? (
          ""
        ) : (
          <>
            <DashboardHeader
              balanceInfo={balanceInfo}
              agentData={agentData}
              balanceData={balanceData}
              isLoading={isLoading}
              refetchBalance={refetch}
            />
          </>
        )}
        <Box sx={{ width: { xs: "100%", lg: "90%" }, margin: "0 auto" }}>
          <Box py={2}>
            <Outlet
              context={{ agentData, balanceInfo, balanceData } || {}}
            ></Outlet>
          </Box>
        </Box>

        <LiveSupport />
      </Box>
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
      {(openNotice || isShowNotice) && (
        <Notice open={openNotice || isShowNotice} setOpen={setOpenNotice} />
      )}
    </Box>
  );
};

const activeRole = (...arr) => {
  return [...new Set(arr.flat())];
};

const agentRoles = [
  "agent",
  "agent-branch",
  "agent-staff",
  "agent-sub-agent",
  "branch-staff",
  "sub-agent-staff",
  "sub-agent",
];

const branchRole = ["agent", "agent-branch", "branch-staff"];
const subAgentRole = ["agent", "agent-sub-agent", "sub-agent-staff"];

const navLists = (agentData) => {
  const dashboardAccess = !!agentData?.userAccess?.dashboard?.access;
  const bankManagementAccess = !!agentData?.userAccess?.bankManagement?.access;
  const flightAccess = !!agentData?.userAccess?.flightSearch?.access;
  const bookingAccess = !!agentData?.userAccess?.flight?.access;
  const depositAccess = !!agentData?.userAccess?.deposit?.access;
  const staffAccess = !!agentData?.userAccess?.staffManagement?.access;
  const companyProfileAccess = !!agentData?.userAccess?.companyProfile?.access;
  const wingManagement = !!agentData?.userAccess?.wingManagement?.access;
  const markupAccess = !!agentData?.userAccess?.markupManagement?.access;
  const activityAccess = !!agentData?.userAccess?.activityLog?.access;
  const smtpEmailAccess = !!agentData?.userAccess?.smtpEmail?.access;
  const reportsAccess = !!agentData?.userAccess?.reports?.access;

  const agentCms = agentData?.agentCms?.eligibleRangeCms ?? {};

  return [
    ...(flightAccess
      ? [
          {
            title: "Search",
            icon: <SearchOutlinedIcon sx={{ fontSize: "25px" }} />,
            to: `/dashboard/searchs`,
            role: agentRoles,
            subRoutes: [],
            allKeys: [
              "searchs",
              "flightaftersearch",
              "airbooking",
              "split-after-search",
            ],
          },
        ]
      : []),
    ...(dashboardAccess
      ? [
          {
            title: "Dashboard",
            icon: <LuLayoutDashboard style={{ fontSize: "20px" }} />,
            to: "/dashboard",
            role: agentRoles,
            subRoutes: [
              agentData?.userAccess?.dashboard?.operations
                ?.viewLiveDashboard && {
                title: "Live Dashboard",
                to: "/dashboard/live",
                key: "live",
                role: activeRole(agentRoles),
              },
              agentData?.userAccess?.dashboard?.operations
                ?.viewBranchDashboard &&
                agentData?.usedCms?.branch !== 0 && {
                  title: "Branch Dashboard",
                  to: "/dashboard/branchDashboard",
                  key: "branchDashboard",
                  role: activeRole(agentRoles),
                },
              // agentData?.userAccess?.dashboard?.operations?.viewStatistics && {
              //   title: "Statistics",
              //   to: "/dashboard/statistics",
              //   key: "statistics",
              //   role: activeRole(agentRoles),
              // },
              agentData?.userAccess?.dashboard?.operations
                ?.viewOperationCalendar && {
                title: "Operations Calendar",
                to: "/dashboard/operation-calendar",
                key: "operation-calendar",
                role: activeRole(agentRoles),
              },
            ].filter(Boolean),
            get allKeys() {
              return this.subRoutes.map((item) => item.key);
            },
          },
        ]
      : []),
    ...(bookingAccess
      ? [
          {
            title: "Reservations",
            icon: <EventSeatIcon style={{ fontSize: "24px" }} />,
            to: "/dashboard/booking/airTicket",
            role: agentRoles,
            subRoutes: [
              {
                title: "All Booking",
                to: "/dashboard/booking/airtickets/all",
                key: "airtickets",
                role: activeRole(agentRoles),
              },
              {
                title: "Partially Due Tickets",
                to: "/dashboard/booking/air-tickets/partiallyDueTicket",
                key: "partiallyDueTicket",
                role: activeRole(agentRoles),
              },
              {
                title: "Refund To Be Confirmed",
                to: "/dashboard/booking/airtickets/refund%20to%20be%20confirmed?from=dashboard",
                key: "refund%20to%20be%20confirmed",
                role: activeRole(agentRoles),
              },
              {
                title: "Reissue To Be Confirmed",
                to: "/dashboard/booking/airtickets/reissue%20to%20be%20confirmed?from=dashboard",
                key: "reissue%20to%20be%20confirmed",
                role: activeRole(agentRoles),
              },
              // {
              //   title: "Hotel",
              //   to: "/dashboard/booking/hotel",
              //   key: "booking/hotel",
              //   role: activeRole(agentRoles),
              // },
              // {
              //   title: "All PNR Import",
              //   to: "/dashboard/booking/allpnrimport",
              //   key: "booking/allpnrimport",
              //   role: activeRole(agentRoles),
              // },
            ],
            get allKeys() {
              return this.subRoutes.map((item) => item.key);
            },
          },
        ]
      : []),
    ...(depositAccess
      ? [
          {
            title: "Payment",
            icon: <CurrencyExchangeIcon style={{ fontSize: "20px" }} />,
            to: `/dashboard/deposits/all?agentData=${encodeURIComponent(
              JSON.stringify(agentData?.userAccess?.deposit)
            )}`,
            role: activeRole(agentRoles),
            subRoutes: [
              agentData?.userAccess?.deposit?.operations
                ?.makeDepositRequest && {
                title: "Add Deposit",
                to: `/dashboard/add-Deposit/${agentCms?.cashDeposit?.eligible ? "cash" : agentCms?.bankTransferDeposit?.eligible ? "bank transfer" : agentCms?.bankDeposit?.eligible ? "bank deposit" : agentCms?.chequeDeposit?.eligible ? "cheque deposit" : ""}`,
                key: "add-Deposit",
                role: activeRole(agentRoles),
              },
              {
                title: "Balance Transfer",
                to: "/dashboard/balanceTransfer",
                key: "balanceTransfer",
                role: activeRole(agentRoles),
              },
              agentData?.userAccess?.deposit?.operations
                ?.viewDepositInformation && {
                title: "Deposit Ledger",
                to: `/dashboard/deposits/all`,
                key: "deposits",
                role: activeRole(agentRoles),
              },
            ].filter(Boolean),
            get allKeys() {
              return this.subRoutes.map((item) => item.key);
            },
          },
        ]
      : []),
    ...(wingManagement
      ? [
          {
            title: "Branch",
            icon: <PiBuildingApartment style={{ fontSize: "24px" }} />,
            to: "/dashboard/wingManagement/status/active",
            role: activeRole(agentRoles),
            subRoutes: [],
            allKeys: ["wingManagement", "addBranch"],
          },
        ]
      : []),

    ...(staffAccess
      ? [
          {
            title: "Staff",
            icon: <BsFillPeopleFill style={{ fontSize: "24px" }} />,
            to: "/dashboard/staffManagement/active",
            role: activeRole(agentRoles),
            subRoutes: [],
            allKeys: ["staffManagement", "add-staff"],
          },
        ]
      : []),

    // {
    //   title: "Branch",
    //   icon: <PiBuildingApartment style={{ fontSize: "24px" }} />,
    //   to: "/dashboard/wingManagement/status/approved",
    //   role: activeRole(agentRoles),
    //   subRoutes: [
    //     {
    //       title: "Branch Management",
    //       to: "/dashboard/wingManagement/status/approved",
    //       key: "wingManagement",
    //       role: activeRole(agentRoles),
    //     },
    //     {
    //       title: "Add Branch",
    //       to: "/dashboard/addBranch",
    //       key: "addBranch",
    //       role: activeRole(agentRoles),
    //     },
    //     {
    //       title: "Branch Activity Log",
    //       to: "/dashboard/branchActivity",
    //       key: "branchActivity",
    //       role: activeRole(agentRoles),
    //     },
    //   ],
    //   get allKeys() {
    //     return this.subRoutes.map((item) => item.key);
    //   },
    // },

    // ...(staffAccess
    //   ? [
    //       {
    //         title: "Staff",
    //         icon: <BsFillPeopleFill style={{ fontSize: "24px" }} />,
    //         to: "/dashboard/staffManagement/approved",
    //         role: activeRole(agentRoles),
    //         subRoutes: [
    //           agentData?.userAccess?.staffManagement?.operations
    //             ?.viewStaffList && {
    //             title: "Staff Management",
    //             to: `/dashboard/staffManagement/approved`,
    //             key: "staffManagement",
    //             role: activeRole(agentRoles),
    //           },
    //           agentData?.userAccess?.staffManagement?.operations
    //             ?.addStaffMember && {
    //             title: "Add Staff",
    //             to: "/dashboard/staffManagement/add-staff",
    //             key: "add-staff",
    //             role: activeRole(agentRoles),
    //           },
    //           {
    //             title: "Staff Activity Log",
    //             to: "/dashboard/staffActivity",
    //             key: "staffActivity",
    //             role: activeRole(agentRoles),
    //           },
    //         ].filter(Boolean),
    //         get allKeys() {
    //           return this.subRoutes.map((item) => item.key);
    //         },
    //       },
    //     ]
    //   : []),

    {
      title: "Settings",
      icon: <MdOutlineManageAccounts style={{ fontSize: "25px" }} />,
      to: "/dashboard/bankAccount/all",
      role: activeRole(agentRoles),
      subRoutes: [
        // ...(smtpEmailAccess
        //   ? [
        //       {
        //         title: "SMTP Email Configuration",
        //         to: "/dashboard/emailConfiguration",
        //         key: "emailConfiguration",
        //         role: activeRole(agentRoles),
        //       },
        //     ]
        //   : []),

        ...(bankManagementAccess
          ? [
              {
                title: "My Bank Account",
                to: {
                  pathname: agentData?.userAccess?.bankManagement?.operations
                    ?.viewBankList
                    ? `/dashboard/bankAccount/all`
                    : `/dashboard/addBankAccount`,
                },
                key: "bankAccount",
                role: activeRole(agentRoles),
              },
            ]
          : []),

        ...(companyProfileAccess &&
        agentData?.userAccess?.companyProfile?.operations?.viewCompanyProfile
          ? [
              {
                title: "Company Profile",
                to: `/dashboard/companyProfile`,
                key: "companyProfile",
                role: activeRole(branchRole, subAgentRole),
              },
            ]
          : []),
        {
          title: "Saved Travelers List",
          to: "/dashboard/clientProfile/active",
          key: "clientProfile",
          role: activeRole(agentRoles),
        },
        {
          title: "User Profile",
          to: "/dashboard/userProfile",
          key: "userProfile",
          role: activeRole(agentRoles),
        },
      ],
      // get allKeys() {
      //   return this.subRoutes.map((item) => item.key);
      // },
      allKeys: [
        "markup",
        "emailConfiguration",
        "addSMTP",
        "bankAccount",
        "addBankAccount",
        "companyProfile",
        "clientProfile",
        "addMarkup",
      ],
    },
    // ...(activityAccess
    //   ? [
    //       {
    //         title: "Activity Log",
    //         icon: <RxActivityLog style={{ fontSize: "20px" }} />,
    //         to: "/dashboard/activityLog/all",
    //         role: activeRole(agentRoles),
    //         subRoutes: [],
    //         allKeys: ["activityLog"],
    //       },
    //     ]
    //   : []),

    ...(reportsAccess
      ? [
          {
            title: "Report",
            icon: <BiSolidReport style={{ fontSize: "25px" }} />,
            to: "/dashboard/generalreport/All",
            role: activeRole(agentRoles),
            subRoutes: [
              // ...(reportsAccess?.operations?.searchHistoryReport
              //   ? [
              //       {
              //         title: "Search History Report",
              //         to: "/dashboard/searchreport",
              //         key: "searchreport",
              //         role: activeRole(agentRoles),
              //       },
              //     ]
              //   : []),

              // ...(reportsAccess?.operations?.salesReport
              //   ? [
              //       {
              //         title: "Sales Report",
              //         to: "/dashboard/salesreport",
              //         key: "salesreport",
              //         role: activeRole(agentRoles),
              //       },
              //     ]
              //   : []),

              // ...(reportsAccess?.operations?.branchReports
              //   ? [
              //       {
              //         title: "Branch Reports",
              //         to: "/dashboard/branchReports",
              //         key: "branchReports",
              //         role: activeRole(agentRoles),
              //       },
              //     ]
              //   : []),

              ...(reportsAccess?.operations?.generalLedgerReport
                ? [
                    {
                      title: "General Ledger Report",
                      to: "/dashboard/generalreport/All",
                      key: "generalreport",
                      role: activeRole(agentRoles),
                    },
                  ]
                : []),
            ],
            allKeys: ["generalreport"],
            // get allKeys() {
            //   return this.subRoutes.map((item) => item.key);
            // },
          },
        ]
      : []),

    {
      title: "Security",
      icon: <GppGoodIcon sx={{ fontSize: "25px" }} />,
      to: "/dashboard/support",
      role: activeRole(agentRoles),
      subRoutes: [
        ...(activityAccess
          ? [
              {
                title: "Activity Log",
                icon: <RxActivityLog style={{ fontSize: "20px" }} />,
                to: "/dashboard/activityLog/all",
                role: activeRole(agentRoles),
                subRoutes: [],
                key: "activityLog",
              },
            ]
          : []),
        ...(agentData?.agentCms?.eligibilityCms?.otpControlSettings
          ? [
              {
                title: "OTP Configurations",
                icon: <RxActivityLog style={{ fontSize: "20px" }} />,
                to: "/dashboard/otp-configurations",
                role: activeRole(agentRoles),
                subRoutes: [],
                key: "otp-configurations",
              },
            ]
          : []),
        {
          title: "Device Control",
          icon: <RxActivityLog style={{ fontSize: "20px" }} />,
          to: "/dashboard/device-control",
          role: activeRole(agentRoles),
          subRoutes: [],
          key: "device-control",
        },
      ],
      // allKeys: ["security"],
      get allKeys() {
        return this.subRoutes.map((item) => item.key);
      },
    },
    {
      title: "Support",
      icon: <BiSupport style={{ fontSize: "24px" }} />,
      to: "/dashboard/support/all",
      role: activeRole(agentRoles),
      subRoutes: [],
      allKeys: ["support"],
    },
  ];
};

const popoverStyle = {
  title: {
    fontSize: "15px",
    borderBottom: "2px solid var(--border-color)",
    color: "var(--secondary-color)",
    fontWeight: "600",
    height: "33px",
    display: "flex",
    alignItems: "center",
  },
  subLinks: {
    fontSize: "13.5px",
    borderBottom: "1px solid var(--border-color)",
    color: "var(--secondary-color)",
    fontWeight: "500",
    height: "40px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    textDecoration: "none",
  },
};

const navStyle = (isActive) => ({
  title: {
    textTransform: "capitalize",
    fontSize: "15px",
    lineHeight: "1",
  },
  iconContainer: {
    width: "38px",
    display: "flex",
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
  },
  btn: {
    bgcolor: isActive ? "var(--primary-color)" : "white",
    padding: "0",
    minWidth: "100%",
    color: isActive ? "white" : "var(--gray-3)",
    height: "38px",
    ":hover": {
      bgcolor: isActive ? "var(--primary-color)" : "var(--border-color)",
    },
    display: "flex",
    justifyContent: "unset",
    alignItems: "center",
    gap: "8px",
  },
  textContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    width: "calc(100% - 50px)",
  },
});

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",

  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8.3)})`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 2.2),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default DashboardHome;
