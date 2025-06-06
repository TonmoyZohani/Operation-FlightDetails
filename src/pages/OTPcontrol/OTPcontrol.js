import {
  Box,
  FormControlLabel,
  Grid,
  styled,
  Switch,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import CustomAlert from "../../component/Alert/CustomAlert";
import CustomToast from "../../component/Alert/CustomToast";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import { convertCamelToTitle } from "../../shared/common/functions";
import PageTitle from "../../shared/common/PageTitle";
import GoogleAuthenticator from "./components/GoogleAuthenticator";
import OTPSkeleton from "./components/OTPSkeleton";

const OTPcontrol = () => {
  const queryClient = useQueryClient();
  const { jsonHeader } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const { data: switches, status } = useQuery({
    queryKey: ["otp/switches"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/otp/switches`,
        jsonHeader()
      );
      return data?.data;
    },
  });

  const handleChangeSwitch = (checked, name, queryKey, endPoint) => {
    CustomAlert({
      success: "warning",
      message: `Are you sure you want to <b>${!checked ? "ON" : "OFF"}</b> ${name}`,
    }).then(async (res) => {
      if (res.isConfirmed) {
        setIsLoading(true);
        const body = { access: !checked };
        try {
          const { data } = await axios.patch(
            `${process.env.REACT_APP_BASE_URL}/api/v1/${endPoint}`,
            body,
            jsonHeader()
          );

          if (data?.success) {
            showToast("success", data?.message);
            queryClient.invalidateQueries([queryKey]);
          }
        } catch (e) {
          console.error(e?.response?.data?.message);
          showToast("error", e?.response?.data?.message || "An error occurred");
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  if (status === "pending") return <OTPSkeleton />;

  return (
    <>
      <PageTitle title={"OTP Configurations"} />

      <Box
        sx={{
          position: "relative",
          p: "16px 24px 24px 24px",
          bgcolor: "white",
          borderRadius: "0 0 5px 5px",
        }}
      >
        <AgencyLoginControl
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          showToast={showToast}
          handleChangeSwitch={(item) => {
            handleChangeSwitch(
              item?.userAccess,
              convertCamelToTitle(item?.provider),
              "user/account",
              `otp/options/${item?.providerId}`
            );
          }}
        />

        <AirTicketServices
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          switches={switches}
          handleChangeSwitch={(item) => {
            handleChangeSwitch(
              item?.userAccess,
              item?.otpSwitchOption?.operationName,
              "otp/switches",
              `otp/switches/${item?.otpSwitchOption?.id}`
            );
          }}
        />
      </Box>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </>
  );
};

const AgencyLoginControl = ({
  isLoading,
  setIsLoading,
  handleChangeSwitch,
  showToast,
}) => {
  const { agentData } = useOutletContext();

  return (
    <>
      <Typography sx={{ fontSize: "16px", color: "var(--dark-gray)" }}>
        OTP Control For <span style={{ fontWeight: "600" }}> Agency Login</span>
      </Typography>

      <Grid container spacing={3} mt={"-10px"}>
        {agentData?.security.map((item, i) => (
          <Grid key={i} item md={4}>
            <Box sx={{ position: "relative" }}>
              <AllSwitches
                item={item}
                isDisabled={item?.control === "admin" || isLoading}
                handleChangeSwitch={handleChangeSwitch}
                name={convertCamelToTitle(item?.provider)}
                checked={item?.userAccess}
              />

              {item?.provider === "googleAuthenticator" && (
                <GoogleAuthenticator
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  showToast={showToast}
                />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
const AirTicketServices = ({ isLoading, switches, handleChangeSwitch }) => {
  return (
    <>
      <Typography sx={{ fontSize: "16px", color: "var(--dark-gray)", mt: 4.5 }}>
        OTP Control For{" "}
        <span style={{ fontWeight: "600" }}>Air Ticket Service</span>
      </Typography>

      <Grid container spacing={3} mt={"-10px"}>
        {switches.map((item, i) => (
          <Grid key={i} item md={3}>
            <AllSwitches
              item={item}
              isDisabled={item?.control === "admin" || isLoading}
              handleChangeSwitch={handleChangeSwitch}
              name={item?.otpSwitchOption?.operationName}
              checked={
                item?.control === "admin" ? item?.adminAccess : item?.userAccess
              }
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

const AllSwitches = ({
  item,
  isDisabled,
  handleChangeSwitch,
  name,
  checked,
}) => {
  return (
    <Box
      sx={{
        py: 1,
        px: 2,
        border: "1px solid var(--border)",
        borderRadius: "5px",
      }}
    >
      <Typography
        sx={{
          fontSize: "14px",
          color: "var(--dark-gray)",
          textTransform: "capitalize",
        }}
      >
        {name}
      </Typography>
      <Box
        pb={0.5}
        sx={{ pl: 1.2, mt: 1.5, pointerEvents: isDisabled && "none" }}
      >
        <FormControlLabel
          onClick={() => handleChangeSwitch(item)}
          disabled={isDisabled}
          control={<CustomSwitch checked={checked} />}
          sx={{ position: "relative" }}
          label={
            <Typography
              sx={{
                position: "absolute",
                color: "white",
                fontSize: "13px",
                left: checked ? "6px" : "20px",
                transform: "translateY(4%)",
              }}
            >
              {checked ? "On" : "Off"}
            </Typography>
          }
        />
      </Box>
    </Box>
  );
};

export const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 45,
  height: 19,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": { width: 10 },
    "& .MuiSwitch-switchBase.Mui-checked": { transform: "translateX(9px)" },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(26px)",
      color: "#fff",
      "& + .MuiSwitch-track": { opacity: 1, backgroundColor: "var(--green)" },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 15,
    height: 15,
    borderRadius: 7,
    transition: theme.transitions.create(["width"], { duration: 200 }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 20 / 2,
    opacity: 1,
    backgroundColor: "#dc143c",
  },
  "& .Mui-disabled": {
    opacity: 0.5,
    "& .MuiSwitch-thumb": { backgroundColor: "#b0b0b0" },
    "& .MuiSwitch-track": { backgroundColor: "#ccc" },
    "&.Mui-checked": {
      "& + .MuiSwitch-track": { backgroundColor: "#ccc" },
    },
  },
}));

export default OTPcontrol;
