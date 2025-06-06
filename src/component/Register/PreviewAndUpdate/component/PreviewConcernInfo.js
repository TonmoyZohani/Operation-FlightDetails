import {
  Box,
  Button,
  ClickAwayListener,
  Grid,
  Typography,
  LinearProgress,
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
import { addYears } from "date-fns";
import Nationality from "../../Nationality";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import {
  convertCamelToTitle,
  phoneInputProps,
} from "../../../../shared/common/functions";
import { concernInfoValidationSchema } from "../../ConcernInfo";
import { ReactComponent as PDFicon } from "../../../../images/svg/pdf.svg";
import { useDispatch } from "react-redux";
import { setAgentData } from "../../../../features/agentRegistrationSlice";
import useToast from "../../../../hook/useToast";
import CustomToast from "../../../Alert/CustomToast";
import CustomCalendar from "../../../CustomCalendar/CustomCalendar";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { registrationImage } from "../../OwnerDocs";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ImagePreviewModal from "../../../Modal/ImagePreviewModal";
import CustomAlert from "../../../Alert/CustomAlert";

const maxDOB = addYears(new Date(), -18);

const PreviewConcernInfo = ({ allRegData }) => {
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
  const [uploadProgress, setUploadProgress] = useState({});
  const [showDoc, setShowDoc] = useState({ label: "", file: null });

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

  const validateField = async (field, value) => {
    try {
      await concernInfoValidationSchema.validateAt(field, {
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

  const handleChangeFile = async (e) => {
    const { name, files } = e.target;

    const isValid = await validateField(name, files[0]);

    if (isValid) {
      // setRegData({ ...regData, [name]: files[0] });
      handleUploadingFile({ name }, files[0]);
    }
  };

  const handleOnDrop = async (e, reqDoc) => {
    e.preventDefault();

    const files = e.dataTransfer.files;
    const imageFile = files[files.length - 1];
    const isValid = await validateField(reqDoc?.name, imageFile);
    if (isValid) {
      // setRegData({ ...regData, [reqDoc?.name]: imageFile });
      handleUploadingFile(reqDoc, imageFile);
    }
  };

  const handleUploadingFile = (reqDoc, imageFile) => {
    let progress = 0;

    setUploadProgress({
      ...uploadProgress,
      [reqDoc?.name]: {
        value: 0,
        status: "uploading",
      },
    });

    const interval = setInterval(() => {
      progress += 10;

      setUploadProgress({
        ...uploadProgress,
        [reqDoc?.name]: {
          value: progress,
          status: "uploading",
        },
      });

      if (progress >= 110) {
        clearInterval(interval);

        setUploadProgress({
          ...uploadProgress,
          [reqDoc?.name]: {
            value: 0,
            status: "completed",
          },
        });

        setRegData({ ...regData, [reqDoc?.name]: imageFile });
      }
    }, 50);
  };

  const handleRemoveFile = (reqDoc) => {
    setRegData({ ...regData, [reqDoc?.name]: allRegData[reqDoc?.name] });
    const newObj = Object.fromEntries(
      Object.entries(uploadProgress).filter(([key]) => key !== reqDoc?.name)
    );
    setUploadProgress(newObj);
    const newErr = Object.fromEntries(
      Object.entries(errors).filter(([key]) => key !== reqDoc?.name)
    );
    setErrors(newErr);
  };

  const handleChangeNationality = (value) => {
    setRegData({ ...regData, personNationality: value });
    validateField("personNationality", value);
  };

  const handleSubmitConcernInfo = async () => {
    const validate = {
      personName: regData?.personName,
      personGender: regData?.personGender,
      personDob: regData?.personDob,
      personNationality: regData?.personNationality,
      personRelation: regData?.personRelation,
      personAddress: regData?.personAddress,
      personEmail: regData?.personEmail,
      personNumber: regData?.personNumber,
      personWhatsappNumber: regData?.personWhatsappNumber,
      personNidFront: regData?.personNidFront,
      personNidBack: regData?.personNidBack,
    };

    const formData = new FormData();

    formData.append("personName", regData?.personName);
    formData.append("personGender", regData?.personGender);
    formData.append("personDob", regData?.personDob);
    formData.append("personNationality", regData?.personNationality);
    formData.append("personRelation", regData?.personRelation);
    formData.append("personAddress", regData?.personAddress);
    formData.append("personEmail", regData?.personEmail);
    formData.append("personNumber", regData?.personNumber);
    formData.append("personWhatsappNumber", regData?.personWhatsappNumber);
    formData.append("personNidFront", regData?.personNidFront);
    formData.append("personNidBack", regData?.personNidBack);

    // return;

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/agent/auth/concern-person/${regData?.agencyId}`;

    setIsLoading(true);
    try {
      await concernInfoValidationSchema.validate(validate, {
        abortEarly: false,
      });
      setErrors({});

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${regData?.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const responseData = response?.data;
      if (responseData?.success === true) {
        setUploadProgress({});
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
            Emergency Concern Person Information
          </Typography>

          <EditAndReset
            setRegData={setRegData}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            setUploadProgress={setUploadProgress}
            setErrors={setErrors}
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
              onClick={() => handleSubmitConcernInfo()}
              disabled={isLoading}
            >
              {isLoading ? "Please Wait..." : "Save & Update"}
            </Button>
          )}
        </Box>
      </Box>

      <Grid container columnSpacing={3} mt={"0"}>
        {/* Person Name */}
        <Grid item md={4} xs={12}>
          <label
            htmlFor="personName"
            style={{ ...updateContainerStyle("personName") }}
          >
            <Typography sx={labelStyle}>Name</Typography>

            <input
              disabled={!isEdit}
              {...inputProps("personName", regData?.personName)}
            />

            <span style={registrationErrText}>{errors?.personName}</span>
          </label>
        </Grid>

        {/* Gender */}
        <Grid item md={4} xs={12}>
          <label htmlFor="personGender" style={containerStyle}>
            <Typography sx={labelStyle}>Gender</Typography>
            <select
              disabled={!isEdit}
              {...inputProps("personGender", regData?.personGender)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              {/* <span style={registrationErrText}>{errors?.personGender}</span> */}
            </select>
            <span style={registrationErrText}>{errors?.personGender}</span>
          </label>
        </Grid>

        {/* Date of Birth */}
        <Grid item md={4} xs={12}>
          <ClickAwayListener onClickAway={() => openCal && setOpenCal(false)}>
            <Box sx={{ position: "relative" }}>
              <Box
                onClick={() => isEdit && setOpenCal(!openCal)}
                sx={{
                  ...updateContainerStyle("personDob"),
                  cursor: isEdit && "pointer",
                }}
              >
                <Typography sx={labelStyle}>Date of Birth</Typography>
                <Typography
                  sx={{
                    ...inputStyle,
                    color: isEdit ? "var(--black)" : "var(--dark-gray)",
                  }}
                >
                  {moment(regData?.personDob).format("DD MMMM YYYY")}
                </Typography>

                <span style={registrationErrText}>{errors?.personDob}</span>
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
                  <CustomCalendar
                    date={
                      regData?.personDob ? regData?.personDob : new Date(maxDOB)
                    }
                    maxDate={maxDOB}
                    title={"Date Of Birth"}
                    handleChange={(date) => {
                      setRegData({
                        ...regData,
                        personDob: moment(date).format("YYYY-MM-DD"),
                      });
                      validateField("personDob", date);
                      setOpenCal(false);
                    }}
                  />
                </Box>
              )}
            </Box>
          </ClickAwayListener>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={"0"}>
        {/* Nationality */}
        <Grid item md={4} xs={12}>
          <Box
            sx={{
              ...updateContainerStyle("personNationality"),
              pointerEvents: isEdit ? "auto" : "none",
            }}
          >
            <Typography sx={labelStyle}>Nationality</Typography>
            <Box sx={{ width: "55%", ...nationalityStyle(isEdit) }}>
              <Nationality
                nationality={regData?.personNationality}
                handleChangeNationality={handleChangeNationality}
              />
            </Box>
            <span style={registrationErrText}>{errors?.personNationality}</span>
          </Box>
        </Grid>

        {/* Gender */}
        <Grid item md={4} xs={12}>
          <label
            htmlFor="personRelation"
            style={{ ...updateContainerStyle("personRelation") }}
          >
            <Typography sx={labelStyle}>Relation</Typography>
            <select
              disabled={!isEdit}
              {...inputProps("personRelation", regData?.personRelation)}
            >
              <option value="family">Family Member</option>
              <option value="colleague">Colleague</option>
              <option value="employee">Employee</option>
              <option value="friend">Friend</option>
            </select>
            <span style={registrationErrText}>{errors?.personRelation}</span>
          </label>
        </Grid>

        {/* Address  */}
        <Grid item md={4} xs={12}>
          <label
            htmlFor="personAddress"
            style={{ ...updateContainerStyle("personAddress") }}
          >
            <Typography sx={labelStyle}>Address</Typography>

            <input
              disabled={!isEdit}
              {...inputProps("personAddress", regData?.personAddress)}
            />

            <span style={registrationErrText}>{errors?.personAddress}</span>
          </label>
        </Grid>

        {/* Email  */}
        <Grid item md={4} xs={12}>
          <label
            htmlFor="personEmail"
            style={{ ...updateContainerStyle("personEmail") }}
          >
            <Typography sx={labelStyle}>Email</Typography>

            <input
              disabled={!isEdit}
              {...inputProps("personEmail", regData?.personEmail)}
            />

            <span style={registrationErrText}>{errors?.personEmail}</span>
          </label>
        </Grid>

        {/*  Phone Number */}
        <Grid item md={4} xs={12}>
          <label
            htmlFor="personNumber"
            style={updateContainerStyle("personNumber")}
          >
            <Typography sx={labelStyle}>Phone Number</Typography>
            <PhoneInput
              {...phoneInputProps("personNumber", regData?.personNumber)}
              onChange={(phone) => {
                setRegData({ ...regData, personNumber: phone });
                validateField("personNumber", phone);
              }}
              disabled={!isEdit}
            />
            <span style={registrationErrText}>{errors?.personNumber}</span>
          </label>
        </Grid>

        {/*  Whatsapp Number */}
        <Grid item md={4} xs={12}>
          <label
            htmlFor="personWhatsappNumber"
            style={updateContainerStyle("personWhatsappNumber")}
          >
            <Typography sx={labelStyle}>Whatsapp Number</Typography>
            <PhoneInput
              {...phoneInputProps(
                "personWhatsappNumber",
                regData?.personWhatsappNumber
              )}
              onChange={(phone) => {
                setRegData({ ...regData, personWhatsappNumber: phone });
                validateField("personWhatsappNumber", phone);
              }}
              disabled={!isEdit}
            />
            <span style={registrationErrText}>
              {errors?.personWhatsappNumber}
            </span>
          </label>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        mt={0}
        // sx={{ pointerEvents: isEdit ? "auto" : "none" }}
      >
        {reqDocFields.map((reqDoc, i) => {
          return (
            <Grid key={i} item md={4} xs={12}>
              <Box
                sx={{
                  position: "relative",
                  border: "1px solid var(--border-color)",
                  borderRadius: "5px",
                  padding: "12px 16px 8px 16px",
                }}
              >
                <Box
                  sx={{
                    ...flexCenter,
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--text-medium)",
                      fontSize: "13px",
                    }}
                  >
                    {reqDoc.label}
                  </Typography>

                  {regData[reqDoc?.name] && (
                    <RemoveRedEyeIcon
                      onClick={() =>
                        setShowDoc({
                          label: regData[reqDoc?.name]?.name
                            ? regData[reqDoc?.name]?.name
                            : reqDoc.label,
                          file: regData[reqDoc?.name],
                        })
                      }
                      sx={{
                        color: "#666666",
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </Box>
                <Box sx={{ pointerEvents: isEdit ? "auto" : "none" }}>
                  <label
                    htmlFor={reqDoc.name}
                    style={{
                      ...registrationImage?.labelContainer,
                      borderColor: errors[reqDoc?.name]
                        ? "var(--primary-color)"
                        : "var(--border-color)",
                      pointerEvents:
                        Object.values(uploadProgress || {})
                          .map((item) => item.status)
                          .includes("uploading") && "none",
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      // setCurrentFile(i + 1);
                    }}
                    // onDragLeave={() => setCurrentFile(null)}
                    onDrop={(e) => handleOnDrop(e, reqDoc)}
                  >
                    <Box sx={registrationImage?.imageBox}>
                      {regData[reqDoc?.name] ? (
                        <>
                          {regData[reqDoc?.name].type === "application/pdf" ? (
                            <Box sx={registrationImage?.pdfBox}>
                              <PDFicon />
                            </Box>
                          ) : (
                            <img
                              style={{
                                height: "100%",
                                width: "55%",
                                borderRadius: "5px",
                              }}
                              src={
                                typeof regData[reqDoc?.name] === "string"
                                  ? regData[reqDoc?.name]
                                      ?.toLowerCase()
                                      ?.includes(".pdf")
                                    ? "https://storage.googleapis.com/b2bnodeimages/pdf.svg"
                                    : regData[reqDoc?.name]
                                  : URL.createObjectURL(regData[reqDoc?.name])
                              }
                              alt="registration images"
                            />
                          )}
                        </>
                      ) : (
                        <Box sx={{ textAlign: "center" }}>
                          <Typography sx={registrationImage?.labelText}>
                            Choose a file, drag & drop or Paste it here
                          </Typography>
                          <Typography
                            sx={{
                              ...registrationImage?.labelText,
                              color: "#888",
                              fontSize: "12px",
                            }}
                          >
                            JPG, JPEG, PNG & PDF formats, up to 2MB
                          </Typography>
                          <Box
                            sx={{
                              border: "1px solid var(--secondary-color)",
                              color: "var(--secondary-color)",
                              textTransform: "capitalize",
                              fontSize: "14px",
                              borderRadius: "5px",
                              width: "60%",
                              p: "3px",
                              textTransform: "uppercase",
                              m: "0 auto",
                              mt: 1.5,
                            }}
                          >
                            Upload file
                          </Box>
                        </Box>
                      )}
                    </Box>

                    <input
                      onChange={handleChangeFile}
                      id={reqDoc.name}
                      style={{ display: "none" }}
                      type="file"
                      name={reqDoc.name}
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                  </label>
                </Box>
                {(uploadProgress[reqDoc?.name] ||
                  regData[reqDoc?.name]?.name) && (
                  <>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        gap: "7px",
                        bgcolor: "#EEF1F7",
                        borderRadius: "5px",
                        p: "10px",
                        alignItems: "center",
                        mb: 1,
                        height: "56px",
                      }}
                    >
                      <InsertDriveFileIcon sx={{ color: "gray" }} />

                      <Box sx={{ width: "100%" }}>
                        <Typography sx={{ fontSize: "12px" }}>
                          {regData[reqDoc?.name]?.name?.length > 30
                            ? regData[reqDoc.name]?.name
                                ?.slice(0, 30)
                                ?.concat("...")
                            : regData[reqDoc.name]?.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "12px",
                          }}
                        >
                          {uploadProgress[reqDoc?.name]?.status ===
                          "uploading" ? (
                            <>
                              Uploading {uploadProgress[reqDoc?.name]?.value} %
                            </>
                          ) : (
                            "Completed"
                          )}
                        </Typography>
                      </Box>
                      <DeleteIcon
                        onClick={() => handleRemoveFile(reqDoc)}
                        sx={{
                          color: "var(--primary-color)",
                          cursor: "pointer",
                        }}
                      />
                    </Box>
                    {uploadProgress[reqDoc?.name] && (
                      <LinearProgress
                        variant="determinate"
                        value={uploadProgress[reqDoc?.name]?.value || 0}
                        sx={{
                          width: "100%",
                          visibility:
                            uploadProgress[reqDoc?.name]?.status === "completed"
                              ? "hidden"
                              : "visible",
                        }}
                      />
                    )}
                  </>
                )}

                <span style={registrationErrText}>{errors[reqDoc?.name]}</span>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <ImagePreviewModal
        open={!!showDoc.file}
        imgUrl={showDoc.file}
        onClose={() => {
          setShowDoc({ label: "", file: null });
        }}
        label={showDoc.label}
      />

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

const reqDocFields = [
  {
    label: "NID Front",
    name: "personNidFront",
  },
  {
    label: "NID Back",
    name: "personNidBack",
  },
];

export default PreviewConcernInfo;
