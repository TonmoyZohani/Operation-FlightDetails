import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

const AgentUpdateGeneralInfo = ({ showData }) => {
  return (
    <Box sx={{ borderRadius: "5px", minHeight: "calc(100vh - 300px)", mt: 5 }}>
      <TableContainer sx={{ px: 1, border: "none", borderRadius: "5px" }}>
        <Table>
          <TableHead sx={{ borderTop: "1px solid var(--border)" }}>
            <TableRow>
              {["Label", "Value"].map((head, i) => (
                <TableCell sx={{ width: "12%", py: 0.7 }} key={i}>
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ width: "25%" }}>WhatsApp Number</TableCell>
              <TableCell sx={{ width: "25%" }}>
                <Typography sx={{ fontSize: "13px" }}>{showData}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AgentUpdateGeneralInfo;
