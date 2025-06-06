import {
  Box,
  Drawer,
  Grid,
  Tooltip as MUITooltip,
  Skeleton,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import useUnAuthorized from "../../shared/common/useUnAuthorized";
import DynamicTable from "../../shared/Tables/DynamicTable";
import CustomToast from "../Alert/CustomToast";
import { columnObj } from "../AllBookings/AirTicket";
import MobileHeader from "../MobileHeader/MobileHeader";
import BottomNavbar from "../Navbar/BottomNavbar/BottomNavbar";
import DashboardLineChart, {
  initialOverAllBody,
} from "./components/DashboardLineChart";
import CustomCalendar from "../CustomCalendar/CustomCalendar";
import useWindowSize from "../../shared/common/useWindowSize";

const layout = {
  border: "1px solid var(--border-color)",
  p: { xs: "8px 10px", lg: "12px 20px" },
  borderRadius: "4px",
  height: "100%",
};

const DashStatistics = () => {
  const { jsonHeader } = useAuth();
  const [chartData, setChartData] = useState([]);
  const { checkUnAuthorized } = useUnAuthorized();
  const { isMobile } = useWindowSize();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const { isLoading } = useQuery({
    queryKey: ["report/line-chart/overAll", initialOverAllBody],
    queryFn: async () => {
      try {
        const requestData = {
          ...initialOverAllBody,
          from: moment(new Date()).format("YYYY-MM-DD"),
          to: moment(new Date()).format("YYYY-MM-DD"),
        };

        const { data } = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/v1/user/report/chart/line`,
          requestData,
          jsonHeader()
        );

        setChartData(data?.data);

        return data;
      } catch (error) {
        if (error?.response?.status === 401) {
          showToast("error", "You are unauthorized to access this site.");
          checkUnAuthorized(error);
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 0,
  });

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
          p: isMobile ? 1.5 : 3,
          width: { xs: "90%", lg: "100%" },
          mx: "auto",
          mt: { xs: 5, lg: 0 },
          mb: { xs: 10, lg: 0 },
        }}
      >
        <Grid container spacing={isMobile ? "8px" : "20px"}>
          {/* Sales, customers, avg rev area */}

          {isLoading ? (
            <BoxSkeleton />
          ) : (
            <>
              {chartData?.report?.length > 0 ? (
                <>
                  {chartData?.filterNames.map((filter, i, arr) => {
                    const crrData = chartData?.report[0];
                    return (
                      <Grid item xs={4} md={12 / arr.length} key={i}>
                        <Box
                          sx={{
                            ...layout,
                            height: isMobile ? "100%" : "118px",
                          }}
                        >
                          <Box
                          // sx={{
                          //   display: "flex",
                          //   justifyContent: "space-between",
                          // }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                textTransform: "capitalize",
                                fontSize: isMobile ? "11px" : "16px",
                              }}
                            >
                              {filter} {filter === "booking" && " Amount"}
                            </Typography>
                            {/* <Typography
                              variant="body2"
                              sx={{ color: "#9e9e9e" }}
                            >
                              {moment(
                                moment(crrData?.name, "DD-MM-YYYY").toDate()
                              ).format("Do MMMM YYYY")}
                            </Typography> */}
                          </Box>
                          <Typography
                            sx={{
                              fontSize: isMobile ? "12px" : "28px",
                              borderBottom: "1px solid var(--border)",
                              pb: 0.5,
                            }}
                          >
                            {filter === "search"
                              ? crrData[filter]?.value
                              : crrData[filter]?.meta?.amount
                                ? crrData[filter]?.meta?.amount + " BDT"
                                : crrData[filter]?.value}
                            {/* {crrData[filter]?.value} */}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "var(--green)",
                              mt: 0.5,
                              fontSize: isMobile ? "11px" : "16px",
                            }}
                          >
                            {moment(
                              moment(crrData?.name, "DD-MM-YYYY").toDate()
                            ).format("Do MMMM YYYY")}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </>
              ) : (
                <>
                  {[...new Array(3)].map((_, i, arr) => (
                    <Grid item md={12 / arr.length} key={i}>
                      <Box
                        sx={{
                          ...layout,
                          ...alightCenter,
                          justifyContent: "center",
                          height: "118px",
                        }}
                      >
                        No Data Found
                      </Box>
                    </Grid>
                  ))}
                </>
              )}
            </>
          )}

          {/* Sales Channel */}
          <Grid item lg={4} xs={12}>
            <SalesChart showToast={showToast} />
          </Grid>

          {/* Revenue  */}
          <Grid item lg={8} xs={12}>
            <RevenueChart showToast={showToast} />
          </Grid>

          {/* Operation */}
          <Grid item xs={12}>
            <Box sx={layout}>
              <DashboardLineChart />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <StaffActivity />
          </Grid>
        </Grid>
      </Box>
      {/* --- Mobile Bottom Navbar start --- */}
      <BottomNavbar />
      {/* --- Mobile Bottom Navbar end --- */}
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
        type="notification"
      />
    </>
  );
};

const SalesChart = ({ showToast }) => {
  const { checkUnAuthorized } = useUnAuthorized();
  const { jsonHeader } = useAuth();
  const { isMobile } = useWindowSize();
  const [openCal, setOpenCal] = useState(false);
  const [pieData, setPieData] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    handleChangeDate(new Date());
  }, []);

  const handleChangeDate = async (date) => {
    setSelectedDate(date);
    setOpenCal(false);
    setIsLoading(true);
    const body = {
      from: "2024-01-01",
      to: "2025-02-19",
      // from: moment(date).format("YYYY-MM-DD"),
      // to: moment(date).format("YYYY-MM-DD"),
    };
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/report/chart/pie`,
        body,
        jsonHeader()
      );

      setPieData(data?.data);
    } catch (e) {
      showToast("error", e?.response?.data?.message || "An error occurred");
      if (e?.response?.status === 401) {
        showToast("error", "You are unauthorized to access this site.");
        checkUnAuthorized(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const noValue = pieData?.data?.every((item) => item?.count === 0);
  const customPieData = pieData?.data.map((item, i) => ({
    name: item?.type,
    value: item?.count,
    color: colors[i],
    ...item,
  }));

  const chartBox = {
    bgcolor: "#eee",
    borderRadius: "50%",
    ...alightCenter,
    justifyContent: "center",
  };

  return (
    <Box sx={{ ...layout, position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Typography
          sx={{
            color: "var(--secondary-color)",
            fontWeight: "500",
            fontSize: { xs: "13px", sm: "16px" },
          }}
        >
          Sales Chanel
        </Typography>

        {isLoading ? (
          <Skeleton
            sx={{ borderRadius: "2px" }}
            variant="rectangular"
            width={"100px"}
            height={"31px"}
            animation="wave"
          />
        ) : (
          <Box onClick={() => setOpenCal(!openCal)} sx={dateBtn}>
            <Typography>
              {moment(selectedDate).format("DD-MM-YYYY")}{" "}
            </Typography>
          </Box>
        )}

        {openCal &&
          (!isMobile ? (
            <Box
              sx={{
                position: "absolute",
                top: "105%",
                borderRadius: "4px",
                width: "100%",
                zIndex: 1000,
                display: "flex",
                bgcolor: "white",
              }}
            >
              <CustomCalendar
                date={selectedDate}
                maxDate={new Date()}
                title="Select Date"
                handleChange={(date) => handleChangeDate(date)}
              />
            </Box>
          ) : (
            <Drawer
              anchor="bottom"
              open={openCal}
              onClose={() => setOpenCal(false)}
              PaperProps={{
                sx: {
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                  p: 2,
                },
              }}
            >
              <CustomCalendar
                date={selectedDate}
                maxDate={new Date()}
                title="Select Date"
                handleChange={(date) => {
                  handleChangeDate(date);
                  setOpenCal(false); // Close drawer on date selection
                }}
              />
            </Drawer>
          ))}
      </Box>

      <Box sx={{ height: "260px", ...alightCenter }}>
        {isLoading ? (
          <Skeleton
            variant="circular"
            width={192}
            height={192}
            sx={{ ml: 2 }}
          />
        ) : noValue ? (
          <Box
            width={isMobile ? 100 : 192}
            height={isMobile ? 100 : 192}
            sx={{ ...chartBox, ml: 2 }}
          >
            <Box width={155} height={155} sx={{ ...chartBox, bgcolor: "#fff" }}>
              <Typography>0.00%</Typography>
            </Box>
          </Box>
        ) : (
          <CustomPieChart
            pieChartData={customPieData}
            width={"65%"}
            innerRadius={isMobile ? 40 : 70}
            outerRadius={isMobile ? 50 : 90}
          />
        )}
      </Box>

      {!noValue && (
        <Box sx={{ position: "absolute", top: "55px", right: "24px" }}>
          <PieChartContentIndicator pieChartData={customPieData} />
        </Box>
      )}

      {/* <Typography variant="body2">
        More than 1,200,000 sales are made using travel Zoo, and 700,000 are
        from Fly Far International.
      </Typography> */}
    </Box>
  );
};

const RevenueChart = ({ showToast }) => {
  const { checkUnAuthorized } = useUnAuthorized();
  const { jsonHeader } = useAuth();
  const { isMobile } = useWindowSize();
  const [openCal, setOpenCal] = useState(null);
  const [barData, setBarData] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [body, setBody] = useState({
    by: "daily",
    from: moment().subtract(15, "days")?._d,
    to: new Date(),
  });

  useEffect(() => {
    handleChangeDate(new Date());
  }, []);

  const handleChangeDate = async () => {
    setOpenCal(false);
    setIsLoading(true);
    const apiBody = {
      from: moment(body.from).format("YYYY-MM-DD"),
      to: moment(body.to).format("YYYY-MM-DD"),
      by: body.by,
    };

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/report/chart/bar`,
        apiBody,
        jsonHeader()
      );

      setBarData(data?.data);
    } catch (e) {
      showToast("error", e?.response?.data?.message || "An error occurred");
      if (e?.response?.status === 401) {
        showToast("error", "You are unauthorized to access this site.");
        checkUnAuthorized(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={layout}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: { xs: 4, lg: 14 },
        }}
      >
        <Typography
          sx={{
            color: "var(--secondary-color)",
            fontWeight: "500",
            fontSize: { xs: "13px", sm: "16px" },
          }}
        >
          Revenue
        </Typography>

        <Box
          sx={{
            position: "relative",
            alignItems: "center",
            width: { xs: "65%", sm: "37%", md: "25%", lg: "100%" },
          }}
        >
          <Grid container columnSpacing={0.5} rowSpacing={isMobile && 0.5}>
            <Grid item xs={12} lg={2.4}>
              <select
                value={body.by}
                onChange={(e) => setBody({ ...body, by: e.target.value })}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  outline: "none",
                  width: "100%",
                }}
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </Grid>

            <Grid item xs={6} lg={4.2}>
              <Box
                onClick={() => setOpenCal(openCal === "from" ? null : "from")}
                sx={{ ...dateBtn, pb: "3px" }}
              >
                <Typography sx={{ fontSize: { xs: "10px", lg: "14px" } }}>
                  From: {moment(body?.from).format("DD-MM-YYYY")}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} lg={3.8}>
              <Box
                onClick={() => setOpenCal(openCal === "to" ? null : "to")}
                sx={{ ...dateBtn, pb: "3px" }}
              >
                <Typography sx={{ fontSize: { xs: "10px", lg: "14px" } }}>
                  To: {moment(body?.to).format("DD-MM-YYYY")}
                </Typography>
              </Box>
            </Grid>

            <Grid
              item
              xs={2}
              lg={1.6}
              sx={{
                display: isMobile && "flex",
                justifyContent: isMobile && "flex-end",
                ml: isMobile && "auto",
              }}
            >
              <Typography
                onClick={handleChangeDate}
                sx={{
                  bgcolor: "var(--primary-color)",
                  ...dateBtn,
                  pb: "3px",
                  color: "white",
                  fontSize: { xs: "10px", lg: "14px" },
                }}
              >
                Save
              </Typography>
            </Grid>
          </Grid>
          {isMobile ? (
            <Drawer
              anchor="bottom"
              open={!!openCal}
              onClose={() => setOpenCal(null)}
            >
              <Box sx={{ p: 2 }}>
                <CustomCalendar
                  date={new Date()}
                  maxDate={new Date()}
                  title={openCal === "from" ? "Select From" : "Select To"}
                  handleChange={(date) => {
                    setBody({ ...body, [openCal]: date });
                    setOpenCal(null);
                  }}
                />
              </Box>
            </Drawer>
          ) : (
            openCal && (
              <Box
                sx={{
                  position: "absolute",
                  top: "105%",
                  borderRadius: "4px",
                  zIndex: 1000,
                  display: "flex",
                  bgcolor: "white",
                  right: openCal === "from" ? "162px" : "48px",
                }}
              >
                <CustomCalendar
                  date={new Date()}
                  maxDate={new Date()}
                  title={openCal === "from" ? "Select From" : "Select To"}
                  handleChange={(date) => {
                    setBody({ ...body, [openCal]: date });
                    setOpenCal(null);
                  }}
                />
              </Box>
            )
          )}
        </Box>
      </Box>

      <Box sx={{ height: "280px", width: "100%", mt: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barData}
            margin={{ left: -20, right: 10 }}
            // barCategoryGap={"25%"}
          >
            <CartesianGrid strokeDasharray="5 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 11 }} />
            <YAxis
              domain={[1000, 7000]}
              tickCount={7}
              tickFormatter={(value) => `${value}`}
              axisLine={{ stroke: "none" }}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip cursor={{ fill: "none" }} content={<CustomTooltip />} />

            <Bar
              dataKey="value"
              fill="var(--primary-color)"
              maxBarSize={15}
              // radius={[10, 10, 0, 0]}
              tickCount={10}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

const StaffActivity = () => {
  const { jsonHeader } = useAuth();

  const {
    data: staffsActivity,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["activities/staffs"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/activities/staffs`,
        jsonHeader()
      );

      return data?.data;
    },
    retry: false,
    staleTime: 0,
  });

  return (
    <Box sx={{ ...layout, padding: 0, position: "relative" }}>
      <Typography
        sx={{
          color: "var(--secondary-color)",
          fontWeight: "500",
          position: "absolute",
          left: "22px",
          top: { xs: "15x", sm: "22px" },
          fontSize: { xs: "13px", sm: "16px" },
        }}
      >
        Staff Activity
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
                ".css-pmzsn9": {
                  p: 0,
                },
                mt: { xs: 2, sm: 0 },
              }}
            >
              <DynamicTable
                data={staffsActivity || []}
                columns={staffActivityColumn}
                title=""
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

const flexColumn = (field, headerName, width = 150) => ({
  ...columnObj(field, headerName, width),
  flex: 1,
});

export const StaffSkeleton = () => {
  const props = {
    sx: { borderRadius: "4px" },
    variant: "rectangular",
    animation: "wave",
    height: "3px",
  };
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Skeleton
          {...props}
          width={"30%"}
          height={"30px"}
          sx={{ borderRadius: "4px" }}
        />
      </Box>
      {[...new Array(8)].map((_, i) => (
        <Box key={i} mt={5}>
          <Skeleton
            {...props}
            width={"100%"}
            sx={{
              borderRadius: "4px",
              "&::after": {
                background:
                  "linear-gradient(90deg, transparent, #f5f5f5, transparent)",
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export const staffActivityColumn = [
  {
    ...flexColumn("StaffName", "Staff Name"),
    renderCell: ({ row }) => row?.user?.firstName + " " + row?.user?.lastName,
  },
  { ...flexColumn("designation", "Designation", 220) },
  {
    ...flexColumn("LastActionRemarks", "Last Action Remarks", 260),
    renderCell: ({ row }) =>
      row?.lastActivity?.remarks ? (
        <MUITooltip title={row?.lastActivity?.remarks}>
          {row?.lastActivity?.remarks}
        </MUITooltip>
      ) : (
        "N/A"
      ),
  },
  {
    ...flexColumn("LastActionTime", "Last Action Time", 190),
    renderCell: ({ row }) =>
      row?.lastActivity?.createdAt
        ? moment(row?.lastActivity?.createdAt).format("hh:mm A Do MMM YYYY")
        : "N/A",
  },
  {
    ...flexColumn("Operation Statistics", "Operation Statistics", 180),
    renderCell: ({ row }) => (
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
    ),
  },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: "white", position: "relative", zIndex: "100" }}>
        <Typography
          sx={{ fontSize: "12px", p: 2 }}
        >{`${payload[0].name} : ${payload[0].value}`}</Typography>
      </Box>
    );
  }
  return null;
};

export const BoxSkeleton = () => {
  const props = {
    sx: { borderRadius: "4px" },
    variant: "rectangular",
    animation: "wave",
    height: "20px",
  };
  return (
    <>
      {[...new Array(3)].map((_, i, arr) => (
        <Grid item md={12 / arr.length} key={i}>
          <Box sx={{ ...layout, height: "118px" }}>
            <Box>
              <Skeleton {...props} width={"60px"} />
            </Box>
            <Skeleton
              {...props}
              width={"50%"}
              height={"25px"}
              sx={{ mt: 1.5, borderRadius: "4px" }}
            />
            <Skeleton
              {...props}
              width={"80px"}
              sx={{ mt: 1.5, borderRadius: "4px" }}
            />
          </Box>
        </Grid>
      ))}
    </>
  );
};

export const CustomPieChart = React.memo(
  ({
    pieChartData,
    width,
    innerRadius = 70,
    outerRadius = 90,
    dataKey = "value",
  }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const { isMobile } = useWindowSize();

    const handleMouseEnter = useCallback((_, index) => {
      setActiveIndex(index);
    }, []);

    const chartData = useMemo(() => pieChartData, [pieChartData]);

    return (
      <ResponsiveContainer width={width} height="100%">
        <PieChart>
          <Pie
            data={chartData}
            activeIndex={activeIndex}
            activeShape={(props) => renderActiveShape(props, isMobile)}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey={dataKey}
            onMouseEnter={handleMouseEnter}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry?.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }
);

const renderActiveShape = (props, isMobile) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;

  const textProps = {
    x: cx,
    y: cy,
    textAnchor: "middle",
    style: {
      textTransform: "capitalize",
      fontSize: isMobile ? "9px" : "14px",
    },
    fill: fill,
  };

  return (
    <g>
      <text {...textProps} dy={-4}>
        {payload.name}
      </text>

      {payload?.payload?.amount || payload?.amount?.count ? (
        <>
          <text {...textProps} dy={10}>
            Count: {payload?.payload?.count}
          </text>
          {payload?.payload?.amount && (
            <text {...textProps} dy={24}>
              Amount: {payload?.payload?.amount}
            </text>
          )}
        </>
      ) : (
        <text {...textProps} dy={13}>
          {(percent * 100).toFixed(2)}%
        </text>
      )}

      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 9}
        outerRadius={outerRadius + 18}
        fill={fill}
      />
    </g>
  );
};

export const PieChartContentIndicator = React.memo(({ pieChartData }) => {
  return (
    <>
      {pieChartData?.map((data, i) => (
        <Box key={i} sx={{ ...alightCenter, gap: "8px", mb: 0.5 }}>
          <Box
            sx={{
              height: "8px",
              width: "8px",
              bgcolor: data.color,
              borderRadius: "50%",
            }}
          ></Box>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              fontSize: { xs: "11px", lg: "16px" },
            }}
          >
            {data.name}
          </Typography>
        </Box>
      ))}
    </>
  );
});

export const alightCenter = { display: "flex", alignItems: "center" };

export const operationBtn = (bgcolor) => ({
  bgcolor,
  height: "27px",
  textTransform: "capitalize",
  color: "white",
  ":hover": { bgcolor },
  borderRadius: "20px",
  fontSize: "13px",
  px: "20px",
});

const colors = ["#fea834", "var(--green)", "#1A73E8", "#D81B60"];

const dateBtn = {
  py: "2px",
  px: 1,
  cursor: "pointer",
  borderRadius: "4px",
  // width: "100px",
  border: "1px solid var(--border)",
};

export default DashStatistics;
