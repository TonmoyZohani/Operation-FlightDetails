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
import React, { useEffect, useState } from "react";

const AgentUpdateAgencyInfo = ({ showData }) => {
    
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
            {[
              { label: "WhatsApp Number", key: "whatsappNumber" },
              { label: "Email", key: "email" },
              { label: "Employee Count", key: "employeeCount" },
              { label: "Phone Number", key: "phoneNumber" },
            ]
              .filter((item) => showData[item.key]) 
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ width: "25%" }}>{item.label}</TableCell>
                  <TableCell sx={{ width: "25%" }}>
                    <Typography sx={{ fontSize: "13px" }}>
                      {showData[item.key]}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AgentUpdateAgencyInfo;
