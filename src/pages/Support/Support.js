import { Box, Button, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import PageTitle from "../../shared/common/PageTitle";
import DynamicTable from "../../shared/Tables/DynamicTable";
import { columnObj } from "../../component/AllBookings/AirTicket";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import useWindowSize from "../../shared/common/useWindowSize";
import NotFound from "../../component/NotFound/NoFound";
import { MobileCardSkeleton } from "../../component/Accounts/Deposit/Deposit";
import TableSkeleton from "../../component/SkeletonLoader/TableSkeleton";
import ApiNotFound from "../../component/NotFound/ApiNotFound";
import moment from "moment";
import FlightIcon from "@mui/icons-material/Flight";
import MobileHeader from "../../component/MobileHeader/MobileHeader";
import BottomNavbar from "../../component/Navbar/BottomNavbar/BottomNavbar";
import PaginationBox from "../../shared/common/PaginationBox";

const Support = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jsonHeader } = useAuth();
  const { isMobile } = useWindowSize();
  const [searchById, setSearchById] = useState("");
  const [query, setQuery] = useState(1);

  const {
    data: allTicket,
    status,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user/support-ticket/ticket", id, query],
    queryFn: async () => {
      const { data } = await axios.get(
        id === "all"
          ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/support-ticket/ticket?page=${query}&limit=10`
          : `${process.env.REACT_APP_BASE_URL}/api/v1/user/support-ticket/ticket?status=${id}&page=${query}&limit=10`,
        jsonHeader()
      );
      return data;
    },
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const ticketData = allTicket?.data?.data ?? [];

  const columns = [
    {
      ...flexColumn("id", "Ticket Id", 200),
      renderCell: ({ row }) => (
        <Button
          onClick={() => {}}
          sx={{ width: "50%", bgcolor: "#e7f3f5", color: "#4D4B4B" }}
        >
          <Typography fontSize={"13px"} noWrap>
            {row?.ticketId}
          </Typography>
        </Button>
      ),
    },
    {
      ...flexColumn("ticketStatus", "Ticket Status", 180),
      renderCell: ({ row }) => (
        <Button
          style={{
            backgroundColor:
              row?.ticketStatus === "opened"
                ? "#4cc57b"
                : row?.ticketStatus === "closed"
                  ? "red"
                  : "#f5a142",
            fontSize: "12px",
            color: "#fff",
          }}
        >
          {row?.ticketStatus}
        </Button>
      ),
    },
    {
      ...flexColumn("processingStatus", "Ticket Progress Status", 180),
      renderCell: ({ row }) => (
        <Button
          style={{
            backgroundColor:
              row?.processingStatus === "working"
                ? "var(--secondary-color)"
                : row?.processingStatus === "unsolved"
                  ? "red"
                  : row?.processingStatus === "solved"
                    ? "#4cc57b"
                    : "#f5a142",
            fontSize: "12px",
            color: "#fff",
          }}
        >
          {row?.processingStatus || "Pending"}
        </Button>
      ),
    },
    { ...flexColumn("type", "Type", 180) },
    { ...flexColumn("subject", "subject", 180) },
    { ...flexColumn("lastReplyBy", "Last Reply By") },
    { ...flexColumn("updatedAt", "Last Update", 200) },
  ];

  const tabs = [
    { label: "all" },
    { label: "pending" },
    { label: "opened" },
    { label: "closed" },
  ];

  const handlePageChange = (newPage) => {
    setQuery(newPage);
  };

  return (
    <Box>
      <PageTitle title={"Support Management"} type={"dataGrid"} />
      {isMobile && (
        <>
          <MobileHeader
            title="Deposit Management"
            subTitle={id}
            labelValue={id}
            labelType="select"
            options={tabs.map((tab) => tab.label)}
            onChange={(e) =>
              navigate(`/dashboard/deposits/${e?.target?.value}`)
            }
          />
        </>
      )}

      <Box
        sx={{
          position: "relative",
          pb: 3,
          borderRadius: "5px",
        }}
      >
        {status === "pending" && (
          <>
            {isMobile ? (
              <Box sx={{ px: "5.1%", mt: 5 }}>
                <MobileCardSkeleton />
              </Box>
            ) : (
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: "4px",
                  height: "calc(100vh - 150px)",
                }}
              >
                <TableSkeleton />
              </Box>
            )}
          </>
        )}

        {status === "error" && (
          <Box
            sx={{ mt: { xs: "15px", md: "0" }, px: { xs: "15px", md: "0" } }}
          >
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: "4px",
                height: "calc(100vh - 150px)",
              }}
            >
              {/* <ServerError message={error?.response?.data?.message} /> */}
              <ApiNotFound label={error?.response?.data?.message} />
            </Box>
          </Box>
        )}

        {status === "success" && (
          <>
            {isMobile ? (
              <Box
                sx={{
                  width: "90%",
                  mx: "auto",
                  mt: 5,
                  mb: 10,
                }}
              >
                {ticketData?.length > 0 ? (
                  <>
                    {ticketData?.map((data, i) => (
                      <React.Fragment key={i}>
                        <MobileSupprtCard data={data} />
                        <Divider />
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <Box sx={{ height: "65vh" }}>
                    {!isLoading && <NotFound />}
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ position: "relative", bgcolor: "#fff", pb: 2 }}>
                <DynamicTable
                  data={ticketData || []}
                  columns={columns}
                  tabs={tabs}
                  setSearchById={setSearchById}
                  route={"/dashboard/support"}
                  selectedTab={id}
                />
                <PaginationBox
                  currentPage={allTicket?.data?.meta?.currentPage}
                  totalPages={allTicket?.data?.meta?.totalPages}
                  totalRecords={allTicket?.data?.meta?.totalRecords}
                  onPageChange={handlePageChange}
                  text={"Support"}
                />
              </Box>
            )}
          </>
        )}
      </Box>
      <BottomNavbar />
    </Box>
  );
};

const flexColumn = (field, headerName, width = 150) => ({
  ...columnObj(field, headerName, width),
  flex: 1,
});

const MobileSupprtCard = ({ data }) => {
  return (
    <Box
      sx={{
        borderRadius: "4px",
        px: "15px",
        py: "10px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <FlightIcon
          sx={{
            border: "1px solid",
            borderRadius: "50px",
            p: 0.4,
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {data?.type} | {data?.subType} Department
            </Typography>
            <Box sx={{ width: "55px" }}>
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "white",
                  textTransform: "capitalize",
                  bgcolor: "#18457b",
                  px: 1,
                  py: 0.35,
                  borderRadius: "2px",
                  fontWeight: "300",
                }}
              >
                {data?.ticketStatus}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ ...justifyBetween }}>
            <Typography
              sx={{ fontSize: "11px", fontWeight: "500", color: "#888888" }}
            >
              {data?.updatedAt
                ? moment().diff(moment(data.updatedAt), "minutes") < 1
                  ? "just now"
                  : moment(data.updatedAt).fromNow()
                : ""}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const justifyBetween = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export default Support;
