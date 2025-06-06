import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Radio,
  RadioGroup,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import React, { useEffect, useState } from "react";
import { FaChild, FaPerson } from "react-icons/fa6";
import { MdChildFriendly } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { useAuth } from "../../context/AuthProvider";
import {
  airLineSelectCustomStyle,
  BpCheckedIcon,
  BpIcon,
} from "../../shared/common/styles";
import CustomCalendar from "../CustomCalendar/CustomCalendar";
import { checkBoxes, classTypes, fetchAllAirlines } from "./FlightOptions";
import { inputStyle, styles } from "./flightSearcStyle";
import {
  setCabin,
  setSearchOptions,
  setSelectedAirlines,
  updateFromSegmentList,
  updateToSegmentList,
} from "./flightSearchSlice";

export const GeneralDrawer = ({
  isOpen,
  handleClose,
  children,
  backgroundColor = "#F0EFF2",
}) => {
  return (
    <SwipeableDrawer
      anchor="right"
      open={isOpen}
      PaperProps={{
        sx: {
          width: "100%",
          height: "100vh",
          bgcolor: backgroundColor,
        },
      }}
      onClose={handleClose}
      onOpen={() => {}}
    >
      {/* Drawer content goes here */}
      {isOpen && <>{children}</>}
    </SwipeableDrawer>
  );
};

