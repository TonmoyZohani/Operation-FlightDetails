import {
  Alert,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { ReactComponent as AirplanIcon } from "../../images/svg/airplane.svg";
import { segmentTitleStyles } from "./FlightDetails";

const BaggageTable = ({ route, baggage, type, cityCount }) => {
  const [toggleCity, setToggleCity] = useState(0);
  const [toogleSegment, setToogleSegment] = useState(0);
  const [show, setShow] = useState(false);

  // console.log(cityCount?.at(toggleCity)?.at(toogleSegment)?.baggage);

  return (
    <Box sx={{ px: { xs: 2, lg: 2 }, py: { xs: 2, lg: 0 } }}>
      <Box sx={{ display: "flex", gap: "15px", mb: "15px" }}>
        {route?.map((route, i) => (
          <Box
            key={i}
            onClick={() => {
              setToggleCity(i);
              setShow(false);
            }}
            sx={{
              bgcolor:
                toggleCity === i
                  ? "var(--primary-color)"
                  : "var(--third-color)",
              border:
                toggleCity === i
                  ? "1px solid var(--primary-color)"
                  : "1px solid var(--primary-color)",
              borderRadius: "3px",
              py: "4px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              key={i}
              sx={{
                ...segmentTitleStyles,
                justifyContent: "center",
                color: toggleCity === i ? "white" : "var(--primary-color)",
              }}
            >
              {route?.departure}
              <AirplanIcon
                style={{
                  height: "15px",
                  width: "15px",
                  fill: toggleCity === i ? "white" : "var(--primary-color)",
                }}
              />
              {route?.arrival}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box>
        <TableContainer sx={{ boxShadow: "none", borderRadius: "0px" }}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell sx={labelStyle}>Pax Type</TableCell>
                <TableCell align="center" sx={headerStyle}>
                  Cabin Baggage
                </TableCell>
                <TableCell align="center" sx={headerStyle}>
                  Check-In Baggage
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cityCount
                ?.at(toggleCity)
                ?.at(toogleSegment)
                ?.baggage?.map((item) => (
                  <TableRow key={item.paxType}>
                    <TableCell sx={labelStyle}>
                      {item.paxType === "ADT"
                        ? "Adult"
                        : item.paxType === "CNN"
                          ? "Child"
                          : "Infant"}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ ...textStyle, textTransform: "uppercase" }}
                    >
                      {item?.cabinBaggage ?? "SB"}
                    </TableCell>
                    <TableCell align="center" sx={textStyle}>
                      {item?.baggage ?? "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {cityCount?.at(toggleCity)?.length > 1 && (
          <Box
            sx={{ display: "flex", gap: "10px", justifyContent: "end", mt: 2 }}
          >
            {cityCount?.at(toggleCity)?.map((city, i) => {
              const isActive = toogleSegment === i;

              return (
                <Button
                  key={i}
                  onClick={() => setToogleSegment(i)}
                  sx={{
                    padding: "5px 10px",
                    borderRadius: "3px",
                    fontSize: "12px",
                    height: "30px",
                    bgcolor: isActive
                      ? "var(--secondary-color)"
                      : "transparent",
                    color: isActive ? "white" : "var(--secondary-color)",
                    border: "1px solid var(--secondary-color)",
                    ":hover": {
                      color: "#fff",
                      bgcolor: "var(--secondary-color)",
                      svg: { fill: "#fff !important" },
                    },
                    gap: 1,
                  }}
                >
                  {city?.departure}
                  <AirplanIcon
                    style={{
                      height: "15px",
                      width: "15px",
                      fill: isActive ? "white" : "var(--secondary-color)",
                    }}
                  />
                  {city?.arrival}
                </Button>
              );
            })}
          </Box>
        )}
      </Box>
      {baggage[toggleCity]?.[0]?.charge !== null && type !== "afterSearch" && (
        <BaggageChargeNotice
          charge={baggage[toggleCity]?.charge}
          checkin={baggage[toggleCity]?.[0]?.baggage}
        />
      )}
    </Box>
  );
};

export const BaggageChargeNotice = ({ charge, checkin }) => {
  return (
    <Box
      sx={{
        ".MuiSvgIcon-root": { color: "var(--secondary-color)" },
        mt: "15px",
      }}
    >
      <Alert
        severity="info"
        sx={{
          border: "1px solid var(--secondary-color)",
          bgcolor: "#E5F6FD",
          color: "var(--secondary-color)",
          fontSize: "12px",
          padding: "0px 10px",
        }}
      >
        <span style={{ fontWeight: "600" }}>Extra Baggage:</span> You have to
        pay {charge} for extra {checkin} baggage.
      </Alert>
    </Box>
  );
};

const textStyle = { fontSize: "12px", color: "var(--secondary-color)" };

const labelStyle = {
  bgcolor: "#18457B",
  color: "var(--white)",
  fontSize: "12px",
  fontWeight: "400",
};

const headerStyle = {
  bgcolor: "#F2F7FF",
  color: "var(--secondary-color)",
  fontSize: "12px",
  fontWeight: "400",
};

export default BaggageTable;
