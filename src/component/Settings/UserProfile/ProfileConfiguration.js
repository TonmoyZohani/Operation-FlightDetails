import {
  Box,
  Grid,
  Button,
  Typography,
  TextField,
  Modal,
  Select,
  FormControl,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import { depositBtn, sharedInputStyles } from "../../../shared/common/styles";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../../Alert/CustomAlert";
import axios from "axios";
import { useAuth } from "../../../context/AuthProvider";
import { textFieldProps } from "../../../shared/common/functions";
import { buttonStyleEye } from "../../Register/GeneraInfo";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CustomCheckBox from "../../CustomCheckbox/CustomCheckbox";
import PageTitle from "../../../shared/common/PageTitle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CustomSwitch } from "../../../style/style";
import moment from "moment";
import secureLocalStorage from "react-secure-storage";
import CustomToast from "../../Alert/CustomToast";
import useToast from "../../../hook/useToast";
import HttpsRoundedIcon from "@mui/icons-material/HttpsRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";

const ProfileConfiguration = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const deviceToken = secureLocalStorage.getItem("deviceToken");
  const [selectedValue, setSelectedValue] = useState(10);
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const { jsonHeader } = useAuth();
  const [password, setPassword] = useState({ logoutAll: false });
  const [passShow, setPassShow] = useState([]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setPassword({
      ...password,
      [name]: value,
    });
  };

  const toggleString = (value) => {
    setPassShow((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleCheckboxChange = (key, isChecked) => {
    setPassword((prev) => {
      if (isChecked) return { ...prev, [key]: true };
      else return { ...prev, [key]: false };
    });
  };

  const handleChangePassword = async () => {
    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure you want to Change Password?",
    });

    if (!result.isConfirmed) {
      return;
    }

    if (password?.newPassword !== password?.confirmPassword) {
      CustomAlert({
        success: "warning",
        message: "New Password and Confirm Password do not match.",
        alertFor: "ok",
      });
      return;
    }

    try {
      const body = {
        oldPassword: password?.oldPassword,
        newPassword: password?.newPassword,
        logoutAll: password?.logoutAll,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v2/user/account/change-password`,
        body,
        jsonHeader()
      );

      if (response?.data?.success) {
        CustomAlert({
          success: response?.data?.success,
          message: response?.data?.message,
        });
        setOpen(false);
        setPassword({});
      }
    } catch (e) {
      CustomAlert({
        success: e.response?.data?.success,
        message: e.response?.data?.message,
      });
    }
  };

  const { data: notificationData, isLoading } = useQuery({
    queryKey: ["notificationData"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/notifications/enable`,
        jsonHeader()
      );
      return data?.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (status) => {
      const body = {
        deviceToken: deviceToken,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/notifications/${status}`,
        body,
        jsonHeader()
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        showToast("success", data.message);
        queryClient.invalidateQueries(["notificationData"]);
      }
    },
    onError: (error) => {
      showToast("error", error?.message || "Something went wrong");
    },
  });

  const snoozeMutation = useMutation({
    mutationFn: async (duration) => {
      const body = {
        duration: duration,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/notifications/snooze`,
        body,
        jsonHeader()
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        showToast("success", data.message);
        queryClient.invalidateQueries(["notificationData"]);
      }
    },
    onError: (error) => {
      showToast("error", error?.message || "Something went wrong");
    },
  });

  const isSnoozed =
    notificationData?.notificationSnoozeTime &&
    moment(notificationData.notificationSnoozeTime).isAfter(moment());

  const firstOptionLabel = isSnoozed
    ? `Snoozed till at ${moment(notificationData?.notificationSnoozeTime).format("HH:mm")}`
    : "Active";

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);

    if (value === 20) {
      handleSnooze(15);
    } else if (value === 30) {
      handleSnooze(30);
    }
  };

  const handleNotification = async (status) => {
    const result = await CustomAlert({
      success: "warning",
      message: `Are you sure you want to ${status} this notification?`,
    });

    if (!result.isConfirmed) return;

    mutation.mutate(status);
  };

  const handleSnooze = async (duration) => {
    const result = await CustomAlert({
      success: "warning",
      message: `Are you sure you want snooze this?`,
    });

    if (!result.isConfirmed) return;

    snoozeMutation.mutate(duration);
  };

  if (isLoading) return null;

  const CardItem = ({ icon, title, subtitle, onClick, extraContent }) => (
    <Grid item md={2.8}>
      <Box
        sx={{ ...cardStyle, display: "flex", flexDirection: "column" }}
        onClick={onClick}
      >
        <Box sx={iconBoxStyle}>{icon}</Box>
        <Box sx={contentBoxStyle}>
          <Typography sx={titleStyle}>{title}</Typography>
          <Typography sx={subtitleStyle}>{subtitle}</Typography>
          {extraContent}
        </Box>
      </Box>
    </Grid>
  );

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: "5px",
        width: {
          xs: "90%",
          lg: "100%",
        },
        mx: "auto",
        mt: {
          xs: 5,
          lg: 0,
        },
        minHeight: "78vh",
      }}
    >
      <PageTitle title={"Profile Configuration"} />
      <Grid container spacing={2} sx={{ padding: "16px 24px" }}>
        <CardItem
          icon={<HttpsRoundedIcon sx={{ color: "#fff", fontSize: "17px" }} />}
          title="Password Change"
          subtitle="Update to your password regularly to enhance your account security."
          onClick={() => {
            setOpen(true);
            setModalType("changePassword");
          }}
        />
        <CardItem
          icon={
            <SecurityRoundedIcon sx={{ color: "#fff", fontSize: "17px" }} />
          }
          title="2FA Authentications"
          subtitle="Add an extra layer of protection in your account with 2FA authentication."
          onClick={() => navigate("/dashboard/twoFactorAuthentication")}
        />
        <Grid item md={2.8}>
          <Box sx={{ ...cardStyle, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={iconBoxStyle}>
                <NotificationsRoundedIcon
                  sx={{ color: "#fff", fontSize: "17px" }}
                />
              </Box>
              <CustomSwitch
                checked={notificationData?.enable || false}
                onChange={(_, checked) =>
                  handleNotification(checked ? "enable" : "disable")
                }
              />
            </Box>
            <Box sx={{ ...contentBoxStyle, mt: "6px" }}>
              <Typography sx={titleStyle}>Notification Settings</Typography>
              <Typography sx={subtitleStyle}>
                Customize Your Notifications Options
              </Typography>
              <FormControl sx={{ minWidth: "70%", mt: "12px" }}>
                <Select
                  value={selectedValue}
                  onChange={handleChange}
                  displayEmpty
                  disabled={!notificationData?.enable}
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{
                    height: 25,
                    "& .MuiSelect-select": {
                      paddingTop: "6px",
                      paddingBottom: "6px",
                      fontSize: "12px",
                    },
                  }}
                >
                  <MenuItem value={10}>{firstOptionLabel}</MenuItem>
                  <MenuItem value={20}>Snooze For 15 Minutes</MenuItem>
                  <MenuItem value={30}>Snooze For 30 Minutes</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          {modalType === "changePassword" && (
            <>
              <Typography
                sx={{ fontSize: "18px", color: "var(--secondary-color)" }}
              >
                Change Password
              </Typography>
              <Grid container spacing={3} my={0.25}>
                <Grid item md={12} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps(
                        "oldPassword",
                        "Old Password",
                        passShow?.includes("oldPassword") ? "text" : "password"
                      )}
                      onChange={handleOnChange}
                      sx={sharedInputStyles}
                    />

                    <button
                      type="button"
                      style={buttonStyleEye}
                      onClick={() => toggleString("oldPassword")}
                    >
                      {passShow?.includes("oldPassword") ? (
                        <VisibilityOffIcon />
                      ) : (
                        <RemoveRedEyeIcon />
                      )}
                    </button>
                  </Box>
                </Grid>

                <Grid item md={12} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps(
                        "newPassword",
                        "New Password",
                        passShow?.includes("newPassword") ? "text" : "password"
                      )}
                      onChange={handleOnChange}
                      sx={sharedInputStyles}
                    />

                    <button
                      type="button"
                      style={buttonStyleEye}
                      onClick={() => toggleString("newPassword")}
                    >
                      {passShow?.includes("newPassword") ? (
                        <VisibilityOffIcon />
                      ) : (
                        <RemoveRedEyeIcon />
                      )}
                    </button>
                  </Box>
                </Grid>

                <Grid item md={12} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps(
                        "confirmPassword",
                        "Confirm Password",
                        passShow?.includes("confirmPassword")
                          ? "text"
                          : "password"
                      )}
                      onChange={handleOnChange}
                      sx={sharedInputStyles}
                    />

                    <button
                      type="button"
                      style={buttonStyleEye}
                      onClick={() => toggleString("confirmPassword")}
                    >
                      {passShow?.includes("confirmPassword") ? (
                        <VisibilityOffIcon />
                      ) : (
                        <RemoveRedEyeIcon />
                      )}
                    </button>
                  </Box>
                </Grid>

                <Grid item md={12}>
                  <CustomCheckBox
                    style={{ color: "var(--gray)", lineHeight: 1 }}
                    label="Logout from All Device."
                    fontSize={"13px"}
                    handleChange={(e) =>
                      handleCheckboxChange("logoutAll", e.target.checked)
                    }
                  />
                </Grid>
              </Grid>

              <Button
                sx={{
                  ...depositBtn,
                  justifyContent: "left",
                }}
                onClick={handleChangePassword}
              >
                Proceed to Change Password
              </Button>
            </>
          )}
        </Box>
      </Modal>
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%",
    md: 600,
  },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
  outline: "none",
};

const cardStyle = {
  minHeight: "150px",
  borderRadius: "9px",
  border: "1px solid #ddd",
  p: "12px",
  color: "var(--light-blue)",
  cursor: "pointer",
};

const iconBoxStyle = {
  width: "30px",
  height: "30px",
  bgcolor: "#E67C00",
  borderRadius: "5px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  ml: "5px",
};

const contentBoxStyle = {
  ml: "5px",
  mt: "10px",
};

const titleStyle = {
  fontSize: "15px",
  mt: "5px",
};

const subtitleStyle = {
  color: "var(--light-gray)",
  fontSize: "12px",
};

export default ProfileConfiguration;