// TODO:: Destination drawer for mobile devices
export const DestinationDrawer = ({
  destinationType,
  showMobileModal,
  handleClose,
  handleInput,
  mobileData,
  flag,
  dispatch,
  continentList,
  suggestion,
  fromSuggestedText,
  toSuggestedText,
  toSegmentLists,
  fromSegmentLists,
  recentSearch,
  fromKeyword,
  toKeyword,
  fromGetSuggestion,
  toGetSuggestion,
  type,
}) => {
  const [keyword, setKeyword] = useState("");
  return (
    <GeneralDrawer isOpen={showMobileModal} handleClose={handleClose}>
      <Box className="traveler-box">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            width: "90%",
          }}
        >
          <ArrowBackIosNewIcon
            sx={{ color: "white", mt: 2 }}
            onClick={() => handleClose()}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: "18px", color: "#fff" }}>
              {destinationType === "from"
                ? "Departure Airport"
                : "Arrival Airport"}
            </Typography>
            <Typography sx={{ fontSize: "13px", color: "#7C92AC" }}>
              Search By Anything
            </Typography>
            <Typography sx={{ fontSize: "13px", color: "#7C92AC" }}>
              {fromSegmentLists[flag]?.code === toSegmentLists[flag]?.code &&
                "Destination Error "}
            </Typography>
          </Box>
          <IconButton></IconButton>
        </Box>

        <input
          className="custom-input"
          autoComplete="off"
          autoFocus
          onChange={(e) => {
            handleInput(e);
            setKeyword(e.target.value);
          }}
          placeholder="Type to search"
          style={inputStyle}
        />
      </Box>

      <Box
        sx={{
          height: "80vh",
          overflowY: "auto",
          bgcolor: "#F0EFF2",
          py: "40px",
          width: "90%",
          mx: "auto",
          scrollbarWidth: "none",
          borderRadius: "5px",
          mb: 5,
        }}
      >
        {!keyword ? (
          <Box sx={{ bgcolor: "white", p: 1.5, pt: 0.5, borderRadius: "3px" }}>
            {type === "from" && (
              <Box>
                {fromKeyword?.length !== 0 && fromGetSuggestion(flag)}

                {fromKeyword?.length === 0 && (
                  <Box sx={{ bgcolor: "white", p: 1.5, pt: 0.5 }}>
                    {recentSearch?.length > 0 && (
                      <Typography
                        sx={{
                          color: "var(--secondary-color)",
                          fontSize: "13px",
                          borderBottom: "1px solid var(--secondary-light)",
                          my: 1,
                        }}
                      >
                        Recent Search
                      </Typography>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                        overflow: "hidden",
                      }}
                    >
                      {recentSearch?.length > 0 && (
                        <>
                          {[
                            ...new Map(
                              recentSearch.map((country) => {
                                const firstSegment = country?.segmentsList?.[0];
                                return [firstSegment?.departure, country];
                              })
                            ).values(),
                          ].map((country, idx) => {
                            const firstSegment = country?.segmentsList?.[0];
                            return (
                              <Box
                                key={idx}
                                sx={{
                                  border: "1px solid var(--primary-color)",
                                  bgcolor: "#FFEDF1",
                                  borderRadius: "3px",
                                  p: "3px 5px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  fromSuggestedText(
                                    {
                                      id: country?.id,
                                      code: firstSegment?.departure,
                                      name: firstSegment?.departureAirport,
                                      cityCode: firstSegment?.departure,
                                      cityName: firstSegment?.departureCityName,
                                      address: firstSegment?.departureCityName,
                                    },
                                    flag
                                  );
                                  handleClose();
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "12px",
                                      fontWeight: "600",
                                      color: "var(--primary-color)",
                                    }}
                                  >
                                    {firstSegment?.departureCityName}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          })}
                        </>
                      )}

                      {continentList?.map((continent, continentIndex) => (
                        <Box key={continentIndex}>
                          <Typography
                            sx={{
                              color: "var(--secondary-color)",
                              fontSize: "15px",
                              borderBottom: "1px solid var(--secondary-light)",
                              mt: 1,
                              fontSize: "13px",
                            }}
                          >
                            {continent?.label}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flexWrap: "wrap",
                              overflow: "hidden",
                              mt: 1,
                            }}
                          >
                            {suggestion
                              ?.filter(
                                (suggestion) =>
                                  suggestion?.continent === continent?.value
                              )
                              .map((location, i) => (
                                <Box
                                  key={i}
                                  sx={{
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "3px",
                                    p: "6px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    fromSuggestedText(
                                      {
                                        ...location,
                                        address:
                                          location?.address?.split(",")[0],
                                      },
                                      flag
                                    );
                                    handleClose();
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}
                                  >
                                    <img
                                      src={`https://flagcdn.com/w320/${location?.countryCode?.toLowerCase()}.png`}
                                      alt={location?.cityName || "City"}
                                      style={{
                                        height: "10px",
                                      }}
                                    />
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        color: "var(--gray-8)",
                                      }}
                                    >
                                      {location?.cityName}
                                    </Typography>
                                  </Box>
                                </Box>
                              ))}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
            {type === "to" && (
              <Box>
                {toKeyword?.length !== 0 && toGetSuggestion(flag)}

                {toKeyword?.length === 0 && (
                  <Box
                    sx={{
                      bgcolor: "white",
                      p: 1.5,
                      pt: 0.5,
                    }}
                  >
                    {recentSearch?.length > 0 && (
                      <Typography
                        sx={{
                          color: "var(--secondary-color)",
                          fontSize: "13px",
                          borderBottom: "1px solid var(--secondary-light)",
                          my: 1,
                        }}
                      >
                        Recent Search
                      </Typography>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                        overflow: "hidden",
                      }}
                    >
                      {recentSearch?.length > 0 && (
                        <>
                          {[
                            ...new Map(
                              recentSearch.map((country) => {
                                const lastSegment =
                                  country?.segmentsList?.at(-1);
                                return [lastSegment?.arrival, country];
                              })
                            ).values(),
                          ].map((country, idx) => {
                            const lastSegment = country?.segmentsList?.at(-1);
                            return (
                              <Box
                                key={idx}
                                sx={{
                                  border: "1px solid var(--primary-color)",
                                  bgcolor: "#FFEDF1",
                                  borderRadius: "3px",
                                  p: "3px 5px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  toSuggestedText(
                                    {
                                      id: country?.id,
                                      code: lastSegment?.arrival,
                                      name: lastSegment?.arrivalAirportName,
                                      cityCode: lastSegment?.arrival,
                                      cityName: lastSegment?.arrivalCityName,
                                      address: lastSegment?.arrivalCityName,
                                    },
                                    flag
                                  );
                                  handleClose();
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "12px",
                                      fontWeight: "600",
                                      color: "var(--primary-color)",
                                    }}
                                  >
                                    {lastSegment?.arrivalCityName}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          })}
                        </>
                      )}

                      {continentList?.map((continent, continentIndex) => (
                        <div key={continentIndex}>
                          <Typography
                            sx={{
                              color: "var(--secondary-color)",
                              fontSize: "15px",
                              borderBottom: "1px solid var(--secondary-light)",
                              mt: 1,
                              fontSize: "13px",
                            }}
                          >
                            {continent?.label}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flexWrap: "wrap",
                              overflow: "hidden",
                              mt: 1,
                            }}
                          >
                            {suggestion
                              ?.filter(
                                (suggestion) =>
                                  suggestion?.continent === continent?.value
                              )
                              .map((location, i) => (
                                <Box
                                  key={i}
                                  sx={{
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "3px",
                                    p: "6px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    toSuggestedText(
                                      {
                                        ...location,
                                        address:
                                          location?.address?.split(",")[0],
                                      },
                                      flag
                                    );
                                    handleClose();
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}
                                  >
                                    <img
                                      src={`https://flagcdn.com/w320/${location?.countryCode?.toLowerCase()}.png`}
                                      alt={location?.cityName || "City"}
                                      style={{
                                        height: "10px",
                                      }}
                                    />
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        color: "var(--gray-8)",
                                      }}
                                    >
                                      {location?.cityName}
                                    </Typography>
                                  </Box>
                                </Box>
                              ))}
                          </Box>
                        </div>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        ) : (
          mobileData?.length > 0 &&
          mobileData?.map((data, index) => (
            <Box
              key={index}
              sx={{
                bgcolor: "#fff",
                height: "65px",
                borderRadius: "3px",
                display: "flex",
                justifyContent: "space-between",
                px: "15px",
                alignItems: "center",
                mb: "15px",
              }}
              onClick={() => {
                if (destinationType === "from") {
                  dispatch(updateFromSegmentList({ index: flag, item: data }));
                  handleClose();
                } else {
                  dispatch(updateToSegmentList({ index: flag, item: data }));
                  handleClose();
                }
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--secondary-color)",
                    fontWeight: "500",
                  }}
                >
                  {data?.address}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "gray",
                    fontWeight: "500",
                  }}
                >
                  {data?.name}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "var(--primary-color)",
                  fontWeight: "500",
                }}
              >
                {data?.code}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </GeneralDrawer>
  );
};

// TODO:: Drawer for calendar for mobile devices
export const CalendarDrawer = ({
  showMobileCalendar,
  handleClose,
  calendarType,
  maxDate,
  minDate,
  departureDates,
  arrivalDates,
  flag,
  handleDepartureDate,
  handleArrivalDate,
}) => {
  const dispatch = useDispatch();
  const [deptDate, setDeptDate] = useState(new Date(departureDates[0]));
  const [arrDate, setArrDate] = useState(new Date(arrivalDates[0]));

  const handleDeptDateChange = (date) => {
    handleDepartureDate(date, flag);
    setDeptDate(date);
    handleClose();
  };

  const handleArrDateChange = (date) => {
    setArrDate(date);
    handleArrivalDate(date, 0);
    // dispatch(updateMobileArrivalDate(date));
    handleClose("mobile");
  };

  return (
    <GeneralDrawer isOpen={showMobileCalendar} onClose={handleClose}>
      <Box className="traveler-box">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            width: "90%",
          }}
        >
          <ArrowBackIosNewIcon
            sx={{ color: "white", mt: 1.5 }}
            onClick={() => {
              handleClose("mobile");
            }}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: "18px", color: "#fff" }}>
              {calendarType === "from" ? "Departure Date" : "Arrival Date"}
            </Typography>
            <Typography sx={{ fontSize: "13px", color: "#7C92AC" }}>
              Search By Preferable Date
            </Typography>
          </Box>
          <IconButton></IconButton>
        </Box>

        <Box className="calendar-title">
          <Typography sx={{ color: "#fff", fontSize: "13px" }}>
            {deptDate?.toDateString()}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "40px",
          mx: 2,
          borderRadius: "5px",
          width: "90%",
          mx: "auto",
        }}
      >
        {calendarType === "from" ? (
          <CustomCalendar
            date={deptDate}
            maxDate={maxDate}
            minDate={minDate}
            title={"Departure Date"}
            handleChange={(date) => {
              handleDeptDateChange(date);
            }}
          />
        ) : (
          <CustomCalendar
            date={arrDate}
            maxDate={maxDate}
            minDate={deptDate}
            title={"Arrival Date"}
            handleChange={(date) => {
              handleArrDateChange(date);
            }}
          />
        )}
      </Box>
    </GeneralDrawer>
  );
};

