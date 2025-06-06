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
import Select from "react-select";
import { useAuth } from "../../../context/AuthProvider";
import useToast from "../../../hook/useToast";
import { sharedInputStyles } from "../../../shared/common/styles";
import { calculateAge } from "../../../utils/calculateAge";
import { getAgeCategoryFromDOB } from "../../../utils/getAgeCategoryFromDB";
import { getPrefixesData } from "../../../utils/getPrefixs";
import CustomToast from "../../Alert/CustomToast";
import CustomCalendar from "../../CustomCalendar/CustomCalendar";
import PassportScanError from "../../Error/PassportScanError";
import { options } from "../../Register/Nationality";
import { customStyles } from "../../AirBooking/PassengerBox";
import ClientPassportFileUpload from "./ClientPassportFileUpload";

const initialState = {
  firstName: "",
  lastName: "",
  passportNation: "",
  dateOfBirth: "",
  gender: "",
  passportNumber: "",
  passportExpire: "",
  passportImage: null,
  nickName: "",
  email: "",
  phone: "880",
};

const ClientPassportScan = ({
  open,
  handleClose,
  departureDate,
  setConcernPerson,
}) => {
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
        if (Object.values(data?.data?.[0]).every((value) => value == null)) {
          setError(true);
          setIsNotEquals(
            Object.values(data?.data?.[0]).every((value) => value == null)
              ? true
              : false
          );
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
    return ["MR", "MS", "MASTER", "MISS"];
  };

  const handleClearError = () => {
    setError(false);
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

  const getPaxType = getAgeCategoryFromDOB(formData?.dateOfBirth);
  const getAge = calculateAge(formData?.dateOfBirth);
  const getPrefixe = getPrefixesData(getPaxType, formData?.gender, getAge);

  useEffect(() => {
    setFormData(initialState);
  }, [passportFileBlob]);

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
            Scan Client Passport
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
                    border: "2px solid var(--border)",
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
                    p: 3,
                    mt: 3,
                  }}
                >
                  <ClientPassportFileUpload
                    id="passportScanCopy"
                    onFileChange={(file) => {
                      handleFileChange(file, "passport");
                    }}
                    isLoading={status === "pending"}
                    preview={passportFileBlob || formData?.passportImage}
                    setPassportFileBlob={setPassportFileBlob}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={7.5}>
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
                      onChange={(selectedOption) => {
                        setFormData((prevState) => ({
                          ...prevState,
                          passportNation: selectedOption?.name || null,
                        }));
                      }}
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
                <Box
                  sx={{
                    border: "2px solid var(--border)",
                    height: "400px",
                    width: {
                      xs: "100%",
                      md: "90%",
                    },
                    ml: "auto",
                    borderRadius: "7px",
                    p: 3,
                    mt: 3,
                  }}
                >
                  <ClientPassportFileUpload
                    id="passportScanCopy"
                    onFileChange={(file) => {
                      handleFileChange(file, "passport");
                    }}
                    isLoading={status === "pending"}
                    preview={passportFileBlob || formData?.passportImage}
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
                    onClick={() => {
                      handleClose();
                      setPassportFileBlob(null);
                      setConcernPerson(formData);
                    }}
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
                      CONFIRM PASSENGER INFORMATION
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

export default ClientPassportScan;
