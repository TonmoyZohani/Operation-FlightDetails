import {
  Box,
  Collapse,
  SwipeableDrawer,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import { FareRulesChargesData } from "../../../shared/common/functions";
import { layoutBox } from "../../../shared/common/styles";

const FareRulesCharges = ({ bookingData, structure, nonStructure }) => {
  const [openPdf, setOpenPdf] = useState(false);
  const [openSubPdf, setOpenSubPdf] = useState(false);
  const [showFareRules, setShowFareRules] = useState(false);

  const downloadSectionStyle = {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const togglePdf = () => {
    setOpenPdf(!openPdf);
    if (openSubPdf) {
      setOpenSubPdf(false);
    }
  };

  return (
    <Box
      sx={{
        cursor: "pointer",
        borderRadius: "5px 5px 0 0",
        bgcolor: "white",
        p: 2,
      }}
    >
      <Box sx={downloadSectionStyle} onClick={togglePdf}>
        <Typography
          sx={{ color: "#3C4258", fontSize: "0.85rem", fontWeight: "500" }}
        >
          Fare Rules Charges
        </Typography>
        <ArrowDropDownIcon
          sx={{
            transition: "transform 0.3s",
            transform: openPdf ? "rotate(180deg)" : "rotate(0deg)",
            bgcolor: "#EFF7FF",
            borderRadius: "50%",
          }}
        />
      </Box>

      <Collapse
        in={openPdf}
        timeout="auto"
        unmountOnExit
        sx={{
          width: "100%",
          transition: "height 1s ease-in-out",
        }}
      >
        <Box sx={{ padding: "8px 0px" }}>
          {nonStructure?.length > 0 && (
            <Typography
              onClick={() => setShowFareRules(true)}
              sx={{
                textDecoration: "underline",
                cursor: "pointer",
                color: "var(--primary-color)",
                textAlign: "right",
                width: "max-content",
                fontSize: "13px",
              }}
            >
              Advanced Fare Rules
            </Typography>
          )}

          <FareRulesChargesData structure={structure} />
        </Box>
      </Collapse>

      <FareDetails
        showFareRules={showFareRules}
        handleDrawerClose={() => setShowFareRules(false)}
        nonStructure={nonStructure}
        bookingData={bookingData?.data}
      />
    </Box>
  );
};

const FareDetails = ({
  showFareRules,
  nonStructure,
  handleDrawerClose,
  bookingData,
}) => {
  const [structure, setStructure] = useState(nonStructure[0]);

  const handleStructure = (val) => {
    const selectedStructure = nonStructure.find((item) => item.title === val);
    setStructure(selectedStructure);
  };


  return (
    <SwipeableDrawer
      anchor="right"
      open={showFareRules}
      onClose={handleDrawerClose}
      PaperProps={{
        sx: {
          width: "22%",
          height: "100vh",
          zIndex: 999999999,
          background: "#ececec",
        },
      }}
    >
      {showFareRules && (
        <Box
          sx={{
            ...layoutBox,
            position: "relative",
            height: "100%",
            background: "#ececec",
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 0,
              background: "#ececec",
            }}
          >
            <Box sx={{ zIndex: 1000 }}>
              <img
                src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${bookingData?.carrier}.png`}
                width="45px"
                height="45px"
                alt="flight1"
              />
              <Typography variant="subtitle1">
                {bookingData?.carrierName}
              </Typography>
              <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>
                {bookingData?.details?.cityCount
                  ? bookingData?.details?.cityCount?.map(
                      (cities, outerIndex) => (
                        <span key={`${outerIndex}`}>
                          {outerIndex > 0 && ", "}
                          {cities[0]?.marketingCarrier}-
                          {cities[0]?.marketingFlight}
                        </span>
                      )
                    )
                  : bookingData?.cityCount?.map((cities, outerIndex) =>
                      cities.map((city, innerIndex) => (
                        <span key={`${outerIndex}-${innerIndex}`}>
                          {innerIndex > 0 && ", "}
                          {city?.marketingCarrier}-{city?.marketingFlight}
                        </span>
                      ))
                    )}
                <span style={{ paddingLeft: "3px" }}>
                  , {bookingData?.details?.brands[0]?.name}{" "}
                </span>
              </Typography>
            </Box>

            <Box sx={{ pt: "20px" }}>
              <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                Fare Rules
              </Typography>
            </Box>

            <select
              style={{
                marginTop: "10px",
                border: "none",
                backgroundColor: "var(--secondary-color)",
                outline: "none",
                paddingTop: "4px",
                paddingBottom: "4px",
                color: "#fff",
                width: "100%",
                paddingLeft: "10px",
              }}
              onChange={(e) => handleStructure(e.target.value)}
            >
              {nonStructure.map((item, index) => (
                <option key={index} value={item.title}>
                  {index + 1}. {item.title}
                </option>
              ))}
            </select>
          </Box>
          <Box sx={{ position: "absolute", right: 20, top: 20 }}>
            <Tooltip
              title={
                <Box sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      mb: 1,
                      mt: 1.5,
                      fontSize: "1rem",
                      lineHeight: "1.2rem",
                    }}
                  >
                    How to read <strong>Fare Rules</strong>
                  </Typography>
                  <Typography
                    sx={{ mb: 0.5, fontSize: "13px", lineHeight: "1rem" }}
                  >
                    TICKET IS NON-REFUNDABLE — the ticket is
                    non-refundable;TICKET IS NON-REFUNDABLE FOR CANCEL/REFUND —
                    the ticket is non-refundable; REFUND IS NOT PERMITTED — the
                    ticket is non-refundable;ANY TIME TICKET IS NON-REFUNDABLE —
                    the ticket is non-refundable; TICKET IS NON-REFUNDABLE IN
                    CASE OF NO-SHOW — the ticket cannot be refunded in case of
                    no-show.Change rules are described in the section with the
                    CHANGES subtitle.
                  </Typography>
                  <Typography
                    sx={{ mt: 1, fontSize: "0.9rem", lineHeight: "1rem" }}
                  >
                    The CHANGES ARE NOT PERMITTED line means that you cannot
                    make any changes and in such a case, you are not allowed to
                    change the date/time/route of the flight.
                  </Typography>
                </Box>
              }
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "var(--primary-color)",
                    color: "white",
                    maxWidth: 310,
                    mr: 3,
                  },
                },
                arrow: {
                  sx: { color: "var(--primary-color)" },
                },
              }}
            >
              <Box
                sx={{
                  width: "35px",
                  height: "35px",
                  bgcolor: "var(--secondary-color)",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "50%",
                  justifyContent: "center",
                }}
              >
                <LiveHelpIcon sx={{ fontSize: "1.3rem", color: "#fff" }} />
              </Box>
            </Tooltip>
          </Box>

          <Box sx={{ pt: "20px", width: "100%", overflow: "hidden" }}>
            <Typography sx={{ fontSize: "12px" }}>{structure?.text}</Typography>
          </Box>
        </Box>
      )}
    </SwipeableDrawer>
  );
};

export default FareRulesCharges;
