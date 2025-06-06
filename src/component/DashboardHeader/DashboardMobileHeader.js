import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import {
  Box,
  Skeleton,
  Stack,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { NotificationBox } from "../Dashboard/Notification";
import Support from "../../pages/Support/Support";

const DashboardMobileHeader = () => {
  const [dueBalance, setDueBalance] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [totalBalance, setTotalBalance] = useState(false);
  const [dueBlcMouseEnter, setDueBlcMouseEnter] = useState(false);
  const [totalBlcMouseEnter, setTotalBlcMouseEnter] = useState(false);
  const { jsonHeader } = useAuth();

  const { data: agentData, status } = useQuery({
    queryKey: ["user/profile"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v2/user/account`,
        jsonHeader()
      );
      return data?.data;
    },
    refetchOnWindowFocus: false,
  });

  //TODO:: Fetching data from api
  const { data: balanceData } = useQuery({
    queryKey: ["balanceData"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/ledger/balance`,
        jsonHeader()
      );
      return data?.data;
    },
  });

  useEffect(() => {
    let timeoutId;
    if (!dueBlcMouseEnter) {
      timeoutId = setTimeout(() => {
        setDueBalance(false);
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [dueBlcMouseEnter]);

  useEffect(() => {
    let timeoutId;
    if (!totalBlcMouseEnter) {
      timeoutId = setTimeout(() => {
        setTotalBalance(false);
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [totalBlcMouseEnter]);

  const handledueBalance = (type) => {
    if (type === "dueBalance") {
      setDueBalance(!dueBalance);
      if (!dueBalance) {
        setDueBlcMouseEnter(true);
      }
    }
    if (type === "totalBalance") {
      setTotalBalance(!totalBalance);
      if (!totalBalance) {
        setTotalBlcMouseEnter(true);
      }
    }
  };

  const handleMouseEnter = (type) => {
    if (type === "dueBalance") {
      if (dueBalance) {
        setDueBalance(true);
        setDueBlcMouseEnter(true);
      }
    }
    if (type === "totalBalance") {
      if (totalBalance) {
        setTotalBalance(true);
        setTotalBalance(true);
      }
    }
  };

  const handleMouseLeave = (type) => {
    if (type === "dueBalance") {
      setDueBlcMouseEnter(false);
    }
    if (type === "totalBalance") {
      setTotalBlcMouseEnter(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#18457B",
        width: {
          xs: "100%",
        },
        height: {
          xs: "255px",
          sm: "350px",
        },
        px: {
          xs: "1rem",
          sm: "1.5rem",
          md: "2rem",
        },
        py: {
          xs: "1rem",
          sm: "1.5rem",
          md: "2rem",
        },
        display: {
          xs: "block",
          lg: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {status === "pending" && (
          <Stack>
            <Skeleton
              variant="text"
              sx={{ fontSize: "1rem", width: "100px" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "0.9rem", width: "115px" }}
            />
          </Stack>
        )}
        {status === "success" && (
          <Box>
            <Typography
              sx={{
                color: "var(--white)",
                fontSize: "16px",
                fontWeight: "400",
                textTransform: "uppercase",
              }}
            >
              {agentData?.agent?.agencyInformation?.agencyName}
            </Typography>
            <Typography
              sx={{
                color: "#5799D7",
                fontSize: "13px",
              }}
            >
              Agent, {agentData?.agent?.agentId}
            </Typography>
          </Box>
        )}
        <Box>
          <HeadsetMicIcon
            onClick={() => {
              setSupportOpen(true);
            }}
            sx={{ fontSize: "27px", color: "var(--white)", mr: "15px" }}
          />
          <NotificationsNoneOutlinedIcon
            onClick={() => {
              setNotificationOpen(true);
            }}
            sx={{ fontSize: "30px", color: "var(--white)" }}
          />
        </Box>
        <SwipeableDrawer
          anchor="right"
          open={supportOpen}
          PaperProps={{
            sx: { width: "100%", zIndex: 1300 },
          }}
        >
          {supportOpen && <Support setOpen={setSupportOpen} />}
        </SwipeableDrawer>
        <SwipeableDrawer
          anchor="right"
          open={notificationOpen}
          PaperProps={{
            sx: { width: "100%", zIndex: 1300 },
          }}
        >
          {notificationOpen && (
            <NotificationBox setOpen={setNotificationOpen} />
          )}
        </SwipeableDrawer>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "33px",
          gap: "5px",
        }}
      >
        <Box
          sx={{
            width: "50%",
            height: "100%",
            bgcolor: "var(--primary-color)",
            borderRadius: "19px",
            cursor: "pointer",
            position: "relative",
            px: "5px",
            mt: "20px",
          }}
          onClick={() => handledueBalance("dueBalance")}
          onMouseEnter={() => handleMouseEnter("dueBalance")}
          onMouseLeave={() => handleMouseLeave("dueBalance")}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                pr: "10px",
                color: "white",
                textAlign: dueBalance ? "center" : "end",
                width: "100%",
              }}
            >
              {dueBalance
                ? balanceData?.totalDue?.toLocaleString("en-IN")
                : "Total Balance"}
            </Typography>
          </Box>

          <Box
            sx={{
              fontSize: "12px",
              bgcolor: "white",
              width: "23px",
              height: "23px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              position: "absolute",
              top: "5px",
              left: !dueBalance ? "calc(0% + 6px)" : "calc(100% - 30px)",
              transition: "left 0.3s ease",
            }}
          >
            ৳
          </Box>
        </Box>

        <Box
          sx={{
            width: "50%",
            height: "100%",
            bgcolor: "var(--secondary-color)",
            borderRadius: "19px",
            cursor: "pointer",
            position: "relative",
            px: "5px",
            mt: "20px",
          }}
          onClick={() => handledueBalance("totalBalance")}
          onMouseEnter={() => handleMouseEnter("totalBalance")}
          onMouseLeave={() => handleMouseLeave("totalBalance")}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                pr: "10px",
                color: "white",
                textAlign: totalBalance ? "center" : "end",
                width: "100%",
              }}
            >
              {totalBalance
                ? balanceData?.balance?.toLocaleString("en-IN")
                : "Total Balance"}
            </Typography>
          </Box>

          <Box
            sx={{
              fontSize: "12px",
              bgcolor: "white",
              width: "23px",
              height: "23px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              position: "absolute",
              top: "5px",
              left: !totalBalance ? "calc(0% + 6px)" : "calc(100% - 30px)",
              transition: "left 0.3s ease",
            }}
          >
            ৳
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardMobileHeader;
