import { Box, Button, Modal, Tooltip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import PageTitle from "../../shared/common/PageTitle";
import PaginationBox from "../../shared/common/PaginationBox";
import useUnAuthorized from "../../shared/common/useUnAuthorized";
import DynamicTable, {
  activeButton,
  buttonStyle,
} from "../../shared/Tables/DynamicTable";
import { getFilterOptionArray } from "../../utils/functions";
import CustomToast from "../Alert/CustomToast";
import BottomNavbar from "../Navbar/BottomNavbar/BottomNavbar";
import TableSkeleton from "../SkeletonLoader/TableSkeleton";
import { depositBtn } from "../../shared/common/styles";

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
  "today",
  "tomorrow",
  "next 7 days",
  "next 15 days",
  "next 30 days",
  "expired",
]);

const PartiallyDueTicket = () => {
  const navigate = useNavigate();
  const { jsonHeader } = useAuth();
  const [query, setQuery] = useState({ status: "all", page: 1 });
  const [searchById, setSearchById] = useState("");
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const { checkUnAuthorized } = useUnAuthorized();
  const { agentData } = useOutletContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState([
    { bookedAt: "12th Dec 2022", pnr: "2AD4RTX", status: "Hold" },
    { bookedAt: "12th Dec 2022", pnr: "RTA423A", status: "Cancel" },
  ]);

  //TODO:: Fetching data from api
  const { data: partiallyDue, isLoading } = useQuery({
    queryKey: ["partiallyDue", query?.status],
    queryFn: async () => {
      const { status, ...rest } = query;
      const baseUrl = `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/advance-search`;

      const params = new URLSearchParams({
        paymentStatus: "partially paid",
        partialPayment: "true",
        page: query?.page,
        ...rest,
      });

      if (status === "expired") {
        params.delete("partialPaymentDueDateFrom");
      }

      if (status === "all") {
        params.delete("partialPaymentDueDateFrom");
        params.delete("partialPaymentDueDateTo");
      }

      const url = `${baseUrl}?${params.toString()}`;

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

  const FilterButton = () => {
    return (
      <Box sx={{ display: "flex", gap: "12px" }}>
        {allFilterBtn?.map((btn, i) => {
          return (
            <Button
              style={btn?.value === query?.status ? activeButton : buttonStyle}
              sx={{ fontSize: { lg: "11px", xs: "11px" } }}
              key={i}
              onClick={() =>
                setQuery((prev) => {
                  const today = new Date();
                  const formatDate = (d) => d.toISOString().split("T")[0];
                  const addDays = (days) => {
                    const date = new Date(today);
                    date.setDate(today.getDate() + days);
                    return formatDate(date);
                  };

                  if (btn?.value === "all")
                    return { ...prev, status: btn?.value };

                  const dayRanges = {
                    today: [0, 0],
                    tomorrow: [0, 1],
                    "next 7 days": [0, 7],
                    "next 15 days": [0, 15],
                    "next 30 days": [0, 30],
                    expired: [0, 0],
                  };

                  const range = dayRanges[btn?.value];
                  if (range) {
                    return {
                      ...prev,
                      status: btn?.value,
                      partialPaymentDueDateFrom: addDays(range[0]),
                      partialPaymentDueDateTo: addDays(range[1]),
                    };
                  }

                  return { ...prev, status: btn?.value };
                })
              }
            >
              {btn?.label}
            </Button>
          );
        })}
      </Box>
    );
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
            navigate(
              `/dashboard/booking/airtickets/${row?.status}/${row?.id}`,
              {
                state: {
                  agentData: agentData?.userAccess,
                  bookingRowData: row,
                },
              }
            );
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
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: "11px",
              bgcolor: "var(--green)",
              color: "#fff",
              p: 1,
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            {row?.paymentStatus}
          </Typography>
        </Box>
      ),
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

  const handlePageChange = (newPage) => {
    setQuery((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <Box
      sx={{
        "& .MuiDataGrid-cell": { p: { textTransform: "uppercase" } },
      }}
    >
      <Box
        sx={{
          position: "relative",
          pb: 3,
          bgcolor: "white",
          borderRadius: "5px",
        }}
      >
        <PageTitle
          title="Partially Due Ticket"
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
                position: "absolute",
                top: 65,
                left: 22,
                zIndex: 1,
              }}
            >
              <FilterButton />
            </Box>

            <DynamicTable
              data={partiallyDue?.data?.[0]?.bookings}
              columns={columns}
              buttons={[]}
              status={null}
              type="partialDueTicket"
              handleAdvanceFilter={() => setModalOpen(true)}
            />

            <PaginationBox
              currentPage={partiallyDue?.data?.[0]?.meta?.currentPage}
              totalPages={partiallyDue?.data?.[0]?.meta?.totalPages}
              totalRecords={partiallyDue?.data?.[0]?.meta?.totalRecords}
              onPageChange={handlePageChange}
              text="Partially Due Ticket"
            />
          </>
        )}
      </Box>

      <BottomNavbar />

      <ToastContainer />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            ...modalStyle,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "14px", mb: 1 }}>
              Due Date From
            </Typography>
            <Box
              sx={{
                border: "1px solid var(--light-bg)",
                padding: "5px",
                borderRadius: "5px",
              }}
            >
              <input
                type="datetime-local"
                style={{ border: "none", outline: "none" }}
                onChange={(e) =>
                  setQuery((prev) => ({
                    ...prev,
                    partialPaymentDueDateFrom: e.target.value + ":00Z",
                  }))
                }
              />
            </Box>

            <Typography sx={{ fontSize: "14px", my: 1 }}>
              Due Date To
            </Typography>
            <Box
              sx={{
                border: "1px solid var(--light-bg)",
                padding: "5px",
                borderRadius: "5px",
              }}
            >
              <input
                type="datetime-local"
                style={{ border: "none", outline: "none" }}
                onChange={(e) =>
                  setQuery((prev) => ({
                    ...prev,
                    partialPaymentDueDateTo: e.target.value + ":00Z",
                  }))
                }
              />
            </Box>
          </Box>

          <Button
            sx={{ ...depositBtn }}
            disabled={
              !(
                query?.partialPaymentDueDateFrom &&
                query?.partialPaymentDueDateTo
              )
            }
            onClick={() => {
              setModalOpen(false);
              setQuery((prev) => ({
                ...prev,
                status: "filter",
              }));
            }}
          >
            Filter
          </Button>
        </Box>
      </Modal>

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

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  width: "500px",
  height: "300px",
  borderRadius: "10px",
  p: 2,
};

export default PartiallyDueTicket;
