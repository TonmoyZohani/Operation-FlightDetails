import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  ClickAwayListener,
  Collapse,
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useAuth } from "../../../context/AuthProvider";
import CustomCalendar from "../../CustomCalendar/CustomCalendar";
import { fetchAllAirlines } from "../../FlightSearchBox/FlightOptions";
import {
  chartFilterSelectStyle,
  customInputBox,
  labelStyle,
  selectProps,
  submitBtn,
  SuggestCard,
} from "./LIneChartFilter";

const GroupByFilter = ({ setChartData, activeTab }) => {
  const { jsonHeader } = useAuth();
  const [openRoute, setOpenRoute] = useState(false);
  const [allAirlines, setAllAirlines] = useState([]);
  const [showAirlines, setShowAirlines] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState("");
  const [openDate, setOpenDate] = useState("");
  const [groupData, setGroupData] = useState({
    type: "",
    route: { departure: "", arrival: "" },
    airline: "",
    by: "",
    from: "",
    to: "",
    type: "",
    item: activeTab,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllAirlines();
      setAllAirlines(data);
    };

    fetchData();
  }, []);

  const handleChangeGroupType = (value, prop) => {
    setGroupData({ ...groupData, [prop]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/report/breakdown`,
        groupData,
        jsonHeader()
      );

      setChartData(response?.data?.data);
    } catch (e) {
      console.error(e.message);
    }
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
        <Typography sx={{ ...labelStyle, fontSize: "18px", mt: 0, mb: 1.5 }}>
          Group By Filter
        </Typography>
        <>
          <Typography sx={labelStyle}>Select Group By Type</Typography>
          <Select
            value={groupTypes.find((option) => option.value === groupData.type)}
            options={groupTypes}
            placeholder={<Typography>Select Group By Type</Typography>}
            {...selectProps}
            onChange={(value) => handleChangeGroupType(value?.value, "type")}
            components={{ DropdownIndicator: null }}
          />
        </>

        {groupData.type === "airlines by route" && (
          <>
            <Typography sx={labelStyle}>Select Route</Typography>
            <Box>
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenRoute(!openRoute);
                }}
                sx={{ ...customInputBox, position: "relative" }}
              >
                {groupData?.route?.departure && groupData?.route?.arrival ? (
                  <Box
                    sx={{
                      display: "flex",
                      bgcolor: "#E6E6E6",
                      borderRadius: "2px",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", p: "3px 3px 3px 6px" }}>
                      <Typography sx={{ fontSize: "12px", color: "#333" }}>
                        {groupData?.route?.departure}
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: "#333" }}>
                        -
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: "#333" }}>
                        {groupData?.route?.arrival}
                      </Typography>
                    </Box>
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeGroupType(
                          { departure: "", arrival: "" },
                          "route"
                        );
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        ":hover": { bgcolor: "#e74c3c70" },
                        p: "3px",
                      }}
                    >
                      <CloseIcon sx={{ fontSize: "10px" }} />
                    </Box>
                  </Box>
                ) : (
                  <Typography sx={{ fontSize: "14px", color: "#808080" }}>
                    Select Route
                  </Typography>
                )}
              </Box>

              <Collapse in={openRoute}>
                <SelectRoute
                  groupData={groupData}
                  setGroupData={setGroupData}
                />
              </Collapse>
            </Box>
          </>
        )}

        {groupData.type === "routes by airline" && (
          <>
            <Typography sx={labelStyle}>Select Airlines</Typography>

            <ClickAwayListener
              onClickAway={() => showAirlines && setShowAirlines(false)}
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
                  onClick={() => setShowAirlines(!showAirlines)}
                  sx={customInputBox}
                >
                  <Box sx={{ display: "flex", gap: "5px", width: "100%" }}>
                    {selectedAirline ? (
                      <Typography sx={{ fontSize: "14px" }}>
                        {selectedAirline}
                      </Typography>
                    ) : (
                      <Typography sx={{ fontSize: "14px", color: "#808080" }}>
                        Select Airlines
                      </Typography>
                    )}
                  </Box>
                </Box>

                {showAirlines && (
                  <Box sx={{ position: "absolute", width: "100%" }}>
                    <Select
                      {...selectProps}
                      styles={chartFilterSelectStyle("airlines")}
                      options={allAirlines}
                      value={groupData?.airline}
                      onChange={(value) => {
                        const selected = value?.value.split("-");
                        handleChangeGroupType(selected[0], "airline");
                        setSelectedAirline(selected[1]);
                        setShowAirlines(false);
                      }}
                      placeholder={<Typography>Search Airline</Typography>}
                      isSearchable={true}
                      menuIsOpen
                    />
                  </Box>
                )}
              </Box>
            </ClickAwayListener>
          </>
        )}
        <>
          <Typography sx={labelStyle}>Select Limit </Typography>
          <Select
            value={allLimits.find((option) => option.value === groupData.type)}
            options={allLimits}
            placeholder={<Typography>Select Limit</Typography>}
            {...selectProps}
            onChange={(value) => handleChangeGroupType(value?.value, "limit")}
            components={{ DropdownIndicator: null }}
          />
        </>

        <>
          <Typography sx={labelStyle}>Select Range</Typography>
          <Select
            value={rangeOption.find((r) => r === groupData.by)}
            options={rangeOption}
            placeholder={<Typography>Select Filter Type</Typography>}
            {...selectProps}
            onChange={(value) => handleChangeGroupType(value.value, "by")}
            components={{ DropdownIndicator: null }}
          />
        </>

        <>
          <Box sx={{ display: "flex", gap: "20px", position: "relative" }}>
            <Box onClick={() => setOpenDate("from")} sx={{ width: "50%" }}>
              <Typography sx={labelStyle}>Select From</Typography>
              <Box sx={customInputBox}>
                {groupData.from ? (
                  <Typography sx={{ fontSize: "14px", color: "#333" }}>
                    {moment(groupData.from).format("DD/MM/YYYY")}
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
                {groupData.to ? (
                  <Typography sx={{ fontSize: "14px", color: "#333" }}>
                    {moment(groupData.to).format("DD/MM/YYYY")}
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
                  <Box
                    sx={{ display: "flex", width: "100%", bgcolor: "white" }}
                  >
                    <CustomCalendar
                      date={groupData[openDate]}
                      maxDate={new Date()}
                      title={openDate === "from" ? "Select From" : "Select To"}
                      handleChange={(date) => {
                        handleChangeGroupType(date, openDate);
                        setOpenDate(openDate === "from" ? "to" : "");
                      }}
                    />
                  </Box>
                </Box>
              </ClickAwayListener>
            )}
          </Box>
        </>
      </Box>

      <Box sx={{ pb: 2.5 }}>
        <Button onClick={handleSubmit} sx={{ ...submitBtn, width: "100%" }}>
          Appply Filter
        </Button>
      </Box>
    </Box>
  );
};

const SelectRoute = ({ groupData, setGroupData }) => {
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
    setGroupData({
      ...groupData,
      route: { departure: route.from, arrival: route.to },
    });
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

const groupTypes = [
  { label: "Top Airlines", value: "airline" },
  { label: "Top Route", value: "route" },
  { label: "Top Routes by Airline", value: "routes by airline" },
  { label: "Top Airlines by Route", value: "airlines by route" },
];

const allRange = ["daily", "monthly", "yearly"];
const rangeOption = allRange.map((tab) => ({
  value: tab.toLowerCase(),
  label: tab,
}));

const allLimits = [
  { label: "Top 5", value: 5 },
  { label: "Top 10", value: 10 },
];

export default GroupByFilter;
