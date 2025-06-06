import {
  Box,
  Button,
  ClickAwayListener,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  flexCenter,
  nationalityStyle,
  updateRegStyle,
} from "../PreviewAndUpdate";
import { regTitle } from "../../GeneraInfo";
import moment from "moment";
import { addYears } from "date-fns";
import Nationality from "../../Nationality";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import {
  convertCamelToTitle,
  getOrdinal,
  phoneInputProps,
} from "../../../../shared/common/functions";
import { useDispatch, useSelector } from "react-redux";
import { setAgentData } from "../../../../features/agentRegistrationSlice";
import { ownerInfoValidationSchema } from "../../OwnerInfo";
import useToast from "../../../../hook/useToast";
import CustomToast from "../../../Alert/CustomToast";
import CustomCalendar from "../../../CustomCalendar/CustomCalendar";
import CustomAlert from "../../../Alert/CustomAlert";

const maxDOB = addYears(new Date(), -18);

const PreviewOwnerInfo = ({ allRegData }) => {
  const [regData, setRegData] = useState({ ...allRegData });

  const dispatch = useDispatch();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const agent = useSelector((state) => state.agentRegistration.agent);
  const { containerStyle, labelStyle, inputStyle, registrationErrText } =
    updateRegStyle;
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(null);
  const [openCal, setOpenCal] = useState(false);

  useEffect(() => {
    let mergedArray;

    if (regData.unverifiedAgent?.owners?.length > 0) {
      mergedArray = regData?.ownership?.[regData?.agentType].map((item) => {
        const unverifiedItem = regData.unverifiedAgent?.owners.find(
          (ver) => ver.id === item.id
        );

        let transformedObject = {};

        if (unverifiedItem) {
          for (const key in unverifiedItem) {
            if (unverifiedItem[key] === false) {
              transformedObject[key] =
                convertCamelToTitle(key) + " is unverified";
            } else {
              transformedObject[key] = unverifiedItem[key];
            }
          }
        } else {
          transformedObject = { id: item.id };
        }

        return transformedObject;
      });
    } else {
      mergedArray = regData?.ownership?.[regData?.agentType]?.map((owner) => ({
        id: owner.id,
      }));
    }
    setErrors(mergedArray);
  }, [isEdit]);

  const validateField = async (id, fieldName, value) => {
    try {
      const singleField = { [fieldName]: value };

      await ownerInfoValidationSchema.validateAt(fieldName, singleField);

      setErrors((preverr) =>
        preverr.map((e) => {
          if (e.id === id) {
            const { [fieldName]: _, ...rest } = e;
            console.error(_);
            return rest;
          }
          return e;
        })
      );

      return true;
    } catch (err) {
      console.error(err.message);
      const errorArray = errors.map((error) => {
        if (error.id === id) {
          return { ...error, id, [fieldName]: err.message };
        }
        return error;
      });

      setErrors(errorArray);
      return false;
    }
  };

  const handleChangeAgentData = (e, id) => {
    const { name, value } = e.target;

    setRegData({
      ...regData,
      ownership: {
        ...regData?.ownership,
        partnership: regData?.ownership?.partnership?.map((partner) => {
          if (partner?.id === id) return { ...partner, [name]: value };
          return partner;
        }),
      },
    });

    validateField(id, name, value);

    if (name === "dateOfBirth") {
      setOpenCal(null);
    }
  };

  const handleSavePartnerInfo = async (id) => {
    const body = regData?.ownership?.partnership?.find((p) => {
      if (p.id === id) {
        return {
          id: p?.id,
          name: p?.name,
          phoneNumber: p?.phoneNumber,
          email: p?.email,
          whatsappNumber: p?.whatsappNumber,
          dateOfBirth: moment(p?.dateOfBirth).format("YYYY-MM-DD"),
          gender: p?.gender,
          nationality: p?.nationality,
        };
      }
    });

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/agent/auth/partnership-owners`;

    try {
      await ownerInfoValidationSchema.validate(body, {
        abortEarly: false,
      });
      // setErrors({});

      // return;

      setIsLoading(true);
      const response = await axios.patch(url, [body], {
        headers: {
          Authorization: `Bearer ${regData?.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const responseData = response?.data;
      if (responseData?.success === true) {
        showToast("success", responseData?.message, () => {
          const agentData = responseData?.data[0];
          setRegData(agentData);
          dispatch(
            setAgentData({
              ...agent,
              ...agentData,
              pageNumber: agentData?.pageNumber + 1,
              isOpen: true,
            })
          );
        });
      }
    } catch (e) {
      if (e.name === "ValidationError") {
        // setIsLoading(false);
        const validationErrors = {};
        e.inner.forEach((error) => {
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
      } else {
        const message = e?.response?.data?.message || "An error occurred";
        setErrors([]);
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

  const updateContainerStyle = (name, partnerIndex) => {
    return {
      ...containerStyle,
      borderColor: errors[partnerIndex]?.[name]
        ? "var(--primary-color)"
        : "var(--border-color)",
      cursor: isEdit && "pointer",
    };
  };

  return (
    <Box>
      {regData?.ownership?.[regData?.agentType]?.map((owner, i) => {
        const errorObject = errors?.find((err) => err?.id === owner?.id);
        return (
          <Box key={owner?.id} sx={{ display: i === 0 && "none" }}>
            <Box
              sx={{
                ...flexCenter,
                justifyContent: "space-between",
                mt: 6,
              }}
            >
              <Box sx={{ ...flexCenter, gap: "10px", height: "35px" }}>
                <Typography noWrap sx={{ ...regTitle, mt: 0 }}>
                  Agency{" "}
                  {regData?.agentType === "proprietorship" ? (
                    "Proprietor"
                  ) : regData?.agentType === "limited" ? (
                    "Managing Director"
                  ) : regData?.agentType === "partnership" ? (
                    <>{getOrdinal(i + 1)} Managing Partner </>
                  ) : (
                    "Owner"
                  )}{" "}
                  Information
                </Typography>

                {isEdit === owner?.id ? (
                  <Typography
                    onClick={() => {
                      setIsEdit(null);
                      setRegData(agent);
                    }}
                    sx={{
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "var(--primary-color)",
                      borderBottom: "1px solid var(--primary-color)",
                    }}
                  >
                    Click to Reset
                  </Typography>
                ) : (
                  <Typography
                    onClick={() => {
                      setIsEdit(owner?.id);
                      setRegData(agent);
                    }}
                    sx={{
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "var(--primary-color)",
                      borderBottom: "1px solid var(--primary-color)",
                    }}
                  >
                    Click to Update
                  </Typography>
                )}
              </Box>

              <Box sx={{ height: "35px" }}>
                {isEdit === owner?.id && (
                  <Button
                    style={{
                      backgroundColor: "var(--secondary-color)",
                      color: isLoading ? "gray" : "white",
                      width: "110px",
                      textTransform: "capitalize",
                      fontSize: "12px",
                    }}
                    onClick={() => handleSavePartnerInfo(owner?.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Please Wait..." : "Save & Update"}
                  </Button>
                )}
              </Box>
            </Box>

            <Grid container spacing={3} mt={0}>
              <Grid item md={4} xs={12}>
                <label htmlFor="name" style={updateContainerStyle("name", i)}>
                  <Typography sx={labelStyle}>Name</Typography>
                  <input
                    disabled={isEdit !== owner?.id}
                    {...inputProps("name", owner?.name, "Enter Name")}
                    onChange={(e) => handleChangeAgentData(e, owner?.id)}
                  />
                  <span style={registrationErrText}>{errorObject?.name}</span>
                </label>
              </Grid>

              <Grid item md={4} xs={12}>
                <label
                  htmlFor="gender"
                  style={updateContainerStyle("gender", i)}
                >
                  <Typography sx={labelStyle}>Gender</Typography>
                  <select
                    disabled={isEdit !== owner?.id}
                    {...inputProps("gender", owner?.gender)}
                    onChange={(e) => handleChangeAgentData(e, owner?.id)}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <span style={registrationErrText}>{errorObject?.gender}</span>
                </label>
              </Grid>

              <Grid item md={4} xs={12}>
                <ClickAwayListener
                  onClickAway={() => openCal === owner?.id && setOpenCal(null)}
                >
                  <Box sx={{ position: "relative" }}>
                    <Box
                      onClick={() =>
                        isEdit === owner?.id &&
                        setOpenCal((prev) =>
                          prev === owner?.id ? null : owner?.id
                        )
                      }
                      sx={{
                        ...updateContainerStyle("dateOfBirth", i),
                        cursor: isEdit === owner?.id && "pointer",
                      }}
                    >
                      <Typography sx={labelStyle}>Date of Birth</Typography>
                      <Typography
                        sx={{
                          ...inputStyle,
                          color:
                            isEdit === owner?.id
                              ? "var(--black)"
                              : "var(--dark-gray)",
                        }}
                      >
                        {moment(owner?.dateOfBirth).format("DD MMMM YYYY")}
                      </Typography>

                      <span style={registrationErrText}>
                        {errorObject?.dateOfBirth}
                      </span>
                    </Box>
                    {openCal === owner?.id && (
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
                            owner?.dateOfBirth
                              ? owner?.dateOfBirth
                              : new Date(maxDOB)
                          }
                          maxDate={maxDOB}
                          title={"Date Of Birth"}
                          handleChange={(date) => {
                            handleChangeAgentData(
                              {
                                target: {
                                  name: "dateOfBirth",
                                  value: moment(date).format("YYYY-MM-DD"),
                                },
                              },
                              owner?.id
                            );
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </ClickAwayListener>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box
                  sx={{
                    ...updateContainerStyle("nationality", i),
                    pointerEvents: isEdit === owner?.id ? "auto" : "none",
                  }}
                >
                  <Typography sx={labelStyle}>Nationality</Typography>
                  <Box
                    sx={{
                      width: "65%",
                      ...nationalityStyle(isEdit === owner?.id),
                    }}
                  >
                    <Nationality
                      nationality={owner?.nationality}
                      handleChangeNationality={() => {
                        handleChangeAgentData({
                          target: { name: "dateOfBirth:" },
                        });
                      }}
                    />
                  </Box>
                  <span style={registrationErrText}>
                    {errorObject?.nationality}
                  </span>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <label
                  htmlFor="email"
                  style={{ ...updateContainerStyle("email", i) }}
                >
                  <Typography sx={labelStyle}>Email</Typography>

                  <input
                    disabled={isEdit !== owner?.id}
                    {...inputProps("email", owner?.email, "Email", "email")}
                    onChange={(e) => handleChangeAgentData(e, owner?.id)}
                  />

                  <span style={registrationErrText}>{errorObject?.email}</span>
                </label>
              </Grid>

              {/*  Phone Number */}
              <Grid item md={4} xs={12}>
                <label
                  htmlFor="phoneNumber"
                  style={updateContainerStyle("phoneNumber", i)}
                >
                  <Typography sx={labelStyle}>Phone Number</Typography>
                  <PhoneInput
                    {...phoneInputProps("phoneNumber", owner?.phoneNumber)}
                    onChange={(phone) => {
                      handleChangeAgentData(
                        {
                          target: { name: "phoneNumber", value: phone },
                        },
                        owner?.id
                      );
                    }}
                    disabled={isEdit !== owner?.id}
                  />
                  <span style={registrationErrText}>
                    {errorObject?.phoneNumber}
                  </span>
                </label>
              </Grid>

              {/*  Whatsapp Number */}
              <Grid item md={4} xs={12}>
                <label
                  htmlFor="whatsappNumber"
                  style={updateContainerStyle("whatsappNumber", i)}
                >
                  <Typography sx={{ ...labelStyle, width: "55%" }}>
                    Whatsapp Number
                  </Typography>
                  <PhoneInput
                    {...phoneInputProps(
                      "whatsappNumber",
                      owner?.whatsappNumber
                    )}
                    onChange={(phone) => {
                      handleChangeAgentData(
                        {
                          target: { name: "whatsappNumber", value: phone },
                        },
                        owner?.id
                      );
                    }}
                    disabled={isEdit !== owner?.id}
                  />
                  <span style={registrationErrText}>
                    {errorObject?.whatsappNumber}
                  </span>
                </label>
              </Grid>
            </Grid>
          </Box>
        );
      })}

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

export default PreviewOwnerInfo;
