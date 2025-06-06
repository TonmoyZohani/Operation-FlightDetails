import {
  Box,
  Button,
  Checkbox,
  Chip,
  Grid,
  MenuItem,
  Modal,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { nextStepStyle } from "../../style/style";
import BaggageAncillaries from "./components/BaggageAncillaries";
import CipVipAncillaries from "./components/CipVipAncillaries";
import MealAncillaries from "./components/MealAncillaries";
import MeetAssistAncillaries from "./components/MeetAssistAncillaries";
import SeatAncillaries from "./components/SeatAncillaries";
import WelcomeGreetingAncillaries from "./components/WelcomeGreetingAncillaries";
import WheelchairAncillaries from "./components/WheelchairAncillaries";
// import TimeLimitAncillaries from "./components/TimeLimitAncillaries";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  removeAncillary,
  removeSingleAncillary,
  setAncillary,
} from "./components/ancillariesSlice";
import FequentFlyerNumber from "./components/FequentFlyerNumber";

const AncillariesModal = ({
  setOpenAnciIndex,
  openAnciIndex,
  pax,
  route,
  clear,
  setClear,
}) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [isTermsCondition, setIsTermsCondition] = useState(false);
  const ancillaries = useSelector((state) => state?.ancillaries);
  const dispatch = useDispatch();

  const existingAncillary = ancillaries?.find(
    (item) =>
      item.index === openAnciIndex &&
      item.route.departure === route.departure &&
      item.route.arrival === route.arrival &&
      item.pax.firstName === pax.firstName &&
      item.pax.lastName === pax.lastName
  );

  const handleSelectAncillary = (label, value, remarks = "", remarksValue) => {
    const ancillary = { label, value };
    ancillary.remarks = remarks;
    ancillary.remarksValue = remarksValue;

    dispatch(
      setAncillary({
        index: openAnciIndex,
        pax,
        route,
        ancillary,
      })
    );
  };

  const handleRemoveAncillary = (label) => {
    dispatch(
      removeAncillary({
        index: openAnciIndex,
        pax,
        route,
        label,
      })
    );
  };

  const handleClose = () => {
    setOpenAnciIndex(null);
    if (clear) {
      dispatch(
        removeSingleAncillary({
          index: openAnciIndex,
          pax,
          route,
        })
      );
    }
  };

  const handleCheckboxClick = () => {
    setIsTermsCondition((prev) => !prev);
  };

  return (
    <Modal
      open={openAnciIndex !== null}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        my: 10,
        zIndex: 100000,
      }}
    >
      <Box
        sx={{
          width: "950px",
          height: window.innerWidth > 1900 ? "83vh" : "93vh",
          overflow: "auto",
          bgcolor: "#fff",
          borderRadius: "10px",
          position: "relative",
          p: { xs: 2, lg: "1.5rem 2rem" },
          position: "relative",
        }}
      >
        <Grid container>
          <Grid item xs={12} sx={{ height: "40px", px: "5px" }}>
            <Typography
              sx={{
                width: {
                  xs: "70%",
                  lg: "100%",
                },
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.85rem",
                  md: "1rem",
                },
                color: "#3C4258",
              }}
            >
              Add New Ancillaries For{" "}
              <span
                style={{
                  textTransform: "uppercase",
                  color: "var(--primary-color)",
                }}
              >{`${pax?.firstName} ${pax?.lastName} `}</span>
              Route
              <span
                style={{
                  textTransform: "uppercase",
                  color: "var(--primary-color)",
                }}
              >
                {` ${route?.departure}-${route?.arrival}`}
              </span>
            </Typography>
          </Grid>
          <Grid
            container
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid item xs={12} lg={3.3}>
              <Box
                sx={{
                  display: {
                    xs: "none",
                    lg: "flex",
                  },
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {tabs?.map((tab, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{
                        border: "1px solid #F1F6FF",
                        borderRadius: "3px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        pl: "10px",
                        cursor: "pointer",
                        bgcolor: selectedTab === tab && "var(--primary-color)",
                      }}
                      onClick={() => setSelectedTab(tab)}
                    >
                      <Typography
                        sx={{
                          color: selectedTab === tab ? "white" : "#333333",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          textTransform: "uppercase",
                        }}
                      >
                        {tab}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
              <Box
                sx={{
                  mb: 1,
                  display: {
                    xs: "block",
                    lg: "none",
                  },
                }}
              >
                <Select
                  value={selectedTab}
                  onChange={(e) => setSelectedTab(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Select Type" }}
                  IconComponent={ArrowDropDownIcon}
                  sx={{
                    width: "100%",
                    height: "40px",
                    bgcolor: "var(--primary-color)",
                    color: "white",
                    textAlign: "left",
                    py: 1,
                    "&:focus": {
                      outline: "none",
                    },
                    "& .MuiSelect-icon": {
                      color: "white",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                        overflowY: "auto",
                      },
                    },
                  }}
                >
                  {tabs?.map((tab, index) => (
                    <MenuItem
                      key={index}
                      value={tab}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {tab}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Grid>
            <Grid item xs={12} lg={8.3}>
              <Box
                sx={{
                  p: {
                    xs: "0 0 0 10px",
                    lg: "0 15px 0 15px",
                  },

                  height: "100%",
                  border: "1px solid #F1F6FF",
                  borderRadius: "3px",
                }}
              >
                {selectedTab === tabs[0] && (
                  <BaggageAncillaries
                    selectedTab={selectedTab}
                    handleSelectAncillary={handleSelectAncillary}
                    index={openAnciIndex}
                    pax={pax}
                    route={route}
                  />
                )}
                {selectedTab === tabs[1] && (
                  <MealAncillaries
                    selectedTab={selectedTab}
                    handleSelectAncillary={handleSelectAncillary}
                    index={openAnciIndex}
                    pax={pax}
                    route={route}
                  />
                )}
                {selectedTab === tabs[2] && (
                  <SeatAncillaries
                    selectedTab={selectedTab}
                    handleSelectAncillary={handleSelectAncillary}
                    index={openAnciIndex}
                    pax={pax}
                    route={route}
                  />
                )}
                {selectedTab === tabs[3] && (
                  <WheelchairAncillaries
                    selectedTab={selectedTab}
                    handleSelectAncillary={handleSelectAncillary}
                    index={openAnciIndex}
                    pax={pax}
                    route={route}
                  />
                )}
                {selectedTab === tabs[4] && (
                  <CipVipAncillaries
                    selectedTab={selectedTab}
                    handleSelectAncillary={handleSelectAncillary}
                    index={openAnciIndex}
                    pax={pax}
                    route={route}
                  />
                )}
                {selectedTab === tabs[5] && (
                  <WelcomeGreetingAncillaries
                    selectedTab={selectedTab}
                    handleSelectAncillary={handleSelectAncillary}
                    index={openAnciIndex}
                    pax={pax}
                    route={route}
                  />
                )}
                {/* {selectedTab === tabs[6] && (
                  <MeetAssistAncillaries
                    selectedTab={selectedTab}
                    handleSelectAncillary={handleSelectAncillary}
                    index={openAnciIndex}
                    pax={pax}
                    route={route}
                  />
                )} */}
                {selectedTab === tabs[6] && (
                  <FequentFlyerNumber
                    selectedTab={selectedTab}
                    handleSelectAncillary={handleSelectAncillary}
                    index={openAnciIndex}
                    pax={pax}
                    route={route}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={12}
            sx={{ bgcolor: "#fff", borderRadius: "5px", mt: "15px" }}
          >
            <Box>
              <Typography
                sx={{ fontSize: "1rem", color: "#3C4258", fontWeight: 500 }}
              >
                Applied Ancillaries
              </Typography>
              <Stack
                direction="row"
                rowGap={0.5}
                spacing={0.5}
                my={1.5}
                flexWrap="wrap"
              >
                {existingAncillary?.ancillaries?.length > 0 ? (
                  existingAncillary?.ancillaries?.map((item, index) => {
                    return (
                      <Chip
                        key={index}
                        sx={{
                          bgcolor: "var(--green)",
                          color: "white",
                          border: "none",
                          boxShadow: "none",
                          cursor: "pointer",
                          border:
                            item?.label === selectedTab
                              ? "2px solid rgb(0, 70, 10)"
                              : "none",

                          "&:hover": {
                            bgcolor: "#0E8749 !important",
                          },

                          "&:focus": {
                            bgcolor: "#0E8749 !important",
                          },

                          "& .MuiChip-deleteIcon": {
                            color: "white",
                            "&:hover": {
                              color: "white",
                            },
                          },
                        }}
                        label={item?.label}
                        variant="outlined"
                        onDelete={() => handleRemoveAncillary(item?.label)}
                        deleteIcon={<CloseIcon sx={{ color: "white" }} />}
                        onClick={() => setSelectedTab(item?.label)}
                      />
                    );
                  })
                ) : (
                  <Chip
                    sx={{
                      bgcolor: "transparent",
                      boxShadow: "none",
                      border: "1px dashed gray",
                      ":hover": {
                        bgcolor: "transparent",
                      },
                      fontWeight: 500,
                      color: "var(--secondary-color)",
                      "& .MuiChip-deleteIcon": {
                        color: "var(--secondary-color)",
                        ":hover": {
                          color: "var(--secondary-color)",
                        },
                      },
                    }}
                    label={"Add First Ancillaries"}
                    onDelete={() => {}}
                    deleteIcon={<AddIcon />}
                  />
                )}
              </Stack>
            </Box>

            {/* {options?.map((option, index) => (
              <Grid item xs={12} lg={12} key={index} sx={{ py: 0, my: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: { xs: "flex-start", lg: "center" },
                  }}
                >
                  <Checkbox
                    sx={{ paddingLeft: "0px", py: 0.5 }}
                    checked={isTermsCondition}
                    onClick={handleCheckboxClick}
                  />
                  <Typography
                    sx={{
                      color: "var(--secondary-color)",
                      fontSize: "13px",
                      fontWeight: "500",
                      pt: { xs: index === 2 ? "10px" : "3px" },
                    }}
                  >
                    {option.label}
                  </Typography>
                </Box>
                {option.subLabel && (
                  <Typography
                    sx={{
                      color: "#C3C3DB",
                      fontSize: "12px",
                      fontWeight: "500",
                      pl: "27px",
                    }}
                  >
                    {option.subLabel}
                  </Typography>
                )}
              </Grid>
            ))} */}
          </Grid>
          <Button
            // disabled={!isTermsCondition}
            sx={{
              ...nextStepStyle,
              ":hover": { bgcolor: "var(--primary-color)" },
              py: 1.5,
              position: "absolute",
              bottom: "30px",
              height: "45px",
              width: "93%",
            }}
            onClick={() => {
              setClear(false);
              setOpenAnciIndex(null);
              setIsTermsCondition(false);
            }}
          >
            SAVE THIS ANCILLARIES FOR {pax?.firstName} {pax?.lastName}
          </Button>
        </Grid>
        <Box
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: {
              xs: 15,
              lg: 25,
            },
            right: {
              xs: 10,
              lg: 30,
            },
            cursor: "pointer",
            bgcolor: "gray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            zIndex: 1,
          }}
        >
          <CloseIcon sx={{ fontSize: "1.5rem", p: 0.5, color: "#FFFFFF" }} />
        </Box>
      </Box>
    </Modal>
  );
};

const options = [
  {
    label: (
      <>
        I have read and agree to the{" "}
        <span style={{ color: "var(--primary-color)" }}>
          Terms and Conditions
        </span>{" "}
        & <span style={{ color: "var(--primary-color)" }}>Refund</span>
      </>
    ),
  },
];

const tabs = [
  "Extra Baggage",
  "Meal",
  "Seat Selections",
  "Wheel Chair",
  "VIP",
  "CIP",
  // "VIP OR CIP",
  // "Welcome Greeting",
  // "Meet And Assist Service",
  "Fequent Flyer Number",
];

export default AncillariesModal;
