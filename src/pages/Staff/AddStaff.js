import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Drawer,
  FormControlLabel,
  Grid,
  Skeleton,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addYears } from "date-fns";
import React, { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as Yup from "yup";
import CustomAlert from "../../component/Alert/CustomAlert";
import CustomLoadingAlert from "../../component/Alert/CustomLoadingAlert";
import CustomToast from "../../component/Alert/CustomToast";
import RequiredIndicator from "../../component/Common/RequiredIndicator";
import CustomTabBar from "../../component/CustomTabBar/CustomTabBar";
import ServerError from "../../component/Error/ServerError";
import MobileHeader from "../../component/MobileHeader/MobileHeader";
import BranchSkeleton from "../../component/SkeletonLoader/BranchSkeleton";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import {
  emailValidation,
  fileTypeValid,
  personNameValidation,
  phoneValidation,
} from "../../shared/common/functions";
import PageTitle from "../../shared/common/PageTitle";
import { depositBtn } from "../../shared/common/styles";
import ConcernPerson from "./components/ConcernPerson";
import OfficialInfo from "./components/OfficialInfo";
import PresentAddress from "./components/PresentAddress";
import StaffVerify from "./StaffVerify";
import ErrorDialog from "../../component/Dialog/ErrorDialog";

export const maxDOB = addYears(new Date(), -18);

const AddStaff = () => {
  const params = useParams();
  const { jsonHeader } = useAuth();

  const {
    data: staff,
    error,
    status,
  } = useQuery({
    queryKey: ["staff", params?.id],
    queryFn: async () => {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/staffs/${params?.id}`;
      const response = await axios.get(url, jsonHeader());

      return response?.data?.data;
    },
    enabled: !!params?.id,
    staleTime: 0,
  });

  return (
    <Box sx={{ borderRadius: "10px" }}>
      <PageTitle title={params?.id ? "Staff Information" : "Add Staff"} />
      <MobileHeader
        title={"Staff Management"}
        labelType="title"
        labelValue={"Add Ataff"}
      />
      <Box
        sx={{
          width: {
            xs: "90%",
            lg: "100%",
          },
          mx: "auto",
          mt: { lg: "0", xs: 5 },
        }}
      >
        {status === "pending" && params?.id && (
          <Box sx={{ bgcolor: "white" }}>
            <BranchSkeleton />
          </Box>
        )}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: { lg: "0 0 5px 5px", xs: "5px" },
          }}
        >
          {status === "error" && (
            <Box sx={{ height: "calc(100vh - 150px)" }}>
              <ServerError message={error?.response?.data?.message} />
            </Box>
          )}

          {status === "success" && <StaffComponent staff={staff} />}
          {!params?.id && <StaffComponent staff={staff} />}
        </Box>
      </Box>
    </Box>
  );
};

const StaffComponent = ({ staff }) => {
  const params = useParams();
  const concernPersonRef = useRef();
  const presentAddressRef = useRef();
  const officialInfoRef = useRef();
  const { formDataHeader, jsonHeader } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [errors, setErrors] = useState({});
  const [staffAllData, setStaffAllData] = useState({});
  const [staffData, setStaffData] = useState();
  const [activeTab, setActiveTab] = useState(0);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    const concernPersonData = concernPersonRef.current.getState();
    const presentAddressData = presentAddressRef.current.getState();
    const officialInfoData = officialInfoRef.current.getState();

    // Combine all data

    const combinedData = {
      ...concernPersonData?.concernPerson,
      ...presentAddressData,
      ...officialInfoData,
    };

    setStaffAllData(combinedData);
    // Update form errors
    setErrors((prev) => ({
      ...prev,
      ...concernPersonData?.errors,
    }));

    let mutableStaffData = { ...combinedData };

    try {
      setShowErrorDialog(true);

      if (!params?.id) {
        await staffValidationSchema(combinedData?.country, params?.id).validate(
          mutableStaffData,
          { abortEarly: false }
        );
      }
      setErrors({});
    } catch (e) {
      if (e.name === "ValidationError") {
        const formattedErrors = {};
        e.inner.forEach((error) => {
          formattedErrors[error.path] = error.message;
        });
        setErrors(formattedErrors);
      }
    }
  };

  const onSubmit = async () => {
    const concernPersonData = concernPersonRef.current.getState();
    const presentAddressData = presentAddressRef.current.getState();
    const officialInfoData = officialInfoRef.current.getState();

    // Combine all data

    const combinedData = {
      ...concernPersonData?.concernPerson,
      ...presentAddressData,
      ...officialInfoData,
    };

    // Extract only the fields required for update
    const updateData = {
      ...concernPersonData.concernPerson,
      ...presentAddressData,
      department:
        officialInfoData?.department === "others"
          ? officialInfoData?.otherDept
          : officialInfoData?.department,
      designation: officialInfoData?.designation,
    };

    setStaffAllData(combinedData);
    // Update form errors
    setErrors((prev) => ({
      ...prev,
      ...concernPersonData?.errors,
    }));

    let mutableStaffData = { ...combinedData };

    // Handle country-based fields cleanup
    const isBangladesh = mutableStaffData.country === "Bangladesh";

    const fieldsToRemove = isBangladesh
      ? ["city", "state", "policeStationZone"]
      : ["division", "district", "upazila"];

    fieldsToRemove.forEach((field) => {
      delete mutableStaffData[field];
      delete updateData[field];
    });

    const formData = new FormData();

    Object.keys(mutableStaffData).forEach((key) => {
      if (mutableStaffData[key]) {
        formData.append(key, mutableStaffData[key]);
      }
    });

    try {
      const isUpdate = !!params?.id;
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/staffs${isUpdate ? `/update/information/${params.id}` : ""}`;
      const method = isUpdate ? "patch" : "post";

      const result = await CustomAlert({
        success: "warning",
        message: `Are you sure you want to ${isUpdate ? "Update" : "Add"} this staff?`,
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await axios[method](
          url,
          params?.id ? updateData : formData,
          params?.id ? jsonHeader() : formDataHeader()
        );
        const responseData = response?.data;

        if (responseData?.success) {
          queryClient.invalidateQueries(["staff"]);
          showToast("success", responseData?.message, () => {
            if (!isUpdate) {
              setIsDrawerOpen(true);
              setStaffData(responseData?.data);
            }
          });
        }
      }
    } catch (e) {
      // if (e.name === "ValidationError") {
      //   setShowErrorDialog(true);
      //   const formattedErrors = e.inner.reduce((acc, error) => {
      //     acc[error.path] = error.message;
      //     return acc;
      //   }, {});
      //   setErrors(formattedErrors);
      // } else {
      // }
      const message = e?.response?.data?.message || "An error occured.";
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const { department, otherDept, ...rest } = errors;

  return (
    <Box sx={{ minHeight: "calc(100vh - 150px)" }}>
      <Box
        sx={{
          px: { md: "0", xs: "15px" },
          mt: { md: "0", xs: "15px" },
        }}
      >
        {params?.id && (
          <Box sx={{ pt: 3, px: 2 }}>
            <CustomTabBar
              allTabs={[
                "Staff Information",
                "Staff Documents",
                "Staff Credentials",
              ]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              bgDark={"var(--primary-color)"}
            />
          </Box>
        )}

        <Box
          sx={{
            px: { md: "22px", xs: "15px" },
            py: { md: "25px", xs: "15px" },
            bgcolor: "white",
            borderRadius: { md: "0 0 5px 5px", xs: "4px" },
          }}
        >
          {activeTab === 0 && (
            <>
              <ConcernPerson
                ref={concernPersonRef}
                staff={staff}
                errors={errors}
                setErrors={setErrors}
                setIsEditable={setIsEditable}
                isEditable={isEditable}
              />
              <PresentAddress
                ref={presentAddressRef}
                staff={staff}
                errors={errors}
                setErrors={setErrors}
                setStaffAllData={setStaffAllData}
                isEditable={isEditable}
              />
            </>
          )}
          <OfficialInfo
            ref={officialInfoRef}
            staff={staff}
            errors={errors}
            setErrors={setErrors}
            isEditable={isEditable}
            activeTab={activeTab}
          />
          {activeTab === 0 && (
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={(event) => setIsChecked(event.target.checked)}
                  />
                }
                label={
                  <>
                    I have read and agree to the{" "}
                    <Link
                      to="/terms-and-conditions"
                      target="_blank"
                      style={{
                        color: "var(--primary-color)",
                        textDecoration: "none",
                      }}
                    >
                      Terms and Conditions
                    </Link>{" "}
                    &
                    <Link
                      to="/privacy-policy"
                      target="_blank"
                      style={{
                        color: "var(--primary-color)",
                        textDecoration: "none",
                      }}
                    >
                      {" "}
                      Privacy Policy{" "}
                    </Link>
                    <RequiredIndicator />
                  </>
                }
                sx={{
                  "& .MuiFormControlLabel-label": {
                    color: "var(--secondary-color)",
                  },
                  mt: 2,
                }}
              />

              <Button
                disabled={!isChecked || isLoading}
                sx={{
                  ...depositBtn,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isLoading ? "space-between" : "flex-start",
                  gap: isLoading ? "8px" : "0",
                  textAlign: isLoading ? "center" : "left",
                  paddingRight: isLoading ? "16px" : "0",
                }}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    {params?.id ? "Update Staff" : "Add Staff"}
                    <CircularProgress size={20} color="inherit" />
                  </>
                ) : (
                  `${params?.id ? "Update Staff" : "Add Staff"}`
                )}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      {openToast && (
        <CustomToast
          open={openToast}
          onClose={handleCloseToast}
          message={message}
          severity={severity}
        />
      )}

      {showErrorDialog && (
        <ErrorDialog
          errors={errors}
          data={staffAllData}
          handleClose={() => {
            setShowErrorDialog(false);
          }}
          onSubmit={onSubmit}
          type="The Staff"
        />
      )}

      <CustomLoadingAlert
        open={isLoading}
        text={`We Are Processing Your ${params?.id ? "Update Staff Account Request" : "New Staff Account Add Request"}`}
      />

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: { width: "50%" },
        }}
      >
        <StaffVerify
          setIsDrawerOpen={setIsDrawerOpen}
          phone={staffAllData?.loginPhone}
          email={staffAllData?.loginEmail}
          staff={staffData}
          setStaff={setStaffData}
          stage={"initial"}
          emailVerified={"email_unverified"}
        />
      </Drawer>
    </Box>
  );
};

export const validateField = async (field, value, setErrors, preCountry) => {
  try {
    const values = {
      [field]: value,
    };

    const response = await staffValidationSchema(preCountry).validateAt(
      field,
      values
    );

    if (response) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  } catch (e) {
    setErrors((prev) => ({ ...prev, [field]: e.message }));
  }
};

export const staffValidationSchema = (preCountry, id) => {
  return Yup.object({
    firstName: personNameValidation("First Name"),
    lastName: personNameValidation("Last Name"),
    gender: id
      ? Yup.string().notRequired()
      : Yup.string().required("Gender is required"),
    dateOfBirth: id
      ? Yup.string().notRequired()
      : Yup.string().required("Date of Birth is required"),
    nationality: id
      ? Yup.string().notRequired()
      : Yup.string().required("Nationality is required"),
    phone: phoneValidation("Phone"),
    email: id ? Yup.string().notRequired() : emailValidation(""),

    country: id
      ? Yup.string().notRequired()
      : Yup.string().required("Country is required"),
    division:
      preCountry === "Bangladesh"
        ? id
          ? Yup.string().notRequired()
          : Yup.string().required("Division is required")
        : null,
    district:
      preCountry === "Bangladesh"
        ? id
          ? Yup.string().notRequired()
          : Yup.string().required("District is required")
        : null,
    upazila:
      preCountry === "Bangladesh"
        ? id
          ? Yup.string().notRequired()
          : Yup.string().required("Upazila is required")
        : null,
    postCode: id
      ? Yup.string().notRequired()
      : Yup.string().required("PostCode is required"),
    state:
      preCountry !== "Bangladesh"
        ? id
          ? Yup.string().notRequired()
          : Yup.string().required("State is required")
        : null,
    city:
      preCountry !== "Bangladesh"
        ? id
          ? Yup.string().notRequired()
          : Yup.string().required("City is required")
        : null,
    policeStationZone:
      preCountry !== "Bangladesh"
        ? id
          ? Yup.string().notRequired()
          : Yup.string().required("Police Station Zone is required")
        : null,
    address: id
      ? Yup.string().notRequired()
      : Yup.string().required("Address is required"),
    department: id
      ? Yup.string().notRequired()
      : Yup.string().required("Department is required"),
    otherDept: id
      ? Yup.string().notRequired()
      : Yup.string().required("Department is required"),
    designation: id
      ? Yup.string().notRequired()
      : Yup.string().required("Designation is required"),

    photo: id ? fileTypeValid("Photo").notRequired() : fileTypeValid("Photo"),
    nidFront: id
      ? fileTypeValid("Nid Front").notRequired()
      : fileTypeValid("Nid Front"),
    nidBack: id
      ? fileTypeValid("Nid Back").notRequired()
      : fileTypeValid("Nid Back"),
    verificationDocument: id
      ? fileTypeValid("Document").notRequired()
      : fileTypeValid("Document"),

    loginEmail: id ? Yup.string().notRequired() : emailValidation(""),
    loginPhone: phoneValidation("Phone"),
    loginPassword: id
      ? Yup.string().notRequired()
      : Yup.string().required("Password is required"),
  });
};

export const MobileInputSkeleton = () => {
  const props = {
    sx: { borderRadius: "4px" },
    variant: "rectangular",
    animation: "wave",
    height: "40px",
  };
  return (
    <Grid container spacing={2.5}>
      {[...new Array(9)].map((_, i) => (
        <Grid key={i} item xs={12}>
          <Skeleton {...props} width={"100%"} />{" "}
        </Grid>
      ))}
    </Grid>
  );
};

export const sectionTitle = {
  fontWeight: "500",
  color: "var(--dark-gray)",
  mb: 1.5,
  mt: 4,
};

export default AddStaff;
