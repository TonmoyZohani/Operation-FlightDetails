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
import { primaryBtn } from "../../../shared/common/styles";

const CardDeposit = () => {
  return (
    <Box
      sx={{
        ".MuiFormControlLabel-label": { width: "80%" },
        "& .MuiFormControlLabel-root": { margin: "0" },
      }}
    >
      <Box style={{ marginTop: "20px" }}>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
        >
          <Grid container spacing={2.5}>
            <Grid item md={4}>
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
                        src="https://wallpapers.com/images/hd/visa-mastercard-logos-wh429a8o742pgm38.jpg"
                        alt=""
                        style={{ width: "70px" }}
                      />
                      <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                        VISA / MASTER
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
          <Grid item md={4}>
            <input
              type="text"
              id="firstname"
              name="firstname"
              style={inputStyle}
              placeholder="Enter Amount"
              required
            />
          </Grid>

          <Grid item md={4}>
            <input
              type="text"
              id="firstname"
              name="firstname"
              style={inputStyle}
              placeholder="Gate Way Fee"
              required
            />
          </Grid>

          <Grid item md={4}>
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

      <Button sx={{ ...primaryBtn, width: "100%", mt: 4 }}>
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

export default CardDeposit;
