import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import {
  Alert,
  Box,
  Button,
  ClickAwayListener,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { addMonths } from "date-fns";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import { sharedInputStyles } from "../../shared/common/styles";
import { calculateAge } from "../../utils/calculateAge";
import { getAgeCategoryFromDOB } from "../../utils/getAgeCategoryFromDB";
import { getPrefixesData } from "../../utils/getPrefixs";
import {
  setPassengerDateOfBirth,
  setPassengerDateOfExpiry,
  setPassengerFirstName,
  setPassengerGender,
  setPassengerLastName,
  setPassengerPassportNation,
  setPassengerPassportNumber,
  setPassengerPrefix,
  setPassportScanValidate,
  setPreviewNull,
} from "../AirBooking/airbookingSlice";
import CustomAlert from "../Alert/CustomAlert";
import CustomToast from "../Alert/CustomToast";
import CustomCalendar from "../CustomCalendar/CustomCalendar";
import PassportScanError from "../Error/PassportScanError";
import { options } from "../Register/Nationality";
import PassportFileUpload from "./PassportFileUpload";
import { customStyles } from "../AirBooking/PassengerBox";

const genders = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const initialState = {
  firstName: "",
  lastName: "",
  passportNation: "",
  dateOfBirth: "",
  gender: "",
  passportNumber: "",
  passportExpire: "",
  passportImage: null,
};

const PassportScanModal = ({
  open,
  handleClose,
  index,
  paxType,
  handlePassportUploadClick,
  paxNo,
  departureDate,
}) => {
  const { passengerData } = useSelector((state) => state.flightBooking);
  const [formData, setFormData] = useState(initialState);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarExpireOpen, setCalendarExpireOpen] = useState(false);
  const [error, setError] = useState(false);
  const [isNotEquals, setIsNotEquals] = useState(false);
  const [passportFile, setPassportFile] = useState(null);
  const [passportFileBlob, setPassportFileBlob] = useState(null);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  let passportExpiry = addMonths(new Date(departureDate), 6);
  const { formDataHeader } = useAuth();
  const dispatch = useDispatch();

  const { mutate, status } = useMutation({
    mutationKey: ["passportScan"],
    mutationFn: async (data) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/analyze-image`,
          data,
          formDataHeader()
        );
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: (data, variables) => {
      if (data?.success) {
        const getPaxType = getAgeCategoryFromDOB(data?.data[0]?.dateOfBirth);
        if (paxType !== getPaxType) {
          setError(true);
          setIsNotEquals(paxType !== getPaxType ? true : false);
          setFormData(initialState);
        } else {
          setFormData((prevState) => ({
            ...prevState,
            ...data?.data[0],
          }));
        }
      } else {
        setError(true);
        setFormData(initialState);
      }
    },
    onError: (error) => {
      console.error(error, "error");
    },
  });

  const getPrefixes = (passengerType) => {
    if (passengerType?.toLowerCase() === "adult") {
      return ["MR", "MS"];
    } else {
      return ["MASTER", "MISS"];
    }
  };

  const handleClearError = () => {
    setError(false);
    setPassportFileBlob(null);
    dispatch(setPreviewNull());
  };

  const handleFileChange = (file) => {
    setPassportFile(file);
    setFormData(initialState);
    setPassportFileBlob(URL.createObjectURL(file));
    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    mutate(formData);
  };

  const handleCalendarOpen = () => {
    setCalendarOpen((prevCanlendarOpen) => !prevCanlendarOpen);
  };

  const handleCalendarExpireOpen = () => {
    setCalendarExpireOpen(
      (prevCanlendarExpireOpen) => !prevCanlendarExpireOpen
    );
  };

  const filterOption = (option, inputValue) => {
    return option.data.name.toLowerCase().includes(inputValue.toLowerCase());
  };

  const passengers = [
    ...passengerData?.adult,
    ...passengerData?.child,
    ...passengerData?.infant,
  ];

  const savePassengerData = async (
    passengerData,
    passengerType,
    index,
    file,
    paxNo
  ) => {
    const existingPassenger = passengers?.find(
      (p) =>
        p.firstName === passengerData.firstName ||
        p.lastName === passengerData.lastName ||
        p.passportNumber === passengerData.passportNumber
    );

    if (existingPassenger) {
      showToast("warning", "Passenger already exists");
      return;
    }

    // Check if any formData property is missing
    const missingFields = Object.entries(formData).filter(
      ([key, value]) => key !== "passportImage" && !value
    );

    if (missingFields.length > 0) {
      await CustomAlert({
        success: false,
        message: `The following fields are missing: ${missingFields
          .map(([key]) => key)
          .join(", ")}`,
      });
      return;
    }

    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? You want to save Passenger passport data.",
    });

    if (!result?.isConfirmed) {
      return;
    }

    const getPaxType = getAgeCategoryFromDOB(formData?.dateOfBirth);
    const getAge = calculateAge(formData?.dateOfBirth);
    const getPrefixe = getPrefixesData(getPaxType, formData?.gender, getAge);

    dispatch(
      setPassengerPrefix({
        passengerType: passengerType?.toLowerCase(),
        index: paxNo,
        prefix: getPrefixe,
      })
    );

    dispatch(
      setPassengerFirstName({
        passengerType: passengerType?.toLowerCase(),
        index: paxNo,
        firstName: passengerData?.firstName,
      })
    );

    dispatch(
      setPassengerLastName({
        passengerType: passengerType?.toLowerCase(),
        index: paxNo,
        lastName: passengerData?.lastName,
      })
    );

    dispatch(
      setPassengerGender({
        passengerType: passengerType?.toLowerCase(),
        index: paxNo,
        gender: passengerData?.gender,
      })
    );

    dispatch(
      setPassengerPassportNation({
        passengerType: passengerType?.toLowerCase(),
        index: paxNo,
        passportNation: {
          name: options?.find(
            (item) => item.code === passengerData?.passportNation?.slice(0, 2)
          )?.name,
          code: passengerData?.passportNation,
        },
      })
    );

    dispatch(
      setPassengerPassportNumber({
        passengerType: passengerType?.toLowerCase(),
        index: paxNo,
        passportNumber: passengerData?.passportNumber,
      })
    );

    const formattedDate = moment(passengerData?.dateOfBirth).format(
      "YYYY-MM-DD"
    );
    dispatch(
      setPassengerDateOfBirth({
        passengerType: passengerType?.toLowerCase(),
        index: paxNo,
        dateOfBirth: formattedDate,
      })
    );

    const formattedExpireDate = moment(passengerData?.passportExpire).format(
      "YYYY-MM-DD"
    );
    dispatch(
      setPassengerDateOfExpiry({
        passengerType: passengerType?.toLowerCase(),
        index: paxNo,
        passportExpire: formattedExpireDate,
      })
    );
    dispatch(
      setPassportScanValidate({
        passengerType: passengerType?.toLowerCase(),
        index: paxNo,
        passportScanValidate: true,
      })
    );

    handlePassportUploadClick(file, passengerType, index, paxNo);
    handleClose();
    setFormData(initialState);
    setPassportFileBlob(null);
    // dispatch(setPreviewNull());
  };

  const getPaxType = getAgeCategoryFromDOB(formData?.dateOfBirth);
  const getAge = calculateAge(formData?.dateOfBirth);
  const getPrefixe = getPrefixesData(getPaxType, formData?.gender, getAge);

  useEffect(() => {
    if (passengerData && paxType && paxNo !== undefined) {
      const passengerType = paxType.toLowerCase();

      const selectedPassenger = passengerData[passengerType]?.[paxNo];

      if (selectedPassenger) {
        setFormData({
          firstName: selectedPassenger.firstName || "",
          lastName: selectedPassenger.lastName || "",
          gender: selectedPassenger.gender || "",
          dateOfBirth: selectedPassenger.dateOfBirth || "",
          passportNation: selectedPassenger.passportNation?.code || "",
          passportNumber: selectedPassenger.passportNumber || "",
          passportExpire: selectedPassenger.passportExpire || "",
          passportImage:
            selectedPassenger.passportImage instanceof Blob
              ? URL.createObjectURL(selectedPassenger.passportImage)
              : null, // Ensure valid Blob before creating URL
        });
      } else {
        setFormData(initialState);
      }
    }
  }, [passengerData, paxType, paxNo, passportFileBlob]);

  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: {
              xs: 1.5,
              md: 3,
            },
            borderRadius: 2,
            width: { xs: "90%", md: "1000px" },
            height: { xs: "90vh", lg: "auto" },
            overflowY: "auto",
          }}
        >
          <Typography sx={{ mb: 1, fontSize: "1rem", color: "var(--black)" }}>
            Scan Passenger Passport [ {paxType} 0{index} ]
          </Typography>
          <Alert
            severity="warning"
            icon={<ErrorIcon sx={{ color: "#E77D00", fontSize: "1.5rem" }} />}
            sx={{
              fontSize: "0.8rem",
              bgcolor: "#FFF6EB",
              color: "#E77D00",
              py: 1,
              px: 2,
              borderRadius: "5px",
              fontWeight: 400,
              border: "1px solid #E77D00",
              display: {
                xs: "none",
                md: "flex",
              },
            }}
          >
            <span style={{ fontWeight: 700 }}>Passport Scan:</span> We do our
            best to accurately scan passport details, some information might not
            be captured perfectly. After scanning, please review all details
            carefully and make any necessary corrections before confirming the
            passenger. Once the booking is completed, passenger information
            cannot be changed.
            <br />
            <span>
              <span style={{ fontWeight: 700 }}>Note:</span> Your passport image
              must clearly show the MRZ{" "}
              <span style={{ fontWeight: 700 }}>(Machine Readable Zone)</span>{" "}
              code for accurate scanning.
            </span>
          </Alert>
          {error ? (
            <PassportScanError
              handleClearError={handleClearError}
              handleClose={handleClose}
              setError={setError}
              isNotEquals={isNotEquals}
              setPassportFileBlob={setPassportFileBlob}
            />
          ) : (
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                md={4.5}
                sx={{
                  height: "100%",
                  display: {
                    xs: "block",
                    sm: "none",
                  },
                }}
              >
                <Box
                  sx={{
                    height: {
                      xs: "400px",
                      sm: "250px",
                      md: "100%",
                    },
                    width: {
                      xs: "100%",
                      md: "90%",
                    },
                    ml: "auto",
                    borderRadius: "7px",
                    p: { lg: 3, md: 3, sm: 0, xs: 0 },
                    mt: { lg: 3, md: 3, sm: 0, xs: 0 },
                  }}
                >
                  <PassportFileUpload
                    id="passportScanCopy"
                    onFileChange={(file) => {
                      handleFileChange(file, "passport");
                    }}
                    isLoading={status === "pending"}
                    preview={passportFileBlob || formData?.passportImage}
                    passengerType={paxType}
                    index={paxNo}
                    setPassportFileBlob={setPassportFileBlob}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={7.5}
                sx={{ mt: { lg: 0, md: 0, sm: 5, xs: 5 } }}
              >
                <Grid container spacing={3}>
                  {/* Prefix here */}
                  <Grid item lg={12} xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mt: {
                          xs: 1,
                          md: 3,
                        },
                      }}
                    >
                      {getPrefixes(getPaxType)?.map((prefix, index) => (
                        <Box
                          key={index}
                          sx={{
                            py: 0.4,
                            px: 2,
                            borderRadius: "3px",
                            border: "1px solid var(--primary-color)",
                            color:
                              getPrefixe === prefix
                                ? "var(--white)"
                                : "var(--primary-color)",
                            transition: "background-color 0.3s ease",
                            cursor: "pointer",
                            bgcolor:
                              getPrefixe === prefix
                                ? "var(--primary-color)"
                                : "",
                            "&:hover": {
                              bgcolor: "var(--primary-color)",
                              color: "#fff",
                            },
                          }}
                        >
                          {prefix}
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                  {/* First Name */}
                  <Grid item md={6} xs={12}>
                    <TextField
                      id="firstName"
                      name="firstName"
                      label="First Name"
                      variant="outlined"
                      size="small"
                      type="text"
                      sx={sharedInputStyles}
                      value={formData?.firstName?.toUpperCase() || ""}
                      focused={!!formData?.firstName}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          firstName: e.target.value.toUpperCase(),
                        }))
                      }
                    />
                  </Grid>
                  {/* Last Name */}
                  <Grid item md={6} xs={12}>
                    <TextField
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      variant="outlined"
                      size="small"
                      type="text"
                      sx={sharedInputStyles}
                      value={formData?.lastName?.toUpperCase() || ""}
                      focused={!!formData?.lastName}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          lastName: e.target.value.toUpperCase(),
                        }))
                      }
                    />
                  </Grid>
                  {/* Gender */}
                  <Grid item md={6} xs={12}>
                    <Select
                      value={
                        formData.gender
                          ? { value: formData.gender, label: formData.gender }
                          : null
                      }
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                      ]}
                      isSearchable={true}
                      isMulti={false}
                      placeholder="SELECT GENDER"
                      styles={customStyles}
                      onChange={(selectedOption) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          gender: selectedOption?.value || null,
                        }))
                      }
                    />
                  </Grid>
                  {/* Date of Birth */}
                  <Grid item md={6} xs={12} sx={{ position: "relative" }}>
                    <TextField
                      id="dateOfBirth"
                      name="dateOfBirth"
                      label="Date Of Birth"
                      variant="outlined"
                      size="small"
                      type="text"
                      sx={sharedInputStyles}
                      onClick={handleCalendarOpen}
                      value={
                        formData?.dateOfBirth
                          ? moment(formData?.dateOfBirth).format("DD MMM YYYY")
                          : ""
                      }
                      focused={!!formData?.dateOfBirth}
                      placeholder="Enter or select a date"
                    />
                    {calendarOpen && (
                      <ClickAwayListener
                        onClickAway={() => setCalendarOpen((prev) => !prev)}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: "100%",
                            left: 12,
                            mx: 1,
                            zIndex: 10,
                            background: "var(--white)",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            flexFlow: "column nowrap",
                          }}
                          className="new-dashboard-calendar"
                        >
                          <CustomCalendar
                            date={new Date()}
                            months={1}
                            title={"Date of birth"}
                            maxDate={new Date()}
                            handleChange={(date) => {
                              setFormData((prevState) => ({
                                ...prevState,
                                dateOfBirth: moment(date).format("YYYY-MM-DD"),
                              }));
                              handleCalendarOpen();
                            }}
                          />
                        </Box>
                      </ClickAwayListener>
                    )}
                  </Grid>

                  {/* Nationality */}
                  <Grid item md={6} xs={12}>
                    <Select
                      value={
                        formData?.passportNation
                          ? options.find(
                              (option) =>
                                option.code ===
                                formData?.passportNation?.slice(0, 2)
                            )
                          : null
                      }
                      onChange={(selectedOption) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          passportNation: selectedOption?.code || null,
                        }))
                      }
                      options={options}
                      isSearchable={true}
                      isMulti={false}
                      placeholder="SELECT NATIONALITY"
                      styles={customStyles}
                      filterOption={filterOption}
                    />
                  </Grid>
                  {/* Passport No. */}
                  <Grid item md={6} xs={12}>
                    <TextField
                      id="passportNo"
                      name="passportNo"
                      label="Passport No"
                      variant="outlined"
                      size="small"
                      type="text"
                      sx={sharedInputStyles}
                      value={formData?.passportNumber || ""}
                      focused={!!formData?.passportNumber}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          passportNumber: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  {/* Passport Expire Date */}
                  <Grid item md={6} xs={12} sx={{ position: "relative" }}>
                    <TextField
                      id="passportExpire"
                      name="passportExpire"
                      label="Expire Date"
                      variant="outlined"
                      size="small"
                      type="text"
                      sx={sharedInputStyles}
                      onClick={handleCalendarExpireOpen}
                      value={
                        formData?.passportExpire
                          ? moment(formData?.passportExpire).format(
                              "DD MMM YYYY"
                            )
                          : ""
                      }
                      focused={!!formData?.passportExpire}
                      placeholder="Enter or select an expiry date"
                    />

                    {calendarExpireOpen && (
                      <ClickAwayListener
                        onClickAway={() =>
                          setCalendarExpireOpen((prev) => !prev)
                        }
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: "-100%",
                            left: 12,
                            mx: 1,
                            zIndex: 10,
                            background: "var(--white)",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            flexFlow: "column nowrap",
                            borderRadius: "5px",
                          }}
                          className="new-dashboard-calendar"
                        >
                          <CustomCalendar
                            date={new Date(passportExpiry)}
                            months={1}
                            title={"Passport Expire"}
                            minDate={new Date()}
                            handleChange={(date) => {
                              setFormData((prevState) => ({
                                ...prevState,
                                passportExpire:
                                  moment(date).format("YYYY-MM-DD"),
                              }));
                              handleCalendarExpireOpen();
                            }}
                          />
                        </Box>
                      </ClickAwayListener>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              {/* passport file upload section */}
              <Grid
                item
                xs={12}
                sm={4.5}
                sx={{
                  height: "100%",
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                }}
              >
                <Box>
                  <PassportFileUpload
                    id="passportScanCopy"
                    onFileChange={(file) => {
                      handleFileChange(file, "passport");
                    }}
                    isLoading={status === "pending"}
                    preview={passportFileBlob || formData?.passportImage}
                    passengerType={paxType}
                    index={paxNo}
                    setPassportFileBlob={setPassportFileBlob}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      width: "100%",
                      height: "45px",
                      display: "flex",
                      justifyContent: "start",
                      bgcolor: "var(--primary-color)",
                      ":hover": {
                        bgcolor: "var(--primary-color)",
                      },
                    }}
                    onClick={() =>
                      savePassengerData(
                        formData,
                        getPaxType,
                        index,
                        passportFile,
                        paxNo
                      )
                    }
                  >
                    <Typography
                      sx={{
                        textAlign: "left",
                        fontSize: {
                          xs: "0.7rem",
                          md: "1rem",
                        },
                      }}
                    >
                      <span style={{ fontWeight: 100 }}>CONFIRM PASSENGER</span>{" "}
                      {formData?.firstName} {formData?.lastName}
                      <span style={{ fontWeight: 100 }}> INFORMATION AS </span>
                      {paxType} {index}
                    </Typography>
                  </Button>
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      handleClose();
                      setPassportFileBlob(null);
                    }}
                    sx={{
                      bgcolor: "var(--black)",
                      color: "var(--white)",
                      height: "45px",
                      width: "45px",
                      borderRadius: "3px",
                      ":hover": {
                        bgcolor: "var(--black)",
                        color: "var(--white)",
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
        type="notification"
      />
    </>
  );
};

export default PassportScanModal;
