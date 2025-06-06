import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import {
  Box,
  Button,
  ClickAwayListener,
  Collapse,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useAuth } from "../../../context/AuthProvider";
import useToast from "../../../hook/useToast";
import { numberToWords } from "../../../shared/common/functions";
import CustomToast from "../../Alert/CustomToast";
import CustomCalendar from "../../CustomCalendar/CustomCalendar";
import { capsul, fetchAllAirlines } from "../../FlightSearchBox/FlightOptions";

const LIneChartFilter = ({ setChartData, filterTabs, setFilterTabs }) => {
  const { jsonHeader } = useAuth();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [openRoute, setOpenRoute] = useState(false);
  const [allAirlines, setAllAirlines] = useState([]);
  // const [filterTabs, setFilterTabs] = useState([initialFilter]);
  const [dateRange, setDateRange] = useState([{ from: "", to: "" }]);
  const [openDate, setOpenDate] = useState("");
  const [crrTab, setCrrTab] = useState(0);
  const [by, setBy] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllAirlines();
      setAllAirlines(data);
    };

    fetchData();
  }, []);

  const handleSelectAirlinesChange = (selectedOptions) => {
    const updatedAirlines = selectedOptions.map((ab) => {
      return {
        label: `${ab.value.split("-")[1]}`,
        value: ab.value,
        code: ab.value.split("-")[0],
      };
    });

    setFilterTabs(
      filterTabs.map((tab, i) => {
        if (i === crrTab) {
          return { ...tab, airlines: updatedAirlines };
        }
        return tab;
      })
    );
  };

  const handleChangeFilter = (selectedOption, prop) => {
    const a = filterTabs.map((tab, index) => {
      if (index === crrTab) {
        const prev = prop === "filterType" ? initialFilter : tab;
        return { ...prev, [prop]: selectedOption.value };
      }
      return tab;
    });

    setFilterTabs(a);
  };

  const handleBookingStatusTripTypeChange = (selectedOptions, prop) => {
    const updatedfilterTabs = [...filterTabs];
    updatedfilterTabs[crrTab][prop] = selectedOptions.map(
      (option) => option.value
    );
    setFilterTabs(updatedfilterTabs);
  };

  const handleAddFilterTab = () => {
    if (filterTabs.length > 3) return;
    setFilterTabs([...filterTabs, initialFilter]);
  };

  const handleRemoveFilterTab = (e, i) => {
    e.stopPropagation();

    if (i === 0 && filterTabs.length > 1) {
      setCrrTab(i);
    } else {
      setCrrTab(i - 1);
    }

    setFilterTabs(
      filterTabs.filter((_, index) => {
        return i !== index;
      })
    );
  };

  const handleSubmit = async () => {
    const body = {
      filters: filterTabs.map((filter) => {
        const { showAirlines, showRoute, ...rest } = filter;
        return {
          ...rest,
          airlines: filter.airlines.map((airline) => airline.code),
        };
      }),
      by,
      from: moment(dateRange?.from).format("YYYY-MM-DD"),
      to: moment(dateRange?.to).format("YYYY-MM-DD"),
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/report/chart/line`,
        body,
        jsonHeader()
      );

      setChartData(response?.data?.data);
    } catch (e) {
      console.error(e);
      showToast("error", e?.response?.data?.message || "An error occurred");
    }
  };

  const handleRemoveRoute = (i, routeIndex) => {
    setFilterTabs((prev) =>
      prev.map((filter, index) => {
        if (index === i) {
          return {
            ...filter,
            routes: filter.routes.filter((_, ind) => ind !== routeIndex),
          };
        }
        return filter;
      })
    );
  };

  return (
    <Box
      pt={2.5}
      px={3}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        minHeight: "100vh",
        gap: "100px",
        height: "100%",
      }}
    >
      <Box>
        <Typography
          onClick={() => {
            setFilterTabs();
          }}
          sx={{ ...labelStyle, fontSize: "18px", mt: 0, mb: 1.5 }}
        >
          Operation Graph Filter
        </Typography>

        <Grid container spacing={"10px"}>
          <Grid container item md={11} spacing={"10px"}>
            {filterTabs.map((tab, i, arr) => {
              const isActive = crrTab === i;
              return (
                <Grid key={i} item md={12 / arr.length}>
                  <Box sx={{ width: "100%" }}>
                    <Button
                      style={{
                        backgroundColor: isActive ? tab?.lineColor : "white",
                        color: isActive ? "white" : tab?.lineColor,
                        width: "100%",
                        textTransform: "capitalize",
                        borderRadius: "35px",
                        border: "1px solid",
                        borderColor: tab?.lineColor,
                        padding: "0 6px",
                        height: "32px",
                        justifyContent: "space-between",
                        alignItems: "center",
                        display: "flex",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (i === crrTab) return;
                        setCrrTab(i);
                      }}
                    >
                      <Typography
                        sx={{ fontWeight: "500", fontSize: "13px", pl: 1 }}
                        noWrap
                      >
                        {numberToWords(i + 1)}
                      </Typography>
                      {arr.length > 1 && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: isActive ? "white" : tab?.lineColor,
                            height: "22px",
                            width: "22px",
                            borderRadius: "50%",
                          }}
                          onClick={(e) => {
                            handleRemoveFilterTab(e, i);
                          }}
                        >
                          <CloseIcon
                            sx={{
                              color: isActive ? tab?.lineColor : "white",
                              fontSize: "12px",
                            }}
                          />
                        </Box>
                      )}
                    </Button>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
          <Grid item md={1}>
            <Box onClick={handleAddFilterTab} sx={addBtn.container}>
              <Button sx={addBtn.btn}>
                <AddIcon />
              </Button>
            </Box>
          </Grid>
        </Grid>

        {filterTabs.map((filter, i) => (
          <Box sx={{ display: crrTab !== i && "none" }} key={i}>
            <Typography sx={labelStyle}>Filter</Typography>
            <Select
              value={filterTypeOptions.find(
                (option) => option.value === filter.filterType
              )}
              options={filterTypeOptions}
              placeholder={<Typography>Select Filter Type</Typography>}
              {...selectProps}
              onChange={(value) => handleChangeFilter(value, "filterType")}
              components={{ DropdownIndicator: null }}
            />

            {filter?.filterType === "booking" && (
              <Box sx={{ position: "relative" }}>
                <Typography sx={labelStyle}>Select Booking Status</Typography>
                <Select
                  value={filter.bookingStatus.map((status) => ({
                    value: status,
                    label: status,
                  }))}
                  options={allBookingStatus.map((tab) => ({
                    value: tab,
                    label: tab,
                  }))}
                  placeholder={<Typography>Select Booking Status</Typography>}
                  {...selectProps}
                  isMulti
                  onChange={(value) =>
                    handleBookingStatusTripTypeChange(value, "bookingStatus")
                  }
                  components={{ DropdownIndicator: null }}
                />
              </Box>
            )}

            {(filter?.filterType === "booking" ||
              filter?.filterType === "search") && (
              <>
                <Typography sx={labelStyle}>Select Trip Type</Typography>
                <Select
                  value={filter.tripTypes.map((status) => ({
                    value: status,
                    label: status,
                  }))}
                  options={allTripType.map((tab) => ({
                    value: tab,
                    label: tab,
                  }))}
                  placeholder={<Typography>Select Trip Type</Typography>}
                  {...selectProps}
                  isMulti
                  onChange={(value) =>
                    handleBookingStatusTripTypeChange(value, "tripTypes")
                  }
                  components={{ DropdownIndicator: null }}
                />

                <Typography sx={labelStyle}>Select Route</Typography>
                <Box>
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenRoute(!openRoute);
                    }}
                    sx={{ ...customInputBox, position: "relative" }}
                  >
                    {filter?.routes?.length > 0 ? (
                      <Box sx={{ display: "flex", gap: "10px" }}>
                        {filter?.routes.map((route, routeIndex) => {
                          return (
                            <Box
                              sx={{
                                display: "flex",
                                bgcolor: "#E6E6E6",
                                borderRadius: "2px",
                                alignItems: "center",
                              }}
                              key={routeIndex}
                            >
                              <Box
                                sx={{ display: "flex", p: "3px 3px 3px 6px" }}
                              >
                                <Typography
                                  sx={{ fontSize: "12px", color: "#333" }}
                                >
                                  {route?.departure}
                                </Typography>
                                <Typography
                                  sx={{ fontSize: "12px", color: "#333" }}
                                >
                                  -
                                </Typography>
                                <Typography
                                  sx={{ fontSize: "12px", color: "#333" }}
                                >
                                  {route?.arrival}
                                </Typography>
                              </Box>
                              <Box
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveRoute(i, routeIndex);
                                }}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  ":hover": {
                                    bgcolor: "#e74c3c70",
                                  },
                                  p: "3px",
                                }}
                              >
                                <CloseIcon sx={{ fontSize: "10px" }} />
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                    ) : (
                      <Typography sx={{ fontSize: "14px", color: "#808080" }}>
                        Select Route
                      </Typography>
                    )}
                  </Box>

                  <Collapse in={openRoute}>
                    <SelectRoute
                      filterTabs={filterTabs}
                      setFilterTabs={setFilterTabs}
                      i={i}
                    />
                  </Collapse>
                </Box>
              </>
            )}

            {filter?.filterType === "booking" && (
              <>
                <Typography sx={labelStyle}>Select Airlines</Typography>

                <ClickAwayListener
                  onClickAway={() =>
                    filter.showAirlines &&
                    handleChangeFilter({ value: false }, "showAirlines")
                  }
                >
                  <Box
                    sx={{
                      ".css-1d9ye53-MuiTypography-root": {
                        fontSize: "14px !important",
                      },
                      position: "relative",
                    }}
                  >
                    <Box
                      onClick={() =>
                        handleChangeFilter(
                          { value: !filter.showAirlines },
                          "showAirlines"
                        )
                      }
                      sx={customInputBox}
                    >
                      {filter?.airlines?.length > 0 ? (
                        <Box
                          sx={{ display: "flex", gap: "5px", width: "100%" }}
                        >
                          {filter?.airlines
                            .slice(0, 4)
                            ?.map((selectedAirline, i) => (
                              <Typography noWrap key={i} sx={{ ...capsul }}>
                                {selectedAirline.label}
                              </Typography>
                            ))}
                          {filter?.airlines?.length > 4 && (
                            <Typography noWrap sx={{ ...capsul }}>
                              +{filter?.airlines?.length - 3} more
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography sx={{ fontSize: "14px", color: "#808080" }}>
                          Preferred Airlines
                        </Typography>
                      )}
                    </Box>

                    {filter.showAirlines && (
                      <Box sx={{ position: "absolute", width: "100%" }}>
                        <Select
                          {...selectProps}
                          styles={chartFilterSelectStyle("airlines")}
                          isMulti
                          options={
                            filter?.airlines.length === 5 ? [] : allAirlines
                          }
                          value={filter?.airlines}
                          onChange={handleSelectAirlinesChange}
                          placeholder={
                            <Typography>
                              Select Airlines ( Maximum 5 )
                            </Typography>
                          }
                          isSearchable={
                            filter?.airlines.length === 5 ? false : true
                          }
                          menuIsOpen
                        />
                      </Box>
                    )}
                    <select style={{ ...groupByStyle, top: "13.5%" }}>
                      <option value="">Select Group By</option>
                      <option value="airline">Top 5</option>
                      <option value="airline">Top 10</option>
                      <option value="airline">Top 15</option>
                    </select>
                  </Box>
                </ClickAwayListener>
              </>
            )}

            {filter?.filterType === "deposit" && (
              <>
                <Typography sx={labelStyle}>Select Deposit Type</Typography>
                <Select
                  value={filter.types.map((status) => ({
                    value: status,
                    label: status,
                  }))}
                  options={allDepositType}
                  placeholder={<Typography>Select Deposit Type</Typography>}
                  {...selectProps}
                  isMulti
                  onChange={(value) =>
                    handleBookingStatusTripTypeChange(value, "types")
                  }
                  components={{ DropdownIndicator: null }}
                />{" "}
              </>
            )}

            <Typography sx={labelStyle}>Select Graph Line Color</Typography>
            <input
              value={filter?.lineColor}
              id="color-select"
              type="color"
              style={{
                border: "1px solid var(--border)",
                height: "46px",
                width: "100%",
                borderRadius: "4px",
                padding: "3px 5px",
                backgroundColor: "white",
              }}
              onChange={(e) => {
                handleChangeFilter({ value: e.target.value }, "lineColor");
              }}
            />
          </Box>
        ))}

        <Typography sx={labelStyle}>Select Range</Typography>
        <Select
          value={rangeOption.find((r) => r === by)}
          options={rangeOption}
          placeholder={<Typography>Select Filter Type</Typography>}
          {...selectProps}
          onChange={(value) => setBy(value?.value)}
          components={{ DropdownIndicator: null }}
        />

        <Box sx={{ display: "flex", gap: "20px", position: "relative" }}>
          <Box onClick={() => setOpenDate("from")} sx={{ width: "50%" }}>
            <Typography sx={labelStyle}>Select From</Typography>
            <Box sx={customInputBox}>
              {dateRange.from ? (
                <Typography sx={{ fontSize: "14px", color: "#333" }}>
                  {moment(dateRange.from).format("DD/MM/YYYY")}
                </Typography>
              ) : (
                <Typography sx={{ fontSize: "14px", color: "#808080" }}>
                  DD/MM/YYYY
                </Typography>
              )}
            </Box>
          </Box>
          <Box onClick={() => setOpenDate("to")} sx={{ width: "50%" }}>
            <Typography sx={labelStyle}>Select To</Typography>
            <Box sx={customInputBox}>
              {dateRange.to ? (
                <Typography sx={{ fontSize: "14px", color: "#333" }}>
                  {moment(dateRange.to).format("DD/MM/YYYY")}
                </Typography>
              ) : (
                <Typography sx={{ fontSize: "14px", color: "#808080" }}>
                  DD/MM/YYYY
                </Typography>
              )}
            </Box>
          </Box>
          {!!openDate && (
            <ClickAwayListener
              onClickAway={() => openDate && setOpenDate(false)}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: "0",
                  "& .rdrDefinedRangesWrapper": { width: "0px" },
                  "& .rdrDateRangePickerWrapper": { width: "100%" },
                  "& .rdrStartEdge, .rdrInRange, .rdrEndEdge": {
                    backgroundColor: "var(--primary-color)",
                  },
                  width: "100%",
                  bottom: "52px",
                }}
              >
                <Box sx={{ display: "flex", width: "100%", bgcolor: "white" }}>
                  <CustomCalendar
                    date={dateRange[openDate]}
                    maxDate={new Date()}
                    title={openDate === "from" ? "Select From" : "Select To"}
                    handleChange={(date) => {
                      setDateRange({ ...dateRange, [openDate]: date });
                      setOpenDate(openDate === "from" ? "to" : "");
                    }}
                  />
                </Box>
              </Box>
            </ClickAwayListener>
          )}
        </Box>
      </Box>

      <Box sx={{ pb: 2.5 }}>
        <Button onClick={handleSubmit} sx={{ ...submitBtn, width: "100%" }}>
          Apply Filter
        </Button>
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

const SelectRoute = ({ setFilterTabs, i }) => {
  const { jsonHeader } = useAuth();
  const [airportData, setAirportData] = useState({});
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState("");
  const [route, setRoute] = useState({ from: "", to: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${process.env.REACT_APP_BASE_URL}/api/v1/admin/airports/search-suggestion`;
        const response = await axios.post(
          url,
          { keyword: keyword || "DXB" },
          jsonHeader()
        );
        const data = response?.data?.data[0];
        setAirportData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (keyword.length >= 3) {
      fetchData();
    }
  }, [keyword]);

  const handleGetRoute = (selected) => {
    if (open === "Departure") {
      if (selected.code === route?.to) {
        setError("Can not select same route");
        return;
      }

      setRoute({ ...route, from: selected?.code });
      setOpen("Arrival");
    } else {
      if (selected.code === route?.from) {
        setError("Can not select same route");
        return;
      }
      setRoute({ ...route, to: selected?.code });
      setOpen("");
    }
    if (error) {
      setError("");
    }
    setKeyword("");
  };

  const handleAddFilterRoute = () => {
    setFilterTabs((prev) =>
      prev.map((filter, index) => {
        if (index === i) {
          return {
            ...filter,
            routes: [
              ...filter.routes,
              { departure: route.from, arrival: route.to },
            ],
          };
        }
        return filter;
      })
    );

    setOpen("");
    setRoute({ from: "", to: "" });
  };

  return (
    <Box
      sx={{
        ...customInputBox,
        flexDirection: "column",
        height: "100%",
        alignItems: "start",
        p: "0",
      }}
      mt={1}
    >
      <Box sx={{ p: "8px", width: "100%", display: "flex", gap: "10px" }}>
        <Box
          onClick={() => setOpen("Departure")}
          sx={{ ...customInputBox, width: "50%" }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              color: route?.from || open === "Departure" ? "#333" : "#808080",
            }}
          >
            {route?.from || "Select Departure"}
          </Typography>
        </Box>
        <Box
          onClick={() => setOpen("Arrival")}
          sx={{ ...customInputBox, width: "50%" }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              color: route?.to || open === "Arrival" ? "#333" : "#808080",
            }}
          >
            {route?.to || "Select Arrival"}
          </Typography>
        </Box>
      </Box>

      {open && (
        <>
          <Typography
            sx={{ fontSize: "12px", color: "var(--primary-color)", px: "15px" }}
          >
            {error}
          </Typography>

          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            name="to"
            style={{
              border: "none",
              padding: "5px 15px",
              width: "100%",
              outline: "none",
              borderBottom: "1px solid var(--border)",
            }}
            type="text"
            placeholder={`Select ${open} Airport`}
          />
          <Box sx={{ maxHeight: "140px", overflow: "auto", width: "100%" }}>
            <Box onClick={() => handleGetRoute(airportData?.result)}>
              <SuggestCard item={airportData?.result} isFirstElement={true} />
            </Box>
            {airportData?.suggestion?.length > 0 && (
              <>
                {airportData?.suggestion?.map((item, i) => {
                  return (
                    <React.Fragment key={i}>
                      <Box onClick={() => handleGetRoute(item)}>
                        <SuggestCard item={item} />
                      </Box>
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </Box>
        </>
      )}

      {route?.from && route?.to && (
        <Box
          onClick={handleAddFilterRoute}
          sx={{
            display: "flex",
            justifyContent: "end",
            pr: "8px",
            width: "100%",
          }}
        >
          <Button sx={submitBtn}>Add</Button>
        </Box>
      )}
    </Box>
  );
};

export const SuggestCard = ({ item, isFirstElement, isSelected }) => {
  return (
    <Box
      sx={{
        paddingLeft: "15px",
        paddingRight: "10px",
        backgroundColor: isSelected ? "#D1E9FF" : "#fff",
        transition: "all .2s ease-in-out",
        "&:hover": { backgroundColor: "#D1E9FF" },
        width: "100%",
      }}
    >
      <Box
        sx={{
          margin: "0px 0px",
          padding: "5px 0px",
          cursor: "pointer",
          display: "flex",
          width: "100%",
          alignItems: "start",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", gap: "3px" }}>
          {isFirstElement ? (
            ""
          ) : (
            <SubdirectoryArrowRightIcon
              sx={{ fontSize: "17px", color: "#677D81" }}
            />
          )}

          <Box>
            <span
              style={{
                fontSize: isFirstElement ? "12px" : "11px",
                color: "#003566",
                display: "block",
                textAlign: "left",
                fontWeight: isSelected ? "500" : "normal",
              }}
            >
              {item?.cityName} {item?.countryName}
            </span>
            <span
              style={{
                fontSize: isFirstElement ? "10px" : "9.5px",
                color: "gray",
                display: "block",
                textAlign: "left",
                fontWeight: isSelected ? "500" : "normal",
              }}
            >
              {item?.name}
            </span>
          </Box>
        </Box>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: isFirstElement ? "13px" : "11px",
              display: "block",
              textAlign: "left",
              paddingRight: "5px",
              color: isSelected ? "#003566" : "#999",
              fontWeight: "600",
            }}
          >
            {item?.code}
          </span>
        </Box>
      </Box>
    </Box>
  );
};

export const customInputBox = {
  backgroundColor: "#ffffff",
  border: "1px solid hsla(0, 0%, 0%, 0.1)",
  height: "40px",
  borderRadius: "4px",
  bgcolor: "#fff",
  cursor: "pointer",
  px: "8px",
  display: "flex",
  alignItems: "center",
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

const commonBtnStyle = {
  textTransform: "capitalize",
  fontSize: "14px",
  px: 2,
  py: 2.5,
  height: "30px",
};

export const submitBtn = {
  ...commonBtnStyle,
  bgcolor: "var(--primary-color)",
  ":hover": { bgcolor: "var(--primary-color)" },
  color: "white",
};

export const labelStyle = {
  mt: 1.5,
  mb: "6px",
  fontSize: "15px",
  fontWeight: "500",
};

export const chartFilterSelectStyle = (type) => ({
  option: (provided, state) => {
    return {
      ...provided,
      margin: "0px",
      padding: type === "airlines" ? "0px" : "5px 8px",
      cursor: "pointer",
      fontSize: "14px",
      backgroundColor: "none",
      textTransform: "capitalize",
      color: state?.isSelected ? "var(--secondary-color)" : "#000000de",
      fontWeight: state?.isSelected ? "500" : "400",
    };
  },

  control: (provided) => {
    return {
      ...provided,
      boxShadow: "none",
      display: "flex",
      cursor: "pointer",
      fontSize: "14px",
      padding: "0px",
      minHeight: "40px",
      backgroundColor: "#ffffff",
      marginTop: type === "airlines" && "8px",
      border: "1px solid hsla(0, 0%, 0%, 0.1)",
      "&:hover": {
        border: "1px solid hsla(0, 0%, 0%, 0.1)",
      },
      borderRadius: type === "airlines" ? "4px 4px 0px 0px" : "4px",
    };
  },
  indicatorSeparator: () => null,
  menuList: (provided) => {
    return {
      ...provided,
      maxHeight: "150px",
      "::-webkit-scrollbar": { width: "0px", height: "0px" },
      "::-webkit-scrollbar-track": { background: "#e9f7ff" },
      "::-webkit-scrollbar-thumb": { background: "#e9f7ff" },
      padding: "0px",
    };
  },

  menu: (provided) => {
    return {
      ...provided,
      borderRadius: type === "airlines" ? "0px 0px 4px 4px" : "4px",
      overflow: "auto",
      marginTop: type === "airlines" ? "0px" : "8px",
      border: "1px solid hsla(0, 0%, 0%, 0.1)",
      boxShadow: "none",
      borderTop: type === "airlines" && "none",
    };
  },

  singleValue: (provided) => ({ ...provided, textTransform: "capitalize" }),
});

export const selectProps = {
  isSearchable: false,
  styles: chartFilterSelectStyle(),
  inputProps: { autoComplete: "off" },
};

const allTabs = ["search", "booking", "deposit", "revenue"];

const filterTypeOptions = allTabs.map((tab) => ({
  value: tab.toLowerCase(),
  label: tab,
}));

const allBookingStatus = [
  "hold",
  "ticketed",
  "refunded",
  "reissued",
  "cancelled",
];
const allTripType = ["oneway", "return", "multicity"];
const allDepositType = [
  { label: "cash", value: "cash" },
  { label: "bank transfer", value: "bankTransfer" },
  { label: "bank deposit", value: "bank" },
  { label: "cheque deposit", value: "cheque" },
];
const allRange = ["daily", "monthly", "yearly"];
const rangeOption = allRange.map((tab) => ({
  value: tab.toLowerCase(),
  label: tab,
}));

const addBtn = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  btn: {
    bgcolor: "var(--secondary-color)",
    ":hover": { bgcolor: "var(--secondary-color)" },
    color: "white",
    borderRadius: "50%",
    minWidth: "30px",
    height: "30px",
    padding: "0",
  },
};

const groupByStyle = {
  borderRadius: "4px",
  outline: "none",
  border: "none",
  paddingLeft: "10px",
  width: "130px",
  background: "var(--primary-color)",
  position: "absolute",
  right: "8px",
  top: "50%",
  transform: "translateY(11%)",
  zIndex: 1000,
  color: "white",
};

export default LIneChartFilter;
