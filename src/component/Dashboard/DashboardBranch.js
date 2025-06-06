import {
  Box,
  Button,
  Divider,
  Grid,
  Tooltip as MUITooltip,
  Skeleton,
  styled,
  Typography,
} from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { addDays } from "date-fns";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../../context/AuthProvider";
import { convertCamelToTitle, getOrdinal } from "../../shared/common/functions";
import DynamicTable, { activeButton } from "../../shared/Tables/DynamicTable";
import { columnObj } from "../AllBookings/AirTicket";
import ServerError from "../Error/ServerError";
import MobileHeader from "../MobileHeader/MobileHeader";
import BottomNavbar from "../Navbar/BottomNavbar/BottomNavbar";
import NotFound from "../NotFound/NoFound";
import { ChartSkeleton } from "./components/DashboardLineChart";
import {
  BoxSkeleton,
  CustomPieChart,
  operationBtn,
  PieChartContentIndicator,
  staffActivityColumn,
  StaffSkeleton,
} from "./DashStatistics";
import Loader from "../Loader/Loader";
import useWindowSize from "../../shared/common/useWindowSize";

const data01 = [
  { name: "Air Tickets", value: 32, color: "#fea834" },
  { name: "Group Fare", value: 18, color: "var(--green)" },
  { name: "Hotel", value: 22, color: "#1A73E8" },
  { name: "Holidays", value: 28, color: "#D81B60" },
];

const layout = {
  border: "1px solid var(--border-color)",
  p: { xs: "10px", lg: "10px 20px" },
  borderRadius: "4px",
  height: "100%",
};

