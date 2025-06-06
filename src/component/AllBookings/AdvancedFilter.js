import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Collapse,
  TextField,
  ClickAwayListener,
} from "@mui/material";
import Select from "react-select";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../context/AuthProvider";
import { fetchAllAirlines } from "../FlightSearchBox/FlightOptions";
import useToast from "../../hook/useToast";
import CustomToast from "../Alert/CustomToast";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { allClassess } from "../../shared/StaticData/allClassess";
import CancelIcon from "@mui/icons-material/Cancel";
import moment from "moment";
import CustomCalendar from "../CustomCalendar/CustomCalendar";

const AdvancedFilter = ({
  filterQuery,
  setFilterQuery,
  setIsAdvanceFilter,
  handleSearchClick,
}) => {
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const [openRoute, setOpenRoute] = useState(false);
  const [allAirlines, setAllAirlines] = useState([]);
  const [openDate, setOpenDate] = useState("");
  const [openBookingDate, setOpenBookingDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllAirlines();
      setAllAirlines(data);
    };

    fetchData();
  }, []);

  const classOptions = allClassess.map((cls) => ({
    value: cls.code,
    label: `${cls.code} - ${cls.name}`,
  }));

  const handleFilterQuery = (statusTitle, selectedOption) => {
    setFilterQuery((prev) => ({
      ...prev,
      [statusTitle]:
        statusTitle === "carrier"
          ? selectedOption.value.split("-")[0].trim()
          : selectedOption.value,
    }));
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
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ ...labelStyle, fontSize: "18px", mt: 0, mb: 1.5 }}>
            Booking Advanced Filter
          </Typography>
          <CloseIcon
            sx={{ color: "var(--primary-color)", cursor: "pointer" }}
            onClick={() => setIsAdvanceFilter(false)}
          />
        </Box>

        {/* TODO:: Selecting booking status */}
        <Box
          sx={{
            ".css-1d9ye53-MuiTypography-root": {
              fontSize: "14px !important",
            },
            position: "relative",
          }}
        >
          <Typography sx={labelStyle}>Select Booking Status</Typography>
          <Box sx={{ position: "absolute", width: "100%" }}>
            <Select
              options={filterTypeOptions}
              value={
                filterQuery.status
                  ? { label: filterQuery.status, value: filterQuery.status }
                  : null
              }
              placeholder={<Typography>Select Status Type</Typography>}
              onChange={(value) => handleFilterQuery("status", value)}
              components={{ DropdownIndicator: null }}
              {...selectProps}
            />
          </Box>
          <span
            onClick={() => handleFilterQuery("status", "")}
            style={{
              position: "absolute",
              color: "var(--secondary-color)",
              right: "5px",
              top: "38px",
              cursor: "pointer",
            }}
          >
            <CancelIcon nsx={{ fontSize: "25px" }} />
          </span>
        </Box>

        {/* TODO:: Selecting trip type */}
        <Box
          sx={{
            ".css-1d9ye53-MuiTypography-root": {
              fontSize: "14px !important",
            },
            position: "relative",
            mt: "55px",
          }}
        >
          <Typography sx={labelStyle}>Trip Type</Typography>
          <Box sx={{ position: "absolute", width: "100%" }}>
            <Select
              options={allTripType.map((tab) => ({
                value: tab,
                label: tab,
              }))}
              value={
                filterQuery.tripType
                  ? { label: filterQuery.tripType, value: filterQuery.tripType }
                  : null
              }
              placeholder={<Typography>Select Trip Type</Typography>}
              onChange={(value) => handleFilterQuery("tripType", value)}
              components={{ DropdownIndicator: null }}
              {...selectProps}
            />
          </Box>
          <span
            onClick={() => handleFilterQuery("tripType", "")}
            style={{
              position: "absolute",
              color: "var(--secondary-color)",
              right: "5px",
              top: "38px",
              cursor: "pointer",
            }}
          >
            <CancelIcon nsx={{ fontSize: "25px" }} />
          </span>
        </Box>

        {/* TODO:: Selecting route */}
        <Box
          sx={{
            ".css-1d9ye53-MuiTypography-root": {
              fontSize: "14px !important",
            },
            position: "relative",
            mt: "55px",
          }}
        >
          <Typography sx={labelStyle}>Select Route</Typography>
          <Box
            onClick={(e) => {
              e.stopPropagation();
              setOpenRoute(!openRoute);
            }}
            sx={{ ...customInputBox, position: "relative" }}
          >
            {openRoute ? (
              <>
                <Box
                  sx={{ position: "absolute", display: "flex", gap: "10px" }}
                >
                  {filterQuery?.departure && filterQuery?.arrival ? (
                    <Typography sx={{ fontSize: "13px" }}>
                      Departure - {filterQuery?.departure} and Arrival -{" "}
                      {filterQuery?.arrival}
                    </Typography>
                  ) : filterQuery?.arrival ? (
                    <Typography sx={{ fontSize: "13px" }}>
                      Arrival - {filterQuery?.arrival}
                    </Typography>
                  ) : filterQuery?.departure ? (
                    <Typography sx={{ fontSize: "13px" }}>
                      Departure - {filterQuery?.departure}
                    </Typography>
                  ) : (
                    <Typography>No route is selected</Typography>
                  )}
                </Box>
                <span
                  onClick={() => {
                    handleFilterQuery("departure", "");
                    handleFilterQuery("arrival", "");
                  }}
                  style={{
                    position: "absolute",
                    color: "var(--secondary-color)",
                    right: "5px",
                    top: "10px",
                    cursor: "pointer",
                  }}
                >
                  <CancelIcon sx={{ fontSize: "25px" }} />
                </span>
              </>
            ) : (
              <Typography sx={{ fontSize: "14px", color: "#808080" }}>
                Select Route
              </Typography>
            )}
          </Box>

          <Collapse in={openRoute}>
            <SelectRoute handleFilterQuery={handleFilterQuery} />
          </Collapse>
        </Box>

        {/* TODO:: Selecting airlines */}
        <Box
          sx={{
            ".css-1d9ye53-MuiTypography-root": {
              fontSize: "14px !important",
            },
            position: "relative",
          }}
        >
          <Typography sx={labelStyle}>Airlines</Typography>
          <Box sx={{ position: "absolute", width: "100%" }}>
            <Select
              {...selectProps}
              value={
                filterQuery.carrier
                  ? { label: filterQuery.carrier, value: filterQuery.carrier }
                  : null
              }
              styles={selectStyle("airlines")}
              options={allAirlines.length === 5 ? [] : allAirlines}
              onChange={(value) => handleFilterQuery("carrier", value)}
              placeholder={<Typography>Select Airlines</Typography>}
              isSearchable={allAirlines.length === 5 ? false : true}
            />
          </Box>
          <span
            onClick={() => handleFilterQuery("carrier", "")}
            style={{
              position: "absolute",
              color: "var(--secondary-color)",
              right: "5px",
              top: "46px",
              cursor: "pointer",
            }}
          >
            <CancelIcon nsx={{ fontSize: "25px" }} />
          </span>
        </Box>

        {/* TODO:: Selecting class */}
        <Box
          sx={{
            mt: "68px",
            ".css-1d9ye53-MuiTypography-root": {
              fontSize: "14px !important",
            },
            position: "relative",
          }}
        >
          <Typography sx={labelStyle}>Class</Typography>

          <Box sx={{ position: "absolute", width: "100%" }}>
            <Select
              options={classOptions}
              placeholder={<Typography>Select Class</Typography>}
              value={
                filterQuery.bookingClass
                  ? {
                      label: filterQuery.bookingClass,
                      value: filterQuery.bookingClass,
                    }
                  : null
              }
              onChange={(value) => handleFilterQuery("bookingClass", value)}
              components={{ DropdownIndicator: null }}
              {...selectProps}
            />
          </Box>
          <span
            onClick={() => handleFilterQuery("bookingClass", "")}
            style={{
              position: "absolute",
              color: "var(--secondary-color)",
              right: "5px",
              top: "38px",
              cursor: "pointer",
            }}
          >
            <CancelIcon nsx={{ fontSize: "25px" }} />
          </span>
        </Box>

        {/* TODO:: Passenger count */}
        <Box sx={{ mt: "60px" }}>
          <Typography sx={labelStyle}>Passenger Count</Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              onChange={(e) =>
                handleFilterQuery("ADT", { value: e.target.value })
              }
              placeholder="No of Adult"
              type="number"
              sx={{
                width: "31.5%",
                "& .MuiInputBase-root": {
                  height: "40px",
                },
              }}
            />

            <TextField
              onChange={(e) =>
                handleFilterQuery("CNN", { value: e.target.value })
              }
              placeholder="No of Child"
              type="number"
              sx={{
                width: "31.5%",
                "& .MuiInputBase-root": {
                  height: "40px",
                },
              }}
            />

            <TextField
              onChange={(e) =>
                handleFilterQuery("INF", { value: e.target.value })
              }
              placeholder="No of Infant"
              type="number"
              sx={{
                width: "31.5%",
                "& .MuiInputBase-root": {
                  height: "40px",
                },
              }}
            />
          </Box>
        </Box>

        {/* TODO:: Passenger count */}
        <Box>
          <Typography sx={labelStyle}>Amount Range</Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              onChange={(e) =>
                handleFilterQuery("priceMax", { value: e.target.value })
              }
              placeholder="Maximum Price"
              type="number"
              sx={{
                width: "47.5%",
                "& .MuiInputBase-root": {
                  height: "40px",
                },
              }}
            />

            <TextField
              onChange={(e) =>
                handleFilterQuery("priceMin", { value: e.target.value })
              }
              placeholder="Minimum Price"
              type="number"
              sx={{
                width: "47.5%",
                "& .MuiInputBase-root": {
                  height: "40px",
                },
              }}
            />
          </Box>
        </Box>

        {/* TODO:: Flight Date range */}
        <Box sx={{ display: "flex", gap: "20px", position: "relative" }}>
          <Box
            onClick={() => setOpenDate("departureDateFrom")}
            sx={{ width: "50%" }}
          >
            <Typography sx={labelStyle}>Departure Date</Typography>
            <Box sx={customInputBox}>
              {filterQuery.departureDateFrom ? (
                <Typography sx={{ fontSize: "14px", color: "#333" }}>
                  {moment(filterQuery.departureDateFrom).format("DD/MM/YYYY")}
                </Typography>
              ) : (
                <Typography sx={{ fontSize: "14px", color: "#808080" }}>
                  DD/MM/YYYY
                </Typography>
              )}
            </Box>
          </Box>
          <Box
            onClick={() => setOpenDate("departureDateTo")}
            sx={{ width: "50%" }}
          >
            <Typography sx={labelStyle}>Arrival Date</Typography>
            <Box sx={customInputBox}>
              {filterQuery.departureDateTo ? (
                <Typography sx={{ fontSize: "14px", color: "#333" }}>
                  {moment(filterQuery.departureDateTo).format("DD/MM/YYYY")}
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
                    date={filterQuery[openDate]}
                    maxDate={new Date()}
                    title={
                      openDate === "departureDateFrom"
                        ? "Departure Date"
                        : "Arrival Date"
                    }
                    handleChange={(date) => {
                      const formattedDate = new Intl.DateTimeFormat("en-GB", {
                        timeZone: "Asia/Dhaka",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                        .format(date)
                        .split("/")
                        .reverse()
                        .join("-");

                      setFilterQuery({
                        ...filterQuery,
                        [openDate]: formattedDate,
                      });

                      setOpenDate(
                        openDate === "departureDateFrom"
                          ? "departureDateTo"
                          : ""
                      );
                    }}
                  />
                </Box>
              </Box>
            </ClickAwayListener>
          )}
        </Box>

        {/* TODO:: Booking Date */}
        <Box sx={{ display: "flex", gap: "20px", position: "relative" }}>
          <Box
            onClick={() => setOpenBookingDate("createdFrom")}
            sx={{ width: "50%" }}
          >
            <Typography sx={labelStyle}>Booking Start Date</Typography>
            <Box sx={customInputBox}>
              {filterQuery.createdFrom ? (
                <Typography sx={{ fontSize: "14px", color: "#333" }}>
                  {moment(filterQuery.createdFrom).format("DD/MM/YYYY")}
                </Typography>
              ) : (
                <Typography sx={{ fontSize: "14px", color: "#808080" }}>
                  DD/MM/YYYY
                </Typography>
              )}
            </Box>
          </Box>
          <Box
            onClick={() => setOpenBookingDate("createdTo")}
            sx={{ width: "50%" }}
          >
            <Typography sx={labelStyle}>Booking End Date</Typography>
            <Box sx={customInputBox}>
              {filterQuery.createdTo ? (
                <Typography sx={{ fontSize: "14px", color: "#333" }}>
                  {moment(filterQuery.createdTo).format("DD/MM/YYYY")}
                </Typography>
              ) : (
                <Typography sx={{ fontSize: "14px", color: "#808080" }}>
                  DD/MM/YYYY
                </Typography>
              )}
            </Box>
          </Box>
          {!!openBookingDate && (
            <ClickAwayListener
              onClickAway={() => openBookingDate && setOpenBookingDate(false)}
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
                    date={filterQuery[openBookingDate]}
                    maxDate={new Date()}
                    title={
                      openBookingDate === "createdFrom"
                        ? "Booking Start Date"
                        : "Booking End Date"
                    }
                    handleChange={(date) => {
                      const formattedDate = new Intl.DateTimeFormat("en-GB", {
                        timeZone: "Asia/Dhaka",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                        .format(date)
                        .split("/")
                        .reverse()
                        .join("-");

                      setFilterQuery({
                        ...filterQuery,
                        [openBookingDate]: formattedDate,
                      });

                      setOpenBookingDate(
                        openBookingDate === "createdFrom"
                          ? "createdTo"
                          : ""
                      );
                    }}
                  />
                </Box>
              </Box>
            </ClickAwayListener>
          )}
        </Box>

        <Box sx={{ my: "30px" }}>
          <Button
            style={{ width: "100%", height: "35px" }}
            onClick={() => handleSearchClick()}
            sx={submitBtn}
          >
            Search
          </Button>
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

const SelectRoute = ({ handleFilterQuery }) => {
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
      handleFilterQuery("departure", { value: selected?.code });
      setOpen("");
    } else {
      if (selected.code === route?.from) {
        setError("Can not select same route");
        return;
      }
      setRoute({ ...route, to: selected?.code });
      handleFilterQuery("arrival", { value: selected?.code });
      setOpen("");
    }
    if (error) {
      setError("");
    }
    setKeyword("");
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
    </Box>
  );
};

const SuggestCard = ({ item, isFirstElement, isSelected }) => {
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

const commonBtnStyle = {
  textTransform: "capitalize",
  fontSize: "12px",
  px: 2,
  py: 1,
  height: "30px",
};

const submitBtn = {
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

export const selectStyle = (type) => ({
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
  styles: selectStyle(),
  inputProps: { autoComplete: "off" },
};

const allTabs = [
  "all",
  "hold",
  "issue in process",
  "partially refund",
  "ticketed",
  "refund",
  "reissued",
  "void",
  "cancel",
];

const filterTypeOptions = allTabs.map((tab) => ({
  value: tab.toLowerCase(),
  label: tab,
}));

const allTripType = ["oneWay", "return", "multiCity"];
const allRange = ["daily", "monthly", "yearly"];

export default AdvancedFilter;
