import CloseIcon from "@mui/icons-material/Close";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import PhoneInput from "react-phone-input-2";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import useFetcher from "../../../hook/useFetcher";
import useToast from "../../../hook/useToast";
import {
  fetchDistrictData,
  fetchDivisionData,
  fetchPostCodeData,
  fetchUpazillaData,
  textFieldProps,
} from "../../../shared/common/functions";
import {
  depositBtn,
  phoneInputLabel,
  registrationErrText,
  sharedInputStyles,
} from "../../../shared/common/styles";
import FileUpload from "../../AirBooking/FileUpload";
import CustomAlert from "../../Alert/CustomAlert";
import CustomLoadingAlert from "../../Alert/CustomLoadingAlert";
import CustomToast from "../../Alert/CustomToast";
import Nationality from "../../Register/Nationality";
import { validateField } from "../AddBranch";

const CompanyInformation = forwardRef(
  ({ branch, errors, setErrors, setIsEditable, isEditable }, ref) => {
    const params = useParams();
    const { jsonHeader } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [allDivision, setAllDivision] = useState([]);
    const [allDistrict, setAllDistrict] = useState([]);
    const [allUpazilla, setAllUpazilla] = useState([]);
    const [allPostCode, setAllPostCode] = useState([]);
    const [companyInfo, setCompanyInfo] = useState({branchCountry:"Bangladesh"});
    const { patchFetcher } = useFetcher();
    const { openToast, message, severity, showToast, handleCloseToast } =
      useToast();

    useEffect(() => {
      if (!params?.id) return;

      const bangladeshAddress =
        branch?.bangladeshBranchAddress?.bangladeshAddress;
      const internationalAddress =
        branch?.internationalBranchAddress?.internationalAddress;

      setCompanyInfo({
        officeImage: null,
        officeSignboardImage: null,
        branchCountry: bangladeshAddress?.country || internationalAddress?.country || "Bangladesh",
        branchDivision: bangladeshAddress?.division || "",
        branchDistrict: bangladeshAddress?.district || "",
        branchUpazilla: bangladeshAddress?.upazila || "",
        branchState: internationalAddress?.state || "",
        branchCity: internationalAddress?.cityName || "",
        branchPoliceStationZone: internationalAddress?.policeStationZone || "",
        branchPostCode:
          bangladeshAddress?.postalCode ||
          internationalAddress?.postalCode ||
          "",
        branchAddress:
          bangladeshAddress?.address || internationalAddress?.address || "",
        branchEmail: branch?.email || "",
        branchNumber: branch?.phone || "",
      });
    }, [params?.id, branch]);

    useEffect(() => {
      if (companyInfo?.branchCountry?.toLowerCase() === "bangladesh") {
        fetchDivisionData(setAllDivision, jsonHeader);
      }
    }, [companyInfo?.branchCountry]);

    useEffect(() => {
      fetchDistrictData(
        companyInfo?.branchDivision,
        setAllDistrict,
        jsonHeader
      );
    }, [companyInfo?.branchDivision]);

    useEffect(() => {
      fetchUpazillaData(
        companyInfo?.branchDistrict,
        setAllUpazilla,
        jsonHeader
      );
    }, [companyInfo?.branchDistrict]);

    useEffect(() => {
      fetchPostCodeData(
        companyInfo?.branchDivision,
        companyInfo?.branchDistrict,
        setAllPostCode,
        jsonHeader
      );
    }, [companyInfo?.branchUpazilla]);

    const handleOnChange = (name, value) => {
      setCompanyInfo({
        ...companyInfo,
        [name]: value,
      });
      validateField(name, value, setErrors, companyInfo?.branchCountry, null);
    };

    const handleFileChange = (value, name) => {
      handleOnChange(name, value);
    };

    useImperativeHandle(ref, () => ({
      getState: () => companyInfo,
    }));

    const handleUpdate = async () => {
      try {
        const result = await CustomAlert({
          success: "warning",
          message: `Are you sure? you want to Update this branch Information?`,
        });

        const endPoint = `/api/v1/user/branches/update/branch/${params?.id}`;

        const body = {
          branchAddress: companyInfo?.branchAddress,
          branchEmail: companyInfo?.branchEmail,
          branchNumber: companyInfo?.branchNumber,
          branchPostCode: String(companyInfo?.branchPostCode),
        };

        if (result.isConfirmed) {
          setIsLoading(true);
          const response = await patchFetcher({ endPoint, body });

          if (response?.success) {
            showToast("success", response?.message);
          } else {
            showToast("error", response?.message);
          }
        }
      } catch (e) {
        const message =
          e?.response?.data?.message || "An error occurred while updating";
        showToast("error", message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: params?.id ? 3 : 0,
            mb: 2,
          }}
        >
          <Typography sx={{ fontWeight: 500, color: "var(--dark-gray)" }}>
            Branch Information
          </Typography>
          {/* {params?.id && (
            <Box onClick={() => setIsEditable((prev) => !prev)}>
              <Typography
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
                  height: "32px",
                }}
              >
                <span style={{ fontSize: "13px", lineHeight: "1" }}>
                  {isEditable ? "Click to Close" : "Click to Update"}
                </span>
                {isEditable ? (
                  <CloseIcon sx={{ fontSize: "18px" }} />
                ) : (
                  <EditCalendarIcon sx={{ fontSize: "18px", p: 0.25 }} />
                )}
              </Typography>
            </Box>
          )} */}
        </Box>

        <Grid container columnSpacing={2.5} rowSpacing={4} sx={{ mb: 4 }}>
          {/* Branch Name */}
          {/* <Grid item md={4} sm={6} xs={12}>
          <Box sx={{ position: "relative" }}>
            <TextField
              {...textFieldProps("branchName", "Branch Name")}
              value={companyInfo?.branchCity}
              onChange={(e) => handleOnChange("branchName", e.target.value)}
              sx={sharedInputStyles}
            />
            {errors?.branchName && (
              <span style={registrationErrText}>{errors?.branchName}</span>
            )}
          </Box>
        </Grid> */}

          {/* Nationality */}
          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <Nationality
                nationality={companyInfo?.branchCountry}
                handleChangeNationality={(country) =>
                  handleOnChange("branchCountry", country)
                }
                placeholder="Select Country"
                isDisabled={true}
                // isDisabled={params?.id ? true : false}
              />
              {errors?.branchCountry && (
                <span style={registrationErrText}>{errors?.branchCountry}</span>
              )}
            </Box>
          </Grid>

          {/* If Bangladesh */}
          {/* Division */}
          {companyInfo?.branchCountry?.toLowerCase() === "bangladesh" && (
            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="small" sx={sharedInputStyles}>
                  <InputLabel>Division Name</InputLabel>
                  <Select
                    value={companyInfo?.branchDivision}
                    name="branchDivision"
                    label="Division Name"
                    MenuProps={{ disableScrollLock: true }}
                    onChange={(e) =>
                      handleOnChange("branchDivision", e?.target?.value)
                    }
                    disabled={params?.id ? true : false}
                  >
                    {allDivision?.map((division, i) => {
                      return (
                        <MenuItem key={i} value={division?.name}>
                          {division?.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {errors?.branchDivision && (
                  <span style={registrationErrText}>
                    {errors.branchDivision}
                  </span>
                )}
              </Box>
            </Grid>
          )}

          {/* District */}
          {companyInfo?.branchCountry?.toLowerCase() === "bangladesh" && (
            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="small" sx={sharedInputStyles}>
                  <InputLabel id="district-select-label">District</InputLabel>
                  <Select
                    labelId="district-select-label"
                    value={companyInfo?.branchDistrict || ""}
                    name="branchDistrict"
                    label="District"
                    MenuProps={{ disableScrollLock: true }}
                    onChange={(e) =>
                      handleOnChange("branchDistrict", e?.target?.value)
                    }
                    disabled={params?.id ? true : false}
                  >
                    {allDistrict?.map((district, i) => {
                      return (
                        <MenuItem key={i} value={district?.name}>
                          {district?.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {errors?.branchDistrict && (
                  <span style={registrationErrText}>
                    {errors.branchDistrict}
                  </span>
                )}
              </Box>
            </Grid>
          )}

          {/* Upazila */}
          {companyInfo?.branchCountry?.toLowerCase() === "bangladesh" && (
            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="small" sx={sharedInputStyles}>
                  <InputLabel>Upazilla / Location</InputLabel>
                  <Select
                    value={companyInfo?.branchUpazilla}
                    name="branchUpazilla"
                    label="Upazilla / Location"
                    MenuProps={{ disableScrollLock: true }}
                    onChange={(e) =>
                      handleOnChange("branchUpazilla", e.target.value)
                    }
                    disabled={params?.id ? true : false}
                  >
                    {allUpazilla?.map((upazilla, i) => {
                      return (
                        <MenuItem key={i} value={upazilla?.name}>
                          {upazilla?.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {errors?.branchUpazilla && (
                  <span style={registrationErrText}>
                    {errors.branchUpazilla}
                  </span>
                )}
              </Box>
            </Grid>
          )}

          {/* Postal Code */}
          {companyInfo?.branchCountry?.toLowerCase() === "bangladesh" && (
            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="small" sx={sharedInputStyles}>
                  <InputLabel>Postal Code</InputLabel>
                  <Select
                    value={companyInfo?.branchPostCode || ""}
                    name="branchPostCode"
                    label="Postal Code"
                    MenuProps={{ disableScrollLock: true }}
                    onChange={(e) => {
                      handleOnChange("branchPostCode", e.target.value);
                    }}
                    disabled={params?.id ? !isEditable : false}
                  >
                    {allPostCode?.map((postCode, i) => {
                      return (
                        <MenuItem key={i} value={postCode?.postCode}>
                          {postCode?.postCode}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {errors?.branchPostCode && (
                  <span style={registrationErrText}>
                    {errors.branchPostCode}
                  </span>
                )}
              </Box>
            </Grid>
          )}

          {/* Not Bangladesh */}
          {/* State */}
          {companyInfo?.branchCountry?.toLowerCase() !== "bangladesh" && (
            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  {...textFieldProps("branchState", "State")}
                  value={companyInfo?.branchState}
                  onChange={(e) =>
                    handleOnChange("branchState", e.target.value)
                  }
                  sx={sharedInputStyles}
                  disabled={params?.id ? true : false}
                />
                {errors?.branchState && (
                  <span style={registrationErrText}>{errors.branchState}</span>
                )}
              </Box>
            </Grid>
          )}

          {/* City */}
          {companyInfo?.branchCountry?.toLowerCase() !== "bangladesh" && (
            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  {...textFieldProps("branchCity", "City Name")}
                  value={companyInfo?.branchCity}
                  onChange={(e) => handleOnChange("branchCity", e.target.value)}
                  sx={sharedInputStyles}
                  disabled={params?.id ? true : false}
                />
                {errors?.branchCity && (
                  <span style={registrationErrText}>{errors.branchCity}</span>
                )}
              </Box>
            </Grid>
          )}

          {/* Police Station Zone */}
          {companyInfo?.branchCountry?.toLowerCase() !== "bangladesh" && (
            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={companyInfo?.location}
                  {...textFieldProps(
                    "branchPoliceStationZone",
                    "Police Station"
                  )}
                  onChange={(e) =>
                    handleOnChange("branchPoliceStationZone", e.target.value)
                  }
                  sx={sharedInputStyles}
                  disabled={params?.id ? !isEditable : false}
                />
                {errors?.branchPoliceStationZone && (
                  <span style={registrationErrText}>
                    {errors.branchPoliceStationZone}
                  </span>
                )}
              </Box>
            </Grid>
          )}

          {/* Post Code */}
          {companyInfo?.branchCountry?.toLowerCase() !== "bangladesh" && (
            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={companyInfo?.location}
                  {...textFieldProps("branchPostCode", "Post Code")}
                  onChange={(e) =>
                    handleOnChange("branchPostCode", e.target.value)
                  }
                  sx={sharedInputStyles}
                  disabled={params?.id ? !isEditable : false}
                />
                {errors?.branchPostCode && (
                  <span style={registrationErrText}>
                    {errors.branchPostCode}
                  </span>
                )}
              </Box>
            </Grid>
          )}

          {/* Address */}
          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <TextField
                value={companyInfo?.branchAddress}
                {...textFieldProps("branchAddress", "Address")}
                onChange={(e) => {
                  handleOnChange("branchAddress", e.target.value);
                }}
                sx={sharedInputStyles}
                disabled={params?.id ? !isEditable : false}
              />
              {errors?.branchAddress && (
                <span style={registrationErrText}>{errors.branchAddress}</span>
              )}
            </Box>
          </Grid>

          {/* Email */}
          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <TextField
                value={companyInfo?.branchEmail}
                {...textFieldProps("branchEmail", "Email", "email")}
                onChange={(e) => {
                  handleOnChange("branchEmail", e.target.value);
                }}
                sx={sharedInputStyles}
                disabled={params?.id ? !isEditable : false}
              />
              {errors?.branchEmail && (
                <span style={registrationErrText}>{errors.branchEmail}</span>
              )}
            </Box>
          </Grid>

          {/* Phone */}
          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <Typography sx={phoneInputLabel}>Phone Number *</Typography>
              <PhoneInput
                inputStyle={{
                  width: "100%",
                  height: "100%",
                }}
                value={companyInfo?.branchNumber}
                country={"bd"}
                countryCodeEditable={false}
                onChange={(phone) => {
                  handleOnChange("branchNumber", phone);
                }}
                disabled={params?.id ? !isEditable : false}
                disableDropdown
              />
              {errors?.branchNumber && (
                <span style={registrationErrText}>{errors.branchNumber}</span>
              )}
            </Box>
          </Grid>
        </Grid>

        {!params.id && (
          <Grid container rowSpacing={3.5} columnSpacing={2.5}>
            {reqDocFields?.map((reqDoc, index) => {
              return (
                <Grid key={index} item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <FileUpload
                      id={reqDoc?.id}
                      label={reqDoc?.label}
                      onFileChange={(file) =>
                        handleFileChange(file, reqDoc?.name)
                      }
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
        )}

        {/* {params?.id && (
          <Box>
            <Button
              disabled={isLoading}
              sx={{
                ...depositBtn,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 0,
                textAlign: "left",
                paddingRight: 0,
              }}
              onClick={handleUpdate}
            >
              Update Branch Information
            </Button>
          </Box>
        )} */}

        <CustomToast
          open={openToast}
          onClose={handleCloseToast}
          message={message}
          severity={severity}
        />

        <CustomLoadingAlert
          open={isLoading}
          text={"We Are Processing Your Branch Information Update Request"}
        />
      </Box>
    );
  }
);

const reqDocFields = [
  {
    label: "Branch Image",
    name: "officeImage",
  },
  {
    label: "Branch Signboard Image",
    name: "officeSignboardImage",
  },
];

export default CompanyInformation;
