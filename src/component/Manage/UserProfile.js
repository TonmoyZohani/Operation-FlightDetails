import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import moment from "moment";
import PhoneInput from "react-phone-input-2";
import { useNavigate, useOutletContext } from "react-router-dom";
import { textFieldProps } from "../../shared/common/functions";
import PageTitle from "../../shared/common/PageTitle";
import {
  depositBtn,
  phoneInputLabel,
  sharedInputStyles,
} from "../../shared/common/styles";
import MobileHeader from "../MobileHeader/MobileHeader";
import Nationality from "../Register/Nationality";

const UserProfile = () => {
  const { agentData } = useOutletContext();
  const navigate = useNavigate();

  return (
    <>
      <MobileHeader
        title="User Prifile"
        labelType="title"
        labelValue={"Profile Information"}
      />
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "5px",
          width: {
            xs: "90%",
            lg: "100%",
          },
          mx: "auto",
          mt: {
            xs: 5,
            lg: 0,
          },
        }}
      >
        <PageTitle title={"User Profile"} />

        <Box
          sx={{
            maxWidth: {
              xs: "100%",
              md: "70%",
            },
            margin: "0 auto",
            padding: "25px",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              position: "relative",
            }}
          >
            <img
              src={agentData?.userProfile?.profileImage}
              width={150}
              height={150}
              style={{ borderRadius: "50%", margin: "20px" }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: "22%",
                right: "45%",
                transform: "translate(50%, 50%)",
                height: "30px",
                width: "30px",
                bgcolor: "#6BC631",
                borderRadius: "50%",
              }}
            ></Box>
          </Box>
          <Grid container spacing={2}>
            {/* First Name */}
            <Grid item sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={agentData?.userProfile?.firstName}
                  {...textFieldProps("firstName", "First Name")}
                  sx={sharedInputStyles}
                  InputProps={{ readOnly: true }}
                  focused
                />
              </Box>
            </Grid>

            {/* Last Name */}
            <Grid item sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={agentData?.userProfile?.lastName}
                  {...textFieldProps("lastName", "Last Name")}
                  sx={sharedInputStyles}
                  InputProps={{ readOnly: true }}
                  focused
                />
              </Box>
            </Grid>

            {/* gender */}
            <Grid item sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={agentData?.userProfile?.gender?.toUpperCase()}
                  {...textFieldProps("gender", "Gender")}
                  sx={sharedInputStyles}
                  InputProps={{ readOnly: true }}
                  focused
                />
              </Box>
            </Grid>

            {/* dob */}
            <Grid item sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={
                    agentData?.userProfile?.dateOfBirth
                      ? moment(
                          agentData?.userProfile?.dateOfBirth,
                          "YYYY-MM-DD"
                        ).format("DD MMMM YYYY")
                      : ""
                  }
                  {...textFieldProps("dob", "Date of Birth")}
                  sx={sharedInputStyles}
                  InputProps={{ readOnly: true }}
                  focused
                />
              </Box>
            </Grid>

            {/* Nationality */}
            <Grid item sm={6} xs={12}>
              <Box sx={{ position: "relative", pointerEvents: "none" }}>
                <Nationality
                  nationality={agentData?.userProfile?.nationality}
                  placeholder="Select Nationality"
                />
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={2}>
            {/* Department */}
            <Grid item sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={agentData?.userProfile?.department}
                  {...textFieldProps("department", "Department")}
                  sx={sharedInputStyles}
                  InputProps={{ readOnly: true }}
                  focused
                />
              </Box>
            </Grid>

            {/* Designation */}
            <Grid item sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={agentData?.userProfile?.designation}
                  {...textFieldProps("designation", "Designation")}
                  sx={sharedInputStyles}
                  InputProps={{ readOnly: true }}
                  focused
                />
              </Box>
            </Grid>

            {/* Join Date */}
            <Grid item sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={
                    agentData?.userProfile?.joiningDate
                      ? moment(
                          agentData?.userProfile?.joiningDate,
                          "YYYY-MM-DD"
                        ).format("DD MMMM YYYY")
                      : ""
                  }
                  {...textFieldProps("joinDate", "Join Date")}
                  sx={sharedInputStyles}
                  InputProps={{ readOnly: true }}
                  focused
                />
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={2}>
            {/* Contact Email */}
            <Grid item sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={agentData?.userProfile?.email}
                  {...textFieldProps("contactEmail", "User Email")}
                  sx={sharedInputStyles}
                  InputProps={{ readOnly: true }}
                  focused
                />
              </Box>
            </Grid>

            {/* Phone Number */}
            <Grid item sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <Typography sx={phoneInputLabel}>Phone Number</Typography>
                <PhoneInput
                  inputStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                  value={agentData?.userProfile?.phone}
                  country={"bd"}
                  countryCodeEditable={false}
                  disabled
                />
              </Box>
            </Grid>

            {/* Address */}
            <Grid item sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={
                    agentData?.userProfile?.bangladeshAddress &&
                    Object.keys(agentData?.userProfile?.bangladeshAddress)
                      .length > 0
                      ? agentData?.userProfile?.bangladeshAddress?.address
                      : agentData?.userProfile?.internationalAddress?.address
                  }
                  {...textFieldProps("address", "Address")}
                  sx={sharedInputStyles}
                  InputProps={{ readOnly: true }}
                  focused
                />
              </Box>
            </Grid>
          </Grid>

          <Button
            sx={{
              ...depositBtn,
              justifyContent: "left",
              bgcolor: "var(--primary-color)",
              "&:hover": {
                bgcolor: "var(--primary-color)",
              },
            }}
            onClick={() => navigate("/dashboard/userProfile/profileConfig")}
          >
            Profile Configuration
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default UserProfile;
