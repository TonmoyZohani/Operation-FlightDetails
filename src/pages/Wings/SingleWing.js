import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React from "react";
import PhoneInput from "react-phone-input-2";
import { useLocation } from "react-router-dom";
import FileUpload from "../../component/AirBooking/FileUpload";
import ServerError from "../../component/Error/ServerError";
import MobileHeader from "../../component/MobileHeader/MobileHeader";
import Nationality from "../../component/Register/Nationality";
import TableSkeleton from "../../component/SkeletonLoader/TableSkeleton";
import { useAuth } from "../../context/AuthProvider";
import PageTitle from "../../shared/common/PageTitle";
import { reqDocFields, textFieldProps } from "../../shared/common/functions";
import {
  phoneInputLabel,
  registrationErrText,
  sharedInputStyles,
} from "../../shared/common/styles";
import useWindowSize from "../../shared/common/useWindowSize";
import { MobileInputSkeleton, sectionTitle } from "../Staff/AddStaff";

const SingleWing = () => {
  const { state } = useLocation();
  const { agentToken } = useAuth();
  const errors = {};
  const { isMobile } = useWindowSize();

  //TODO:: Fetching data from api
  const {
    data: singleWing,
    error,
    status,
  } = useQuery({
    queryKey: ["singleWing"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/agent/wing/${state?.id}`,
        {
          headers: { Authorization: `Bearer ${agentToken}` },
        }
      );
      return data?.data;
    },
  });

  return (
    <Box sx={{ borderRadius: { md: "10px" } }}>
      {isMobile ? (
        <>
          <MobileHeader
            title={"Branch Details"}
            subTitle={`${state?.firstName} ${state?.lastName}`}
            labelValue={state?.companyName}
          />
        </>
      ) : (
        <PageTitle title={"Branch Details"} />
      )}

      <Box
        sx={{
          mt: { lg: "0", xs: 5 },
          width: {
            xs: "90%",
            lg: "100%",
          },
          mx: "auto",
        }}
      >
        <Box
          sx={{
            px: { md: "22px", xs: "15px" },
            py: { md: "25px", xs: "15px" },
            bgcolor: "white",
            borderRadius: { lg: "0 0 5px 5px", xs: "4px" },
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
                sx={{ fontWeight: "500", color: "var(--dark-gray)", mb: 2 }}
              >
                Concern Person Information
              </Typography>
              <Grid container spacing={2.5}>
                {/* firstName */}
                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      value={singleWing?.firstName}
                      {...textFieldProps("firstName", "First Name")}
                      sx={sharedInputStyles}
                      InputLabelProps={{ shrink: true }}
                      disabled
                    />
                  </Box>
                </Grid>

                {/* LastName */}
                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      value={singleWing?.lastName}
                      {...textFieldProps("lastName", "Last Name")}
                      sx={sharedInputStyles}
                      InputLabelProps={{ shrink: true }}
                      disabled
                    />
                  </Box>
                </Grid>

                {/* gender */}
                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <FormControl fullWidth size="small" sx={sharedInputStyles}>
                      <InputLabel id="gender-select-label">
                        Select Gender *
                      </InputLabel>
                      <Select
                        labelId="gender-select-label"
                        value={singleWing?.gender || ""}
                        {...textFieldProps("gender", "Select Gender")}
                        MenuProps={{ disableScrollLock: true }}
                        disabled
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                {/* dob */}
                <Grid item md={4} sm={6} xs={12}>
                  <Box>
                    <TextField
                      value={
                        singleWing?.dob &&
                        moment(singleWing?.dob, "YYYY-MM-DD").format(
                          "DD MMMM YYYY"
                        )
                      }
                      {...textFieldProps("dob", "Date of Birth")}
                      sx={sharedInputStyles}
                      InputLabelProps={{ shrink: true }}
                      disabled
                    />
                  </Box>
                </Grid>

                {/* Email */}
                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      value={singleWing?.email}
                      {...textFieldProps("personalEmail", "Personal Email")}
                      sx={sharedInputStyles}
                      InputLabelProps={{ shrink: true }}
                      disabled
                    />
                  </Box>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <Box
                    sx={{
                      position: "relative",
                      pointerEvents: "none",
                    }}
                  >
                    <Nationality placeholder={singleWing?.nationality} />
                  </Box>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <Typography sx={phoneInputLabel}>Phone Number *</Typography>
                    <PhoneInput
                      inputStyle={{
                        width: "100%",
                        height: "100%",
                      }}
                      value={singleWing?.phone}
                      country={"bd"}
                      countryCodeEditable={false}
                      disabled
                    />
                  </Box>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <Typography sx={phoneInputLabel}>
                      Whatsapp Number *
                    </Typography>
                    <PhoneInput
                      inputStyle={{ width: "100%", height: "100%" }}
                      value={singleWing?.whatsappNumber}
                      country={"bd"}
                      countryCodeEditable={false}
                      label="WhatsApp Number"
                      disabled
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* ----------  Concern Person Information End  ---------- */}

              {/* ----------  Branch Information Start  ---------- */}

              <Typography sx={sectionTitle}>Company Information</Typography>

              <Grid container spacing={2.5}>
                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <FormControl fullWidth size="small" sx={sharedInputStyles}>
                      <InputLabel id="wingType-select-label">Type</InputLabel>
                      <Select
                        labelId="wingType-select-label"
                        value={
                          singleWing?.wingType === "sub-agent"
                            ? "subAgent"
                            : "branch"
                        }
                        name="wingType"
                        label="Select Wing Type"
                        {...textFieldProps("wingType", "Type")}
                        MenuProps={{ disableScrollLock: true }}
                        disabled
                      >
                        <MenuItem value="branch">Branch</MenuItem>
                        <MenuItem value="subAgent">Sub Agent</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative", pointerEvents: "none" }}>
                    <Nationality placeholder={singleWing?.country} />
                  </Box>
                </Grid>

                {singleWing?.country.toLowerCase() === "bangladesh" && (
                  <Grid item md={4} sm={6} xs={12}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        value={singleWing?.division}
                        {...textFieldProps("division", "Division")}
                        sx={sharedInputStyles}
                        InputLabelProps={{ shrink: true }}
                        disabled
                      />
                    </Box>
                  </Grid>
                )}

                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    {singleWing?.country.toLowerCase() !== "bangladesh" ? (
                      <TextField
                        {...textFieldProps("city", "City Name")}
                        value={singleWing?.city || ""}
                        sx={sharedInputStyles}
                        InputLabelProps={{ shrink: true }}
                        disabled
                      />
                    ) : (
                      <TextField
                        value={singleWing?.district}
                        {...textFieldProps("district", "District")}
                        sx={sharedInputStyles}
                        InputLabelProps={{ shrink: true }}
                        disabled
                      />
                    )}
                  </Box>
                </Grid>
                {singleWing?.country.toLowerCase() === "bangladesh" && (
                  <Grid item md={4} sm={6} xs={12}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        value={singleWing?.upazilla}
                        {...textFieldProps("upazilla", "Upazilla")}
                        sx={sharedInputStyles}
                        InputLabelProps={{ shrink: true }}
                        disabled
                      />
                    </Box>
                  </Grid>
                )}
                {singleWing?.country.toLowerCase() === "bangladesh" && (
                  <Grid item md={4} sm={6} xs={12}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        value={singleWing?.postCode}
                        {...textFieldProps("postCode", "PostCode")}
                        sx={sharedInputStyles}
                        InputLabelProps={{ shrink: true }}
                        disabled
                      />
                    </Box>
                  </Grid>
                )}
                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      value={singleWing?.location}
                      {...textFieldProps("location", "Location")}
                      sx={sharedInputStyles}
                      InputLabelProps={{ shrink: true }}
                      disabled
                    />
                  </Box>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      value={singleWing?.contactEmail}
                      {...textFieldProps(
                        "contactEmail",
                        "Email",
                        "contactEmail"
                      )}
                      sx={sharedInputStyles}
                      InputLabelProps={{ shrink: true }}
                      disabled
                    />
                  </Box>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <Typography sx={phoneInputLabel}>Phone Number *</Typography>
                    <PhoneInput
                      inputStyle={{
                        width: "100%",
                        height: "100%",
                      }}
                      value={singleWing?.contactNumber}
                      country={"bd"}
                      countryCodeEditable={false}
                      disabled
                    />
                  </Box>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <Typography sx={phoneInputLabel}>
                      Whatsapp Number *
                    </Typography>
                    <PhoneInput
                      inputStyle={{ width: "100%", height: "100%" }}
                      value={singleWing?.contactWhatsappNumber}
                      country={"bd"}
                      countryCodeEditable={false}
                      disabled
                      label="WhatsApp Number"
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* ----------  Branch Information End  ---------- */}

              {/* ----------  Required Documents Start  ---------- */}

              <Typography sx={sectionTitle}>Documents</Typography>

              <Grid container spacing={2.5} mt={0}>
                {reqDocFields
                  ?.filter((item) =>
                    singleWing?.wingType === "branch"
                      ? item.name !== "tradeLicence" && item.name !== "logo"
                      : true
                  )
                  .map((reqDoc, index) => (
                    <Grid key={index} item md={4} sm={6} xs={12}>
                      <Box sx={{ position: "relative" }}>
                        <FileUpload
                          id={reqDoc?.id}
                          label={reqDoc?.name}
                          onFileChange={(file) =>
                            // handleFileChange(file, reqDoc?.name)
                            ""
                          }
                          previewImg={singleWing?.[reqDoc?.name]}
                        />

                        {reqDoc?.name && errors?.[reqDoc?.name] && (
                          <span style={registrationErrText}>
                            {errors[singleWing?.[reqDoc?.name]]}
                          </span>
                        )}
                      </Box>
                    </Grid>
                  ))}
              </Grid>

              {/* ----------  Required Documents End  ---------- */}

              {/* ----------  Login Information Start  ---------- */}

              <Typography sx={sectionTitle}>Login Information</Typography>

              <Grid container spacing={2.5}>
                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <Typography sx={phoneInputLabel}>Phone Number *</Typography>
                    <PhoneInput
                      inputStyle={{
                        width: "100%",
                        height: "100%",
                      }}
                      value={singleWing?.phone}
                      country={"bd"}
                      countryCodeEditable={false}
                      disabled
                    />
                  </Box>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      value={singleWing?.email}
                      {...textFieldProps("email", "Email", "email")}
                      sx={sharedInputStyles}
                      InputLabelProps={{ shrink: true }}
                      disabled
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

export default SingleWing;
