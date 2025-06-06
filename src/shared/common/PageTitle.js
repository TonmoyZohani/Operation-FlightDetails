import SearchIcon from "@mui/icons-material/Search";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import * as Yup from "yup";

const PageTitle = ({ title, type, searchById, setSearchById }) => {
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;

    validationSchema
      .validate(value)
      .then(() => {
        setSearchById(value);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <Box
      sx={{
        height: "50px",
        bgcolor: "#F2F8FF",
        display: { xs: "none", lg: "flex" },
        justifyContent: type === "dataGrid" ? "space-between" : "end",
        alignItems: "center",
        px: 2,
        borderRadius: "5px 5px 0 0",
      }}
    >
      {type === "dataGrid" && (
        <Box
          sx={{
            input: {
              "::placeholder": { fontStyle: "italic", color: "#839EB9" },
            },
            display: "flex",
            alignItems: "center",
            gap: "5px",
            position: "relative",
          }}
        >
          <SearchIcon sx={{ color: "#839EB9" }} />
          <input
            style={{
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              color: "var(--secondary-color)",
              fontWeight: "500",
              textTransform: "uppercase",
            }}
            value={searchById || ""}
            onChange={handleInputChange}
            type="text"
            placeholder="Enter Id for Search"
          />
          {error && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
                position: "absolute",
                bottom: "-15px",
                left: "5px",
              }}
            >
              {error}
            </p>
          )}
        </Box>
      )}

      <Typography
        sx={{
          color: "var(--secondary-color)",
          fontSize: "1.2rem",
          fontWeight: "500",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

const validationSchema = Yup.string()
  .matches(/^(?! ).*$/, "Cannot start with a space")
  .matches(/^(?!.* ).*$/, "Cannot have consecutive spaces");

export default PageTitle;
