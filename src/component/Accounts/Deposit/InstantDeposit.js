import { Box, Button, Grid, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Checkbox from '@mui/material/Checkbox';
import ssllogo from "../../../images/logo/ssllogo.png";
import bkashLogo from "../../../images/logo/bkashlogo.png";
import nagadLogo from "../../../images/logo/nagadlogo.png";
import React, { useState } from 'react'

const inputStyle = {
  width: "100%",
  height: "37px",
  borderRadius: "4px",
  outline: "none",
  border: "1px solid #DEE0E4",
  paddingLeft: "15px",
};

const InstantDeposit = () => {

  return (
    <Box sx={{ px: "22px", pb: '35px', mb: "25px", width: "100%", height: '500px',display:"flex",flexDirection:"column",justifyContent:"space-between" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>

        {/* Payment logo */}
        <Box sx={{ width: "25%", ml: "8px", mt: "20px" }}>
          <Box sx={{ width: "100%", height: "45px", borderRadius: "3px", mb: "15px" }}>
            <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={ssllogo} />
          </Box>
          <Box sx={{ width: "100%", border: "1px solid var(--gray)", height: "45px", borderRadius: "3px", mb: "10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img style={{ width: "25%", height: "100%", objectFit: "center" }} src={nagadLogo} />
          </Box>
          <Box sx={{ width: "100%", border: "1px solid var(--gray)", height: "45px", borderRadius: "3px", mb: "10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img style={{ width: "25%", height: "70%", objectFit: "center" }} src={bkashLogo} />
          </Box>
        </Box>

        <Box sx={{ width: "70%" }}>
          <form style={{ marginTop: "20px" }}>
            <Grid container spacing={2.5}>
              <Grid item md={6}>
                <select
                  style={inputStyle}
                >
                  <option value="male">Select Transaction Type</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </Grid>

              <Grid item md={6}>
                <input type="text" id="firstname" name="firstname" style={inputStyle} placeholder="Enter Amount" required />
              </Grid>
              <Grid item md={6}>
                <input style={inputStyle} placeholder="Gateway Fee" required />
              </Grid>
              <Grid item md={6}>
                <input style={inputStyle} placeholder="Amount To Be Deposited" required />
              </Grid>
            </Grid>
          </form>

        </Box>
      </Box>


      <Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: "30px", gap: "5px" }}>
          <Checkbox sx={{ p: "0px" }} /> <Typography sx={{ fontSize: "12px", fontWeight: "500", color: "var(--gray)" }}>By Completing this Registration Agree with our <span style={{ color: "var(--primary-color)" }}>Terms and Conditions & Privacy Policy</span></Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: "5px", gap: "5px" }}>
          <Checkbox sx={{ p: "0px" }} /> <Typography sx={{ fontSize: "12px", fontWeight: "500", color: "var(--gray)" }}>I agree with sharing the above mentioned information with Fly Far International </Typography>
        </Box>

        <Button style={{ backgroundColor: "var(--primary-color)", color: "var(--white)", width: "100%", fontSize: "12px", marginTop: "30px", paddingTop: "7px", paddingBottom: "7px" }}>Send Deposit Request Amount of BDT 45.00</Button>
      </Box>

    </Box>
  )
}

export default InstantDeposit;