// TODO:: Drawer for traveler for mobile devices
export const TravelerDrawer = ({
  showMobileTraveler,
  handleClose,
  adultCount,
  childCount,
  infantCount,
  adultIncrement,
  adultDecrement,
  childIncrement,
  childDecrement,
  infantIncrement,
  infantDecrement,
  searchOptions,
  // dispatch,
  handleChildAgeChange,
}) => {
  return (
    <GeneralDrawer isOpen={showMobileTraveler} onClose={handleClose}>
      <Box className="traveler-box">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            width: "90%",
          }}
        >
          <ArrowBackIosNewIcon
            sx={{ color: "white", mt: 1.5 }}
            onClick={() => {
              handleClose("mobile");
            }}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: "18px", color: "#fff" }}>
              Travelers
            </Typography>
            <Typography sx={{ fontSize: "13px", color: "#7C92AC" }}>
              Select and Edit Travelers
            </Typography>
          </Box>
          <IconButton></IconButton>
        </Box>

        <Box className="traveler-titleBox">
          <Typography sx={{ color: "#fff", fontSize: "13px" }}>
            {adultCount} Adult
            {childCount?.length > 0 && `, ${childCount?.length} Child`}
            {infantCount > 0 && `, ${infantCount} Infant`}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          mt: "40px",
          bgcolor: "white",
          width: "90%",
          mx: "auto",
          p: "1rem",
          borderRadius: "5px",
        }}
      >
        {/* adult portion */}
        <Box sx={styles.boxContainer}>
          <Box sx={styles.boxContent}>
            <FaPerson style={styles.icon} />
            <Box sx={styles.textContainer}>
              <Typography sx={styles.secondaryText}>Adults</Typography>
              <Typography sx={styles.primaryText}>12 years & above</Typography>
            </Box>
          </Box>
          <Box sx={styles.counterContainer}>
            <RemoveCircleOutlineOutlinedIcon
              onClick={adultDecrement}
              sx={
                adultCount > 1
                  ? styles.counterIconActive
                  : styles.counterIconInactive
              }
            />
            <Typography>{adultCount}</Typography>
            <ControlPointOutlinedIcon
              onClick={adultIncrement}
              sx={
                adultCount + childCount.length + infantCount < 9
                  ? styles.counterIconActive
                  : styles.counterIconInactive
              }
            />
          </Box>
        </Box>
        {/* child portion */}
        <Box
          sx={{
            borderBottom: "1px solid #5D95D7",
            pb: "7px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: "5px",
              py: "15px",
              width: "100%",
            }}
          >
            <Box sx={styles.boxContent}>
              <FaChild style={styles.icon} />
              <Box sx={styles.textContainer}>
                <Typography sx={styles.secondaryText}>Children</Typography>
                <Typography sx={styles.primaryText}>
                  From 5 to under 12
                </Typography>
              </Box>
            </Box>
            <Box sx={styles.counterContainer}>
              <RemoveCircleOutlineOutlinedIcon
                onClick={childDecrement}
                sx={
                  childCount.length > 0
                    ? styles.counterIconActive
                    : styles.counterIconInactive
                }
              />
              <Typography>{childCount.length}</Typography>
              <ControlPointOutlinedIcon
                onClick={childIncrement}
                sx={
                  adultCount + childCount.length + infantCount < 9 &&
                  searchOptions.fareType === ""
                    ? styles.counterIconActive
                    : styles.counterIconInactive
                }
              />
            </Box>
          </Box>

          {/* Iterate over the childCount array to display Child No and Child Age */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              mx: "0.70rem",
            }}
          >
            {childCount?.map((age, index) => (
              <Box
                key={index}
                sx={{
                  mt: 1,
                  flexBasis: "30%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography sx={{ ...styles.secondaryText, mb: "4px" }}>
                  Child {index + 1} Age
                </Typography>
                <select
                  value={age}
                  onChange={(e) => handleChildAgeChange(e, index)}
                  className="child-select"
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <option key={i} value={i + 2}>
                      {i + 2}
                    </option>
                  ))}
                </select>
              </Box>
            ))}
          </Box>
          <span
            style={{
              margin: "10px 0.75rem 0",
              fontSize: "12px",
              color: "#dc143c",
              display: childCount.length === 0 ? "none" : "block",
            }}
          >
            Choose Your Child Age
          </span>
        </Box>

        {/* infant portion */}
        <Box
          sx={{
            ...styles.boxContainer,
            borderBottom: "none",
          }}
        >
          <Box sx={styles.boxContent}>
            <MdChildFriendly style={styles.icon} />
            <Box sx={styles.textContainer}>
              <Typography sx={styles.secondaryText}>Infant</Typography>
              <Typography sx={styles.primaryText}>Under 2 years</Typography>
            </Box>
          </Box>
          <Box sx={styles.counterContainer}>
            <RemoveCircleOutlineOutlinedIcon
              onClick={infantDecrement}
              sx={
                infantCount > 0
                  ? styles.counterIconActive
                  : styles.counterIconInactive
              }
            />
            <Typography>{infantCount}</Typography>
            <ControlPointOutlinedIcon
              onClick={infantIncrement}
              sx={
                adultCount + childCount.length + infantCount < 9 &&
                searchOptions.fareType === ""
                  ? styles.counterIconActive
                  : styles.counterIconInactive
              }
            />
          </Box>
        </Box>
        <Button
          sx={styles.button}
          style={{
            backgroundColor: "var(--secondary-color)",
          }}
          onClick={() => {
            handleClose();
          }}
        >
          Done
        </Button>
      </Box>
    </GeneralDrawer>
  );
};

