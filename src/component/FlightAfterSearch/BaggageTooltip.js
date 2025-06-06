import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

const BaggageTooltip = ({ flightData }) => {
  const baggage = [
    ...new Set(flightData.baggage.flat().map((item) => item.paxType)),
  ];

  return (
    <Box sx={{ " .MuiTableCell-root": { fontSize: "12px" } }}>
      <TableContainer sx={{ boxShadow: "none", borderRadius: "0px" }}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Pax Type</TableCell>
              {flightData.route.map((route, index) => (
                <TableCell key={index} style={{ fontWeight: "bold" }}>
                  {route.departure}-{route.arrival}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {baggage.map((type) => (
              <TableRow key={type}>
                <TableCell>{type}</TableCell>
                {flightData.baggage.map((segment, index) => {
                  const paxBaggage = segment.find(
                    (item) => item.paxType === type
                  );
                  return (
                    <TableCell key={index}>
                      {paxBaggage ? paxBaggage.baggage : "-"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BaggageTooltip;
