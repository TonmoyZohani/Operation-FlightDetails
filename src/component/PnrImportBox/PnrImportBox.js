import {
  Box,
  ClickAwayListener,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ActionButton from "../../shared/common/ActionButton";
import { ReactComponent as DropDownIcon } from ".././../images/svg/dropdown.svg";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PendingLoader from "../Loader/PendingLoader";
import { useQuery } from "@tanstack/react-query";
import useToast from "../../hook/useToast";
import CustomToast from "../Alert/CustomToast";

const PnrImportBox = () => {
  const { jsonHeader } = useAuth();
  const [openCountry, setOpenCountry] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const navigate = useNavigate();

  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const [selectedSystem, setSelectedSystem] = useState({
    gdsName: "Select System",
    id: "",
    shareCommand: "Select GDS System First",
  });

  const [selectedPnr, setSelectedPnr] = useState("");

  const { data: allSystem, status } = useQuery({
    queryKey: ["pnr-share/get-gds-name`"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/pnr-share/get-gds-name`,
        jsonHeader()
      );

      return data?.data;
    },
    retry: false,
    staleTime: 0,
  });

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
          {status === "pending" ? (
            <GDSLoader />
          ) : (
            <>
              {allSystem?.length !== 0 ? (
                allSystem?.map((item, index) => {
                  return (
                    <Box
                      key={index}
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
                        onClick={() => {
                          setSelectedSystem(item);
                          setOpenCountry(false);
                        }}
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
                            {item?.gdsName?.charAt(0).toUpperCase() +
                              item?.gdsName?.slice(1)}
                          </Typography>
                        </Box>
                        {/* <Box>
                      <img
                        src={item?.image}
                        style={{ width: "40px", height: "15px" }}
                      />
                    </Box> */}
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
            </>
          )}
        </Box>
      </Box>
    );
  };

  const handleClickAway = () => {
    setOpenCountry(false);
  };

  const handlePnrSearch = async () => {
    setIsLoading(true);
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/auto/pnr-share`;

    const body = {
      gdsName: selectedSystem?.gdsName,
      pcc: selectedSystem?.pcc,
      pnr: selectedPnr,
      isSaved: false,
    };

    try {
      const response = await axios.post(url, body, jsonHeader());

      if (response?.data?.success) {
        setIsLoading(false);
        navigate(`/dashboard/booking/allpnrimport/share-pnr-retrive`, {
          state: {
            pcc: selectedSystem?.pcc,
            pnr: selectedPnr,
            pnrData: response?.data?.data,
            gdsId: selectedSystem?.id,
          },
        });
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      showToast("error", error?.message || "An unexpected error occurred");
    }
  };

  if (isLoading) {
    return <PendingLoader type="split" />;
  }

  // if (isError) {
  //   return   <ServerError message={isError} />
  // }

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box sx={{ px: { lg: 0, xs: 2.3, md: 4.1, sm: 3.3 } }}>
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
                md={4}
                lg={4}
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
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  onClick={() => {
                    setOpenCountry((prev) => !prev);
                  }}
                >
                  <Box sx={{ mt: "8px" }}>
                    <p style={{ marginBottom: "5px" }}>GDS</p>
                    <span className="addressTitle">
                      {selectedSystem?.gdsName?.charAt(0).toUpperCase() +
                        selectedSystem?.gdsName?.slice(1)}
                    </span>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "end" }}>
                    <DropDownIcon
                      fill={"var(--secondary-color)"}
                      style={{
                        width: "18px",
                        height: "8px",
                        marginLeft: "25px",
                        marginBottom: "10px",
                        transform: openCountry
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.3s ease-in-out",
                      }}
                    />
                  </Box>
                </Box>
                {openCountry && (
                  <Box className="des-box">
                    <Box>{destinationBox()}</Box>
                  </Box>
                )}
              </Grid>

              <Grid
                className="dashboard-main-input-parent"
                item
                xs={12}
                sm={12}
                md={4}
                lg={4}
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
                    borderRight: { lg: "1px solid #DEDEDE", xs: "none" },
                  }}
                >
                  <Box sx={{ mt: "8px" }}>
                    <p style={{ marginBottom: "4px" }}>Share PNR</p>
                    <span className="addressTitle">
                      {selectedSystem?.shareCommand}
                    </span>
                  </Box>
                </Box>
              </Grid>

              <Grid
                className="dashboard-main-input-parent"
                item
                xs={12}
                sm={12}
                md={4}
                lg={4}
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
                  <Box
                    sx={{
                      mt: "8px",
                      "& .addressTitle::placeholder": {
                        color: "var(--primary-color)",
                      },
                    }}
                  >
                    <p style={{ marginBottom: "4px" }}>PNR</p>
                    <input
                      className="addressTitle"
                      style={{
                        border: "none",
                        outline: "none",
                      }}
                      placeholder="Enter PNR"
                      onChange={(e) => setSelectedPnr(e.target.value)}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Grid item lg={0.6} xs={12}>
              <ActionButton
                buttonDisabled={selectedSystem?.id === "" || selectedPnr === ""}
                handleClick={handlePnrSearch}
                buttonText={isLoading ? "Waiting" : "Import"}
              />
            </Grid>
          </Grid>
        </Box>
      </ClickAwayListener>
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </>
  );
};

const GDSLoader = () => {
  return (
    <Box sx={{ px: "10px" }}>
      <Skeleton
        animation="wave"
        width={"100%"}
        height={"32.5px"}
        sx={{ borderRadius: "4px" }}
      />
    </Box>
  );
};

export default PnrImportBox;
