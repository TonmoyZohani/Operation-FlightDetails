import React from "react";
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
} from "@mui/material";

const MobileBaggages = ({ baggage }) => {
  return (
    <Box sx={{ bgcolor: "white", p: 2, borderRadius: 1 }}>
      <Box>
        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: 500,
            color: "var(--black)",
            mb: 1,
          }}
        >
          Destination & Details
        </Typography>
        <TableContainer
          sx={{
            boxShadow: "none",
            borderRadius: "0px",
          }}
        >
          <Table size="small" aria-label="a dense table">
            <TableBody>
              {baggage?.map((bag, index) => (
                <TableRow
                  key={index}
                >
                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: "var(--secondary-color)",
                      fontSize: "14px",
                      textAlign: "left",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    {bag?.paxType === "ADT"
                      ? "Adult"
                      : bag?.paxType === "CNN"
                      ? "Child"
                      : "Infant"}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontSize: "14px",
                      textAlign: "left",
                      bgcolor: "#18457b",
                      opacity: 0.8,
                    }}
                  >
                    {`Check ${bag?.baggage}, Cabin ${bag?.cabinBaggage}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default MobileBaggages;
