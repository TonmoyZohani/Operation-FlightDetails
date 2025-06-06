import {
  Box,
  Radio,
  RadioGroup,
  Grid,
  ClickAwayListener,
  Grow,
  FormControl,
  Tooltip,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ReactComponent as DropDownIcon } from "../../images/svg/dropdown.svg";
import { Typography } from "@mui/material";
import {
  airLineSelectCustomStyle,
  BpIcon,
  BpCheckedIcon,
} from "../../shared/common/styles.js";
import "./FlightOptions.css";
import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  setCabin,
  setFareType,
  setSearchType,
  setSelectedAirlines,
} from "./flightSearchSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { convertCamelToTitle } from "../../shared/common/functions.js";
import { useAuth } from "../../context/AuthProvider.js";

export const classTypes = [
  {
    label: "Economy",
    value: "Economy",
  },
  {
    label: "Business",
    value: "Business",
  },
  {
    label: "Premium First",
    value: "Premiumfirst",
  },
  {
    label: "Premium Economy",
    value: "Premiumeconomy",
  },
  {
    label: "Premium Business",
    value: "Premiumbusiness",
  },
];

export const checkBoxes = [
  {
    name: "searchType",
    boxes: [
      {
        label: "Regular Search",
        value: "regular",
      },
      {
        label: "Advanced Search",
        value: "advanced",
      },
    ],
  },
];

const searchTypes = [
  {
    label: "Regular Search",
    value: "regular",
  },
  // {
  //   label: "Advanced Search",
  //   value: "regular",
  // },
  {
    label: "Split Search",
    value: "split",
    description: "This search is only for Round Way",
  },
];

const allfareTypes = [
  {
    label: "Regular Fare",
    value: "regularFare",
    description: "",
  },
  {
    label: "Labor Fare",
    value: "laborFare",
    description:
      "Passengers with new employment visas traveling from Bangladesh (BD) to Saudi Arabia (K.S.A) or Kuala Lumpur (KUL) are eligible for a special fare (RBD # T). Other visa types or old employment visas may lead to travel difficulties or penalties if this specific ticket is used.",
  },
  {
    label: "Umrah Fare",
    value: "umrahFare",
    description:
      "This special fare is for Umrah pilgrims with a valid Umrah Visa traveling outside of Saudi Arabia's restricted periods. The airline will not allow boarding if these conditions aren't met.",
  },
  {
    label: "Student Fare",
    value: "studentFare",
    description:
      "To qualify for student fares or extra baggage, passengers must be over 12 years old and possess valid student ID cards and student visas (when necessary). Failure to provide these may lead to denied boarding or baggage fees.",
  },
  {
    label: "Seaman Fare",
    value: "seamanFare",
    description:
      "Those employed on tankers, cruise ships, or in oil/energy production (onshore or offshore) are considered seafarers, encompassing roles from administrators to support staff who are certified. They must carry valid identification and letters to avoid being denied boarding.",
  },
];

// Fetch airlines data and return options array
export const fetchAllAirlines = async (agentToken, isDomestic) => {
  try {
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/airlines/code`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${agentToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = response?.data?.data;

    // If isDomestic is true, filter airlines by predefined domestic codes
    const filteredData = isDomestic
      ? data.filter((airline) =>
          ["VQ", "2A", "BS", "BG"].includes(airline.code)
        )
      : data;

    // Map the filtered or all data
    return filteredData.map((airline) => ({
      label: (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 10px",
            cursor: "pointer",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <img
              src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${airline.code}.png`}
              style={{ height: "20px", width: "20px" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://storage.googleapis.com/erp-document-bucket/alternetFlightIcon.png";
              }}
            />
            <Typography sx={{ fontSize: "12.3px", fontWeight: 500 }}>
              {airline.name}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "12.3px", fontWeight: 500 }}>
            {airline.code}
          </Typography>
        </Box>
      ),
      value: `${airline.code}-${airline.name}`,
    }));
  } catch (error) {
    return [];
  }
};

