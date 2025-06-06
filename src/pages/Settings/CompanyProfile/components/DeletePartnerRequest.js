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
import React, { useState } from "react";
import ImagePreviewModal from "../../../../component/Modal/ImagePreviewModal";
import ImageFile from "../../../../assets/png/jpg.png";

const DeletePartnerRequest = ({ oldPartnerData }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const partnerData = oldPartnerData?.map((info) => ({
    name: info?.name,
    phoneNumber: info?.phoneNumber,
    email: info?.email,
    whatsappNumber: info?.whatsappNumber,
    dateOfBirth: info?.dateOfBirth,
    gender: info?.gender,
    nationality: info?.nationality,
    nidFront: info?.nidFront,
    nidBack: info?.nidBack,
    photo: info?.photo,
    tin: info?.tin,
    signature: info?.signature,
  }));

  const formatKey = (key) => {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (match) => match.toUpperCase());
  };

  return (
    <Box
      sx={{
        borderRadius: "5px",
        minHeight: "calc(100vh - 300px)",
        mt: 5,
      }}
    >
      {partnerData?.map((info, index) => (
        <Box key={index}>
          <Typography
            sx={{
              fontSize: "16px",
              color: "var(--secondary-color)",
              fontWeight: "500",
              my: 3,
            }}
          >
            Owner Information {index + 1}
          </Typography>

          <TableContainer>
            <Table>
              <TableHead sx={{ borderTop: "1px solid var(--border)" }}>
                <TableRow>
                  {["Label", "Value", "Status"].map((head, i) => (
                    <TableCell sx={{ width: "33%", py: 0.7 }} key={i}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(info).map((key, rowIndex) => {
                  return (
                    <TableRow key={rowIndex}>
                      {/* Label */}
                      <TableCell sx={{ width: "30%" }}>
                        <Typography
                          sx={{ textTransform: "capitalize", fontSize: "13px" }}
                        >
                          {formatKey(key)}
                        </Typography>
                      </TableCell>

                      {/* New Value */}
                      <TableCell sx={{ width: "60%" }}>
                        <Typography sx={{ fontSize: "13px" }}>
                          {info[key]?.startsWith("https://") ? (
                            <img
                              src={ImageFile}
                              alt="New Value"
                              style={{
                                width: "40px",
                                height: "40px",
                                cursor: "pointer",
                              }}
                              onClick={() => setImageUrl(info[key])}
                            />
                          ) : (
                            info[key] || "N/A"
                          )}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell sx={{ width: "10%" }}>
                        <Typography
                          sx={{
                            bgcolor: info.status ? "green" : "red",
                            color: "#fff",
                            fontSize: "12px",
                            p: "5px",
                            borderRadius: "2px",
                            textAlign: "center",
                            width: "80px",
                          }}
                        >
                          {info.status ? "Verified" : "Unsettled"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
      {imageUrl && (
        <ImagePreviewModal
          open={imageUrl}
          onClose={setImageUrl}
          imgUrl={imageUrl}
        />
      )}
    </Box>
  );
};

export default DeletePartnerRequest;
