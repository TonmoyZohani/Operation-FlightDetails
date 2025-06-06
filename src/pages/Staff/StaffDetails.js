import { Box, Grid, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import PhoneInput from "react-phone-input-2";
import { useLocation } from "react-router-dom";
import FileUpload from "../../component/AirBooking/FileUpload";
import ServerError from "../../component/Error/ServerError";
import MobileHeader from "../../component/MobileHeader/MobileHeader";
import Nationality from "../../component/Register/Nationality";
import TableSkeleton from "../../component/SkeletonLoader/TableSkeleton";
import { useAuth } from "../../context/AuthProvider";
import { textFieldProps } from "../../shared/common/functions";
import PageTitle from "../../shared/common/PageTitle";
import { phoneInputLabel, sharedInputStyles } from "../../shared/common/styles";
import useWindowSize from "../../shared/common/useWindowSize";
import { MobileInputSkeleton, sectionTitle } from "./AddStaff";

const StaffDetails = () => {
  const location = useLocation();
  const { jsonHeader } = useAuth();
  const { isMobile } = useWindowSize();

  // const { id, staffData } = state;
  const id = location?.state?.id;
  const staffData = location?.state?.staffData;

  const fetchData = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/v1/agent/staff/draft-details/${id}`,
      jsonHeader()
    );

    return response.data.data;
  };

  //TODO:: Fetching data from api
  const {
    data: singleStaff,
    error,
    status,
  } = useQuery({
    queryKey: ["singleStaff", id],
    queryFn: fetchData,
    enabled: !!id,
  });

  return (
    <Box sx={{ borderRadius: { md: "10px" } }}>
      {isMobile ? (
        <MobileHeader
          title={"Staff Details"}
          subTitle={`${staffData?.firstName} ${staffData?.lastName}, ${
            singleStaff?.designation || ""
          }`}
          labelValue={staffData?.staffId}
        />
      ) : (
        <PageTitle title={"Staff Details"} />
      )}

      <Box sx={{ mt: { lg: "0", xs: 5 } }}>
        <Box
          sx={{
            width: {
              xs: "90%",
              lg: "100%",
            },
            mx: "auto",
            px: { lg: "22px", xs: "15px" },
            py: { md: "25px", xs: "15px" },
            bgcolor: "white",
            borderRadius: { md: "0 0 5px 5px", xs: "4px" },
          }}
        >
          {status === "pending" && (
            <>{isMobile ? <MobileInputSkeleton /> : <TableSkeleton />}</>
          )}

          {status === "error" && (
            <Box sx={{ height: "calc(100vh - 150px)" }}>
              <ServerError message={error?.response?.data?.message} />
            </Box>
          )}

          {status === "success" && (
            <form>
              {/* ----------  Concern Person Information Start  ---------- */}

              <Typography
                sx={{ fontWeight: "500", color: "var(--dark-gray)", mb: 1.5 }}
              >
                Concern Person Information
              </Typography>
              <Grid container spacing={2.5}>
                {/* firstName */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("firstName", "First Name")}
                      value={singleStaff?.firstName}
                      sx={sharedInputStyles}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>

                {/* LastName */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("lastName", "Last Name")}
                      value={singleStaff?.lastName}
                      sx={sharedInputStyles}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>

                {/* gender */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("gender", "Gender")}
                      value={singleStaff?.gender}
                      sx={sharedInputStyles}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>

                {/* dateOfBirth */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("dateOfBirth", "Date of Birth")}
                      value={moment(singleStaff?.dateOfBirth).format(
                        "DD MMM YYYY"
                      )}
                      sx={sharedInputStyles}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>

                {/* Nationality */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("dateOfBirth", "Date of Birth")}
                      value={moment(singleStaff?.dateOfBirth).format(
                        "DD MMM YYYY"
                      )}
                      sx={sharedInputStyles}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>

                {/* Nationality */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <Nationality
                      nationality={singleStaff?.nationality || ""}
                      placeholder="Select Nationality"
                      disabled
                    />
                  </Box>
                </Grid>

                {/* Phone Number */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <Typography sx={phoneInputLabel}>Phone Number *</Typography>
                    <PhoneInput
                      inputStyle={{
                        width: "100%",
                        height: "100%",
                      }}
                      value={singleStaff?.phone || ""}
                      country={"bd"}
                      countryCodeEditable={false}
                      disabled
                    />
                  </Box>
                </Grid>

                {/* WhatsApp Number */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <Typography sx={phoneInputLabel}>
                      Whatsapp Number *
                    </Typography>
                    <PhoneInput
                      inputStyle={{ width: "100%", height: "100%" }}
                      value={singleStaff?.whatsappNumber}
                      country={"bd"}
                      countryCodeEditable={false}
                      label="WhatsApp Number"
                      disabled
                    />
                  </Box>
                </Grid>

                {/* Blood Group */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("bloodGroup", "Select Blood Group")}
                      value={singleStaff?.bloodGroup}
                      sx={sharedInputStyles}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* ----------  Concern Person Information End  ---------- */}

              {/* ----------  Present Address Information Start  ---------- */}

              <Typography sx={sectionTitle}>
                Present Address Information
              </Typography>

              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <Nationality
                      nationality={singleStaff?.preCountry}
                      placeholder="Select Country"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      value={singleStaff?.preAddress}
                      {...textFieldProps("preAddress", "Address")}
                      sx={sharedInputStyles}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* ----------  Present Address Information End  ---------- */}

              {/* ----------  Permanent Address Information Start  ---------- */}

              <Typography sx={sectionTitle}>
                Permanent Address Information
              </Typography>

              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <Nationality
                      nationality={singleStaff?.parCountry}
                      placeholder="Select Country"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      value={singleStaff?.parAddress}
                      {...textFieldProps("parAddress", "Address")}
                      sx={sharedInputStyles}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* ----------  Present Address Information End  ---------- */}

              {/* ----------  Offial Information Start  ---------- */}

              <Typography sx={sectionTitle}>Official Information</Typography>

              <Grid container spacing={2.5}>
                {/* Department */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      value={singleStaff?.department}
                      {...textFieldProps("department", "Department")}
                      sx={sharedInputStyles}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>

                {/* Designation */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      value={singleStaff?.designation}
                      {...textFieldProps("designation", "Designation")}
                      sx={sharedInputStyles}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>

                {/* Phone no */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <Typography sx={phoneInputLabel}>Phone Number *</Typography>
                    <PhoneInput
                      inputStyle={{
                        width: "100%",
                        height: "100%",
                      }}
                      country={"bd"}
                      countryCodeEditable={false}
                      value={singleStaff?.officePhone}
                      disabled
                    />
                  </Box>
                </Grid>

                {/* PBX */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      value={singleStaff?.pbx}
                      {...textFieldProps("pbx", "PBX")}
                      sx={sharedInputStyles}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>

                {/* Email */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("officeEmail", "Email", "email")}
                      value={singleStaff?.officeEmail}
                      sx={sharedInputStyles}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* ----------  Login Information End  ---------- */}

              {/* ----------  Documents Start  ---------- */}

              <Typography sx={sectionTitle}>Document</Typography>

              <Grid container spacing={2.5}>
                {reqDocFields?.map((reqDoc, index) => (
                  <Grid key={index} item xs={12} sm={6} md={4}>
                    <Box sx={{ position: "relative" }}>
                      <FileUpload
                        id={index}
                        label={reqDoc?.label}
                        onFileChange={(file) => {}}
                        previewImg={singleStaff?.[reqDoc?.name]}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* ----------  Documents End  ---------- */}

              {/* ----------  Emergency Contact Start  ---------- */}
              <Typography sx={{ ...sectionTitle }}>
                Emergency Contact
              </Typography>

              <Grid container spacing={2.5}>
                {/* emg Name */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("emgName", "Name")}
                      sx={sharedInputStyles}
                      value={singleStaff?.emgName}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>

                {/* Emg Gender */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("emgGender", "Select Gender")}
                      sx={sharedInputStyles}
                      value={singleStaff?.emgGender}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>

                {/* Emg Relation */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("emgRelation", "Relation")}
                      sx={sharedInputStyles}
                      value={singleStaff?.emgRelation}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>

                {/* Emg Address */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("emgAddress", "Address")}
                      sx={sharedInputStyles}
                      value={singleStaff?.emgAddress}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>

                {/* Phone */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <Typography sx={phoneInputLabel}>Phone Number *</Typography>
                    <PhoneInput
                      inputStyle={{
                        width: "100%",
                        height: "100%",
                      }}
                      value={singleStaff?.emgPhoneNumber}
                      country={"bd"}
                      countryCodeEditable={false}
                      disabled
                    />
                  </Box>
                </Grid>

                {/* Email */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("emgEmail", "Email", "email")}
                      sx={sharedInputStyles}
                      value={singleStaff?.emgEmail}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                </Grid>

                {nidInfo?.map((reqDoc, index) => (
                  <Grid key={index} item xs={12} sm={6} md={4}>
                    <Box sx={{ position: "relative" }}>
                      <FileUpload
                        id={index}
                        label={reqDoc?.label}
                        onFileChange={(file) => {}}
                        previewImg={singleStaff?.[reqDoc?.name]}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* ----------  Emergency Contact End  ---------- */}

              {/* ----------  Login Information Start  ---------- */}

              <Typography sx={sectionTitle}>Login Information</Typography>

              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("email", "Email", "email")}
                      sx={sharedInputStyles}
                      value={singleStaff?.email}
                      disabled
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* ----------  Login Information End  ---------- */}
            </form>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const reqDocFields = [
  {
    label: "Concern Photo",
    name: "photo",
  },
  {
    label: "Concern NID Front",
    name: "nidFront",
  },
  {
    label: "Concern NID Back",
    name: "nidBack",
  },
  {
    label: "Utilities Bill Copy",
    name: "utilitiesBill",
  },
  {
    label: "CV",
    name: "cv",
  },
];

const nidInfo = [
  {
    label: "Emergency NID Front",
    name: "emgNidFront",
  },
  {
    label: "Emergency NID Back",
    name: "emgNidBack",
  },
];

export default StaffDetails;