const DashboardBranch = () => {
  const { jsonHeader } = useAuth();
  const { isMobile } = useWindowSize();
  const [topPerforming, setTopPerforming] = useState({
    type: "",
    totalCount: "",
    data: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const BorderLinearProgress = styled(LinearProgress)(() => ({
    height: isMobile ? 7 : 24,
    borderRadius: 4,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: "#E7F1FF",
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 2,
      backgroundColor: "var(--secondary-color)",
    },
  }));

  const { data: summaryData, status } = useQuery({
    queryKey: ["report/branch/summary"],
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/report/branch/summary`,
        {
          from: moment(new Date()).format("YYYY-MM-DD"),
          to: moment(new Date()).format("YYYY-MM-DD"),
        },
        jsonHeader()
      );

      return data?.data;
    },
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    handleChangePerformance({ target: { value: "search" } });
  }, []);

  const handleChangePerformance = async (e) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/report/branch/top-performing`,
        {
          from: moment(new Date()).format("YYYY-MM-DD"),
          to: moment(new Date()).format("YYYY-MM-DD"),
          item: e.target.value,
          limit: 10,
        },
        jsonHeader()
      );
      setTopPerforming({
        type: e.target.value,
        totalCount: data?.data?.totalCount,
        data: data?.data?.data,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MobileHeader
        title={"Dashboard Statistics"}
        labelType="title"
        labelValue={"Dashboard Live"}
      />
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "3px",
          p: { xs: 1.5, lg: 3 },
          width: {
            xs: "100%",
            lg: "100%",
          },
          mx: "auto",
          mt: {
            xs: 5,
            lg: 0,
          },
          mb: {
            xs: 10,
            lg: 0,
          },
        }}
      >
        <Grid container spacing={{ xs: "10px", lg: "20px" }}>
          {status === "pending" ? (
            <BoxSkeleton />
          ) : (
            <>
              {summaryData?.data.map((d, i) => {
                return (
                  <Grid item lg={3} xs={6} key={i}>
                    <Box sx={layout}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: { xs: "11px", lg: "16px" } }}
                          variant="body2"
                        >
                          {convertCamelToTitle(d?.name)}
                        </Typography>
                        {!isMobile && (
                          <Typography
                            sx={{
                              fontSize: { xs: "11px", lg: "16px" },
                              color: "#9E9E9E",
                            }}
                            variant="body2"
                          >
                            {moment(summaryData?.to).format("Do MMM YYYY")}
                          </Typography>
                        )}
                      </Box>

                      <Typography
                        sx={{
                          fontSize: { xs: "13px", lg: "28px" },
                          // borderBottom: "1px solid var(--border)",
                        }}
                      >
                        {d?.value ? d?.value : 0}{" "}
                        {d?.name !== "search" && "BDT"}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      {/* <Typography
                        variant="body2"
                        sx={{
                          color: "var(--green)",
                          mt: 0.5,
                          visibility: "hidden",
                        }}
                      >
                        14 % Less or More Than Yesterday
                      </Typography> */}
                      <Typography
                        sx={{
                          fontSize: { xs: "11px", lg: "16px" },
                          color: "green",
                        }}
                        variant="body2"
                      >
                        {moment(summaryData?.to).format("Do MMM YYYY")}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </>
          )}

          {/* Sales Channel */}
          <Grid item lg={4} xs={12}>
            <Box sx={{ ...layout, position: "relative" }}>
              <Typography
                sx={{
                  color: "var(--secondary-color)",
                  fontWeight: "500",
                  fontSize: { xs: "13px", sm: "16px" },
                }}
              >
                Sales Chanel
              </Typography>

              <Box sx={{ height: "260px" }}>
                <CustomPieChart
                  pieChartData={data01}
                  width={"65%"}
                  innerRadius={isMobile ? 40 : 70}
                  outerRadius={isMobile ? 50 : 90}
                />
              </Box>

              <Box sx={{ position: "absolute", top: "55px", right: "24px" }}>
                <PieChartContentIndicator pieChartData={data01} />
              </Box>

              {/* <Typography variant="body2">
                More than 1,200,000 sales are made using travel Zoo, and 700,000
                are from Fly Far International.
              </Typography> */}
            </Box>
          </Grid>

          {/* Revenue  */}
          <Grid item lg={8} xs={12}>
            <Box sx={layout}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--gray-3)",
                    fontWeight: "500",
                    fontSize: { xs: "13px", lg: "16px" },
                  }}
                >
                  Top Performing Branch
                </Typography>
                <select
                  onChange={handleChangePerformance}
                  style={{
                    ...inputStyle,
                    width: isMobile ? "110px" : "150px",
                    fontSize: isMobile ? "11px" : "16px",
                  }}
                >
                  <option value="search">Search</option>
                  <option value="ticketed">Ticketed</option>
                  <option value="refund">Refund</option>
                  <option value="reissue">Reissue</option>
                  <option value="void">Void</option>
                  <option value="fundTransfer">Fund Transfer</option>
                  <option value="fundReturned">Fund Return</option>
                </select>
              </Box>

              <Box sx={{ height: "250px", width: "100%", overflowY: "auto" }}>
                {isLoading ? (
                  <PerformanceLoader />
                ) : (
                  <>
                    {topPerforming?.data && topPerforming?.data?.length > 0 ? (
                      <>
                        {topPerforming?.data?.map((performance, i) => {
                          return (
                            <Box key={i} mt={2.5} sx={{ position: "relative" }}>
                              <Typography
                                sx={{
                                  color: "var(--gray-3)",
                                  fontWeight: "500",
                                  mb: 1,
                                  fontSize: { xs: "11px", lg: "16px" },
                                }}
                              >
                                {performance?.branchAddress} Branch (
                                {performance?.value})
                              </Typography>
                              <BorderLinearProgress
                                variant="determinate"
                                value={performance?.value}
                              />
                              <Typography
                                sx={{
                                  ...progressStyle?.rankText,
                                  fontSize: { xs: "11px", lg: "16px" },
                                }}
                              >
                                {getOrdinal(i + 1)}
                              </Typography>
                            </Box>
                          );
                        })}
                      </>
                    ) : (
                      <NotFound label="" message="" fontSize="0.85rem" />
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <DashboardBranchLineChart />
          </Grid>

          <Grid item xs={12}>
            <BranchActivity />
          </Grid>
        </Grid>
      </Box>
      {/* --- Mobile Bottom Navbar start --- */}
      <BottomNavbar />
      {/* --- Mobile Bottom Navbar end --- */}
    </>
  );
};

const inputStyle = {
  width: "100%",
  height: "37px",
  borderRadius: "4px",
  outline: "none",
  border: "1px solid #DEE0E4",
  paddingLeft: "15px",
};

const progressStyle = {
  rankText: {
    position: "absolute",
    top: "5px",
    right: "5px",
    fontSize: "14px",
    color: "var(--dark-gray)",
  },
};

const DashboardBranchLineChart = () => {
  const { jsonHeader } = useAuth();
  const { isMobile } = useWindowSize();
  const [chartData, setChartData] = useState([]);
  const [activeTab, setActiveTab] = useState("booking");
  const [filterBody, setFilterBody] = useState(initialBookingBody);

  const { isLoading, isError, error } = useQuery({
    queryKey: ["report/branch", filterBody],
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/report/branch`,
        filterBody,
        jsonHeader()
      );

      setChartData(data?.data);
      return data?.data;
    },
    retry: false,
    staleTime: 0,
  });

  const handleChangeTab = (tab) => {
    setActiveTab(tab);

    if (tab === "booking") {
      setFilterBody(initialBookingBody);
    } else if (tab === "search") {
      setFilterBody(initialSearchBody);
    } else if (tab === "fundTransfer") {
      setFilterBody(initialFundBody);
    } else if (tab === "fundReturned") {
      setFilterBody(initialReturnBody);
    }
  };

  return (
    <Box sx={layout}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1,
        }}
      >
        <Typography
          sx={{
            color: "var(--secondary-color)",
            fontWeight: "500",
            textTransform: "capitalize",
            fontSize: { xs: "13px", sm: "16px" },
          }}
        >
          {convertCamelToTitle(activeTab)} Operation
        </Typography>

        <Box
          sx={{
            width: { lg: "45%", md: "50%", sm: "50%", xs: "30%" },
            bgcolor: { xs: "transparent", sm: "#EDECEC" },
            borderRadius: { xs: "10px", sm: "30px" },
          }}
        >
          <Grid container spacing={{ xs: 0.5, sm: 1.5, md: 2, lg: 2 }}>
            {allTabs?.map((tab, i) => {
              const bgcolor = activeTab === tab ? "#4D4B4B" : "transparent";
              return (
                <Grid item xs={6} sm={3} md={3} lg={3} key={i}>
                  <Typography
                    onClick={() => handleChangeTab(tab)}
                    sx={{
                      bgcolor,
                      ":hover": { bgcolor },
                      textTransform: "capitalize",
                      width: "100%",
                      color: activeTab === tab ? "white" : "var(--dark-gray)",
                      fontSize: "13px",
                      height: "27px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: { xs: "4px", sm: "40px", lg: "40px" },
                      fontSize: {
                        xs: "7px",
                        sm: "8px",
                        md: "10px",
                        lg: "13px",
                      },
                      border: {
                        xs: !activeTab ? "none" : "1px solid gray",
                        sm: "none",
                      },
                      height: isMobile ? "17px" : "27px",
                      cursor: "pointer",
                    }}
                  >
                    {convertCamelToTitle(tab)}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
      {isLoading ? (
        <Box sx={{ height: "430px" }}>
          <ChartSkeleton />
        </Box>
      ) : (
        <>
          {isError ? (
            <Box sx={{ height: "430px" }}>
              <ServerError message={error?.response?.data?.message} />
            </Box>
          ) : (
            <Box sx={{ height: "430px" }}>
              <Box
                my={1.5}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {chartData?.filterNames?.map((filter, i) => {
                    return (
                      <React.Fragment key={i}>
                        <Typography
                          sx={{
                            ...operationBtn(
                              chartData?.report[0]?.[filter]?.lineColor
                            ),
                            py: "2px",
                            height: "auto",
                            fontSize: {
                              xs: "7px",
                              sm: "8px",
                              md: "10px",
                              lg: "13px",
                            },
                          }}
                        >
                          {chartData?.report[0]?.[filter]?.filterName ||
                            chartData?.report[0]?.[filter]?.item}
                        </Typography>
                      </React.Fragment>
                    );
                  })}
                </Box>

                {/* <Box sx={{ display: "flex", gap: "10px" }}>
                  {(activeTab === "booking" || activeTab === "search") && (
                    <select
                      onChange={handleGroupBy}
                      style={{
                        borderRadius: "4px",
                        outline: "none",
                        border: "1px solid #DEE0E4",
                        paddingLeft: "15px",
                        width: "150px",
                      }}
                    >
                      <option value="">Select Group By</option>
                      {activeTab === "booking" && (
                        <option value="airline">Top Airlines</option>
                      )}
                      <option value="route">Top Route</option>
                    </select>
                  )}

                  <Button
                    onClick={() => setOpenFilter(true)}
                    sx={{
                      ...operationBtn("var(--primary-color)"),
                      borderRadius: "4px",
                    }}
                  >
                    Filter
                  </Button>
                </Box> */}
              </Box>

              <Box sx={{ height: isMobile ? "300px" : "350px", width: "100%" }}>
                {chartData?.report?.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData?.report}
                      margin={{
                        top: 20,
                        left: isMobile ? -40 : -28,
                        right: chartData?.filterNames.includes("search")
                          ? -28
                          : 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="5 3" stroke={"#dadce0"} />
                      {!isMobile && (
                        <XAxis
                          dataKey="name"
                          tickFormatter={(value) => {
                            return `${moment(moment(value, "DD-MM-YYYY").toDate()).format("DD MMM YY")}`;
                          }}
                          {...axisProps}
                        />
                      )}
                      <Tooltip content={<CustomTooltip />} />
                      {chartData?.yAxisValues?.left?.length > 0 && (
                        <YAxis
                          ticks={chartData?.yAxisValues?.left}
                          domain={[
                            0,
                            Math.max(...chartData?.yAxisValues?.left),
                          ]}
                          tickFormatter={(value) => `${value}`}
                          {...axisProps}
                          yAxisId="left"
                          orientation="left"
                        />
                      )}

                      {chartData?.yAxisValues?.right?.length > 0 && (
                        <YAxis
                          ticks={chartData?.yAxisValues?.right}
                          domain={[
                            0,
                            Math.max(...chartData?.yAxisValues?.right),
                          ]}
                          tickFormatter={(value) => `${value}`}
                          {...axisProps}
                          yAxisId="right"
                          orientation="right"
                        />
                      )}

                      {chartData?.filterNames?.map((filter, i) => {
                        return (
                          <React.Fragment key={i}>
                            <Line
                              yAxisId={filter === "search" ? "right" : "left"}
                              {...lineProps(
                                `${filter}.value`,
                                chartData?.report[0]?.[filter]?.lineColor
                              )}
                            />
                          </React.Fragment>
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

const allTabs = ["booking", "search", "fundTransfer", "fundReturned"];

const initialBookingBody = {
  from: moment(addDays(new Date(), -14)).format("YYYY-MM-DD"),
  to: moment(new Date()).format("YYYY-MM-DD"),
  by: "daily",
  item: "booking",
  limit: 5,
};

const initialSearchBody = {
  ...initialBookingBody,
  item: "search",
};
const initialFundBody = {
  ...initialBookingBody,
  item: "fundTransfer",
};
const initialReturnBody = {
  ...initialBookingBody,
  item: "fundReturned",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
          width: "240px",
        }}
      >
        <p>
          <strong style={{ fontSize: "1.2rem" }}>{label}</strong>
        </p>
        {payload.map((entry, index) => {
          const prop = entry.dataKey.split(".")[0];

          const data = entry?.payload[prop];

          return (
            <div key={index} style={{ marginBottom: 5 }}>
              <span
                style={{
                  color: entry.stroke,
                  fontWeight: "500",
                  textTransform: "capitalize",
                }}
              >
                {data?.filterName}:{" "}
                {data?.meta?.amount ? (
                  <>{data?.meta?.amount?.toLocaleString("en-IN")} BDT </>
                ) : (
                  data?.value
                )}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

const axisProps = {
  axisLine: { stroke: "none" },
  tickLine: false,
  tick: { fontSize: 12 },
};

const lineProps = (dataKey, stroke) => ({
  dataKey,
  stroke,
  strokeWidth: "1px",
  dot: false,
});

const BranchActivity = () => {
  const { jsonHeader } = useAuth();
  const { isMobile } = useWindowSize();
  const [selectedBranch, setSelectedBranch] = useState({
    id: "",
    branchName: "",
  });

  const {
    data: branchActivity,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["activities/branches"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/activities/branches`,
        jsonHeader()
      );

      return data?.data;
    },
    retry: false,
    staleTime: 0,
  });

  const { data: branchStaffsActivity } = useQuery({
    queryKey: ["activities/branches/staffs"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/activities/branches/${selectedBranch.id}/staffs`,
        jsonHeader()
      );

      return data?.data;
    },
    retry: false,
    staleTime: 0,
    enabled: !!selectedBranch?.id,
  });

  const flexColumn = (field, headerName, width = 150) => ({
    ...columnObj(field, headerName, width),
    flex: 1,
  });

  const columns = [
    {
      ...flexColumn("branchId", "Branch ID", 150),
      renderCell: ({ row }) => (
        <Button
          onClick={() => {
            setSelectedBranch({
              id: row?.id,
              branchName: row?.city || row?.district,
            });
          }}
          sx={{ fontSize: "12px", bgcolor: "#e7f3f5", color: "#4D4B4B" }}
        >
          {row?.branchId}
        </Button>
      ),
    },
    {
      ...flexColumn("branchName", "Branch Name", 220),
      renderCell: ({ row }) => <>{row?.branchName} Branch</>,
    },
    {
      ...flexColumn("Last Action Remarks", "Last Action Remarks", 250),
      renderCell: ({ row }) => (
        <>
          {row?.user?.userActivities ? (
            <MUITooltip title={row?.user?.userActivities?.[0]?.remarks}>
              {row?.user?.userActivities?.[0]?.remarks}
            </MUITooltip>
          ) : (
            "N/A"
          )}
        </>
      ),
    },
    {
      ...flexColumn("Last Action time", "Last Action time", 250),
      renderCell: ({ row }) => (
        <>
          {row?.lastActivity?.createdAt
            ? moment(row?.lastActivity?.createdAt).format("hh:mm A Do MMM YYYY")
            : "N/A"}
        </>
      ),
    },
    {
      ...flexColumn("Operation Statistics", "Operation Statistics", 220),
      renderCell: ({ row }) => (
        <>
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <LineChart width={150} height={45} data={row?.activityCounts}>
              <Line
                type="monotone"
                dataKey="activityCount"
                stroke="var(--green)"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </Box>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ ...layout, padding: 0, position: "relative" }}>
      <Typography
        sx={{
          color: "var(--secondary-color)",
          fontWeight: "500",
          position: "absolute",
          left: "22px",
          top: { xs: "15x", sm: "22px" },
        }}
      >
        {selectedBranch?.branchName} Branch Activity
      </Typography>

      {isLoading ? (
        <Box sx={{ height: "430px" }}>
          <StaffSkeleton />
        </Box>
      ) : (
        <>
          {isError ? (
            "Error"
          ) : (
            <Box
              sx={{
                ".dataGrid_height": {
                  height: "calc(100vh - 300px) !important",
                },
                position: "relative",
                mt: { xs: 2, sm: 0 },
              }}
            >
              {selectedBranch.id && (
                <Button
                  onClick={() => setSelectedBranch({ id: "", branchName: "" })}
                  style={{ ...activeButton, minWidth: "100px" }}
                  sx={{
                    fontSize: { lg: "11px", xs: "11px" },
                    position: "absolute",
                    right: "22.8%",
                    top: "19px",
                    zIndex: "100",
                  }}
                >
                  Back to all Branch
                </Button>
              )}
              <Box sx={{ ".css-pmzsn9": { p: 0 } }}>
                <DynamicTable
                  data={
                    selectedBranch.id
                      ? branchStaffsActivity
                      : branchActivity || []
                  }
                  columns={selectedBranch.id ? staffActivityColumn : columns}
                  title=""
                />
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

const PerformanceLoader = () => {
  const props = {
    sx: { borderRadius: "4px" },
    variant: "rectangular",
    animation: "wave",
  };
  return (
    <Box mt={"24px"}>
      {[...new Array(3)].map((_, i) => (
        <Box key={i} sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Skeleton {...props} width={"30%"} height={"20px"} />
            <Skeleton {...props} width={"30%"} height={"20px"} />
          </Box>

          <Skeleton {...props} width={"100%"} height={"24px"} />
        </Box>
      ))}
    </Box>
  );
};

export default DashboardBranch;
