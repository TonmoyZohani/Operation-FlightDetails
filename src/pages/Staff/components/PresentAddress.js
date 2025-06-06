import {
  Box,
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
import { useParams } from "react-router-dom";
import Nationality from "../../../component/Register/Nationality";
import { useAuth } from "../../../context/AuthProvider";
import {
  fetchDistrictData,
  fetchDivisionData,
  fetchPostCodeData,
  fetchUpazillaData,
  textFieldProps,
} from "../../../shared/common/functions";
import {
  registrationErrText,
  sharedInputStyles,
} from "../../../shared/common/styles";
import { sectionTitle, validateField } from "../AddStaff";

const PresentAddress = forwardRef(
  ({ staff, errors, setErrors, isEditable }, ref) => {
    const { jsonHeader } = useAuth();
    const params = useParams();
    const [allDivision, setAllDivision] = useState([]);
    const [allDistrict, setAllDistrict] = useState([]);
    const [allUpazila, setAllUpazila] = useState([]);
    const [allPostCode, setAllPostCode] = useState([]);
    const [presentAddress, setPresentAddress] = useState({});

    useEffect(() => {
      if (!params?.id) return;

      const bangladeshAddress =
        staff?.bangladeshStaffAddress?.bangladeshAddress;
      const internationalAddress =
        staff?.internationalStaffAddress?.internationalAddress;

      setPresentAddress({
        country:
          bangladeshAddress?.country || internationalAddress?.country || "",
        division: bangladeshAddress?.division || "",
        district: bangladeshAddress?.district || "",
        upazila: bangladeshAddress?.upazila || "",
        state: internationalAddress?.state || "",
        city: internationalAddress?.cityName || "",
        policeStationZone: internationalAddress?.policeStationZone || "",
        postCode:
          bangladeshAddress?.postalCode ||
          internationalAddress?.postalCode ||
          "",
        address:
          bangladeshAddress?.address || internationalAddress?.address || "",
      });
    }, [params?.id, staff]);

    useEffect(() => {
      if (presentAddress?.country?.toLowerCase() === "bangladesh") {
        fetchDivisionData(setAllDivision, jsonHeader);
      }
    }, [presentAddress?.country]);

    useEffect(() => {
      fetchDistrictData(presentAddress?.division, setAllDistrict, jsonHeader);
    }, [presentAddress?.division]);

    useEffect(() => {
      fetchUpazillaData(presentAddress?.district, setAllUpazila, jsonHeader);
    }, [presentAddress?.district]);

    useEffect(() => {
      fetchPostCodeData(
        presentAddress?.division,
        presentAddress?.district,
        setAllPostCode,
        jsonHeader
      );
    }, [presentAddress?.upazila]);

    const handleOnChange = (name, value) => {
      setPresentAddress({
        ...presentAddress,
        [name]: value,
      });

      if (name === "country" && value === "Bangladesh") {
        validateField(name, value, setErrors, value, null);
      } else {
        validateField(name, value, setErrors, presentAddress?.country, null);
      }
    };

    useImperativeHandle(ref, () => ({
      getState: () => presentAddress,
    }));

    return (
      <>
        <Typography sx={sectionTitle}>Staff Address Information</Typography>
        <Grid container spacing={2.5}>
          {/* Country */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ position: "relative" }}>
              <Nationality
                nationality={presentAddress?.country}
                handleChangeNationality={(e) => handleOnChange("country", e)}
                placeholder="Select Country"
                isDisabled={params?.id ? !isEditable : false}
              />
              {errors?.country && (
                <span style={registrationErrText}>{errors.country}</span>
              )}
            </Box>
          </Grid>

          {/* If Bangladesh */}
          {/* Division */}
          {presentAddress?.country?.toLowerCase() === "bangladesh" && (
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="small" sx={sharedInputStyles}>
                  <InputLabel>Division</InputLabel>
                  <Select
                    value={presentAddress?.division}
                    name="division"
                    label="Division"
                    MenuProps={{ disableScrollLock: true }}
                    onChange={(e) =>
                      handleOnChange("division", e?.target?.value)
                    }
                    disabled={params?.id ? !isEditable : false}
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
                {errors?.division && (
                  <span style={registrationErrText}>{errors.division}</span>
                )}
              </Box>
            </Grid>
          )}

          {/* District */}
          {presentAddress?.country?.toLowerCase() === "bangladesh" && (
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="small" sx={sharedInputStyles}>
                  <InputLabel>District</InputLabel>
                  <Select
                    value={presentAddress?.district}
                    name="district"
                    label="District"
                    MenuProps={{ disableScrollLock: true }}
                    onChange={(e) =>
                      handleOnChange("district", e?.target?.value)
                    }
                    disabled={params?.id ? !isEditable : false}
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
                {errors?.district && (
                  <span style={registrationErrText}>{errors.district}</span>
                )}
              </Box>
            </Grid>
          )}

          {/* Upazila */}
          {presentAddress?.country?.toLowerCase() === "bangladesh" && (
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="small" sx={sharedInputStyles}>
                  <InputLabel>Upazilla</InputLabel>
                  <Select
                    value={presentAddress?.upazila}
                    name="upazila"
                    label="Upazila"
                    MenuProps={{ disableScrollLock: true }}
                    onChange={(e) => {
                      handleOnChange("upazila", e?.target?.value);
                    }}
                    disabled={params?.id ? !isEditable : false}
                  >
                    {allUpazila?.map((upazila, i) => {
                      return (
                        <MenuItem key={i} value={upazila?.name}>
                          {upazila?.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {errors?.upazila && (
                  <span style={registrationErrText}>{errors.upazila}</span>
                )}
              </Box>
            </Grid>
          )}

          {/* Post Code */}
          {presentAddress?.country?.toLowerCase() === "bangladesh" && (
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="small" sx={sharedInputStyles}>
                  <InputLabel>Post Code</InputLabel>
                  <Select
                    value={presentAddress?.postCode}
                    name="postCode"
                    label="Postal Code"
                    MenuProps={{ disableScrollLock: true }}
                    onChange={(e) => handleOnChange("postCode", e.target.value)}
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
                {errors?.postCode && (
                  <span style={registrationErrText}>{errors.postCode}</span>
                )}
              </Box>
            </Grid>
          )}

          {/* not Bangladesh */}
          {/* State */}
          {presentAddress?.country?.toLowerCase() !== "bangladesh" && (
            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  {...textFieldProps("state", "State")}
                  value={presentAddress?.state}
                  onChange={(e) => handleOnChange("state", e.target.value)}
                  sx={sharedInputStyles}
                  disabled={params?.id ? !isEditable : false}
                />
                {errors?.state && (
                  <span style={registrationErrText}>{errors.state}</span>
                )}
              </Box>
            </Grid>
          )}

          {/* City */}
          {presentAddress?.country?.toLowerCase() !== "bangladesh" && (
            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  {...textFieldProps("city", "City Name")}
                  value={presentAddress?.city}
                  onChange={(e) => handleOnChange("city", e.target.value)}
                  sx={sharedInputStyles}
                  disabled={params?.id ? !isEditable : false}
                />
                {errors?.city && (
                  <span style={registrationErrText}>{errors.city}</span>
                )}
              </Box>
            </Grid>
          )}

          {/* Police Station Zone */}
          {presentAddress?.country?.toLowerCase() !== "bangladesh" && (
            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={presentAddress?.policeStationZone}
                  {...textFieldProps("policeStationZone", "Police Station")}
                  onChange={(e) =>
                    handleOnChange("policeStationZone", e.target.value)
                  }
                  sx={sharedInputStyles}
                  disabled={params?.id ? !isEditable : false}
                />
                {errors?.policeStationZone && (
                  <span style={registrationErrText}>
                    {errors.policeStationZone}
                  </span>
                )}
              </Box>
            </Grid>
          )}

          {/* Post Code */}
          {presentAddress?.country?.toLowerCase() !== "bangladesh" && (
            <Grid item md={4} sm={6} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={presentAddress?.postCode}
                  {...textFieldProps("postCode", "Post Code")}
                  onChange={(e) => handleOnChange("postCode", e.target.value)}
                  sx={sharedInputStyles}
                  disabled={params?.id ? !isEditable : false}
                />
                {errors?.postCode && (
                  <span style={registrationErrText}>{errors.postCode}</span>
                )}
              </Box>
            </Grid>
          )}

          {/* Address */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ position: "relative" }}>
              <TextField
                value={presentAddress?.address}
                {...textFieldProps("address", "Address")}
                onChange={(e) => handleOnChange("address", e.target.value)}
                sx={sharedInputStyles}
                disabled={params?.id ? !isEditable : false}
              />
              {errors?.address && (
                <span style={registrationErrText}>{errors.address}</span>
              )}
            </Box>
          </Grid>
        </Grid>
      </>
    );
  }
);

export default PresentAddress;
