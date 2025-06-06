import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  SwipeableDrawer,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import QueueHeader from "../../pages/Bookings/components/QueueHeader";
import PageTitle from "../../shared/common/PageTitle";
import PaginationBox from "../../shared/common/PaginationBox";
import useUnAuthorized from "../../shared/common/useUnAuthorized";
import useWindowSize from "../../shared/common/useWindowSize";
import DynamicTable, {
  activeButton,
  buttonStyle,
} from "../../shared/Tables/DynamicTable";
import { getFilterOptionArray } from "../../utils/functions";
import CustomToast from "../Alert/CustomToast";
import BottomNavbar from "../Navbar/BottomNavbar/BottomNavbar";
import ApiNotFound from "../NotFound/ApiNotFound";
import NotFound from "../NotFound/NoFound";
import TableSkeleton from "../SkeletonLoader/TableSkeleton";
import AdvancedFilter from "./AdvancedFilter";
import MobileBookingCard from "./components/MobileBookingCard";
import { MobileCardSkeleton } from "../Accounts/Deposit/Deposit";
import { convertCamelToTitle } from "../../shared/common/functions";

export const columnObj = (field, headerName, width = 150) => {
  return { field, headerName, width };
};

export const colorMap = {
  status: "#B279B3",
  tripType: "#52be5a",
  departure: "#2b8fd9",
  carrier: "#be7352",
  bookingClass: "#4999d4",
  ADT: "#2bd99f",
  CNN: "#bf7017",
  INF: "#cf45d8",
  priceMax: "#d84564",
  priceMin: "#4782de",
  departureDateFrom: "#f9a168",
  departureDateTo: "#53828d",
  startDate: "#B279B3",
  endDate: "#52be5a",
};

const allFilterBtn = getFilterOptionArray([
  "all",
  "hold",
  "issue in process",
  "ticketed",
  "refund",
  "reissued",
  "void",
  "cancel",
  "ancillaries",
  // "partially refund",
]);

export const pageButtonStyle = {
  bgcolor: "var(--secondary-color)",
  width: "27px",
  height: "27px",
  borderRadius: "50px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
};

const AirTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const from = params.get("from");
  const { id } = useParams();
  const { jsonHeader } = useAuth();
  const [type, setType] = useState("all");
  const [filterBtn, setFilterBtn] = useState([...allFilterBtn]);
  const [query, setQuery] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isAdvanceFilter, setIsAdvanceFilter] = useState(false);
  const [filterQuery, setFilterQuery] = useState({});
  const [filterSearch, setFilterSearch] = useState(false);
  const [searchById, setSearchById] = useState("");
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const { checkUnAuthorized } = useUnAuthorized();

  const { isMobile } = useWindowSize();
  const { agentData } = useOutletContext();

  const handleTypeChange = (event, newTab) => {
    if (event?.target?.value) {
      setType(event?.target?.value);
      navigate(`/dashboard/booking/airtickets/${event?.target?.value}`);
    } else {
      setType(newTab);
    }
  };

  //TODO:: Fetching data from api
  const {
    data: bookingData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "bookingData",
      id,
      query,
      filterSearch,
      searchById && searchById.length >= 5 ? searchById : null,
    ],
    queryFn: async () => {
      const { status, ...filteredQuery } = filterQuery;

      const cleanedQuery = Object.fromEntries(
        Object.entries(filteredQuery).filter(([key, value]) => value !== "")
      );

      const queryString = qs.stringify(cleanedQuery);

      let url;

      if (searchById && searchById.length >= 5) {
        if (id === "all") {
          url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/advance-search?searchTerm=${searchById}`;
        } else {
          url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/advance-search?status=${id}&searchTerm=${searchById}`;
        }
      } else {
        if (id === "all" || id === "back") {
          url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/advance-search?page=${query}${
            queryString ? `&${queryString}` : ""
          }`;
        } else if (id === "ancillaries") {
          url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/ancillary-requests?page=${query}`;
        } else if (id.startsWith("ancillaries-")) {
          const status = id.split("ancillaries-")[1];
          url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/ancillary-requests?status=${status}&page=${query}${
            queryString ? `&${queryString}` : ""
          }`;
        } else {
          url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/advance-search?status=${id}&page=${query}${
            queryString ? `&${queryString}` : ""
          }`;
        }
      }

      const { data } = await axios.get(url, jsonHeader());
      return data;
    },
    onError: (err) => {
      if (err?.response?.status === 401) {
        showToast("error", "You are unauthorized to access this site.");
        checkUnAuthorized(err);
      } else {
        console.error("An error occurred:", err);
      }
    },
  });

  const handleSearchClick = () => {
    setIsAdvanceFilter(false);
    setFilterSearch(true);
    navigate(
      `/dashboard/booking/airtickets/${filterQuery?.status || activeFilter}`
    );
    refetch();
  };

  const resetFilter = () => {
    setFilterQuery({});
    setFilterSearch(false);
    navigate(`/dashboard/booking/airtickets/all`);
    refetch();
  };

  // Status toggle for dataGrid
  function getTotalPassengers(passengers) {
    return passengers.reduce((total, passenger) => total + passenger.count, 0);
  }

  // Columns for table
  const columns = [
    {
      ...columnObj("bookingId", "Reference", 120),
      renderCell: ({ row }) => (
        <Button
          sx={{
            fontSize: "12px",
            bgcolor: "#e7f3f5",
            color: "#4D4B4B",
          }}
          onClick={() => {
            navigate(`/dashboard/booking/airtickets/${id}/${row?.id}`, {
              state: {
                agentData: agentData?.userAccess,
                bookingRowData: row,
                fromNavigation: true,
              },
            });

            sessionStorage.setItem(row?.bookingId, "true");
          }}
        >
          {row?.bookingId}
        </Button>
      ),
    },
    {
      ...columnObj("status", "Status", 170),
      renderCell: ({ row }) => {
        const statusColors = {
          hold: "#B279B3",
          ticketed: "#52be5a",
          void: "#2b8fd9",
          "issue in process": "#be7352",
          "void request": "#4999d4",
          refund: "#2bd99f",
          "refund request": "#bf7017",
          "refund to be confirmed": "#cf45d8",
          "refund on process": "#d84564",
          "reissue request": "#4782de",
          // "partially refund": "#53828d",
          refunding: "#f9a168",
          "reissue on process": "#53828d",
          "reissue to be confirmed": "#581845",
        };
        return (
          <Button
            sx={{
              fontSize: "10px",
              backgroundColor: statusColors[row?.status] || "red",
              ":hover": {
                backgroundColor: statusColors[row?.status] || "red",
              },
              color: "#fff",
            }}
          >
            {row?.status}
          </Button>
        );
      },
    },
    {
      ...columnObj("branch", "Branch", 130),
      renderCell: ({ row }) => {
        const user = row?.firstActivityLog?.user;

        return (
          <p>{user?.type === "agent" ? "Main Branch" : user?.branchName}</p>
        );
      },
    },
    {
      ...columnObj("destination", "Destination", 150),
      renderCell: ({ row }) => {
        const routes = row?.details?.route;
        const tripType = row?.tripType;
        return (
          <Typography
            sx={{
              fontSize: "14px",
              color: "#4D4B4B",
              pt: "17px",
              fontWeight: "500",
            }}
          >
            {routes && tripType === "oneWay" && (
              <>
                {routes[0]?.departure} - {routes[routes?.length - 1]?.arrival}
              </>
            )}
            {routes && tripType === "return" && (
              <>
                {routes[0]?.departure} - {routes[0]?.arrival} -{" "}
                {routes[routes?.length - 1]?.arrival}
              </>
            )}
            {routes && tripType === "multiCity" && (
              <>
                {routes.map((city, i, arr) => (
                  <React.Fragment key={i}>
                    {city?.departure}
                    {i < arr.length - 1 && " - "}
                    {i === arr.length - 1 && ` - ${city?.arrival}`}
                  </React.Fragment>
                ))}
              </>
            )}
            {!routes && "No route information available"}
          </Typography>
        );
      },
    },
    columnObj("tripType", "Trip Type", 100),

    {
      ...columnObj("carrier", "Carrier Name", 170),
      renderCell: ({ row }) => (
        <>
          {row?.carrierName?.length > 15 ? (
            <Tooltip
              title={
                <p>
                  {row?.carrierName} ({row?.carrier})
                </p>
              }
            >
              <p>{row?.carrierName?.slice(0, 15)}...</p>
            </Tooltip>
          ) : (
            <>
              {row?.carrierName} ({row?.carrier})
            </>
          )}
        </>
      ),
    },
    {
      ...columnObj("paxCount", "Pax Count", 120),
      renderCell: ({ row }) => {
        const passengers = row?.details?.passengers || [];
        const totalPassengers = getTotalPassengers(passengers);
        return (
          <p>
            {totalPassengers} {totalPassengers === 1 ? "Person" : "Persons"}
          </p>
        );
      },
    },
    {
      ...columnObj("paymentStatus", "Payment Status", 130),
      renderCell: ({ row }) => <p>{row?.paymentStatus}</p>,
    },
    {
      ...columnObj("timeLimit", "Time Limit", 130),
      renderCell: ({ row }) => {
        const { fareTimeLimit, timeLimit } = row;

        const formatDate = (dateString) => {
          return moment(dateString).format("DD MMM, YYYY");
        };

        if (!fareTimeLimit && !timeLimit) {
          return (
            <p style={{ color: "var(--primary-color)" }}>Immediate Issue</p>
          );
        }

        if (!fareTimeLimit) {
          return <p>{formatDate(timeLimit)}</p>;
        }

        if (!timeLimit) {
          return <p>{formatDate(fareTimeLimit)}</p>;
        }

        const lowerDate =
          new Date(fareTimeLimit) < new Date(timeLimit)
            ? fareTimeLimit
            : timeLimit;

        return <p>{formatDate(lowerDate)}</p>;
      },
    },
    {
      ...columnObj("createdAt", "Booking Date", 130),
      renderCell: ({ row }) => (
        <p>{moment(row?.createdAt).format("DD MMM, YYYY")}</p>
      ),
    },
    {
      ...columnObj("flightDate", "Flight Date", 130),
      renderCell: ({ row }) => (
        <p>
          {moment(row?.details?.route?.[0]?.departureDate).format(
            "DD MMM, YYYY"
          )}
        </p>
      ),
    },
    {
      headerAlign: "center",
      align: "center",
      ...columnObj("agentPrice", "Paid Amount", 130),
      renderCell: ({ row }) => (
        <p>{row?.agentPrice?.toLocaleString("en-IN")} BDT</p>
      ),
    },
    {
      headerAlign: "center",
      align: "center",
      ...columnObj("clientPrice", "Client Price", 130),
      renderCell: ({ row }) => (
        <p>{row?.clientPrice?.toLocaleString("en-IN")} BDT</p>
      ),
    },
    {
      ...columnObj("platform", "platform", 90),
      renderCell: ({ row }) => row?.firstActivityLog?.devicePlatform || "N/A",
    },
    {
      ...columnObj("email", "Client Email", 200),
      renderCell: ({ row }) => row?.email || "N/A",
    },
    {
      ...columnObj("phoneNumber", "Client Phone", 120),
      renderCell: ({ row }) => row?.phoneNumber || "N/A",
    },
  ];

  const ancillaryColumns = [
    {
      ...columnObj("bookingAncillaryRequestId", "Ancillary ID", 120),
      headerClassName: "sticky-column",
      cellClassName: "sticky-column",
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Button
            onClick={() => {
              navigate(`/dashboard/booking/ancillaries/${row?.bookingId}`, {
                state: {
                  bookingId: `${row?.bookingId}`,
                  from: "air-ticket",
                },
              });
            }}
            sx={{ fontSize: "12px", bgcolor: "#e7f3f5", color: "#4D4B4B" }}
          >
            {row?.bookingAncillaryRequestId}
          </Button>
        </Box>
      ),
    },
    {
      ...columnObj("status", "STATUS", 100),
      renderCell: ({ row }) => (
        <Button
          size="small"
          style={{
            fontSize: "12px",
            backgroundColor:
              row?.status === "pending"
                ? " #B279B3"
                : row?.status === "approved"
                  ? " #52be5a"
                  : "red",
            color: "#fff",
            cursor: "default",
          }}
        >
          {row?.status}
        </Button>
      ),
    },
    {
      ...columnObj("bookingId", "BOOKING ID", 120),
      headerClassName: "sticky-column",
      cellClassName: "sticky-column",
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Button
            sx={{ fontSize: "12px", bgcolor: "#e7f3f5", color: "#4D4B4B" }}
            onClick={() => {
              navigate(
                `/dashboard/booking/airtickets/${id}/${row?.bookingId}`,
                {
                  state: {
                    agentData: agentData?.userAccess,
                    bookingRowData: row,
                  },
                }
              );
            }}
          >
            {row?.booking?.bookingId}
          </Button>
        </Box>
      ),
    },
    {
      ...columnObj("bookingStatus", "Booking Status", 150),
      renderCell: ({ row }) => (
        <Button
          size="small"
          style={{
            fontSize: "12px",
            backgroundColor:
              row?.booking?.status === "hold"
                ? "#B279B3"
                : row?.booking?.status === "ticketed"
                  ? "#52be5a"
                  : row?.booking?.status === "void"
                    ? "#2b8fd9"
                    : row?.booking?.status === "issue in process"
                      ? "#be7352"
                      : row?.booking?.status === "void request"
                        ? "#4999d4"
                        : row?.booking?.status === "refund"
                          ? "#2bd99f"
                          : row?.booking?.status === "refund request"
                            ? " #bf7017 "
                            : row?.booking?.status === "refund to be confirmed"
                              ? "#cf45d8"
                              : row?.booking?.status ===
                                  "reissue to be confirmed"
                                ? "#cf45d8"
                                : row?.booking?.status === "refund on process"
                                  ? "#d84564"
                                  : row?.booking?.status === "reissue request"
                                    ? "#4782de "
                                    : "red",
            color: "#fff",
            cursor: "default",
          }}
        >
          {row?.booking?.status}
        </Button>
      ),
    },
    {
      ...columnObj("pnr", "Airlines PNR", 110),
      renderCell: ({ row }) => (
        <Typography
          sx={{
            textTransform: "capitalize",
            display: "flex",
            alignItems: "center",
            height: "100%",
            fontSize: "13px",
          }}
        >
          {row?.booking?.airlinePnr || "N/A"}
        </Typography>
      ),
    },
    {
      ...columnObj("route", "Route", 130),
      renderCell: ({ row }) => {
        return (
          <Typography
            sx={{
              textTransform: "capitalize",
              display: "flex",
              alignItems: "center",
              height: "100%",
              fontSize: "13px",
            }}
          >
            <>
              {row?.ancillaries?.[0]?.route?.arrival +
                " - " +
                row?.ancillaries?.[0]?.route?.departure}
            </>
          </Typography>
        );
      },
    },
    {
      ...columnObj("departureDate", "Departure Date", 140),
      renderCell: ({ row }) => {
        return (
          <Typography
            sx={{
              textTransform: "capitalize",
              display: "flex",
              alignItems: "center",
              height: "100%",
              fontSize: "13px",
            }}
          >
            <>
              {moment(row?.ancillaries?.[0]?.route?.departureDate).format(
                "DD MMM, YYYY"
              ) || "N/A"}
            </>
          </Typography>
        );
      },
    },
    {
      ...columnObj("ancillaries", "Ancillaries", 250),
      renderCell: ({ row }) => {
        return (
          <Typography
            sx={{
              textTransform: "capitalize",
              display: "flex",
              alignItems: "center",
              height: "100%",
              fontSize: "13px",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {row?.ancillaries?.map((ancillary) => (
                <Box
                  sx={{
                    border: "1px solid var(--border)",
                    borderRadius: "3px",
                    padding: "0px 5px",
                  }}
                >
                  <Typography sx={{ fontSize: "13px" }}>
                    {ancillary?.type}
                  </Typography>
                </Box>
              )) || "N/A"}
            </Box>
          </Typography>
        );
      },
    },
    {
      ...columnObj("createdAt", "BOOK DATE", 140),
      renderCell: ({ row }) => {
        return (
          <Typography
            sx={{
              textTransform: "capitalize",
              display: "flex",
              alignItems: "center",
              height: "100%",
              fontSize: "13px",
            }}
          >
            <>{moment(row?.createdAt).format("DD MMM, YYYY") || "N/A"}</>
          </Typography>
        );
      },
    },
  ];

  const handleGetFilterBtn = (value) => {
    if (value === "refund") {
      setFilterBtn(
        getFilterOptionArray([
          "refund",
          "refund request",
          "refund to be confirmed",
          "refund on process",
          "refunding",
          // "partially refund",
          "back",
          // "issue reject",
        ])
      );
    } else if (value === "reissued") {
      setFilterBtn(
        getFilterOptionArray([
          "reissued",
          "reissue request",
          "reissue to be confirmed",
          "reissue on process",
          "back",
        ])
      );
    } else if (value === "void") {
      setFilterBtn(
        getFilterOptionArray(["void", "void request", "void reject", "back"])
      );
    } else if (value === "cancel") {
      setFilterBtn(
        getFilterOptionArray(["cancel", "issue reject", "failed", "back"])
      );
    } else if (value === "ancillaries") {
      setFilterBtn([
        { label: "ancillaries", value: "ancillaries" },
        { label: "pending", value: "ancillaries-pending" },
        { label: "to be confirmed", value: "ancillaries-to be confirmed" },
        { label: "processing", value: "ancillaries-processing" },
        { label: "approved", value: "ancillaries-approved" },
        { label: "canceled", value: "ancillaries-canceled" },
        { label: "rejected", value: "ancillaries-rejected" },
        { label: "back", value: "back" },
      ]);
    } else if (value === "back") {
      setFilterBtn([...allFilterBtn]);
    }
  };

  useEffect(() => {
    setActiveFilter(id);
    handleGetFilterBtn(
      id.includes("-")
        ? id.split("-")[0]
        : id.includes(" ")
          ? id.split(" ")[0]
          : id
    );
  }, [id, activeFilter]);

  const FilterButton = () => {
    return (
      <Box sx={{ display: "flex", gap: "12px" }}>
        {filterBtn?.map((btn, i) => {
          return (
            <Button
              style={
                btn?.label === "back"
                  ? { ...activeButton, backgroundColor: "var(--dark-gray)" }
                  : btn?.value === activeFilter
                    ? activeButton
                    : buttonStyle
              }
              key={i}
              sx={{ fontSize: { lg: "11px", xs: "11px" } }}
              onClick={() => {
                if (btn?.value === "back") {
                  setQuery(1);
                  setActiveFilter("all");
                  navigate(`/dashboard/booking/airtickets/all`);
                } else if (id === "all") {
                  setQuery(1);
                  setActiveFilter("all");
                } else {
                  setQuery(1);
                  setActiveFilter(btn?.value);
                }
                handleGetFilterBtn(btn?.value);
                if (btn?.value !== "back") {
                  setSearchById("");
                  navigate(`/dashboard/booking/airtickets/${btn?.value}`);
                }
              }}
            >
              {btn?.label}
            </Button>
          );
        })}
      </Box>
    );
  };

  const FilterButtonMobile = () => {
    return (
      <Select
        value={type}
        onChange={handleTypeChange}
        displayEmpty
        inputProps={{ "aria-label": "Select Type" }}
        IconComponent={ArrowDropDownIcon}
        sx={{
          width: "100%",
          bgcolor: "var(--primary-color)",
          color: "white",
          textAlign: "left",
          mt: "4px",
          "&:focus": {
            outline: "none",
          },
          "& .MuiSelect-icon": {
            color: "white",
          },
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 250,
              overflowY: "auto",
            },
          },
        }}
      >
        {allFilterBtn?.map((tab, index) => {
          return (
            <MenuItem
              key={index}
              value={tab?.value}
              sx={{
                textTransform: "capitalize",
                display: "flex",
              }}
            >
              <Typography
                sx={{
                  textTransform: "uppercase",
                  fontSize: "14px",
                  mt: 0.4,
                }}
              >
                {tab?.label}
              </Typography>
            </MenuItem>
          );
        })}
      </Select>
    );
  };

  const FilterQueryButton = () => {
    return (
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          maxWidth: "100%",
        }}
      >
        {Object.keys(filterQuery)
          .filter((key) => filterQuery[key])
          .map((key, i) => {
            const value = filterQuery[key];
            const color = colorMap[key] || "#53828d";

            return (
              <Tooltip title={key.toUpperCase()} key={i}>
                <Button
                  style={{
                    ...activeButton,
                    backgroundColor: color,
                    flexBasis: "auto",
                    marginBottom: "8px",
                  }}
                  sx={{
                    fontSize: { lg: "11px", xs: "11px" },
                    minWidth: "fit-content",
                  }}
                >
                  {value}
                </Button>
              </Tooltip>
            );
          })}

        {/* Add a Refresh button */}
        <Button
          style={{
            backgroundColor: "#f9a168",
            color: "#fff",
            fontSize: "11px",
            marginBottom: "8px",
          }}
          onClick={() => {
            resetFilter();
          }}
        >
          Reset
        </Button>
      </Box>
    );
  };

  if (isError) {
    return (
      <Box>
        <Box
          sx={{
            display: {
              xs: "block",
              lg: "none",
            },
          }}
        >
          <QueueHeader type={type} tabs={allFilterBtn} />
        </Box>
        <Box
          sx={{
            bgcolor: "white",
            height: "calc(93vh - 150px)",
            borderRadius: "5px",
            display: {
              xs: "none",
              lg: "block",
            },
          }}
        >
          <ApiNotFound label={error?.response?.data?.message} />
        </Box>
      </Box>
    );
  }

  const handlePageChange = (newPage) => {
    setQuery(newPage);
  };

  const handleAdvanceFilter = () => {
    setIsAdvanceFilter(!isAdvanceFilter);
  };

  if (isLoading && bookingData?.data[0]?.bookings?.length === 0) {
    return (
      <Box
        sx={{
          bgcolor: "white",
          height: "calc(93vh - 110px)",
          borderRadius: "5px",
        }}
      >
        <PageTitle
          title={"All Flight Bookings"}
          type={"dataGrid"}
          setSearchById={setSearchById}
        />
        <Box sx={{ pt: "19px", px: "18px" }}>
          {isMobile ? (
            <Box
              sx={{
                width: {
                  xs: "90%",
                },
                height: "40px",
                borderRadius: isMobile ? "2px" : "5px",
                overflow: "hidden",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                left: "4.7%",
              }}
            >
              <FilterButtonMobile />
            </Box>
          ) : filterSearch ? (
            <FilterQueryButton />
          ) : (
            <FilterButton />
          )}
        </Box>
        <NotFound />
      </Box>
    );
  }

  const processBookingData = (bookings) => {
    return bookings.map((row) => {
      const routes = row?.details?.route;
      const tripType = row?.tripType;
      const passengers = row?.details?.passengers || [];
      const totalPassengers = getTotalPassengers(passengers);
      const user = row?.firstActivityLog?.user;
      const { fareTimeLimit, timeLimit } = row;
      const platform = row?.firstActivityLog?.devicePlatform;

      const formatDate = (dateString) => {
        return dateString ? moment(dateString).format("DD MMM, YYYY") : "";
      };

      const lowerDate =
        fareTimeLimit && timeLimit
          ? new Date(fareTimeLimit) < new Date(timeLimit)
            ? fareTimeLimit
            : timeLimit
          : fareTimeLimit || timeLimit;

      return {
        ...row,
        branch:
          user?.type === "agent" ? "Main Branch" : user?.branchName || "N/A",
        destination: (() => {
          if (!routes) return "No route information available";
          if (tripType === "oneWay") {
            return `${routes[0]?.departure} - ${routes[routes.length - 1]?.arrival}`;
          }
          if (tripType === "return") {
            return `${routes[0]?.departure} - ${routes[0]?.arrival} - ${
              routes[routes.length - 1]?.arrival
            }`;
          }
          if (tripType === "multiCity") {
            return routes
              .map(
                (city, i, arr) =>
                  `${city?.departure}${i < arr.length - 1 ? " - " : ` - ${city?.arrival}`}`
              )
              .join("");
          }
          return "";
        })(),
        paxCount: `${totalPassengers} ${totalPassengers === 1 ? "Person" : "Persons"}`,
        flightDate: formatDate(routes?.[0]?.departureDate),
        timeLimit: lowerDate
          ? formatDate(lowerDate)
          : row?.fareTimeLimit || row?.timeLimit
            ? formatDate(row?.fareTimeLimit || row?.timeLimit)
            : "Immediate Issue",
        platform: platform || "N/A",
      };
    });
  };

  const transformedBookings = bookingData?.data?.[0]?.bookings
    ? processBookingData(bookingData.data[0].bookings)
    : [];

  return (
    <Box
      sx={{
        "& .MuiDataGrid-cell": { p: { textTransform: "uppercase" } },
      }}
    >
      {isMobile ? (
        <Box>
          <Box
            sx={{
              position: "sticky",
              top: 0,
              height: "120px",
              bgcolor: "var(--secondary-color)",
              width: "100%",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                width: "90%",
                height: "100%",
                mx: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <ArrowBackIosNewIcon
                onClick={() => navigate("/dashboard/searchs")}
                sx={{ fontSize: "1.3rem", color: "#FFFFFF" }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{ fontSize: "17px", color: "#fff", textAlign: "center" }}
                >
                  Queues
                </Typography>
                <Typography sx={{ fontSize: "11px", color: "#7C92AC" }}>
                  <span style={{ textTransform: "capitalize" }}>{type}</span>{" "}
                  Booking
                </Typography>
              </Box>
              <SearchIcon sx={{ fontSize: "1.3rem", color: "#FFFFFF" }} />
            </Box>

            {/* dropdown */}

            <Box
              sx={{
                width: {
                  xs: "90%",
                },
                height: "40px",
                borderRadius: isMobile ? "2px" : "5px",
                overflow: "hidden",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                bottom: "-20px",
                left: "4.9%",
              }}
            >
              <FilterButtonMobile />
            </Box>
          </Box>
          <Box sx={{ width: "90%", mx: "auto", mt: 5 }}>
            {isLoading && <MobileCardSkeleton />}
          </Box>
          {bookingData?.data[0]?.bookings.length > 0 ? (
            <Stack spacing={1} sx={{ width: "90%", mx: "auto", mt: 5, mb: 10 }}>
              {!isLoading &&
                bookingData?.data[0]?.bookings?.map((booking, index) => (
                  <Link
                    key={index}
                    to={`/dashboard/booking/airtickets/${type}/${booking?.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <MobileBookingCard booking={booking} />
                  </Link>
                ))}
            </Stack>
          ) : (
            <Box sx={{ height: "65vh", mx: "5%", mt: 5 }}>
              {!isLoading && <NotFound />}
            </Box>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            position: "relative",
            pb: 3,
            bgcolor: "white",
            borderRadius: "5px",
          }}
        >
          <PageTitle
            title={from ? convertCamelToTitle(id) : "All Bookings Table"}
            type={"dataGrid"}
            searchById={searchById}
            setSearchById={setSearchById}
          />

          {isLoading ? (
            <Box sx={{ bgcolor: "white", borderRadius: "5px" }}>
              <Box
                sx={{
                  height: "80vh",
                  display: {
                    xs: "none",
                    lg: "block",
                  },
                }}
              >
                <TableSkeleton />
              </Box>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: from === "dashboard" && "none",
                  position: "absolute",
                  top: 65,
                  left: 22,
                  zIndex: 1,
                }}
              >
                {!filterSearch ? <FilterButton /> : <FilterQueryButton />}
              </Box>

              <DynamicTable
                route={"/dashboard/booking/airticket"}
                data={transformedBookings}
                columns={
                  id.includes("ancillaries") ? ancillaryColumns : columns
                }
                title="All Flight Bookings"
                type={"flightBookings"}
                buttons={[]}
                status={null}
                selectedTab={id}
                pagesRecord={bookingData?.data?.[0]?.meta}
                handleAdvanceFilter={handleAdvanceFilter}
                setSearchById={setSearchById}
              />

              <PaginationBox
                currentPage={bookingData?.data?.[0]?.meta?.currentPage}
                totalPages={bookingData?.data?.[0]?.meta?.totalPages}
                totalRecords={bookingData?.data?.[0]?.meta?.totalRecords}
                onPageChange={handlePageChange}
                text={"Bookings"}
              />
            </>
          )}
        </Box>
      )}
      <BottomNavbar />
      <SwipeableDrawer
        anchor="right"
        open={isAdvanceFilter}
        PaperProps={{
          sx: { width: "30%", zIndex: 999999999 },
        }}
      >
        <AdvancedFilter
          setIsAdvanceFilter={setIsAdvanceFilter}
          filterQuery={filterQuery}
          setFilterQuery={setFilterQuery}
          handleSearchClick={handleSearchClick}
        />
      </SwipeableDrawer>

      <ToastContainer />
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
        type="notification"
      />
    </Box>
  );
};

export default AirTicket;
