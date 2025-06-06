import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { convertCamelToTitle } from "../../shared/common/functions";
import { depositBtn } from "../../shared/common/styles";

const ErrorDialog = ({ errors, handleClose, data, onSubmit, type = "" }) => {
  const errosDatas = errors
    ? Object.entries(errors).map(([label, message]) => ({ label, message }))
    : [];

  const errorDatas = errosDatas?.map((error) => {
    const fieldValue = data[error.label];

    if (fieldValue instanceof File) {
      return {
        label: error.label,
        message: error.message,
        value: fieldValue.name || "File attached",
      };
    }

    return {
      label: error.label,
      message: error.message,
      value:
        typeof fieldValue === "object" && fieldValue !== null
          ? JSON.stringify(fieldValue)
          : fieldValue || "N/A",
    };
  });

  const datas = Object.entries(data)?.map(([label, value]) => {
    if (value instanceof File) {
      const isImage = value.type.startsWith("image/");
      const preview = isImage ? URL.createObjectURL(value) : null;

      return {
        label,
        value: preview ? (
          <img
            src={preview}
            alt={value.name || "File preview"}
            style={{
              maxWidth: "50px",
              maxHeight: "60px",
              borderRadius: "5px",
            }}
          />
        ) : (
          <a
            href={URL.createObjectURL(value)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            {value.name || "Download File"}
          </a>
        ),
      };
    }

    return {
      label,
      value:
        typeof value === "object" && value !== null
          ? JSON.stringify(value)
          : value || "N/A",
    };
  });

  return (
    <Dialog
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          width: { xs: "100%", md: "800px" },
          minWidth: { xs: "90%", md: "800px" },
          pb: 2,
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "0.85rem",
                sm: "0.95rem",
                md: "1.3rem",
              },
              fontWeight: 500,
            }}
          >
            {errorDatas?.length > 0
              ? `Fix The Unverified Field ${type}`
              : `Preview And Confirm ${type}`}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon
              sx={{ color: "var(--primary-color)", cursor: "pointer" }}
            />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{ borderTop: "1px solid var(--border)", py: 0, my: 0 }}
                >
                  <TableCell sx={{ color: "var(--secondary-color)", py: 1 }}>
                    Field
                  </TableCell>
                  <TableCell sx={{ color: "var(--secondary-color)", py: 1 }}>
                    Value
                  </TableCell>
                  {errorDatas.length > 0 && (
                    <TableCell sx={{ color: "var(--secondary-color)", py: 1 }}>
                      Error
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {errorDatas?.length > 0
                  ? errorDatas?.map((error, index) => (
                      <TableRow key={index}>
                        <TableCell
                          sx={{ textTransform: "capitalize", py: 1, my: 0 }}
                        >
                          {convertCamelToTitle(error?.label)}
                        </TableCell>
                        <TableCell sx={{ py: 1, my: 0 }}>
                          {error?.value || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{ py: 1, my: 0, color: "var(--primary-color)" }}
                        >
                          {error?.message}
                        </TableCell>
                      </TableRow>
                    ))
                  : datas?.map((data, index) => (
                      <TableRow key={index} sx={{ py: 0, my: 0 }}>
                        <TableCell sx={{ textTransform: "capitalize", py: 1 }}>
                          {convertCamelToTitle(data?.label)}
                        </TableCell>
                        <TableCell sx={{ py: 1, my: 0 }}>
                          {data?.value || "N/A"}{" "}
                          {data?.label?.toLowerCase() === "amount" && "BDT"}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContentText>
      </DialogContent>
      {errorDatas?.length <= 0 && (
        <DialogActions>
          <Button
            type="submit"
            sx={{
              ...depositBtn,
              bgcolor: "var(--secondary-color)",
              ":hover": {
                bgcolor: "var(--secondary-color)",
              },
              display: "flex",
              alignItems: "center",
              width: "96%",
              mx: "auto",
            }}
            onClick={() => {
              onSubmit();
              handleClose();
            }}
          >
            Submit
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ErrorDialog;