// TODO:: Drawer for Class for mobile devices
export const ClassDrawer = ({
  showMobileClass,
  handleClose,
  cabin,
  dispatch,
}) => {
  return (
    <GeneralDrawer isOpen={showMobileClass} onClose={handleClose}>
      <Box className="traveler-box">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            width: "90%",
          }}
        >
          <ArrowBackIosNewIcon
            sx={{ color: "white", mt: 1.5 }}
            onClick={handleClose}
          />
          <Box>
            <Typography sx={{ fontSize: "18px", color: "#fff" }}>
              Preferred Class
            </Typography>
            <Typography sx={{ fontSize: "13px", color: "#7C92AC" }}>
              Select and Edit Preferred Class
            </Typography>
          </Box>
          <IconButton></IconButton>
        </Box>

        <Box className="traveler-titleBox">
          <Typography sx={{ color: "#fff", fontSize: "13px" }}>
            {cabin}
          </Typography>
        </Box>
      </Box>

      <Box
        className="traveler-SingleBox"
        sx={{ padding: "12px 17px", width: "90%", mx: "auto" }}
      >
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="class-type"
            name="class-type"
            value={cabin}
            onChange={(event) => {
              dispatch(setCabin(event.target.value));
              handleClose();
            }}
          >
            {classTypes.map((classType) => (
              <FormControlLabel
                key={classType.value}
                value={classType.value}
                control={<Radio />}
                label={classType.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
    </GeneralDrawer>
  );
};

// TODO:: Fare Type Drawer for mobile devices
export const PrefAirlinesDrawer = ({ showMobileAirlines, handleClose }) => {
  const dispatch = useDispatch();

  const [allAirlines, setAllAirlines] = useState([]);
  const [isShowPreferedAirlines, setIsShowPreferedAirlines] = useState(false);
  const { selectedAirlines } = useSelector((state) => state.flight);

  const { agentToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllAirlines(agentToken);
      setAllAirlines(data);
    };
    setIsShowPreferedAirlines();
    fetchData();
  }, []);

  const options = allAirlines;

  const handleSelectAirlinesChange = (selectedOptions) => {
    const a = selectedOptions.map((ab) => {
      return {
        label: `${ab.value.split("-")[0]}`,
        value: ab.value,
      };
    });

    dispatch(setSelectedAirlines(a));
  };

  return (
    <GeneralDrawer isOpen={showMobileAirlines} onClose={handleClose}>
      <Box className="traveler-box">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            width: "90%",
          }}
        >
          <ArrowBackIosNewIcon
            sx={{ color: "white", mt: 1.5 }}
            onClick={handleClose}
          />
          <Box>
            <Typography sx={{ fontSize: "18px", color: "#fff" }}>
              Preferred Airlines
            </Typography>
            <Typography sx={{ fontSize: "13px", color: "#7C92AC" }}>
              Select and Edit Preferred Airlines
            </Typography>
          </Box>
          <IconButton></IconButton>
        </Box>

        <Box className="traveler-titleBox" sx={{ width: "90%", mx: "auto" }}>
          {!isShowPreferedAirlines ? (
            <>
              {selectedAirlines.length > 0 ? (
                <Box sx={{ display: "flex", gap: "10px" }}>
                  {selectedAirlines.map((selectedAirline, i) => (
                    <Typography
                      key={i}
                      sx={{ fontSize: "12px", color: "#fff" }}
                    >
                      {selectedAirline.label}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ color: "#fff", fontSize: "12px" }}>
                  No Airline Has Been Selected
                </Typography>
              )}
            </>
          ) : (
            <Typography sx={{ color: "#fff", fontSize: "12px" }}>
              No Airline Has Been Selected
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ width: "90%", mx: "auto", mt: "40px", pb: "20px" }}>
        <Box
          sx={{
            bgcolor: "#fff",
            top: "90%",
            width: "100%",
            zIndex: "100",
            borderRadius: "3px",
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
                  color: "var(--secondary-color)",
                  fontSize: "12px",
                }}
              >
                Search Airlines (Maximum 5)
              </span>
            }
            menuIsOpen={true}
            isSearchable={selectedAirlines.length === 5 ? false : true}
          />
        </Box>
      </Box>
    </GeneralDrawer>
  );
};

