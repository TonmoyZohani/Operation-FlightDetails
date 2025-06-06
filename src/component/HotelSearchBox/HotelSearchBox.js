import { Alert, Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import { FaSearch } from "react-icons/fa";
import { format } from "date-fns";
import ActionButton from "../../shared/common/ActionButton";
import { useNavigate } from "react-router-dom";

const HotelSearchBox = () => {
  const initialData = [
    {
      id: 973,
      name: "Dhaka",
      countryCode: "BD",
      type: "city",
      regionId: null,
    },
    {
      id: "radisson_blu_water_garden_hotel_dhaka",
      name: "Radisson Blu Dhaka Water Garden Hotel",
      countryCode: null,
      type: "hotel",
      regionId: 973,
    },
    {
      id: 6053839,
      name: "Dubai",
      countryCode: "AE",
      type: "city",
      regionId: null,
    },
    {
      id: "dubai_hotel_2",
      name: "Ellison Dubaj Hotel",
      countryCode: null,
      type: "hotel",
      regionId: 965858884,
    },
    {
      id: 956,
      name: "Cox's Bazar",
      countryCode: "BD",
      type: "city",
      regionId: null,
    },
  ];
  const navigate = useNavigate();

  const [openDestination, setOpenDestination] = useState(false);
  const [suggestDestination, setSuggestDestination] = useState(initialData);

  const destinationBox = () => {
    return (
      <Box
        sx={{
          height: "fit-content",
          position: "relative",
          width: "100%",
          zIndex: "100",
        }}
      >
        <Box
          sx={{
            maxHeight: "230px",
            overflowY: "auto",
            background: "transparent",
            mt: "15px",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
            "&::-webkit-scrollbar": { width: "0px" },
          }}
        >
          {suggestDestination.length !== 0 ? (
            suggestDestination.map((item, index) => {
              return (
                <Box
                  sx={{
                    paddingLeft: "10px",
                    paddingRight: "5px",
                    backgroundColor: "var(--white)",
                    color: "var(--gray)",
                    transition: "all .5s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#D1E9FF",
                      color: "var(--white)",
                    },
                    "&:hover .address": { color: "#003597" },
                    "&:hover .name": { color: "#999999" },
                    "&:hover .code": { color: "var(--white)" },
                  }}
                >
                  <Box
                    sx={{
                      margin: "0px 0px",
                      padding: "4px",
                      cursor: "pointer",
                      display: "flex",
                      color: "var(--gray)",
                      gap: "10px",
                      justifyContent: "space-between",
                    }}
                    // onClick={() => {
                    //   destinationText(item);
                    // }}
                  >
                    <Box>
                      <Typography
                        className="address"
                        sx={{
                          fontSize: "13px",
                          color: "#003597",
                          display: "block",
                          textAlign: "left",
                          fontWeight: 500,
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        className="type"
                        sx={{
                          fontSize: "11px",
                          color: "#616A6B",
                          display: "block",
                          textAlign: "left",
                          fontWeight: 500,
                        }}
                      >
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        className="name"
                        sx={{
                          fontSize: "14px",
                          display: "block",
                          textAlign: "left",
                          fontWeight: 600,
                          pr: "6px",
                        }}
                      >
                        {item?.type === "city" ? (
                          <EmojiTransportationIcon
                            sx={{ color: "var(--primary-color)" }}
                          />
                        ) : (
                          <FoodBankIcon
                            sx={{ color: "var(--secondary-color)" }}
                          />
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box>
              <Typography
                variant="subtitle-2"
                style={{
                  color: "var(--primary-color)",
                  fontWidth: "bold",
                  paddingLeft: "10px",
                }}
              >
                Not found
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  const handleHotel = () => {
    navigate("/dashboard/search/hotelAfterSearch");
  };

  return (
    <Box>
      <Grid
        sx={{
          justifyContent: "space-between",
        }}
        container
        rowSpacing={0}
        columnSpacing={0}
      >
        {/* Todo: Destination,Check In,Check Out */}
        <Grid container item lg={11.2}>
          {/* Todo: Destination */}
          <Grid
            item
            className="dashboard-main-input-parent des-grid"
            xs={12}
            sm={12}
            md={6}
            lg={4.5}
          >
            <Box
              className="update-search1"
              bgcolor={"#fff"}
              sx={{
                borderRadius: {
                  lg: "5px 0px 0px 5px",
                  xs: "0px 0px 0px 0px",
                },
                borderBottom: { lg: "none", xs: "1px solid #E7F3FE" },
              }}
              onClick={() => {
                setOpenDestination((prev) => !prev);
              }}
            >
              <Box style={{ position: "relative" }}>
                <p>Destination</p>
                <span className="addressTitle">
                  Radisson Blu Dhaka Water Garden
                </span>
              </Box>
              <Box
                style={{
                  lineHeight: "0px",
                }}
              >
                <input
                  required
                  readOnly
                  placeholder="Hotel"
                  style={{ border: "none" }}
                />
              </Box>
            </Box>
            {openDestination && (
              <Box
                className="des-box"
                // onKeyDown={(e) => handleKeyDownFrom(e, index)}
              >
                <Box
                  className="des-input-parent"
                  backgroundColor="#fff"
                  mt={"1px"}
                >
                  <div style={{ position: "relative" }}>
                    <FaSearch
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#FF6B81",
                      }}
                    />
                    <input
                      autoComplete="off"
                      autoFocus
                      //   onChange={(e) => handleInputChangeFrom(index, e)}
                      placeholder="City/Hotel/Street Name..."
                      className="crimsonPlaceholder des-input"
                      style={{ paddingLeft: "35px" }}
                    />
                  </div>
                </Box>
                <Box>{destinationBox()}</Box>
              </Box>
            )}
          </Grid>
          <Grid
            className="dashboard-main-input-parent"
            item
            xs={12}
            sm={12}
            md={6}
            lg={4.5}
            style={{
              position: "relative",
              height: "73px",
              borderRight: { lg: "1px solid #DEDEDE", xs: "none" },
            }}
          >
            <Box
              className="update-search1"
              bgcolor={"#fff"}
              sx={{
                borderBottom: { lg: "none", xs: "1px solid #E7F3FE" },
              }}
            >
              <Box
                className="dashboard-main-input date12"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginTop: "0px",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "column",
                    width: "50%",
                    cursor: "pointer",
                    lineHeight: 1.5,
                  }}
                >
                  <p>Check In &#10507;</p>
                  <span className="addressTitle" style={{ paddingTop: "2px" }}>
                    {`${format(new Date(), "dd MMM yy")}`}
                  </span>

                  <Typography
                    variant="subtitle2"
                    style={{ color: "#003566", fontSize: "11px" }}
                  >
                    {`${format(new Date(), "EEEE")}`}
                  </Typography>
                </Box>

                <Box
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "column",
                    width: "50%",
                    cursor: "pointer",
                    lineHeight: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#8C8080 !important",
                    }}
                  >
                    Check Out &#10507;
                  </Typography>

                  <span className="addressTitle" style={{ paddingTop: "2px" }}>
                    {`${format(new Date(), "dd MMM yy")}`}
                  </span>

                  <Typography
                    sx={{
                      color: "#003566 !important",
                      fontSize: "11px",
                    }}
                  >
                    {`${format(new Date(), "EEEE")}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item lg={3}>
            <Box
              className="update-search1"
              bgcolor={"#fff"}
              style={{
                borderRadius: "0px 5px 5px 0px",
                borderLeft: "1px solid #DEDEDE",
              }}
            >
              <Box
                sx={{ cursor: "pointer" }}
                className="traveler-count"
                // onClick={handleClickOpen}
              >
                <Button
                  sx={{
                    justifyContent: "flex-start",
                    color: "#000",
                    display: "block",
                  }}
                >
                  <p>Travelers</p>
                  <span style={{ fontSize: "17px" }}>
                    {/* {" "}
                    {adultCount + childCount + infantCount}{" "}
                    {adultCount + childCount + infantCount > 1
                      ? `Travelers`
                      : `Traveler`} */}
                    3 Travelers
                  </span>
                  <Typography
                    variant="subtitle2"
                    style={{
                      color: "#003566",
                      fontSize: "11px",
                      lineHeight: "10px",
                    }}
                  >
                    1 ADT
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid item lg={0.6}>
          <ActionButton
            handleClick={handleHotel}
            buttonText="Search"
            buttonDisabled={true}
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          ".MuiSvgIcon-root": { color: "#1e462e" },
          mt: 3,
        }}
      >
        <Alert
          severity="info"
          sx={{
            border: "1px solid #1e462e",
            bgcolor: "#EDF7ED",
            color: "#1e462e",
            fontSize: "12px",
            padding: "0px 10px",
          }}
        >
          <span style={{ fontWeight: "600" }}>Notice:</span> We would like to
          inform you that the{" "}
          <b style={{ fontWeight: "600" }}> Hotel Module </b> is currently under
          development and not yet available for use. Our technical team is
          actively working to complete the necessary configurations and
          enhancements to ensure optimal functionality and user experience.We
          appreciate your patience and understanding during this period. A
          formal update will be provided once the module is fully operational.
          <div style={{ marginTop: "8px" }}>
            For any immediate concerns or assistance, please do not hesitate to
            contact our support team.
          </div>
        </Alert>
      </Box>
    </Box>
  );
};

export default HotelSearchBox;
