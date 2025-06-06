import {
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import Nationality from "../../../component/Register/Nationality";
import {
  registrationErrText,
  sharedInputStyles,
} from "../../../shared/common/styles";
import { sectionTitle, validateField } from "../AddStaff";
import {
  fetchDistrictData,
  fetchDivisionData,
  fetchPostCodeData,
  fetchUpazillaData,
  textFieldProps,
} from "../../../shared/common/functions";
import { useAuth } from "../../../context/AuthProvider";
import { useParams } from "react-router-dom";

const PermanentAddress = forwardRef(
  ({ staff, errors, setErrors, staffAllData }, ref) => {
    const { jsonHeader } = useAuth();
    const params = useParams();
    const [allDivision, setAllDivision] = useState([]);
    const [allDistrict, setAllDistrict] = useState([]);
    const [allUpazila, setAllUpazila] = useState([]);
    const [allPostCode, setAllPostCode] = useState([]);
    const [PermanentAddress, setparsentAddress] = useState({});

    useEffect(() => {
      setparsentAddress({
        parCountry: params?.id
          ? staff?.parCountry
          : staffAllData
            ? staffAllData?.parCountry
            : "",
        parDivision: params?.id
          ? staff?.parDivision
          : staffAllData
            ? staffAllData?.parDivision
            : "",
        parDistrict: params?.id
          ? staff?.parDistrict
          : staffAllData
            ? staffAllData?.parDistrict
            : "",
        parUpazila: params?.id
          ? staff?.parUpazila
          : staffAllData
            ? staffAllData?.parUpazila
            : "",
        parPostalCode: params?.id
          ? staff?.parPostalCode
          : staffAllData
            ? staffAllData?.parPostalCode
            : "",
        parAddress: params?.id
          ? staff?.parAddress
          : staffAllData
            ? staffAllData?.parAddress
            : "",
      });
    }, [params?.id, staffAllData]);

    useEffect(() => {
      if (PermanentAddress?.parCountry?.toLowerCase() === "bangladesh") {
        fetchDivisionData(setAllDivision, jsonHeader);
      }
    }, [PermanentAddress?.parCountry]);

    useEffect(() => {
      fetchDistrictData(
        PermanentAddress?.parDivision,
        setAllDistrict,
        jsonHeader
      );
    }, [PermanentAddress?.parDivision]);

    useEffect(() => {
      fetchUpazillaData(
        PermanentAddress?.parDistrict,
        setAllUpazila,
        jsonHeader
      );
    }, [PermanentAddress?.parDistrict]);

    useEffect(() => {
      fetchPostCodeData(
        PermanentAddress?.parDivision,
        PermanentAddress?.parDistrict,
        setAllPostCode,
        jsonHeader
      );
    }, [PermanentAddress?.parUpazila]);

    const handleOnChange = (name, value) => {
      setparsentAddress({
        ...PermanentAddress,
        [name]: value,
      });

      if (name === "parCountry" && value === "Bangladesh") {
        validateField(name, value, setErrors, value, null);
      } else {
        validateField(
          name,
          value,
          setErrors,
          null,
          PermanentAddress?.parCountry
        );
      }
    };

    useImperativeHandle(ref, () => ({
      getState: () => PermanentAddress,
    }));

    return (
      <>
        <Typography sx={sectionTitle}>Permanent Address Information</Typography>

        <Grid container columnSpacing={2.5} rowSpacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ position: "relative" }}>
              <Nationality
                nationality={PermanentAddress?.parCountry}
                handleChangeNationality={(e) => handleOnChange("parCountry", e)}
                placeholder="Select Country"
              />
              {errors?.parCountry && (
                <span style={registrationErrText}>{errors.parCountry}</span>
              )}
            </Box>
          </Grid>

          {PermanentAddress?.parCountry?.toLowerCase() === "bangladesh" && (
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="small" sx={sharedInputStyles}>
                  <InputLabel>Division</InputLabel>
                  <Select
                    value={PermanentAddress?.parDivision}
                    name="parDivision"
                    label="Division"
                    MenuProps={{ disableScrollLock: true }}
                    onChange={(e) =>
                      handleOnChange("parDivision", e?.target?.value)
                    }
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
                {errors?.parDivision && (
                  <span style={registrationErrText}>{errors.parDivision}</span>
                )}
              </Box>
            </Grid>
          )}

          {PermanentAddress?.parCountry?.toLowerCase() === "bangladesh" && (
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="small" sx={sharedInputStyles}>
                  <InputLabel>District</InputLabel>
                  <Select
                    value={PermanentAddress?.parDistrict}
                    name="parDistrict"
                    label="District"
                    MenuProps={{ disableScrollLock: true }}
                    onChange={(e) =>
                      handleOnChange("parDistrict", e?.target?.value)
                    }
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
                {errors?.parDistrict && (
                  <span style={registrationErrText}>{errors.parDistrict}</span>
                )}
              </Box>
            </Grid>
          )}

          {PermanentAddress?.parCountry?.toLowerCase() === "bangladesh" && (
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="small" sx={sharedInputStyles}>
                  <InputLabel>Upazila</InputLabel>
                  <Select
                    value={PermanentAddress?.parUpazila}
                    name="parUpazila"
                    label="Upazila"
                    MenuProps={{ disableScrollLock: true }}
                    onChange={(e) => {
                      handleOnChange("parUpazila", e?.target?.value);
                    }}
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
                {errors?.parUpazila && (
                  <span style={registrationErrText}>{errors.parUpazila}</span>
                )}
              </Box>
            </Grid>
          )}

          {PermanentAddress?.parCountry?.toLowerCase() === "bangladesh" && (
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="small" sx={sharedInputStyles}>
                  <InputLabel>Postal Code</InputLabel>
                  <Select
                    value={PermanentAddress?.parPostalCode || ""}
                    name="parPostCode"
                    label="Postal Code"
                    MenuProps={{ disableScrollLock: true }}
                    onChange={(e) =>
                      handleOnChange("parPostalCode", e.target.value)
                    }
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
                {errors?.parPostalCode && (
                  <span style={registrationErrText}>
                    {errors.parPostalCode}
                  </span>
                )}
              </Box>
            </Grid>
          )}

          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ position: "relative" }}>
              <TextField
                value={PermanentAddress?.parAddress}
                {...textFieldProps("parAddress", "Address")}
                onChange={(e) => handleOnChange("parAddress", e.target.value)}
                sx={sharedInputStyles}
                InputLabelProps={{
                  shrink: Boolean(PermanentAddress?.parAddress),
                }}
              />
              {errors?.parAddress && (
                <span style={registrationErrText}>{errors.parAddress}</span>
              )}
            </Box>
          </Grid>
        </Grid>
      </>
    );
  }
);

export default PermanentAddress;