// TODO:: Fare Type Drawer for mobile devices
export const FareTypeDrawer = ({
  showMobileFareType,
  handleClose,
  searchOptions,
}) => {
  const dispatch = useDispatch();

  const handleChange = (event) => {
    dispatch(
      setSearchOptions({
        name: event.target.name,
        value: event.target.value,
      })
    );

    handleClose();
  };

  return (
    <GeneralDrawer isOpen={showMobileFareType} onClose={handleClose}>
      <Box className="traveler-box">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            width: "90%",
          }}
        >
          <ArrowBackIosNewIcon
            sx={{ color: "white", mt: 1.5 }}
            onClick={handleClose}
          />
          <Box>
            <Typography sx={{ fontSize: "18px", color: "#fff" }}>
              Fare Types
            </Typography>
            <Typography sx={{ fontSize: "13px", color: "#7C92AC" }}>
              Select and Edit Fare Type
            </Typography>
          </Box>
          <IconButton></IconButton>
        </Box>

        <Box className="traveler-titleBox">
          <Typography sx={{ color: "#fff", fontSize: "13px" }}>
            {searchOptions?.searchType.charAt(0).toUpperCase() +
              searchOptions?.searchType.slice(1)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {checkBoxes.map(({ boxes, name }, i) => {
          return (
            <Box
              className="traveler-SingleBox"
              key={i}
              sx={{
                width: "90%",
                bgcolor: "#fff",
                px: 2,
                py: 1,
                borderRadius: "3px",
              }}
            >
              <RadioGroup
                row
                sx={{ justifyContent: "space-between", width: "100%" }}
                value={searchOptions[name]}
                onChange={handleChange}
                name={name}
              >
                {boxes.map((box, index) => (
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
          );
        })}
      </Box>
    </GeneralDrawer>
  );
};
