import CloseIcon from "@mui/icons-material/Close";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import {
  Box,
  Button,
  ClickAwayListener,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import CustomAlert from "../../../../component/Alert/CustomAlert";
import CustomLoadingAlert from "../../../../component/Alert/CustomLoadingAlert";
import CustomToast from "../../../../component/Alert/CustomToast";
import ErrorDialog from "../../../../component/Dialog/ErrorDialog";
import { regTitle } from "../../../../component/Register/GeneraInfo";
import Nationality from "../../../../component/Register/Nationality";
import { useAuth } from "../../../../context/AuthProvider";
import useToast from "../../../../hook/useToast";
import { textFieldProps } from "../../../../shared/common/functions";
import {
  depositBtn,
  phoneInputLabel,
  registrationErrText,
  sharedInputStyles,
} from "../../../../shared/common/styles";
import useWindowSize from "../../../../shared/common/useWindowSize";

const CompanyAgencyInfo = ({ agentProfile, isEditable, refetch }) => {
  const { isMobile } = useWindowSize();
  const [openCal, setOpenCal] = useState(false);
  const [editable, setEditable] = useState(false);
  const { agentToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const [agencyDetails, setAgencyDetails] = useState({
    employeeCount: "",
    email: "",
    phoneNumber: "",
    whatsappNumber: "",
    // division: "",
    // district: "",
    // updazila: "",
    // postalcode: "",
    // address: "",
  });

  const errors = {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgencyDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setShowErrorDialog(true);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    const body = Object.fromEntries(
      Object.entries(agencyDetails).filter(([key, value]) => value !== "")
    );

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/user/agent/agency-info`;

    try {
      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? you want to update Agency Information?",
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await axios.patch(url, body, {
          headers: {
            Authorization: `Bearer ${agentToken}`,
            "Content-Type": "application/json",
          },
        });

        const responseData = response?.data;
        if (responseData?.success === true) {
          refetch();
          setIsLoading(false);
          showToast("success", response?.data?.message);
          setEditable(false);
        }
      }
    } catch (e) {
      setIsLoading(false);
      showToast("error", e?.response?.data?.message);
      console.error(e.message);
    }
  };

  const handleClose = () => {
    setShowErrorDialog(false);
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 300px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: !isMobile && "center",
            mt: 4,
            flexDirection: {
              xs: "column",
              lg: "row",
              md: "row",
              sm: "row",
            },
            gap: { xs: 1.3, lg: "0px" },
            mb: { xs: 2, lg: 0, md: 0, sm: 0 },
          }}
        >
          <Typography sx={{ ...regTitle, mt: 0 }}>
            {agentProfile?.currentData?.agencyInformation?.agencyName} Agency
            Information
          </Typography>
          {editable ? (
            <Typography
              onClick={() => setEditable(!editable)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "4px",
                cursor: "pointer",
                color: "white",
                bgcolor: "var(--primary-color)",
                px: 1,
                borderRadius: "3px",
                width: "130px",
              }}
            >
              <span style={{ paddingTop: "3px", fontSize: "13px" }}>
                {!isMobile && "Click to "} Close
              </span>
              <CloseIcon sx={{ p: 0.25 }} />
            </Typography>
          ) : (
            isEditable && (
              <Typography
                onClick={() => setEditable(!editable)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "4px",
                  cursor: "pointer",
                  color: "white",
                  bgcolor: "var(--primary-color)",
                  px: 1,
                  borderRadius: "3px",
                  width: "130px",
                }}
              >
                <span style={{ paddingTop: "3px", fontSize: "13px" }}>
                  {!isMobile && "Click to "} Update
                </span>
                <EditCalendarIcon sx={{ p: 0.25 }} />
              </Typography>
            )
          )}
        </Box>

        <Box>
          <Grid container spacing={3} mt={0}>
            <Grid item md={4} sm={6} xs={12}>
              <ClickAwayListener
                onClickAway={() => openCal && setOpenCal(false)}
              >
                <Box>
                  <TextField
                    value={moment(
                      agentProfile?.currentData?.agencyInformation
                        ?.establishedDate
                    ).format("DD MMMM YYYY")}
                    {...textFieldProps("establishedDate", "Established Date")}
                    sx={sharedInputStyles}
                    disabled={true}
                  />
                </Box>
              </ClickAwayListener>
            </Grid>

            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="small" sx={sharedInputStyles}>
                  <InputLabel id="employeeCount-select-label">
                    Employee Count
                  </InputLabel>
                  <Select
                    labelId="employeeCount-select-label"
                    defaultValue={
                      agentProfile?.currentData?.agencyInformation
                        ?.employeeCount
                    }
                    name="employeeCount"
                    label="Employee Count"
                    MenuProps={{ disableScrollLock: true }}
                    onChange={handleChange}
                    disabled={!editable}
                  >
                    <MenuItem value="0-10">0-10</MenuItem>
                    <MenuItem value="10-25">10-25</MenuItem>
                    <MenuItem value="25-50">25-50</MenuItem>
                    <MenuItem value="50-100">50-100</MenuItem>
                    <MenuItem value="100-200">100-200</MenuItem>
                    <MenuItem value="200+">200+</MenuItem>
                  </Select>
                </FormControl>
                {agentProfile?.updatedData?.agencyInformation
                  ?.employeeCount && (
                  <span
                    style={{ ...registrationErrText, color: "var(--green)" }}
                  >
                    Already in update request
                  </span>
                )}
              </Box>
            </Grid>

            <Grid item md={4} sm={6} xs={12}>
              <Box
                sx={{
                  position: "relative",
                  pointerEvents: editable ? "auto" : "none",
                  opacity: editable ? 1 : 0.5,
                }}
              >
                <Nationality
                  nationality={
                    agentProfile?.currentData?.agencyInformation
                      ?.agencyInternationalAddressRelations
                      ? agentProfile?.currentData?.agencyInformation
                          ?.agencyInternationalAddressRelations
                          ?.internationalAddress?.country
                      : agentProfile?.currentData?.agencyInformation
                          ?.agencyBangladeshAddressRelations
                          ?.bangladeshAddressAddress?.country
                  }
                  placeholder={"Select Country"}
                  isDisabled={isEditable}
                />
              </Box>
            </Grid>

            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={
                    agentProfile?.currentData?.agencyInformation
                      ?.agencyBangladeshAddressRelations
                      ? agentProfile?.currentData?.agencyInformation
                          ?.agencyBangladeshAddressRelations?.bangladeshAddress
                          ?.division
                      : agentProfile?.currentData?.agencyInformation
                          ?.agencyInternationalAddressRelations
                          ?.internationalAddress?.state
                  }
                  {...textFieldProps(
                    "division",
                    agentProfile?.currentData?.agencyInformation
                      ?.agencyBangladeshAddressRelations
                      ? "Division"
                      : "State"
                  )}
                  onChange={handleChange}
                  sx={{ sharedInputStyles }}
                  disabled
                />
              </Box>
            </Grid>

            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={
                    agentProfile?.currentData?.agencyInformation
                      ?.agencyBangladeshAddressRelations
                      ? agentProfile?.currentData?.agencyInformation
                          ?.agencyBangladeshAddressRelations?.bangladeshAddress
                          ?.district
                      : agentProfile?.currentData?.agencyInformation
                          ?.agencyInternationalAddressRelations
                          ?.internationalAddress?.cityName
                  }
                  {...textFieldProps(
                    "district",
                    agentProfile?.currentData?.agencyInformation
                      ?.agencyBangladeshAddressRelations
                      ? "District"
                      : "City Name"
                  )}
                  onChange={handleChange}
                  sx={{ sharedInputStyles }}
                  disabled
                />
              </Box>
            </Grid>

            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={
                    agentProfile?.currentData?.agencyInformation
                      ?.agencyBangladeshAddressRelations
                      ? agentProfile?.currentData?.agencyInformation
                          ?.agencyBangladeshAddressRelations?.bangladeshAddress
                          ?.upazila
                      : agentProfile?.currentData?.agencyInformation
                          ?.agencyInternationalAddressRelations
                          ?.internationalAddress?.policeStationZone
                  }
                  {...textFieldProps(
                    "upazila",
                    agentProfile?.currentData?.agencyInformation
                      ?.agencyBangladeshAddressRelations
                      ? "Upazila"
                      : "Police Station Zone"
                  )}
                  onChange={handleChange}
                  sx={{ sharedInputStyles }}
                  disabled
                />
              </Box>
            </Grid>

            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={
                    agentProfile?.currentData?.agencyInformation
                      ?.agencyBangladeshAddressRelations
                      ? agentProfile?.currentData?.agencyInformation
                          ?.agencyBangladeshAddressRelations?.bangladeshAddress
                          ?.postalCode
                      : agentProfile?.currentData?.agencyInformation
                          ?.agencyInternationalAddressRelations
                          ?.internationalAddress?.postalCode
                  }
                  {...textFieldProps(
                    "postalcode",
                    agentProfile?.currentData?.agencyInformation
                      ?.agencyBangladeshAddressRelations
                      ? "Postal Code"
                      : "Postal Code"
                  )}
                  onChange={handleChange}
                  sx={{ sharedInputStyles }}
                  disabled
                />
              </Box>
            </Grid>

            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={
                    agentProfile?.currentData?.agencyInformation
                      ?.agencyBangladeshAddressRelations
                      ? agentProfile?.currentData?.agencyInformation
                          ?.agencyBangladeshAddressRelations?.bangladeshAddress
                          ?.address
                      : agentProfile?.currentData?.agencyInformation
                          ?.agencyInternationalAddressRelations
                          ?.internationalAddress?.address
                  }
                  {...textFieldProps(
                    "address",
                    agentProfile?.currentData?.agencyInformation
                      ?.agencyBangladeshAddressRelations
                      ? "Address"
                      : "Address"
                  )}
                  onChange={handleChange}
                  sx={{ sharedInputStyles }}
                  disabled
                />
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={0}>
            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  defaultValue={
                    agentProfile?.currentData?.agencyInformation?.email
                  }
                  {...textFieldProps("email", "Office Email Address", "email")}
                  onChange={handleChange}
                  sx={sharedInputStyles}
                  disabled={!editable}
                />

                <span style={registrationErrText}>{errors?.email}</span>
              </Box>

              {agentProfile?.updatedData?.agencyInformation?.email && (
                <span style={{ color: "var(--green)", fontSize: "11px" }}>
                  Already in update request
                </span>
              )}
            </Grid>

            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <Typography sx={phoneInputLabel}>
                  Office Phone Number *
                </Typography>
                <PhoneInput
                  inputStyle={{ width: "100%", height: "100%" }}
                  value={
                    agentProfile?.currentData?.agencyInformation?.phoneNumber
                  }
                  country={"bd"}
                  disabled={!editable}
                  onChange={(phone) =>
                    handleChange({
                      target: { name: "phoneNumber", value: phone },
                    })
                  }
                />

                <span style={registrationErrText}>{errors?.phoneNumber}</span>
                {agentProfile?.updatedData?.agencyInformation?.phoneNumber && (
                  <span style={{ color: "var(--green)", fontSize: "11px" }}>
                    Already in update request
                  </span>
                )}
              </Box>
            </Grid>

            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <Typography sx={phoneInputLabel}>Whatsapp Number *</Typography>
                <PhoneInput
                  inputStyle={{ width: "100%", height: "100%" }}
                  value={
                    agentProfile?.currentData?.agencyInformation?.whatsappNumber
                  }
                  country={"bd"}
                  disabled={!editable}
                  onChange={(phone) =>
                    handleChange({
                      target: { name: "whatsappNumber", value: phone },
                    })
                  }
                  label="WhatsApp Number"
                />

                <span style={registrationErrText}>
                  {errors?.whatsappNumber}
                </span>
                {agentProfile?.updatedData?.agencyInformation
                  ?.whatsappNumber && (
                  <span style={{ color: "var(--green)", fontSize: "11px" }}>
                    Already in update request
                  </span>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Button
        type="submit"
        disabled={isLoading}
        sx={{
          ...depositBtn,
          display: editable ? "flex" : "none",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: isLoading ? "8px" : "0",
          textAlign: "left",
          paddingRight: isLoading ? "16px" : "0",
        }}
        onClick={handleSubmit}
      >
        Update agency Information
      </Button>

      <CustomLoadingAlert
        open={isLoading}
        text={"We Are Processing Your Update Request"}
      />
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />

      {showErrorDialog && (
        <ErrorDialog
          errors={errors}
          data={Object.fromEntries(
            Object.entries(agencyDetails).filter(([key, value]) => value !== "")
          )}
          handleClose={handleClose}
          onSubmit={onSubmit}
          type={"Preview And Confirm"}
        />
      )}
    </Box>
  );
};

export default CompanyAgencyInfo;
