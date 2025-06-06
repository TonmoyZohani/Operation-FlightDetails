import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Box, Grid, TextField, Typography } from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import PhoneInput from "react-phone-input-2";
import { useParams } from "react-router-dom";
import useFetcher from "../../../hook/useFetcher";
import useToast from "../../../hook/useToast";
import { sectionTitle } from "../../../pages/Staff/AddStaff";
import { textFieldProps } from "../../../shared/common/functions";
import {
  phoneInputLabel,
  registrationErrText,
  sharedInputStyles,
} from "../../../shared/common/styles";
import FileUpload from "../../AirBooking/FileUpload";
import CustomLoadingAlert from "../../Alert/CustomLoadingAlert";
import CustomToast from "../../Alert/CustomToast";
import { buttonStyleEye } from "../../Register/GeneraInfo";

const BranchDocuments = forwardRef(({ branch, errors }, ref) => {
  const params = useParams();
  const { id } = params;
  const [passShow, setPassShow] = useState(false);
  const [branchDoc, setBranchDoc] = useState({});
  const { patchFetcher } = useFetcher();
  const [fileUploading, setFileUploading] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  useEffect(() => {
    const branchManager = branch?.branchManager;
    setBranchDoc((prev) => ({
      ...prev,
      photo: id ? branchManager?.photo : null,
      verificationDocument: id ? branchManager?.verificationDocument : null,
      nidFront: id ? branchManager?.nidFront : null,
      nidBack: id ? branchManager?.nidBack : null,
      loginPhone: id ? branchManager?.loginPhone : "",
      loginEmail: id ? branchManager?.loginEmail : "",
      loginPassword: "",
    }));
    if (id) {
      setBranchDoc((prev) => ({
        ...prev,
        officeImage: id ? branch?.officeImage : null,
        officeSignboardImage: id ? branch?.officeSignboardImage : null,
      }));
    }
  }, [id, branch]);

  const handleOnChange = (name, value) => {
    setBranchDoc({
      ...branchDoc,
      [name]: value,
    });
    // validateField(name, value, setErrors, null, id);
  };

  const handleFileChange = async (value, name) => {
    if (params?.id) {
      try {
        const formData = new FormData();
        formData.append("image", value);
        formData.append("fieldName", name);
        const endPoint = `/api/v1/user/branches/update/image/${params?.id}`;
        setFileUploading(true);
        const response = await patchFetcher({
          endPoint,
          body: formData,
          contentType: "multipart/form-data",
        });
        if (response?.success) {
          showToast("success", response?.message);
          // queryClient.invalidateQueries(["staff"]);
        }
      } catch (error) {
        console.error(error);
        showToast("error", error?.response?.data?.message);
      } finally {
        setFileUploading(false);
      }
    } else {
      handleOnChange(name, value);
    }
  };

  useImperativeHandle(ref, () => ({
    getState: () => branchDoc,
  }));

  return (
    <Box>
      <Typography sx={sectionTitle}>Documents</Typography>

      <Grid container rowSpacing={3.5} columnSpacing={2.5}>
        {reqDocFields?.map((reqDoc, index) => {
          return (
            <Grid key={index} item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <FileUpload
                  id={reqDoc?.id}
                  label={reqDoc?.label}
                  previewImg={branchDoc[reqDoc?.name]}
                  onFileChange={(file) => handleFileChange(file, reqDoc?.name)}
                  accept=".jpg,.jpeg,.png,.pdf"
                  acceptLabel="JPG JPEG PNG & PDF"
                />
                {
                  <span style={registrationErrText}>
                    {errors[reqDoc?.name]}
                  </span>
                }
              </Box>
            </Grid>
          );
        })}
        {id &&
          branchDocFields?.map((reqDoc, index) => {
            return (
              <Grid key={index} item md={4} sm={6} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <FileUpload
                    id={reqDoc?.id}
                    label={reqDoc?.label}
                    onFileChange={(file) =>
                      handleFileChange(file, reqDoc?.name)
                    }
                    previewImg={branchDoc[reqDoc?.name]}
                    accept=".jpg,.jpeg,.png,.pdf"
                    acceptLabel="JPG JPEG PNG & PDF"
                  />
                  {
                    <span style={registrationErrText}>
                      {errors[reqDoc?.name]}
                    </span>
                  }
                </Box>
              </Grid>
            );
          })}
      </Grid>

      {/* ----------  Required Documents End  ---------- */}

      {/* ----------  Login Information Start  ---------- */}
      <Box sx={{ display: id ? "none" : "block" }}>
        <Typography sx={sectionTitle}>
          Branch Manager Login Information
        </Typography>

        <Grid container spacing={2.5}>
          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <Typography sx={phoneInputLabel}>Phone Number *</Typography>
              <PhoneInput
                inputStyle={{
                  width: "100%",
                  height: "100%",
                }}
                value={branchDoc?.loginPhone}
                country={"bd"}
                countryCodeEditable={false}
                onChange={(phone) => handleOnChange("loginPhone", phone)}
                disableDropdown
              />
              {errors?.loginPhone && (
                <span style={registrationErrText}>{errors.loginPhone}</span>
              )}
            </Box>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <TextField
                value={branchDoc?.loginEmail}
                {...textFieldProps("loginEmail", "Email", "email")}
                onChange={(e) => handleOnChange("loginEmail", e.target.value)}
                sx={sharedInputStyles}
                focused={branchDoc?.loginEmail}
                autoComplete="off"
              />
              {errors?.loginEmail && (
                <span style={registrationErrText}>{errors.loginEmail}</span>
              )}
            </Box>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Box
              sx={{
                position: "relative",
              }}
            >
              <TextField
                value={branchDoc?.loginPassword}
                {...textFieldProps(
                  "loginPassword",
                  "Enter Password",
                  passShow ? "text" : "password"
                )}
                onChange={(e) =>
                  handleOnChange("loginPassword", e.target.value)
                }
                autoComplete="new-password"
                sx={sharedInputStyles}
              />
              {errors?.loginPassword && (
                <span style={registrationErrText}>{errors.loginPassword}</span>
              )}

              <button
                type="button"
                style={buttonStyleEye}
                onClick={() => setPassShow((prev) => !prev)}
              >
                {passShow ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
              </button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />

      <CustomLoadingAlert
        open={fileUploading}
        text={"We Are Processing Uploading Request"}
      />
    </Box>
  );
});

const reqDocFields = [
  {
    label: "Branch Manager Photo",
    name: "photo",
  },
  {
    label: "Branch Manager NID Front",
    name: "nidFront",
  },
  {
    label: "Branch Manager NID Back",
    name: "nidBack",
  },
  {
    label: "Branch Manager CV/TIN/VISITING CARD",
    name: "verificationDocument",
  },
];

const branchDocFields = [
  {
    label: "Branch Image",
    name: "officeImage",
  },
  {
    label: "Branch Signboard Image",
    name: "officeSignboardImage",
  },
];

export default BranchDocuments;
