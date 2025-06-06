import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import PageTitle from "../../shared/common/PageTitle";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import { primaryBtn } from "../../shared/common/styles";
import { useAuth } from "../../context/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useUnAuthorized from "../../shared/common/useUnAuthorized";
import useToast from "../../hook/useToast";
import CustomAlert from "../../component/Alert/CustomAlert";
import CustomLoadingAlert from "../../component/Alert/CustomLoadingAlert";
import CustomToast from "../../component/Alert/CustomToast";

const buttonStyle = {
  fontSize: "12px",
  textTransform: "uppercase",
  color: "var(--white)",
  width: "fit-content",
  p: "2px 5px",
  borderRadius: "2px",
  mb: 0.5,
};

const DeviceControl = () => {
  const { jsonHeader } = useAuth();
  const { checkUnAuthorized } = useUnAuthorized();
  const queryClient = useQueryClient();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [isLoading, setIsLoading] = useState(false);
  const allDevice = [];

  const { data: userSessions } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/v2/user/sessions`,
          jsonHeader()
        );
        return data?.data;
      } catch (error) {
        if (error?.response?.status === 401) {
          showToast("error", "You are unauthorized to access this site.");
          checkUnAuthorized(error);
        }
        throw error;
      }
    },
  });

  const handleRemoveSession = async (session) => {
    setIsLoading(true);
  
    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/user/sessions/${session?.id}`;
  
    const result = await CustomAlert({
      success: "warning",
      message: session?.currentSession
        ? "Are you sure? If you remove this device, you will be logged out."
        : "Are you sure? You want to remove this device?",
    });
  
    if (result.isConfirmed) {
      try {
        const response = await axios.patch(url, {}, jsonHeader());
        const userData = response?.data;
        showToast("success", userData?.message);
  
        queryClient.invalidateQueries(["session"]);
      } catch (err) {
        const message = err?.response?.data?.message || "An error occurred";
        showToast("error", message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <PageTitle title={"Device Session Control"} />

      <Box
        sx={{
          position: "relative",
          p: "16px 24px 24px 24px",
          bgcolor: "white",
          borderRadius: "0 0 5px 5px",
        }}
      >
        <Box sx={{ width: "100%", mx: "0 auto" }}>
          <Box sx={{ mt: 2.5 }}>
            {userSessions
              ?.sort((a, b) => (b?.currentSession ? 1 : -1))
              ?.map((session, i) => {
                return (
                  <Box
                    key={i}
                    sx={{
                      p: 1,
                      bgcolor: "#f0f2f5",
                      mt: 1.5,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      pl: 1.5,
                      borderRadius: "4px",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "18px",
                          color: "var(--black)",
                          textTransform: "capitalize",
                          mb: 0.5,
                        }}
                      >
                        {session?.loginAttempt?.platform}
                      </Typography>
                      <Box sx={{ display: "flex", gap: "10px", mt: "10px" }}>
                        <Typography
                          sx={{
                            bgcolor: "var(--primary-color)",
                            ...buttonStyle,
                          }}
                        >
                          {session?.loginAttempt?.devicePlatform}
                        </Typography>

                        <Typography
                          sx={{
                            bgcolor: "#688cd5",
                            ...buttonStyle,
                          }}
                        >
                          Last Activity -{" "}
                          {moment(session?.lastActivity).format(
                            "hh:mm:ss A DD MMM YYYY"
                          )}
                        </Typography>

                        <Typography
                          sx={{
                            bgcolor: "#cc655d",
                            ...buttonStyle,
                          }}
                        >
                          Expire At -{" "}
                          {moment(session?.expAt).format(
                            "hh:mm:ss A DD MMM YYYY"
                          )}
                        </Typography>

                        {session?.currentSession && (
                          <Typography
                            sx={{
                              bgcolor: "var(--green)",
                              ...buttonStyle,
                            }}
                          >
                            Current Device
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <DeleteIcon
                      sx={{
                        cursor: "pointer",
                        color: "var(--primary-color)",
                      }}
                      onClick={() => handleRemoveSession(session)}
                    />
                  </Box>
                );
              })}
          </Box>
        </Box>
      </Box>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
        type="notification"
      />

      <CustomLoadingAlert
        open={isLoading}
        text={"We Are Processing to remove this device"}
      />
    </>
  );
};

export default DeviceControl;
