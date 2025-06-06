import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Drawer,
  FormControlLabel,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { addYears } from "date-fns";
import React, { useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import WingVerify from "../../pages/Wings/Wingverify";
import PageTitle from "../../shared/common/PageTitle";
import {
  emailValidation,
  fileTypeValid,
  personNameValidation,
  phoneValidation,
} from "../../shared/common/functions";
import { depositBtn } from "../../shared/common/styles";
import CustomAlert from "../Alert/CustomAlert";
import CustomLoadingAlert from "../Alert/CustomLoadingAlert";
import CustomToast from "../Alert/CustomToast";
import RequiredIndicator from "../Common/RequiredIndicator";
import CustomTabBar from "../CustomTabBar/CustomTabBar";
import ErrorDialog from "../Dialog/ErrorDialog";
import ServerError from "../Error/ServerError";
import MobileHeader from "../MobileHeader/MobileHeader";
import BranchSkeleton from "../SkeletonLoader/BranchSkeleton";
import BranchCredentials from "./components/BranchCredentials";
import BranchDocuments from "./components/BranchDocuments";
import BranchUpdateInfo from "./components/BranchUpdateInfo";
import CompanyInformation from "./components/CompanyInformation";
import ConcernPerson from "./components/ConcernPerson";

export const maxDOB = addYears(new Date(), -18);

const AddBranch = () => {
  const params = useParams();
  const { jsonHeader } = useAuth();
  const location = useLocation();
  const { branchStatus } = location?.state || {};

  const {
    data: branch,
    error,
    status,
  } = useQuery({
    queryKey: ["branch", params?.id],
    queryFn: async () => {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/branches/${params?.id}`;
      const response = await axios.get(url, jsonHeader());
      return response?.data?.data;
    },
    enabled: !!params?.id,
    staleTime: 0,
  });

  return (
    <Box sx={{ borderRadius: "10px" }}>
      <PageTitle title={params?.id ? "Branch Information" : "Add Branch"} />
      <MobileHeader
        title={"Branch Management"}
        labelType="title"
        labelValue={"Add Branch"}
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
            px: { md: "22px", xs: "15px" },
            py: { md: "25px", xs: "15px" },
            bgcolor: "white",
            borderRadius: { md: "0 0 5px 5px", xs: "4px" },
          }}
        >
          {status === "error" && (
            <Box sx={{ height: "calc(100vh - 150px)" }}>
              <ServerError message={error?.response?.data?.message} />
            </Box>
          )}

          {status === "success" && (
            <BranchComponent branch={branch} branchStatus={branchStatus} />
          )}
          {!params?.id && <BranchComponent branch={branch} />}
        </Box>
      </Box>
    </Box>
  );
};

const BranchComponent = ({ branch, branchStatus }) => {
  const params = useParams();
  const documentsRef = useRef();
  const concernPersonRef = useRef();
  const { formDataHeader } = useAuth();
  const CompanyInformationRef = useRef();
  const [errors, setErrors] = useState({});
  const [branchId, setBranchId] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [branchData, setBranchData] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [personalEmail, setPersonalEmail] = useState("");
  const [personalPhone, setPersonalPhone] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [branchAllData, setBranchAllData] = useState(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const handleSubmit = async () => {
    setShowErrorDialog(true);
    const concernPersonData = concernPersonRef.current?.getState();
    const CompanyInformationData = CompanyInformationRef.current?.getState();
    const documentsData = documentsRef.current?.getState();
    // Combine the data as needed
    const combinedData = {
      ...concernPersonData,
      ...CompanyInformationData,
      ...documentsData,
    };

    setBranchAllData(combinedData);

    // Remove fields based on country
    if (combinedData.branchCountry !== "Bangladesh") {
      ["branchDivision", "branchDistrict", "branchUpazilla"].forEach(
        (field) => {
          delete combinedData[field];
        }
      );
    } else if (combinedData.branchCountry === "Bangladesh") {
      delete combinedData.branchState;
      delete combinedData.branchCity;
      delete combinedData.branchPoliceStationZone;
    }

    try {
      setShowErrorDialog(true);
      await branchValidationSchema(
        combinedData?.branchCountry,
        params?.id
      ).validate(combinedData, {
        abortEarly: false,
      });
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
    const concernPersonData = concernPersonRef.current?.getState();
    const CompanyInformationData = CompanyInformationRef.current?.getState();
    const documentsData = documentsRef.current?.getState();
    // Combine the data as needed
    const combinedData = {
      ...concernPersonData,
      ...CompanyInformationData,
      ...documentsData,
    };

    setBranchAllData(combinedData);

    // Remove fields based on country
    if (combinedData.branchCountry !== "Bangladesh") {
      ["branchDivision", "branchDistrict", "branchUpazilla"].forEach(
        (field) => {
          delete combinedData[field];
        }
      );
    } else if (combinedData.branchCountry === "Bangladesh") {
      delete combinedData.branchState;
      delete combinedData.branchCity;
      delete combinedData.branchPoliceStationZone;
    }

    const formData = new FormData();

    for (const key in combinedData) {
      if (combinedData[key] !== "") {
        formData.append(key, combinedData[key]);
      }
    }

    try {
      await branchValidationSchema(
        combinedData?.branchCountry,
        params?.id
      ).validate(combinedData, {
        abortEarly: false,
      });
      setErrors({});

      const url = params?.id
        ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/branches`
        : `${process.env.REACT_APP_BASE_URL}/api/v1/user/branches`;
      const method = params?.id ? "patch" : "post";

      const result = await CustomAlert({
        success: "warning",
        message: `Are you sure you want to ${params?.id ? "Update" : "Add"} this branch?`,
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await axios[method](url, formData, formDataHeader());
        const responseData = response?.data;

        if (responseData?.success === true) {
          showToast("success", responseData?.message, () => {
            if (!params?.id) {
              setBranchData(responseData?.data);
              setBranchId(responseData?.data?.id);
              setIsDrawerOpen(true);
              setIsLoading(false);
            }
            setIsLoading(false);
          });
        }
      }
    } catch (e) {
      setIsLoading(false);
      const message =
        e?.response?.data?.message || "Fields is Missing or Invalid.";
      showToast("error", message);
      if (e.name === "ValidationError") {
        const formattedErrors = {};
        e.inner.forEach((error) => {
          formattedErrors[error.path] = error.message;
        });
        setErrors(formattedErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowErrorDialog(false);
  };

  const allTabs =
    branch?.verificationData?.length > 0
      ? [
          "Branch Information",
          "Branch Manager",
          "Branch Documents",
          "Branch Credentials",
          "Update Request",
        ]
      : [
          "Branch Information",
          "Branch Manager",
          "Branch Documents",
          "Branch Credentials",
        ];

  return (
    <Box>
      <Box
        sx={{
          px: { md: "0px", xs: "15px" },
          py: { md: "0px", xs: "15px" },
          borderRadius: { md: "0 0 5px 5px", xs: "4px" },
        }}
      >
        {params?.id && (
          <Box>
            <CustomTabBar
              allTabs={allTabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              bgDark={"var(--primary-color)"}
            />
          </Box>
        )}
        {activeTab === 0 && (
          <>
            {/* branch information */}
            <CompanyInformation
              ref={CompanyInformationRef}
              branch={branch}
              errors={errors}
              setErrors={setErrors}
              activeTab={activeTab}
              setIsEditable={setIsEditable}
              isEditable={isEditable}
            />
          </>
        )}
        {(activeTab === 1 || (!params?.id && activeTab === 0)) && (
          <>
            {/* branch manager information */}
            <ConcernPerson
              ref={concernPersonRef}
              branch={branch}
              errors={errors}
              setErrors={setErrors}
              setPersonalEmail={setPersonalEmail}
              setPersonalPhone={setPersonalPhone}
              isEditable={isEditable}
              branchStatus={branchStatus}
            />
          </>
        )}
        {(activeTab === 2 || (!params?.id && activeTab === 0)) && (
          <>
            {/* documents */}
            <BranchDocuments
              ref={documentsRef}
              branch={branch}
              errors={errors}
              id={params?.id}
              setErrors={setErrors}
              personalEmail={personalEmail}
              personalPhone={personalPhone}
            />
          </>
        )}
        {activeTab === 0 && !params?.id && (
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
                  {params?.id ? "Update Branch" : "Add Branch"}
                  <CircularProgress size={20} color="inherit" />
                </>
              ) : (
                `${params?.id ? "Update Branch" : "Add Branch"}`
              )}
            </Button>
          </Box>
        )}
        {activeTab === 3 && <BranchCredentials branch={branch} />}
        {activeTab === 4 && (
          <BranchUpdateInfo updateData={branch?.verificationData} />
        )}
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
          data={branchAllData}
          handleClose={handleClose}
          onSubmit={onSubmit}
          type="The Branch"
        />
      )}

      <CustomLoadingAlert
        open={isLoading}
        text={"We Are Processing Your New Branch Account Add Request"}
      />

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{ sx: { width: { md: "50%", xs: "100%" } } }}
      >
        <WingVerify
          setIsDrawerOpen={setIsDrawerOpen}
          email={branchAllData?.loginEmail}
          phone={branchAllData?.loginPhone}
          stage={"initial"}
          emailVerified={"email_unverified"}
          id={branchId}
          branchData={branchData}
          setBranchData={setBranchData}
          // setRefetch={setRefetch}
        />
      </Drawer>
    </Box>
  );
};

export const validateField = async (field, value, setErrors, country, id) => {
  try {
    const values = {
      [field]: value,
    };

    await branchValidationSchema(country, id).validateAt(field, values);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  } catch (e) {
    setErrors((prev) => ({ ...prev, [field]: e.message }));
  }
};

export const branchValidationSchema = (country, id = null) => {
  const isUpdating = Boolean(id);

  return Yup.object({
    branchManagerFirstName: isUpdating
      ? Yup.string().nullable()
      : personNameValidation("First Name"),
    branchManagerLastName: isUpdating
      ? Yup.string().nullable()
      : personNameValidation("Last Name"),
    branchManagerGender: isUpdating
      ? Yup.string().nullable()
      : Yup.string().required("Gender is required"),
    branchManagerDOB: isUpdating
      ? Yup.string().nullable()
      : Yup.string().required("Date of Birth is required"),
    branchManagerNationality: isUpdating
      ? Yup.string().nullable()
      : Yup.string().required("Nationality is required"),

    branchCountry: isUpdating
      ? Yup.string().nullable()
      : Yup.string().required("Country is required"),
    branchDivision:
      country === "Bangladesh"
        ? isUpdating
          ? Yup.string().nullable()
          : Yup.string().required("Division is required")
        : Yup.mixed().nullable(),
    branchState:
      country !== "Bangladesh"
        ? isUpdating
          ? Yup.string().nullable()
          : Yup.string().required("State is required")
        : Yup.mixed().nullable(),
    branchCity:
      country !== "Bangladesh"
        ? isUpdating
          ? Yup.string().nullable()
          : Yup.string().required("City is required")
        : Yup.mixed().nullable(),
    branchPoliceStationZone:
      country !== "Bangladesh"
        ? isUpdating
          ? Yup.string().nullable()
          : Yup.string().required("Police Station is required")
        : Yup.mixed().nullable(),
    branchDistrict:
      country === "Bangladesh"
        ? isUpdating
          ? Yup.string().nullable()
          : Yup.string().required("District is required")
        : Yup.mixed().nullable(),
    branchUpazilla:
      country === "Bangladesh"
        ? isUpdating
          ? Yup.string().nullable()
          : Yup.string().required("Upazilla is required")
        : Yup.mixed().nullable(),

    branchPostCode: isUpdating
      ? Yup.string().nullable()
      : Yup.string().required("Postal Code is required"),
    branchAddress: isUpdating
      ? Yup.string().nullable()
      : Yup.string().required("Location is required"),

    branchEmail: isUpdating
      ? Yup.string().nullable()
      : emailValidation("Branch"),
    branchNumber: isUpdating
      ? Yup.string().nullable()
      : phoneValidation("Branch"),
    branchManagerEmail: isUpdating
      ? Yup.string().nullable()
      : emailValidation("Branch Manager"),
    branchManagerPhoneNumber: isUpdating
      ? Yup.string().nullable()
      : phoneValidation("Branch Manager"),

    photo: isUpdating ? Yup.mixed().nullable() : fileTypeValid("Photo"),
    nidFront: isUpdating ? Yup.mixed().nullable() : fileTypeValid("Nid Front"),
    nidBack: isUpdating ? Yup.mixed().nullable() : fileTypeValid("Nid Back"),
    verificationDocument: isUpdating
      ? Yup.mixed().nullable()
      : fileTypeValid("Utility Tin"),
    officeImage: isUpdating
      ? Yup.mixed().nullable()
      : fileTypeValid("Office Image"),
    officeSignboardImage: isUpdating
      ? Yup.mixed().nullable()
      : fileTypeValid("Office Signboard Image"),

    loginPhone: isUpdating ? Yup.string().nullable() : phoneValidation("Phone"),
    loginEmail: isUpdating ? Yup.string().nullable() : emailValidation(""),
    loginPassword: isUpdating
      ? Yup.string().nullable()
      : Yup.string().required("Password is required"),
  });
};

export default AddBranch;
