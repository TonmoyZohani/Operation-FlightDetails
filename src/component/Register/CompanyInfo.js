import {
  Box,
  Button,
  ClickAwayListener,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
import * as Yup from "yup";
import {
  phoneInputLabel,
  registrationErrText,
  sharedInputStyles,
} from "../../shared/common/styles";
import {
  textFieldProps,
  phoneValidation,
  emailValidation,
  convertCamelToTitle,
} from "../../shared/common/functions";
import PhoneInput from "react-phone-input-2";
import CustomCheckBox from "../CustomCheckbox/CustomCheckbox";
import moment from "moment";
import { addDays } from "date-fns";
import Nationality from "./Nationality";
import { regTitle } from "./GeneraInfo";
import useToast from "../../hook/useToast";
import CustomToast from "../Alert/CustomToast";
import CustomCalendar from "../CustomCalendar/CustomCalendar";
import CustomAlert from "../Alert/CustomAlert";
import {
  setSessionExpired,
  setAddressDetails,
  setAgencyInformation,
  setAgentReg,
} from "../../features/registrationSlice";
import useAddressData from "../../hook/useAddressData";
import { regSubmitBtn, RemoveDate } from "./RegisterPortal";
import ErrorDialog from "../Dialog/ErrorDialog";

const maxDOB = addDays(new Date(), -1);

const CompanyInfo = ({ isLoading, setIsLoading, setStep }) => {
  const dispatch = useDispatch();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const agentReg = useSelector((state) => state.registration.agentReg);
  // const [isLoading, setIsLoading] = useState(false);
  const [openCal, setOpenCal] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errors, setErrors] = useState({});

  const { accessToken, user, correctionFields, pageNumber } = agentReg;

  const {
    agencyName,
    establishedDate,
    employeeCount,
    addressDetails,
    phoneNumber,
    whatsappNumber,
    email,
  } = user?.agent?.agencyInformation;
  const {
    country = "Bangladesh",
    state,
    cityName,
    policeStationZone,
    division,
    district,
    upazila,
    postalCode,
    address,
  } = addressDetails || {};

  const isBD = country ? country?.toLowerCase() === "bangladesh" : "";
  const { data: allDivision = [], status: divisionStatus } = useAddressData(
    isBD,
    "divisions"
  );

  const { data: allDistrict = [], status: districtStatus } = useAddressData(
    division,
    `districts?divisionName=${division}`
  );

  const { data: allUpazilla = [], status: upazillaStatus } = useAddressData(
    district,
    `upazillas?districtName=${district}`
  );

  const { data: allPostCode = [], status: postCodeStatus } = useAddressData(
    upazila,
    `postcodes?divisionName=${division}&districtName=${district}`
  );

  useEffect(() => {
    if (correctionFields) {
      if (correctionFields.length > 0) {
        const unverifiedObj = {};
        correctionFields.forEach((field) => {
          unverifiedObj[field] =
            convertCamelToTitle(field) + " is not verified";
        });

        setErrors(unverifiedObj);
      }
    }
  }, []);

  const handleSubmitCompanyInfo = async (e) => {
    e.preventDefault();

    const bdAddress = isBD
      ? { division, district, upazila }
      : { state, cityName, policeStationZone };

    const body = {
      phoneNumber,
      whatsappNumber,
      email,
      establishedDate,
      employeeCount,
      addressDetails: { country, ...bdAddress, postalCode, address },
    };

    const filteredBody = filterBody(body, correctionFields);

    const { addressDetails, ...rest } = body;
    const validateBody = { ...rest, ...body?.addressDetails };

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/agent-account?step=4`;

    try {
      await companyInfoValidationSchema.validate(validateBody, {
        abortEarly: false,
      });

      setErrors({});

      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? You want to proceed next Step",
      });
      if (result?.isConfirmed) {
        setIsLoading(true);
        const response = await axios.post(url, filteredBody, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const responseData = response?.data;

        if (responseData?.success === true) {
          const agentData = responseData?.data;

          const nextStep = Number(agentData?.metadata?.step);
          dispatch(
            setAgentReg({ ...agentReg, ...agentData, pageNumber: nextStep })
          );

          const message = `Agency Information ${pageNumber > 4 || correctionFields?.length > 0 ? "Updated" : "Completed"} Successfully`;

          showToast("success", message, () => {
            setStep(nextStep);
          });
        }
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        setIsLoading(false);
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });

        // CustomAlert({
        //   success: "warning",
        //   message:
        //     Object.keys(validationErrors)
        //       .map((a) => convertCamelToTitle(a))
        //       .join(", ") +
        //     " field have validation errors. Please ensure the required criteria.",
        //   alertFor: "registration",
        // });

        setShowErrorDialog(true);

        setErrors(validationErrors);
      } else {
        const message = err?.response?.data?.message || "An error occurred";

        showToast("error", message, () => {
          if (err?.response?.data?.statusCode === 401) {
            dispatch(setSessionExpired());
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateField = async (field, value) => {
    try {
      await companyInfoValidationSchema.validateAt(field, {
        [field]: value,
      });
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    } catch (e) {
      setErrors((prev) => ({ ...prev, [field]: e.message }));
      return false;
    }
  };

  const handleChangeAgencyInfo = (e) => {
    const { name, value } = e.target;
    dispatch(setAgencyInformation({ field: name, value: value }));
    validateField(name, value);
  };

  const handleChangeAddressDetails = (e) => {
    const { name, value } = e.target;

    const resetFields = {
      country: ["division", "district", "upazila", "postalCode"],
      division: ["district", "upazila", "postalCode"],
      district: ["upazila", "postalCode"],
      upazila: ["postalCode"],
    };

    const updated = { ...addressDetails, [name]: value };

    if (resetFields[name]) {
      resetFields[name].forEach((field) => (updated[field] = ""));
    }

    dispatch(setAddressDetails(updated));
    validateField(name, value);
  };

  const unverifiedFields = (name) => {
    return correctionFields?.length > 0 && !correctionFields?.includes(name);
  };

  return (
    <>
      <Typography sx={{ ...regTitle, mt: 3 }}>
        {agencyName} Agency Information
      </Typography>

      <Typography sx={{ color: "var(--primary-color)", fontSize: "13px" }}>
        <span style={{ fontWeight: "500" }}>Note:</span> Please ensure that all
        fields are filled exactly as per Trade License to avoid discrepancies.
      </Typography>
      <form onSubmit={handleSubmitCompanyInfo}>
        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            justifyContent: "space-between",
            ".MuiPaper-root": { maxHeight: "200px !important" },
          }}
        >
          <Box>
            <Grid container columnSpacing={3} rowSpacing={3.5} mt={0}>
              <Grid item md={4} xs={12}>
                <ClickAwayListener
                  onClickAway={() => openCal && setOpenCal(false)}
                >
                  <Box
                    sx={{
                      position: "relative",
                      "& .MuiInputLabel-root": {
                        "&.Mui-focused": {
                          color: establishedDate && "#00000099",
                        },
                      },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: establishedDate && "#0000003B",
                          borderWidth: establishedDate && "1px",
                        },
                      },
                      pointerEvents:
                        unverifiedFields("establishedDate") && "none",
                    }}
                  >
                    <TextField
                      disabled={unverifiedFields("establishedDate")}
                      value={
                        establishedDate &&
                        moment(establishedDate, "YYYY-MM-DD").format(
                          "DD-MM-YYYY"
                        )
                      }
                      {...textFieldProps("establishedDate", "Established Date")}
                      sx={sharedInputStyles}
                      onClick={() => setOpenCal(!openCal)}
                      focused={openCal || establishedDate}
                      autoComplete="off"
                    />
                    <span style={registrationErrText}>
                      {errors?.establishedDate}
                    </span>
                    {openCal && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "100%",
                          borderRadius: "4px",
                          width: "100%",
                          zIndex: "1000",
                          display: "flex",
                          bgcolor: "white",
                        }}
                      >
                        <CustomCalendar
                          date={
                            establishedDate ? establishedDate : new Date(maxDOB)
                          }
                          maxDate={maxDOB}
                          title={"Established Date"}
                          handleChange={(date) => {
                            handleChangeAgencyInfo({
                              target: {
                                name: "establishedDate",
                                value: moment(date).format("YYYY-MM-DD"),
                              },
                            });

                            setOpenCal(false);
                          }}
                        />
                      </Box>
                    )}

                    {establishedDate && (
                      <RemoveDate
                        handleClick={() => {
                          handleChangeAgencyInfo({
                            target: { name: "establishedDate", value: "" },
                          });
                        }}
                      />
                    )}
                  </Box>
                </ClickAwayListener>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <FormControl fullWidth size="small" sx={sharedInputStyles}>
                    <InputLabel id="employeeCount-select-label">
                      Employee Count
                    </InputLabel>
                    <Select
                      labelId="employeeCount-select-label"
                      value={employeeCount || ""}
                      name="employeeCount"
                      label="employeeCount"
                      onChange={handleChangeAgencyInfo}
                      disabled={unverifiedFields("employeeCount")}
                    >
                      <MenuItem value="0-10">0-10</MenuItem>
                      <MenuItem value="10-25">10-25</MenuItem>
                      <MenuItem value="25-50">25-50</MenuItem>
                      <MenuItem value="50-100">50-100</MenuItem>
                      <MenuItem value="100-200">100-200</MenuItem>
                      <MenuItem value="200+">200+</MenuItem>
                    </Select>
                  </FormControl>

                  <span style={registrationErrText}>
                    {errors?.employeeCount}
                  </span>
                </Box>
              </Grid>

              {/* <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <Typography sx={{ ...phoneInputLabel, zIndex: "100" }}>
                    Country
                  </Typography>
                  <Nationality
                    nationality={country || ""}
                    handleChangeNationality={(value) => {
                      handleChangeAddressDetails({
                        target: { name: "country", value: value?.name },
                      });
                    }}
                    placeholder={"Select Country"}
                    isDisabled={
                      correctionFields && correctionFields.length > 0
                        ? unverifiedFields("country")
                        : pageNumber > 4
                    }
                    optionFor={"registration"}
                  />
                  <span style={registrationErrText}>{errors?.country}</span>
                </Box>
              </Grid> */}

              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    disabled
                    value={country || "Bangladesh"}
                    {...textFieldProps("country", `country`)}
                    sx={sharedInputStyles}
                  />
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  {country?.toLowerCase() !== "bangladesh" ? (
                    <TextField
                      {...textFieldProps("state", "State Name")}
                      value={state || ""}
                      onChange={handleChangeAddressDetails}
                      sx={sharedInputStyles}
                      disabled={unverifiedFields("state")}
                    />
                  ) : (
                    <FormControl fullWidth size="small" sx={sharedInputStyles}>
                      <InputLabel id="division-select-label">
                        Division Name
                      </InputLabel>
                      <Select
                        labelId="division-select-label"
                        value={division || ""}
                        name="division"
                        label="Division Name"
                        onChange={handleChangeAddressDetails}
                        MenuProps={menuProps}
                        disabled={unverifiedFields("division")}
                      >
                        {divisionStatus === "success" ? (
                          allDivision.length > 0 ? (
                            allDivision?.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item?.name}>
                                  {item?.name}
                                </MenuItem>
                              );
                            })
                          ) : (
                            <MenuItem disabled>No Data Found.</MenuItem>
                          )
                        ) : (
                          <MenuItem disabled>Something went wrong!</MenuItem>
                        )}

                        <AddressSkeleton status={divisionStatus} />
                      </Select>
                    </FormControl>
                  )}

                  <span style={registrationErrText}>
                    {errors?.division || errors?.state}
                  </span>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  {country?.toLowerCase() !== "bangladesh" ? (
                    <TextField
                      {...textFieldProps("cityName", "City Name")}
                      value={cityName || ""}
                      onChange={handleChangeAddressDetails}
                      sx={sharedInputStyles}
                      disabled={unverifiedFields("cityName")}
                    />
                  ) : (
                    <FormControl fullWidth size="small" sx={sharedInputStyles}>
                      <InputLabel id="district-select-label">
                        District
                      </InputLabel>
                      <Select
                        labelId="district-select-label"
                        value={district || ""}
                        name="district"
                        label="District"
                        onChange={handleChangeAddressDetails}
                        MenuProps={menuProps}
                        disabled={unverifiedFields("district")}
                      >
                        {districtStatus === "success" &&
                          (allDistrict.length > 0 ? (
                            allDistrict?.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item?.name}>
                                  {item?.name}
                                </MenuItem>
                              );
                            })
                          ) : (
                            <MenuItem disabled>No Data Found.</MenuItem>
                          ))}

                        {districtStatus === "error" && (
                          <MenuItem disabled>Something went wrong!</MenuItem>
                        )}

                        <AddressSkeleton status={districtStatus} />
                      </Select>
                    </FormControl>
                  )}

                  <span style={registrationErrText}>
                    {errors?.district || errors?.cityName}
                  </span>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  {country?.toLowerCase() !== "bangladesh" ? (
                    <TextField
                      value={policeStationZone || ""}
                      {...textFieldProps(
                        "policeStationZone",
                        "Police Station Zone"
                      )}
                      onChange={handleChangeAddressDetails}
                      sx={sharedInputStyles}
                      disabled={unverifiedFields("policeStationZone")}
                    />
                  ) : (
                    <FormControl fullWidth size="small" sx={sharedInputStyles}>
                      <InputLabel
                        id="upazila-select-label1"
                        sx={{ bgcolor: "white", pr: 1 }}
                      >
                        Upazilla / Thana
                      </InputLabel>
                      <Select
                        labelId="upazila-select-label1"
                        value={upazila || ""}
                        name="upazila"
                        label="upazila"
                        onChange={handleChangeAddressDetails}
                        MenuProps={menuProps}
                        disabled={unverifiedFields("upazila")}
                      >
                        {upazillaStatus === "success" &&
                          (allUpazilla.length > 0 ? (
                            allUpazilla?.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item?.name}>
                                  {item?.name}
                                </MenuItem>
                              );
                            })
                          ) : (
                            <MenuItem disabled>No Data Found.</MenuItem>
                          ))}

                        {upazillaStatus === "error" && (
                          <MenuItem disabled>Something went wrong!</MenuItem>
                        )}
                        <AddressSkeleton status={upazillaStatus} />
                      </Select>
                    </FormControl>
                  )}

                  <span style={registrationErrText}>
                    {errors?.upazila || errors?.policeStationZone}
                  </span>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  {country?.toLowerCase() !== "bangladesh" ? (
                    <TextField
                      value={postalCode || ""}
                      {...textFieldProps("postalCode", "Postal Code")}
                      onChange={handleChangeAddressDetails}
                      sx={sharedInputStyles}
                      disabled={unverifiedFields("postalCode")}
                    />
                  ) : (
                    <FormControl fullWidth size="small" sx={sharedInputStyles}>
                      <InputLabel id="postalCode-select-label">
                        Postal Code
                      </InputLabel>
                      <Select
                        labelId="postalCode-select-label"
                        value={postalCode || ""}
                        name="postalCode"
                        label="Postal Code"
                        onChange={handleChangeAddressDetails}
                        MenuProps={menuProps}
                        disabled={unverifiedFields("postalCode")}
                      >
                        {postCodeStatus === "success" &&
                          (allPostCode.length > 0 ? (
                            allPostCode?.map((item, i) => {
                              return (
                                <MenuItem
                                  key={i}
                                  value={String(item?.postCode)}
                                >
                                  {String(item?.postCode)}
                                </MenuItem>
                              );
                            })
                          ) : (
                            <MenuItem disabled>No Data Found.</MenuItem>
                          ))}

                        {postCodeStatus === "error" && (
                          <MenuItem disabled>Something went wrong!</MenuItem>
                        )}

                        <AddressSkeleton status={postCodeStatus} />
                      </Select>
                    </FormControl>
                  )}

                  <span style={registrationErrText}>{errors?.postalCode}</span>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    value={address}
                    {...textFieldProps("address", "Address")}
                    onChange={handleChangeAddressDetails}
                    sx={sharedInputStyles}
                    disabled={unverifiedFields("address")}
                  />
                  <span style={registrationErrText}>{errors?.address}</span>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    value={email}
                    {...textFieldProps(
                      "email",
                      "Office Email Address",
                      "email"
                    )}
                    onChange={handleChangeAgencyInfo}
                    sx={sharedInputStyles}
                    disabled={unverifiedFields("email")}
                  />
                  <span style={registrationErrText}>{errors?.email}</span>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <Typography sx={phoneInputLabel}>
                    Office Phone Number *
                  </Typography>
                  <PhoneInput
                    disabled={unverifiedFields("phoneNumber")}
                    inputStyle={{ width: "100%", height: "100%" }}
                    value={phoneNumber}
                    country={"bd"}
                    countryCodeEditable={false}
                    onChange={(phone) => {
                      handleChangeAgencyInfo({
                        target: { name: "phoneNumber", value: phone },
                      });
                    }}
                    disableDropdown
                  />
                  <span style={registrationErrText}>{errors?.phoneNumber}</span>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <Typography sx={phoneInputLabel}>
                    Office Whatsapp Number *
                  </Typography>
                  <PhoneInput
                    disabled={unverifiedFields("whatsappNumber")}
                    inputStyle={{ width: "100%", height: "100%" }}
                    value={whatsappNumber}
                    country={"bd"}
                    countryCodeEditable={false}
                    onChange={(phone) => {
                      handleChangeAgencyInfo({
                        target: { name: "whatsappNumber", value: phone },
                      });
                    }}
                    label="WhatsApp Number"
                    disableDropdown
                  />

                  <span style={registrationErrText}>
                    {errors?.whatsappNumber}
                  </span>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <CustomCheckBox
                  value={
                    phoneNumber &&
                    whatsappNumber &&
                    whatsappNumber === phoneNumber
                  }
                  style={{ color: "var(--gray)" }}
                  label="Office Phone and WhatsApp Number is Same"
                  fontSize={"13px"}
                  handleChange={(e) => {
                    handleChangeAgencyInfo({
                      target: {
                        name: "whatsappNumber",
                        value: e.target.checked ? phoneNumber : "880",
                      },
                    });
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Button
            type="submit"
            disabled={isLoading}
            style={regSubmitBtn(isLoading)}
          >
            {isLoading
              ? "agency information is in progress, please Wait..."
              : pageNumber > 4
                ? "Update agency information"
                : "save agency information and continue to next step"}
          </Button>
        </Box>
      </form>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />

      {showErrorDialog && (
        <ErrorDialog
          errors={errors}
          data={{}}
          handleClose={() => {
            setShowErrorDialog(false);
          }}
          type="For Agency Information"
        />
      )}
    </>
  );
};

const required = (type) => Yup.string().required(`${type} is required`);

export const companyInfoValidationSchema = Yup.object({
  establishedDate: required("Established Date"),
  employeeCount: required("Employee Count"),
  country: required("Country"),
  division: required("Division"),
  district: required("District"),
  upazila: required("Upazila"),
  postalCode: required("Postal Code"),
  address: required("Office address"),
  email: emailValidation("Office"),
  phoneNumber: phoneValidation("Office Phone"),
  whatsappNumber: phoneValidation("Office Whatsapp"),
});

const menuProps = {
  PaperProps: { style: { maxHeight: 200, overflowY: "auto" } },
};

const AddressSkeleton = ({ status }) => {
  return (
    status === "pending" &&
    [...new Array(5)].map((_, i) => (
      <Box key={i} py={"6px"} px={2}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height="14px"
          sx={{ borderRadius: "2px" }}
        />
      </Box>
    ))
  );
};

function filterBody(body, correctionFields) {
  if (!correctionFields) return body;
  if (!correctionFields.length) return body;

  let filteredBody = {};

  for (let key of correctionFields) {
    if (body.hasOwnProperty(key)) {
      filteredBody[key] = body[key];
    } else if (body.addressDetails?.hasOwnProperty(key)) {
      if (!filteredBody.addressDetails) filteredBody.addressDetails = {};
      filteredBody.addressDetails[key] = body.addressDetails[key];
    }
  }

  return filteredBody;
}

export default CompanyInfo;
