import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  SwipeableDrawer,
  Skeleton,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { operationBtn } from "../DashStatistics";
import LIneChartFilter from "./LIneChartFilter";
import moment from "moment";
import axios from "axios";
import { useAuth } from "../../../context/AuthProvider";
import { addDays } from "date-fns";
import ServerError from "../../Error/ServerError";
import { useQuery } from "@tanstack/react-query";
import GroupByFilter from "./GroupByFilter";
import useWindowSize from "../../../shared/common/useWindowSize";

const DashboardLineChart = () => {
  const { jsonHeader } = useAuth();
  const [activeTab, setActiveTab] = useState("overall");
  const [openFilter, setOpenFilter] = useState(false);
  const [openTopRoute, setOpenTopRoute] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [filterBody, setFilterBody] = useState(initialOverAllBody);
  const [filterTabs, setFilterTabs] = useState([initialFilter]);
  const { isMobile } = useWindowSize();
  const { isLoading, isError, error } = useQuery({
    queryKey: ["report/line-chart", filterBody],
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/report/chart/line`,
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

    if (tab === "overall") {
      setFilterBody(initialOverAllBody);
    } else if (tab === "search") {
      setFilterBody(initialSearch);
    } else if (tab === "booking") {
      setFilterBody(initialBooking);
    } else if (tab === "deposit") {
      setFilterBody(initialDeposit);
    }
  };

  const handleGroupBy = async (e) => {
    const value = e.target.value;
    if (value === "") return;

    if (value === "route by airline" || value === "airline by route") {
    }
    setOpenTopRoute(true);
    return;
  };

  return (
    <>
      {/* All tabs and Title */}
      <Box
        sx={{
          display: "flex",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          py: 1,
        }}
      >
        <Typography
          sx={{
            color: "var(--secondary-color)",
            fontWeight: 500,
            textTransform: "capitalize",
          }}
        >
          {activeTab} Operation
        </Typography>

        <Box
          sx={{
            // width: { lg: "30%", md: "30%", sm: "30%", xs: "20%" },
            bgcolor: { xs: "transparent", sm: "#EDECEC" },
            borderRadius: { xs: "10px", sm: "30px" },
          }}
        >
          {/* container spacing={{ xs: 0.5, sm: 1.5, md: 2, lg: 2 }} */}
          <Box sx={{ display: "flex", gap: 1 }}>
            {allTabs?.map((tab, i) => {
              const isActive = activeTab === tab;
              return (
                <Box key={i}>
                  {/* item xs={6} sm={3} md={3} lg={3} */}
                  <Typography
                    onClick={() => handleChangeTab(tab)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: isActive ? "#4D4B4B" : "transparent",
                      ":hover": {
                        bgcolor: isActive ? "#4D4B4B" : "transparent",
                      },
                      border: {
                        xs: isActive ? "none" : "1px solid gray",
                        sm: "none",
                      },
                      borderRadius: { xs: "4px", sm: "40px", lg: "40px" },
                      textTransform: "capitalize",
                      color: isActive ? "white" : "var(--dark-gray)",
                      fontSize: {
                        xs: "7px",
                        sm: "8px",
                        md: "10px",
                        lg: "13px",
                      },
                      height: isMobile ? "17px" : "27px",
                      padding: "5px 15px",
                      cursor: "pointer",
                    }}
                  >
                    {tab}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Chart */}

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
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    width: "50%",
                  }}
                >
                  {/* container spacing={{ xs: 0.5, sm: 1, md: 2, lg: 1 }} */}
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    {chartData?.filterNames?.map((filter, i) => {
                      const data = chartData?.report[0]?.[filter];
                      const label = data?.filterName || data?.item;
                      const color = data?.lineColor;

                      return (
                        <Box item key={i}>
                          {/* xs={4} sm={4} md={2.3} */}
                          <Typography
                            sx={{
                              ...operationBtn(color),
                              fontSize: {
                                xs: "7px",
                                sm: "8px",
                                md: "10px",
                                lg: "13px",
                              },
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              width: "fit-content",
                            }}
                          >
                            {label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                {!isMobile && (
                  <Box sx={{ display: "flex", gap: { xs: "5px", lg: "10px" } }}>
                    {(activeTab === "booking" || activeTab === "search") && (
                      <Button
                        onClick={() => setOpenTopRoute(true)}
                        sx={{
                          ...operationBtn("var(--primary-color)"),
                          borderRadius: "4px",
                          fontSize: { xs: "10px", lg: "16px" },
                        }}
                      >
                        Group By
                      </Button>
                    )}

                    <Button
                      onClick={() => setOpenFilter(true)}
                      sx={{
                        ...operationBtn("var(--primary-color)"),
                        borderRadius: "4px",
                        fontSize: { xs: "10px", lg: "16px" },
                      }}
                    >
                      Filter
                    </Button>
                  </Box>
                )}
              </Box>

              <Box sx={{ height: "350px", width: "100%" }}>
                {chartData?.report?.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData?.report}
                      margin={{
                        top: 20,
                        left: -28,
                        right: chartData?.filterNames.includes("search")
                          ? -28
                          : 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="5 3" stroke={"#dadce0"} />
                      <XAxis
                        dataKey="name"
                        tickFormatter={(value) => {
                          return `${value}`;
                          // return `${moment(moment(value, "DD-MM-YYYY").toDate()).format("DD MMM YY")}`;
                        }}
                        {...axisProps}
                      />
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
                              yAxisId={chartData?.yAxisSide[filter]}
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

      <SwipeableDrawer
        anchor="right"
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        PaperProps={{
          sx: { width: "30%", zIndex: 999999999 },
        }}
      >
        {openFilter && (
          <LIneChartFilter
            setChartData={setChartData}
            filterTabs={filterTabs}
            setFilterTabs={setFilterTabs}
          />
        )}
      </SwipeableDrawer>

      <SwipeableDrawer
        anchor="right"
        open={openTopRoute}
        onClose={() => setOpenTopRoute(false)}
        PaperProps={{
          sx: { width: "30%", zIndex: 999999999 },
        }}
      >
        {openTopRoute && (
          <GroupByFilter
            setChartData={setChartData}
            filterTabs={filterTabs}
            activeTab={activeTab}
            setFilterTabs={setFilterTabs}
          />
        )}
      </SwipeableDrawer>
    </>
  );
};

const initialFilter = {
  filterType: "",
  filterName: "",
  bookingStatus: [],
  tripTypes: [],
  routes: [],
  airlines: [],
  types: [],
  lineColor: "#555555",
  showAirlines: false,
  showRoute: false,
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

export const ChartSkeleton = () => {
  const props = {
    sx: { borderRadius: "4px" },
    variant: "rectangular",
    animation: "wave",
    height: "3px",
  };
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Skeleton
            {...props}
            width={"80px"}
            height={"25px"}
            sx={{ mt: 1.5, borderRadius: "34px" }}
          />
          <Skeleton
            {...props}
            width={"80px"}
            height={"25px"}
            sx={{ mt: 1.5, borderRadius: "34px" }}
          />
          <Skeleton
            {...props}
            width={"80px"}
            height={"25px"}
            sx={{ mt: 1.5, borderRadius: "34px" }}
          />
        </Box>
        <Skeleton
          {...props}
          width={"150px"}
          height={"25px"}
          sx={{ mt: 1.5, borderRadius: "4px" }}
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
    </>
  );
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
  // type: "monotone",
});

const allTabs = ["overall", "search", "booking", "deposit"];

const a = {
  bookingStatus: [],
  tripTypes: [],
  routes: [],
  airlines: [],
  types: [],
};

export const initialOverAllBody = {
  filters: [
    {
      filterType: "booking",
      filterName: "booking",
      lineColor: "#0e8749",
      ...a,
    },
    {
      filterType: "deposit",
      filterName: "deposit",
      lineColor: "#3498db",
      ...a,
    },
    { filterType: "search", filterName: "search", lineColor: "#fea834", ...a },
  ],
  by: "daily",
  from: moment(addDays(new Date(), -14)).format("YYYY-MM-DD"),
  to: moment(new Date()).format("YYYY-MM-DD"),
};

const initialSearch = {
  ...initialOverAllBody,
  filters: [
    {
      filterType: "search",
      filterName: "oneway",
      lineColor: "#0e8749",
      tripTypes: ["oneway"],
    },
    {
      filterType: "search",
      filterName: "return",
      lineColor: "#3498db",
      tripTypes: ["return"],
    },
    {
      filterType: "search",
      filterName: "multicity",
      lineColor: "#fea834",
      tripTypes: ["multicity"],
    },
  ],
};

const initialBooking = {
  ...initialOverAllBody,
  filters: initialSearch.filters.map((filter) => ({
    ...filter,
    filterType: "booking",
  })),
};

const initialDeposit = {
  ...initialOverAllBody,
  filters: [
    {
      filterType: "deposit",
      filterName: "cash",
      lineColor: "#0e8749",
      types: ["cash"],
    },
    {
      filterType: "deposit",
      filterName: "bankTransfer",
      lineColor: "#3498db",
      types: ["bankTransfer"],
    },
    {
      filterType: "deposit",
      filterName: "bank",
      lineColor: "#fea834",
      types: ["bank"],
    },
    {
      filterType: "deposit",
      filterName: "cheque",
      lineColor: "#5856d6",
      types: ["cheque"],
    },
  ],
};

export default DashboardLineChart;
