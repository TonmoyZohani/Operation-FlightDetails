import React from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { depositBtn } from "../../../shared/common/styles";

const MobileBanking = () => {
  return (
    <Box
      sx={{
        ".MuiFormControlLabel-label": { width: "80%" },
        "& .MuiFormControlLabel-root": { margin: "0" },
        mt: "15px",
        minHeight: "calc(100vh - 300px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "white",
        p: { md: "0", xs: "15px" },
        borderRadius: "5px",
      }}
    >
      <Box>
        <Box>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={4}>
                <Box sx={{ borderRadius: "4px", border: "1px solid #DEE0E4" }}>
                  <FormControlLabel
                    value="bkash"
                    control={<Radio />}
                    sx={{ width: "100%", p: "10px" }}
                    label={
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src="https://freepnglogo.com/images/all_img/1701541855%E0%A6%AC%E0%A6%BF%E0%A6%90%E0%A6%BE%E0%A6%B6-%E0%A6%B2%E0%A6%97%E0%A7%8B.png"
                          alt=""
                          style={{ width: "70px" }}
                        />
                        <Typography
                          sx={{ fontSize: "13px", fontWeight: "600" }}
                        >
                          BKash
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ borderRadius: "4px", border: "1px solid #DEE0E4" }}>
                  <FormControlLabel
                    value="nagad"
                    control={<Radio />}
                    sx={{ width: "100%", p: "10px" }}
                    label={
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src="https://www.logo.wine/a/logo/Nagad/Nagad-Logo.wine.svg"
                          alt=""
                          style={{ width: "70px" }}
                        />
                        <Typography
                          sx={{ fontSize: "13px", fontWeight: "600" }}
                        >
                          Nagad
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </RadioGroup>
        </Box>

        <Box style={{ marginTop: "20px" }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={4}>
              <input
                type="text"
                id="firstname"
                name="firstname"
                style={inputStyle}
                placeholder="Payment Type Transaction ID"
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <input
                type="text"
                id="firstname"
                name="firstname"
                style={inputStyle}
                placeholder="Gate Way Fee"
                required
              />
            </Grid>
          </Grid>
        </Box>

        <Box style={{ marginTop: "60px" }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={4}>
              <input
                type="text"
                id="firstname"
                name="firstname"
                style={inputStyle}
                placeholder="Payment Type Account Number"
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <input
                type="text"
                id="firstname"
                name="firstname"
                style={inputStyle}
                placeholder="Enter Amount"
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <input
                type="text"
                id="firstname"
                name="firstname"
                style={inputStyle}
                placeholder="Gate Way Fee"
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <input
                type="text"
                id="firstname"
                name="firstname"
                style={inputStyle}
                placeholder="Amount to be Deposit"
                required
              />
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Button
        type="submit"
        sx={{
          ...depositBtn,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          textAlign: "left",
          paddingRight: "16px",
          fontSize: { md: "14px", xs: "11px" },
        }}
      >
        Send Deposit Request Amount of BDT 45.00
      </Button>
    </Box>
  );
};

const inputStyle = {
  width: "100%",
  height: "37px",
  borderRadius: "4px",
  outline: "none",
  border: "1px solid #DEE0E4",
  paddingLeft: "15px",
};

export default MobileBanking;
