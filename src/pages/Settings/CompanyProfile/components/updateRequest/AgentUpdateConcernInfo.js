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

const AgentUpdateConcernInfo = ({ showData }) => {
    
  const labelMapping = {
    name: "Name",
    gender: "Gender",
    dateOfBirth: "Date of Birth",
    nationality: "Nationality",
    address: "Address",
    email: "Email",
    phoneNumber: "Phone Number",
    whatsappNumber: "WhatsApp Number",
    relation: "Relation",
    nidFrontImage: "NID Front Image",
    nidBackImage: "NID Back Image",
  };

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
            {Object.entries(showData).map(([key, value], index) => (
              <TableRow key={index}>
                <TableCell sx={{ width: "25%" }}>
                  {labelMapping[key] || key}{" "}
                </TableCell>
                <TableCell sx={{ width: "25%" }}>
                  {key.includes("Image") ? (
                    <img
                      src={value}
                      alt={key}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontSize: "13px" }}>{value}</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AgentUpdateConcernInfo;
