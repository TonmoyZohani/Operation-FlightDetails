import {
  Box,
  Button,
  ClickAwayListener,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  EditAndReset,
  flexCenter,
  nationalityStyle,
  updateRegStyle,
} from "../PreviewAndUpdate";
import { regTitle } from "../../GeneraInfo";
import moment from "moment";
import { addDays } from "date-fns";
import Nationality from "../../Nationality";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import {
  convertCamelToTitle,
  phoneInputProps,
} from "../../../../shared/common/functions";
import { useQuery } from "@tanstack/react-query";
import { companyInfoValidationSchema } from "../../CompanyInfo";
import { useDispatch } from "react-redux";
import { setAgentData } from "../../../../features/agentRegistrationSlice";
import useToast from "../../../../hook/useToast";
import CustomToast from "../../../Alert/CustomToast";
import CustomCalendar from "../../../CustomCalendar/CustomCalendar";
import CustomAlert from "../../../Alert/CustomAlert";

const maxDOB = addDays(new Date(), -1);

const PreviewCompanyInfo = ({ allRegData }) => {
  const [regData, setRegData] = useState({ ...allRegData });

  const dispatch = useDispatch();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const { containerStyle, labelStyle, inputStyle, registrationErrText } =
    updateRegStyle;
  const [errors, setErrors] = useState({});
  const [openCal, setOpenCal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (regData.unverifiedAgent?.agencyInformation) {
      const transformedObject = {};
      for (const key in regData.unverifiedAgent?.agencyInformation) {
        if (regData.unverifiedAgent?.agencyInformation[key] === false) {
          transformedObject[key] = convertCamelToTitle(key) + " is unverified";
        } else {
          transformedObject[key] =
            regData.unverifiedAgent?.agencyInformation[key];
        }
      }
      setErrors(transformedObject);
      setOpenCal(false);
    }
  }, [isEdit]);

  const { data: allDivision } = useQuery({
    queryKey: ["locations/divisions"],
    queryFn: async () => {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/common/locations/divisions`;
      const divisionData = await fetchAPI(regData?.accessToken, url);
      return divisionData;
    },

    ...queryObj,
  });

  const { data: allDistrict } = useQuery({
    queryKey: ["locations/districts", regData?.divisionId],
    queryFn: async () => {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/common/locations/districts?divisionId=${regData?.divisionId}`;
      const districtData = await fetchAPI(regData?.accessToken, url);
      return districtData;
    },
    ...queryObj,
  });

  const { data: allUpazilla } = useQuery({
    queryKey: ["locations/upazillas", regData?.districtId],
    queryFn: async () => {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/common/locations/upazillas?districtId=${regData?.districtId}`;
      const upazillaData = await fetchAPI(regData?.accessToken, url);
      return upazillaData;
    },
    ...queryObj,
  });

  const { data: allPostCode } = useQuery({
    queryKey: ["locations/postcodes", regData?.districtId, regData?.divisionId],
    queryFn: async () => {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/common/locations/postcodes?divisionId=${regData?.divisionId}&districtId=${regData?.districtId}`;
      const postCodeData = await fetchAPI(regData?.accessToken, url);
      return postCodeData;
    },
    ...queryObj,
  });

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

  const handleChangeAgentData = (e) => {
    const { name, value } = e.target;

    setRegData({ ...regData, [name]: value });
    validateField(name, value);
  };

  const handleChangeNationality = (value) => {
    setRegData({ ...regData, country: value });
    validateField("country", value);
  };

  const handleSubmitCompanyInfo = async () => {
    const body = {
      agencyName: regData?.agencyName,
      establishedDate: moment(regData?.establishedDate).format("YYYY-MM-DD"),
      agencyPhone: regData?.agencyPhone,
      employeeCount: regData?.employeeCount,
      country: regData?.country,
      state: regData?.state,
      city: regData?.city,
      zone: regData?.zone,
      postalCode: String(regData?.postalCode),
      address: regData?.address,
      agencyEmail: regData?.agencyEmail,
      agencyWhatsapp: regData?.agencyWhatsapp,
      isIataProvide: Number(regData?.isIataProvide),
      isToabProvide: Number(regData?.isToabProvide),
      isAtabProvide: Number(regData?.isAtabProvide),
      isAviationCertificateProvide: Number(
        regData?.isAviationCertificateProvide
      ),
    };

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/agent/auth/agency-info`;

    setIsLoading(true);
    try {
      await companyInfoValidationSchema.validate(body, { abortEarly: false });

      setErrors({});
      const response = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${regData?.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const responseData = response?.data;

      if (responseData?.success === true) {
        showToast("success", responseData?.message, () => {
          setRegData(responseData?.data[0]);
          dispatch(
            setAgentData({
              ...regData,
              ...responseData?.data[0],
              pageNumber: responseData?.data[0]?.pageNumber + 1,
              isOpen: true,
            })
          );
        });
      }
    } catch (err) {
      console.error(err.message);
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });

        CustomAlert({
          success: "warning",
          message:
            Object.keys(validationErrors)
              .map((a) => convertCamelToTitle(a))
              .join(", ") +
            " field have validation errors. Please ensure the required criteria.",
          alertFor: "registration",
        });

        setErrors(validationErrors);
      } else {
        const message = err?.response?.data?.message || "An error occurred";
        setErrors({});
        showToast("error", message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputProps = (name, value, placeholder, type = "text") => {
    const extraProp = { style: inputStyle, onChange: handleChangeAgentData };
    return { name, id: name, value, type, placeholder, ...extraProp };
  };

  const updateContainerStyle = (name) => {
    return {
      ...containerStyle,
      borderColor: errors?.[name]
        ? "var(--primary-color)"
        : "var(--border-color)",
      cursor: isEdit && "pointer",
    };
  };

  return (
    <Box>
      <Box sx={{ ...flexCenter, justifyContent: "space-between", mt: 6 }}>
        <Box sx={{ ...flexCenter, gap: "10px", height: "35px" }}>
          <Typography noWrap sx={{ ...regTitle, mt: 0 }}>
            {regData?.agencyName} Agency Information
          </Typography>
          <EditAndReset
            setRegData={setRegData}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
          />
        </Box>

        <Box sx={{ height: "35px" }}>
          {isEdit && (
            <Button
              style={{
                backgroundColor: "var(--secondary-color)",
                color: isLoading ? "gray" : "white",
                width: "110px",
                textTransform: "capitalize",
                fontSize: "12px",
              }}
              onClick={() => handleSubmitCompanyInfo()}
              disabled={isLoading}
            >
              {isLoading ? "Please Wait..." : "Save & Update"}
            </Button>
          )}
        </Box>
      </Box>

      <Grid container columnSpacing={3} mt={"0"}>
        {/* Established Date */}
        <Grid item md={4} xs={12}>
          <ClickAwayListener onClickAway={() => openCal && setOpenCal(false)}>
            <Box sx={{ position: "relative" }}>
              <Box
                onClick={() => isEdit && setOpenCal(!openCal)}
                sx={{
                  ...updateContainerStyle("establishedDate"),
                  cursor: isEdit && "pointer",
                }}
              >
                <Typography sx={labelStyle}>Established Date</Typography>
                <Typography
                  sx={{
                    ...inputStyle,
                    color: isEdit ? "var(--black)" : "var(--dark-gray)",
                  }}
                >
                  {moment(regData?.establishedDate).format("DD MMMM YYYY")}
                </Typography>

                <span style={registrationErrText}>
                  {errors?.establishedDate}
                </span>
              </Box>
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
                  {/* <Calendar
                    style={{ backgroundColor: "white" }}
                    date={
                      regData?.establishedDate
                        ? regData?.establishedDate
                        : new Date(maxDOB)
                    }
                    onChange={(date) => {
                      setRegData({
                        ...regData,
                        establishedDate: moment(date).format("YYYY-MM-DD"),
                      });
                      validateField("establishedDate", date);
                      setOpenCal(false);
                    }}
                    months={1}
                    maxDate={maxDOB}
                  /> */}

                  <CustomCalendar
                    date={
                      regData?.establishedDate
                        ? regData?.establishedDate
                        : new Date(maxDOB)
                    }
                    maxDate={maxDOB}
                    title={"Established Date"}
                    handleChange={(date) => {
                      setRegData({
                        ...regData,
                        establishedDate: moment(date).format("YYYY-MM-DD"),
                      });
                      validateField("establishedDate", date);
                      setOpenCal(false);
                    }}
                  />
                </Box>
              )}
            </Box>
          </ClickAwayListener>
        </Grid>

        {/* Employee Count */}
        <Grid item md={4} xs={12}>
          <label htmlFor="employeeCount" style={containerStyle}>
            <Typography sx={labelStyle}>Employee Count</Typography>
            <select
              disabled={!isEdit}
              {...inputProps("employeeCount", regData?.employeeCount)}
              // onChange={(e) => {
              //   setRegData({
              //     ...regData,
              //     state: e?.target?.value,

              //   });
              // }}
            >
              <option value="0-10">0-10</option>
              <option value="10-25">10-25</option>
              <option value="25-50">25-50</option>
              <option value="50-100">50-100</option>
              <option value="100-200">100-200</option>
              <option value="200+">200+</option>
            </select>
          </label>
        </Grid>

        {/* country */}
        <Grid item md={4} xs={12}>
          <Box
            sx={{
              ...updateContainerStyle("country"),
              pointerEvents: isEdit ? "auto" : "none",
            }}
          >
            <Typography sx={labelStyle}>Country</Typography>
            <Box sx={{ width: "55%", ...nationalityStyle(isEdit) }}>
              <Nationality
                nationality={regData?.country}
                handleChangeNationality={handleChangeNationality}
              />
            </Box>
            <span style={registrationErrText}>{errors?.country}</span>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={"0"}>
        {/* Division Name */}
        <Grid item md={4} xs={12}>
          <label htmlFor="state" style={{ ...updateContainerStyle("state") }}>
            <Typography sx={labelStyle}>Division Name</Typography>
            {regData?.country?.toLowerCase() !== "bangladesh" ? (
              <input
                disabled={!isEdit}
                {...inputProps("state", regData?.state)}
              />
            ) : (
              <>
                <select
                  disabled={!isEdit}
                  {...inputProps("state", regData?.state)}
                  onChange={(e) => {
                    setRegData({
                      ...regData,
                      state: e?.target?.value,
                      divisionId: allDivision?.find(
                        (d) => d.name === e?.target?.value
                      ).id,
                    });
                  }}
                >
                  {allDivision?.map((division, i) => {
                    return (
                      <option key={i} value={division?.name}>
                        {division?.name}
                      </option>
                    );
                  })}
                </select>
              </>
            )}
            <span style={registrationErrText}>{errors?.state}</span>{" "}
          </label>
        </Grid>

        {/* District Name */}
        <Grid item md={4} xs={12}>
          <label htmlFor="city" style={{ ...updateContainerStyle("city") }}>
            <Typography sx={labelStyle}>District</Typography>
            {regData?.country?.toLowerCase() !== "bangladesh" ? (
              <input
                disabled={!isEdit}
                {...inputProps("city", regData?.city)}
              />
            ) : (
              <>
                <select
                  disabled={!isEdit}
                  {...inputProps("city", regData?.city)}
                  onChange={(e) => {
                    setRegData({
                      ...regData,
                      city: e?.target?.value,
                      districtId: allDistrict?.find(
                        (d) => d.name === e?.target?.value
                      ).id,
                    });
                  }}
                >
                  {allDistrict?.map((division, i) => {
                    return (
                      <option key={i} value={division?.name}>
                        {division?.name}
                      </option>
                    );
                  })}
                </select>
              </>
            )}
            <span style={registrationErrText}>{errors?.city}</span>
          </label>
        </Grid>

        {/* Upazilla / zone Name */}
        <Grid item md={4} xs={12}>
          <label htmlFor="zone" style={{ ...updateContainerStyle("zone") }}>
            <Typography sx={labelStyle}>Upazilla / Location</Typography>
            {regData?.country?.toLowerCase() !== "bangladesh" ? (
              <input
                disabled={!isEdit}
                {...inputProps("zone", regData?.zone)}
              />
            ) : (
              <>
                <select
                  disabled={!isEdit}
                  {...inputProps("zone", regData?.zone)}
                >
                  {allUpazilla?.map((division, i) => {
                    return (
                      <option key={i} value={division?.name}>
                        {division?.name}
                      </option>
                    );
                  })}
                </select>
              </>
            )}
            <span style={registrationErrText}>{errors?.zone}</span>
          </label>
        </Grid>

        {/* Post code  */}
        <Grid item md={4} xs={12}>
          <label
            htmlFor="postalCode"
            style={{ ...updateContainerStyle("postalCode") }}
          >
            <Typography sx={labelStyle}> Postal Code</Typography>
            {regData?.country?.toLowerCase() !== "bangladesh" ? (
              <input
                disabled={!isEdit}
                {...inputProps("postalCode", regData?.postalCode)}
              />
            ) : (
              <>
                <select
                  disabled={!isEdit}
                  {...inputProps("postalCode", regData?.postalCode)}
                >
                  {allPostCode?.map((postCode, i) => {
                    return (
                      <option key={i} value={postCode?.postCode}>
                        {postCode?.postCode}
                      </option>
                    );
                  })}
                </select>
              </>
            )}
            <span style={registrationErrText}>{errors?.postalCode}</span>
          </label>
        </Grid>

        {/* Address  */}
        <Grid item md={4} xs={12}>
          <label
            htmlFor="address"
            style={{ ...updateContainerStyle("address") }}
          >
            <Typography sx={labelStyle}>Address</Typography>

            <input
              disabled={!isEdit}
              {...inputProps("address", regData?.address)}
            />

            <span style={registrationErrText}>{errors?.address}</span>
          </label>
        </Grid>

        {/* Agency Email  */}
        <Grid item md={4} xs={12}>
          <label
            htmlFor="agencyEmail"
            style={{ ...updateContainerStyle("agencyEmail") }}
          >
            <Typography sx={labelStyle}>Office Email Address</Typography>

            <input
              disabled={!isEdit}
              {...inputProps("agencyEmail", regData?.agencyEmail)}
            />

            <span style={registrationErrText}>{errors?.agencyEmail}</span>
          </label>
        </Grid>

        {/*  Office Phone Number */}
        <Grid item md={4} xs={12}>
          <label
            htmlFor="agencyPhone"
            style={updateContainerStyle("agencyPhone")}
          >
            <Typography sx={{ ...labelStyle, width: "55%" }}>
              Office Phone Number
            </Typography>
            <PhoneInput
              {...phoneInputProps("agencyPhone", regData?.agencyPhone)}
              onChange={(phone) => {
                setRegData({ ...regData, agencyPhone: phone });
                validateField("agencyPhone", phone);
              }}
              disabled={!isEdit}
            />
            <span style={registrationErrText}>{errors?.agencyPhone}</span>
          </label>
        </Grid>

        {/*  Whatsapp Number */}
        <Grid item md={4} xs={12}>
          <label
            htmlFor="agencyWhatsapp"
            style={updateContainerStyle("agencyWhatsapp")}
          >
            <Typography sx={{ ...labelStyle, width: "55%" }}>
              Whatsapp Number
            </Typography>
            <PhoneInput
              {...phoneInputProps("agencyWhatsapp", regData?.agencyWhatsapp)}
              onChange={(phone) => {
                setRegData({ ...regData, agencyWhatsapp: phone });
                validateField("agencyWhatsapp", phone);
              }}
              disabled={!isEdit}
            />
            <span style={registrationErrText}>{errors?.agencyWhatsapp}</span>
          </label>
        </Grid>
      </Grid>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

const fetchAPI = async (accessToken, url) => {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const responseData = response?.data;
    if (responseData?.success === true) {
      return responseData?.data;
    }
  } catch (err) {
    console.error(err.message);
  }
};

const queryObj = {
  keepPreviousData: true,
  staleTime: 1800000,
  retry: false,
};

export default PreviewCompanyInfo;
