import {
  Box,
  CircularProgress,
  IconButton,
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
import axios from "axios";
import { useAuth } from "../../../../context/AuthProvider";
import CustomAlert from "../../../../component/Alert/CustomAlert";
import useToast from "../../../../hook/useToast";
import CustomToast from "../../../../component/Alert/CustomToast";
import DeleteIcon from "@mui/icons-material/Delete";

const NewPartnerRequest = ({ newPartnerData }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { jsonHeader } = useAuth();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const partnerData = newPartnerData?.map((info) => ({
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
    partnerTableId: info?.partnerTableId,
  }));

  const formatKey = (key) => {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (match) => match.toUpperCase());
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/agent/agent-info/remove-partnership/${id}`;
      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? you want to detele this Owner?",
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await axios.patch(url, {}, jsonHeader());
        const responseData = response?.data;

        if (responseData?.success) {
          setIsLoading(false);
          showToast(responseData?.message);
        }
      }
    } catch (error) {
      console.error(error?.response?.data?.message);
      showToast("error", error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ borderRadius: "5px", minHeight: "calc(100vh - 300px)" }}>
      {partnerData?.map((info, index) => (
        <Box key={index}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
            <IconButton
              aria-label="add to shopping cart"
              sx={{
                bgcolor: "none",
                ":hover": {
                  bgcolor: "transparent",
                },
                color: "var(--primary-color)",
                pr: "12px",
              }}
              onClick={() => handleDelete(info?.partnerTableId)}
            >
              {isLoading ? (
                <CircularProgress
                  size={20}
                  style={{ color: "var(--primary-color)" }}
                />
              ) : (
                <DeleteIcon sx={{ p: 0 }} />
              )}
            </IconButton>
          </Box>

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
                {Object.keys(info)
                  ?.filter((item) => item !== "partnerTableId")
                  ?.map((key, rowIndex) => {
                    return (
                      <TableRow key={rowIndex}>
                        {/* Label */}
                        <TableCell sx={{ width: "30%" }}>
                          <Typography
                            sx={{
                              textTransform: "capitalize",
                              fontSize: "13px",
                            }}
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
                            {info.status ? "Verified" : "Unverified"}
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

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

export default NewPartnerRequest;
