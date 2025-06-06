import { Alert, Box, ClickAwayListener, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ActionButton from "../../shared/common/ActionButton";
import { useNavigate } from "react-router-dom";

const TourSearchBox = () => {
  const [openCountry, setOpenCountry] = useState(false);
  const [suggestCountry, setSuggestCountry] = useState([]);
  const navigate = useNavigate();

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
          {suggestCountry.length !== 0 ? (
            suggestCountry.map((item, index) => {
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
                          pt: "5px",
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                    <Box>
                      <img
                        alt="logo"
                        src={`https://flagcdn.com/w320/${item?.code.toLowerCase()}.png`}
                        style={{
                          width: "25px",
                          height: "17px",
                          backgroundSize: "cover",
                          marginRight: "5px",
                          borderRadius: "3px",
                        }}
                      />
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

  const handleClickAway = () => {
    setOpenCountry(false);
  };

  const handleSearchVisa = () => {
    navigate("/dashboard/search/tourAfterSearch");
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
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
              lg={6}
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
                  setOpenCountry((prev) => !prev);
                }}
              >
                <Box sx={{ mt: "8px" }}>
                  <p>Destination Type</p>
                  <span className="addressTitle">Domestic</span>
                </Box>
              </Box>
              {openCountry && (
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
                        placeholder="Select Country..."
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
              lg={6}
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
                  borderRadius: "0px 5px 5px 0px",
                }}
              >
                <Box sx={{ mt: "8px" }}>
                  <p>City</p>
                  <span className="addressTitle">Cox's Bazar</span>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Grid item lg={0.6}>
            <ActionButton
              handleClick={handleSearchVisa}
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
            <b style={{ fontWeight: "600" }}> Tour Module </b> is currently
            under development and not yet available for use. Our technical team
            is actively working to complete the necessary configurations and
            enhancements to ensure optimal functionality and user experience.We
            appreciate your patience and understanding during this period. A
            formal update will be provided once the module is fully operational.
            <div style={{ marginTop: "8px" }}>
              For any immediate concerns or assistance, please do not hesitate
              to contact our support team.
            </div>
          </Alert>
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default TourSearchBox;