const FlightOptions = ({ isDomestic, flightAfterSearch, tripType }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isShowPreferedAirlines, setIsShowPreferedAirlines] = useState(false);
  const [allAirlines, setAllAirlines] = useState([]);
  const [initialAllAirlines, setInitialAllAirlines] = useState([]);
  const [isShowClass, setIsShowClass] = useState(false);
  const [isShowSearchType, setIsShowSearchType] = useState(false);
  const [isShowFareType, setIsShowFareType] = useState(false);
  const { selectedAirlines, searchType, fareType, cabin } = useSelector(
    (state) => state?.flight
  );
  const { agentToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllAirlines(agentToken, isDomestic);
      setAllAirlines(data);
      setInitialAllAirlines(data);
    };

    fetchData();
  }, [isDomestic]);

  const options = allAirlines;

  const handleSelectAirlinesChange = (selectedOptions) => {
    const a = selectedOptions.map((ab) => {
      const splitValue = ab?.value?.split("-");

      return {
        label: `${splitValue[1] || ab?.label}`,
        value: splitValue[0],
      };
    });

    const updatedAirlines = initialAllAirlines.filter((airline) => {
      return !a.some(
        (option) => `${option?.value}-${option?.label}` === airline.value
      );
    });

    setAllAirlines(updatedAirlines);
    dispatch(setSelectedAirlines(a));
  };

  const airlinesSlices =
    selectedAirlines?.length > 3
      ? selectedAirlines.slice(0, 3)
      : selectedAirlines;

  return (
    <Box
      sx={{
        px: { lg: "0px" },
        borderRadius: "0px 0px 4px 4px",
        bgcolor: { lg: "transparent" },
      }}
    >
      {/* Select search type, fare type and preferred airlines select Area */}
      <ClickAwayListener
        onClickAway={() => {
          if (isShowPreferedAirlines) setIsShowPreferedAirlines(false);
          if (isShowClass) setIsShowClass(false);
          if (isShowFareType) setIsShowFareType(false);
        }}
      >
        <Box
          sx={{
            mt:
              location.pathname === "/dashboard/flightaftersearch" ||
              location.pathname === "/dashboard/split-after-search"
                ? "15px"
                : "20px",

            ".css-6c648h-multiValue": {
              bgcolor: "#F1592A1A",
              px: "10px",
              borderRadius: "35px",
              div: { fontSize: "11px" },
            },
          }}
        >
          <Grid
            container
            sx={{ justifyContent: "space-between" }}
            spacing={{ xs: 1.5, sm: 1.5, md: 1.5, lg: 0 }}
          >
            {/* Preferred Airline */}
            <Grid item lg={5} xs={12}>
              <Box sx={{ position: "relative", height: "100%" }}>
                <Box
                  onClick={() => {
                    if (flightAfterSearch === "reissue-search") return;

                    setIsShowPreferedAirlines(!isShowPreferedAirlines);
                    setIsShowClass(false);
                  }}
                  sx={optionContainer(isShowPreferedAirlines, location)}
                >
                  {/* Preferred Airlines */}

                  {!isShowPreferedAirlines ? (
                    <>
                      {airlinesSlices?.length > 0 ? (
                        <Box sx={{ display: "flex", gap: "10px" }}>
                          {airlinesSlices?.map((selectedAirline, i) => (
                            <Typography key={i} sx={capsul}>
                              {selectedAirline.label}
                            </Typography>
                          ))}
                          {selectedAirlines?.length > 3 && (
                            <Typography sx={capsul}>
                              +{selectedAirlines?.length - 3} more
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#8C8080",
                          }}
                        >
                          Select Preferred Airline
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography sx={{ fontSize: "12px", color: "#8C8080" }}>
                      Select Preferred Airlines
                    </Typography>
                  )}

                  <DropDownIcon {...iconProps} />
                </Box>

                {isShowPreferedAirlines && (
                  <Grow
                    in={isShowPreferedAirlines}
                    style={{
                      transform: "none",
                      transformOrigin: "0 0 0",
                    }}
                    {...(isShowPreferedAirlines ? { timeout: 300 } : {})}
                  >
                    <Box
                      sx={{
                        ...optionBox,
                        padding: "0px",
                      }}
                    >
                      <Select
                        styles={airLineSelectCustomStyle}
                        isMulti
                        options={selectedAirlines.length === 5 ? [] : options}
                        value={selectedAirlines}
                        onChange={handleSelectAirlinesChange}
                        placeholder={
                          <span
                            style={{
                              color: "#4A7CBF",
                              fontSize: "13px",
                              display: "block",
                              paddingBottom: "8px",
                            }}
                          >
                            Type Airlines Here (Maximum 5)
                          </span>
                        }
                        menuIsOpen={true}
                        isSearchable={
                          selectedAirlines.length === 5 ? false : true
                        }
                        autoFocus
                        noOptionsMessage={() =>
                          selectedAirlines.length === 5
                            ? "Maximum Prefered Airlines Select Limit Reach"
                            : ""
                        }
                      />
                    </Box>
                  </Grow>
                )}
              </Box>
            </Grid>

            {/* <Grid item lg={3} xs={12}>
              <Box
                sx={{
                  bgcolor:
                    location.pathname === "/dashboard/flightaftersearch"
                      ? "#f3f3f3"
                      : "#fff",
                  px: 1.5,
                  borderRadius: "3px",
                }}
              >
                <RadioGroup
                  row
                  sx={{
                    justifyContent: "space-between",
                    width: "100%",
                    height: "40px",
                  }}
                  value={searchType}
                  onClick={(e) => dispatch(setSearchType(e.target.value))}
                >
                  {searchTypes.map((box, index) => (
                    <FormControlLabel
                      key={index}
                      value={box.value}
                      control={
                        <Radio
                          disableRipple
                          checkedIcon={<BpCheckedIcon />}
                          icon={<BpIcon />}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: "11px", color: "#8C8080" }}>
                          {box.label}
                        </Typography>
                      }
                    />
                  ))}
                </RadioGroup>
              </Box>
            </Grid> */}

            {/* Search Options */}
            <Grid item lg={2.2} xs={12}>
              <Box sx={{ position: "relative" }}>
                <Box
                  onClick={() => {
                    setIsShowSearchType((prev) => !prev);
                    setIsShowPreferedAirlines(false);
                    setIsShowClass(false);
                    setIsShowFareType(false);
                  }}
                  sx={optionContainer(isShowSearchType, location)}
                >
                  {searchType ? (
                    <Typography
                      sx={{
                        fontSize: "11.5px",
                        fontWeight: "500",
                        color: "var(--primary-color)",
                      }}
                    >
                      {convertCamelToTitle(
                        searchTypes.find((item) => item.value === searchType)
                          ?.label
                      )}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: "11.5px", color: "#8C8080" }}>
                      Preferred Class
                    </Typography>
                  )}

                  <DropDownIcon {...iconProps} />
                </Box>

                <Grow
                  in={isShowSearchType}
                  style={{
                    transformOrigin: "0 0 0",
                    border: "1px solid var(--border)",
                  }}
                  {...(isShowSearchType ? { timeout: 0 } : {})}
                >
                  <Box sx={optionBox}>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={fareType}
                        onChange={(event) => {
                          dispatch(setSearchType(event.target.value));
                          setIsShowSearchType(false);
                        }}
                        name="radio-buttons-group"
                      >
                        {searchTypes.map((item, i) => (
                          <Tooltip
                            key={i}
                            title={item?.description || ""}
                            arrow
                            placement="right-start"
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: "var(--secondary-color)",
                                  color: "#fff",
                                  fontSize: "12px",
                                  boxShadow: 1,
                                  borderRadius: "6px",
                                  textAlign: "justify",
                                  p: 1.5,
                                },
                              },
                              arrow: {
                                sx: { color: "var(--secondary-color)" },
                              },
                            }}
                          >
                            <FormControlLabel
                              value={item.value}
                              control={
                                <Radio
                                  disableRipple
                                  checkedIcon={<BpCheckedIcon />}
                                  icon={<BpIcon />}
                                />
                              }
                              label={
                                <span style={{ fontSize: "12px" }}>
                                  {item.label}
                                </span>
                              }
                              checked={searchType === item.value}
                              disabled={
                                tripType === "oneway" && item.value === "split"
                              }
                            />
                          </Tooltip>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Grow>
              </Box>
            </Grid>

            {/* Fare Options */}
            <Grid item lg={2.2} xs={12}>
              <Box sx={{ position: "relative" }}>
                <Box
                  onClick={() => {
                    if (flightAfterSearch === "reissue-search") return;
                    setIsShowFareType((prev) => !prev);
                    setIsShowPreferedAirlines(false);
                    setIsShowClass(false);
                    setIsShowSearchType(false);
                  }}
                  sx={optionContainer(isShowFareType, location)}
                >
                  {fareType ? (
                    <Typography
                      sx={{
                        fontSize: "11.5px",
                        fontWeight: "500",
                        color: "var(--primary-color)",
                      }}
                    >
                      {convertCamelToTitle(fareType)}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: "11.5px", color: "#8C8080" }}>
                      Preferred Class
                    </Typography>
                  )}

                  <DropDownIcon {...iconProps} />
                </Box>

                <Grow
                  in={isShowFareType}
                  style={{
                    transformOrigin: "0 0 0",
                    border: "1px solid var(--border)",
                  }}
                  {...(isShowFareType ? { timeout: 0 } : {})}
                >
                  <Box sx={optionBox}>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={fareType}
                        onChange={(event) => {
                          dispatch(setFareType(event.target.value));
                          setIsShowFareType(false);
                        }}
                        name="radio-buttons-group"
                      >
                        {allfareTypes.map((item, i) => (
                          <Tooltip
                            key={i}
                            title={item?.description || ""}
                            arrow
                            placement="right-start"
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: "var(--secondary-color)",
                                  color: "#fff",
                                  fontSize: "12px",
                                  boxShadow: 1,
                                  borderRadius: "6px",
                                  textAlign: "justify",
                                  p: 1.5,
                                },
                              },
                              arrow: {
                                sx: {
                                  color: "var(--secondary-color)",
                                },
                              },
                            }}
                          >
                            <FormControlLabel
                              value={item.value}
                              control={
                                <Radio
                                  disableRipple
                                  checkedIcon={<BpCheckedIcon />}
                                  icon={<BpIcon />}
                                />
                              }
                              label={
                                <span style={{ fontSize: "12px" }}>
                                  {item.label}
                                </span>
                              }
                              checked={fareType === item.value}
                            />
                          </Tooltip>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Grow>
              </Box>
            </Grid>

            {/* Class Options */}
            <Grid item lg={2.2} xs={12}>
              <Box sx={{ position: "relative" }}>
                <Box
                  onClick={() => {
                    if (flightAfterSearch === "reissue-search") return;
                    setIsShowClass((prev) => !prev);
                    setIsShowPreferedAirlines(false);
                    setIsShowFareType(false);
                    setIsShowSearchType(false);
                  }}
                  sx={optionContainer(isShowClass, location)}
                >
                  {cabin ? (
                    <Typography
                      sx={{
                        fontSize: "11.5px",
                        fontWeight: "500",
                        // color: isDomestic ? "gray" : "var(--primary-color)",
                        color: "var(--primary-color)",
                      }}
                    >
                      {convertCamelToTitle(cabin)}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: "11.5px", color: "#8C8080" }}>
                      Preferred Class
                    </Typography>
                  )}

                  <DropDownIcon {...getIconProps(isDomestic)} />
                </Box>

                <Grow
                  in={isShowClass}
                  style={{
                    transformOrigin: "0 0 0",
                    border: "1px solid var(--border)",
                  }}
                  {...(isShowClass ? { timeout: 0 } : {})}
                >
                  <Box sx={optionBox}>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={cabin}
                        onChange={(event) => {
                          dispatch(setCabin(event.target.value));
                          setIsShowClass(false);
                        }}
                        name="radio-buttons-group"
                      >
                        {classTypes.map((item, i) => (
                          <FormControlLabel
                            key={i}
                            value={item.label}
                            control={
                              <Radio
                                disableRipple
                                checkedIcon={<BpCheckedIcon />}
                                icon={<BpIcon />}
                              />
                            }
                            label={
                              <span style={{ fontSize: "12px" }}>
                                {item.label}
                              </span>
                            }
                            checked={cabin === item.value}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Grow>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </ClickAwayListener>
    </Box>
  );
};

const optionContainer = (isOpen, location) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  height: "40px",
  px: "10px",
  borderRadius: isOpen ? "3px 3px 0px 0px" : "3px",
  bgcolor:
    location.pathname === "/dashboard/flightaftersearch" ||
    location.pathname === "/dashboard/split-after-search"
      ? "#f3f3f3"
      : "#fff",
  gap: "10px",
});

const optionBox = {
  position: "absolute",
  bgcolor: "white",
  borderRadius: "0px",
  p: "5px 14px",
  zIndex: "100",
  width: "100%",
};

const iconProps = {
  width: "15px",
  height: "10px",
  fill: "var(--secondary-color)",
};

const getIconProps = (isDomestic) => ({
  width: "15px",
  height: "10px",
  fill: isDomestic ? "gray" : "var(--secondary-color)",
});

export const capsul = {
  bgcolor: "#F1592A1A",
  borderRadius: "16px",
  px: 1,
  py: "3px",
  color: "var(--primary-color)",
  fontSize: "11px",
};

export default FlightOptions;
