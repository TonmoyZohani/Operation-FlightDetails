import {
  Box,
  Button,
  Grid,
  Skeleton,
  SwipeableDrawer,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import FlightIcon from "@mui/icons-material/Flight";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import NotificationsIcon from "@mui/icons-material/Notifications";
import moment from "moment";
import { PiCurrencyDollarSimpleLight } from "react-icons/pi";
import CloseIcon from "@mui/icons-material/Close";
import { iconBox } from "../Register/RegisterPortal";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { jsonHeader } = useAuth();

  const { data: notifications } = useQuery({
    queryKey: ["user/notifications/stats"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/notifications/stats`,
        jsonHeader()
      );

      return data?.data;
    },
    staleTime: 0,
  });

  return (
    <>
      <Box
        onClick={() => {
          setOpen(true);
          if (notifications?.unseen > 0) {
            queryClient.invalidateQueries(["user/notifications/stats"]);
          }
        }}
        sx={{
          bgcolor: "var(--primary-color)",
          width: "38px",
          height: "38px",
          display: { xs: "none", lg: "flex" },
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "50%",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <NotificationsIcon sx={{ color: "var(--white)", fontSize: "25px" }} />
        {notifications?.unseen > 0 && (
          <Typography
            sx={{
              position: "absolute",
              top: -10,
              right: -10,
              height: "23px",
              width: "23px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "12px",
              bgcolor: "white",
              border: "1px solid var(--primary-color)",
              borderRadius: "50%",
            }}
          >
            {notifications?.unseen}
          </Typography>
        )}
      </Box>

      <SwipeableDrawer
        anchor="right"
        open={open}
        PaperProps={{
          sx: { width: "27%", zIndex: 999999999 },
        }}
      >
        {open && <NotificationBox setOpen={setOpen} />}
      </SwipeableDrawer>
    </>
  );
};

export const NotificationBox = ({ setOpen }) => {
  const { jsonHeader } = useAuth();
  const observer = useRef();
  const navigate = useNavigate();
  const [tab, setTab] = useState(initialTab);

  const {
    data: datas,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["user/notifications", tab],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/v1/user/notifications?page=${pageParam}&deposit=${tab?.deposit}&agent=${tab?.agent}&branch=${tab?.branch}&booking=${tab?.booking}`,
          jsonHeader()
        );

        return data?.data;
      } catch (err) {
        const msj = err?.response?.data?.message;
      }
    },

    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.pagination?.page;
      const totalPage = lastPage?.pagination?.totalPages;
      const nextPage = lastPage?.pagination?.page + 1;

      if (currentPage < totalPage) {
        return nextPage;
      }
      return undefined;
    },
    retry: false,
    staleTime: 0,
    cacheTime: 0,
  });

  const lastItemRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const notificationData = datas?.pages.flatMap((page) => page?.data) || [];

  const handleChangeTab = (option) => {
    if (option === "all" || option === "promotions") {
      setTab(initialTab);
      return;
    }

    setTab({
      title: option,
      deposit: option === "deposit" ? true : false,
      agent: option === "others" ? true : false,
      branch: option === "others" ? true : false,
      booking: option === "bookings" ? true : false,
    });
  };

  const handleNavigateNotification = async (item) => {
    const moduleInfo = item?.moduleInfo?.module.toLowerCase();

    setOpen(false);
    if (moduleInfo.includes("deposit")) {
      navigate("/dashboard/depositDetails", {
        state: {
          id: item?.moduleInfo?.id,
          depositType: item?.moduleInfo?.module,
        },
      });
    } else if (moduleInfo.includes("balance")) {
      navigate("/dashboard/balanceTransfer");
    } else if (moduleInfo.includes("booking")) {
      navigate(`/dashboard/booking/airtickets/all/${item?.moduleInfo?.id}`);
    }

    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/notifications/${item?.id}`,
        jsonHeader()
      );
      return data;
    } catch (e) {
      console.error(e?.response);
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box
        sx={{
          ...alignCenter,
          justifyContent: "space-between",
          px: 2,
          pt: {
            xs: 2,
            lg: 0,
          },
          mb: 1.5,
        }}
      >
        <Typography sx={{ fontSize: "1.06rem", fontWeight: "500" }}>
          Notification
        </Typography>

        <Tooltip title="Close">
          <Box
            onClick={() => setOpen(false)}
            sx={{ ...iconBox, height: "28px", width: "28px" }}
          >
            <CloseIcon
              sx={{
                color: "white",
                fontSize: "20px",
                borderRadius: "50%",
              }}
            />
          </Box>
        </Tooltip>
      </Box>
      <Grid container px={2} pb={1}>
        {options.map((option, i, arr) => {
          return (
            <Grid
              item
              xs={i === 0 ? 1.5 : 10.5 / (arr.length - 1)}
              md={i === 0 ? 1.5 : 10.5 / (arr.length - 1)}
              key={i}
            >
              <Box
                onClick={() => handleChangeTab(option)}
                sx={{ width: "100%" }}
              >
                <Button
                  sx={{
                    textTransform: "capitalize",
                    color:
                      tab?.title === option
                        ? "var(--primary-color)"
                        : "#B6B6CC",
                    borderBottom: "1px solid",
                    borderColor:
                      tab?.title === option
                        ? "var(--primary-color)"
                        : "#B6B6CC",
                    borderRadius: "0",
                    width: "100%",
                    justifyContent: "start",
                    pr: 0,
                    minWidth: "0px",
                    fontSize: "12px",
                  }}
                >
                  {option}
                </Button>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Box
        sx={{
          height: "calc(100vh - 120px)",
          overflowY: "auto",
          pl: 2,
          pr: 1.25,
        }}
      >
        {status === "pending" && (
          <>
            {[...new Array(7)].map((_, i) => (
              <React.Fragment key={i}>
                <SkeletonArea />
              </React.Fragment>
            ))}
          </>
        )}

        {status === "success" && (
          <>
            {notificationData.length > 0 ? (
              <>
                {notificationData.map((item, i) => {
                  return (
                    <Box
                      ref={
                        i === notificationData.length - 1 ? lastItemRef : null
                      }
                      onClick={() =>
                        item?.moduleInfo?.module &&
                        handleNavigateNotification(item)
                      }
                      sx={{
                        ...alignCenter,
                        display: item === undefined ? "none" : "flex",
                        borderBottom: "1px solid #eee",
                        py: 1,
                        gap: "15px",
                        pl: 2,
                        cursor: item?.moduleInfo?.module && "pointer",
                        ":hover": { bgcolor: "#f5f5f5" },
                      }}
                      key={i}
                    >
                      <Box
                        sx={{
                          width: "35px",
                          height: "35px",
                          borderRadius: "50%",
                          bgcolor: "#eee",
                          ...alignCenter,
                          justifyContent: "center",
                        }}
                      >
                        {(item?.moduleInfo?.module
                          .toLowerCase()
                          .includes("deposit") ||
                          item?.moduleInfo?.module
                            .toLowerCase()
                            .includes("balance")) && (
                          <PiCurrencyDollarSimpleLight
                            style={{ fontSize: "20px" }}
                          />
                        )}

                        {item?.moduleInfo?.module
                          .toLowerCase()
                          .includes("booking") && (
                          <FlightIcon style={{ fontSize: "20px" }} />
                        )}

                        {!item?.moduleInfo?.module && (
                          <NotificationsIcon style={{ fontSize: "20px" }} />
                        )}
                      </Box>
                      <Box sx={{ width: "calc(100% - 45px)" }}>
                        <Box sx={{ ...alignCenter, gap: "5px" }}>
                          <Typography sx={{ fontSize: "15px" }}>
                            {item?.title}
                          </Typography>
                          {item?.userNotification?.clickedAt === null && (
                            <Box
                              sx={{
                                height: "7px",
                                width: "7px",
                                bgcolor: "var(--green)",
                                borderRadius: "50%",
                              }}
                            />
                          )}
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: item?.userNotification?.clickedAt && "#777",
                            lineHeight: "1",
                            fontWeight:
                              item?.userNotification?.clickedAt === null
                                ? "600"
                                : "400",
                          }}
                        >
                          {item?.body}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "11px", color: "#aaa", mt: 1.5 }}
                        >
                          {moment(item?.createdAt).format(
                            "hh:mm:ss A Do MMMM YYYY"
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
                {isFetchingNextPage && <SkeletonArea />}
              </>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  ...alignCenter,
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{ fontSize: "18px", color: "var(--dark-gray)" }}
                >
                  No Notification Found
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

const SkeletonArea = () => {
  return (
    <Box
      sx={{
        py: 1,
        gap: "15px",
        pl: 2,
        ...alignCenter,
        borderBottom: "1px solid #eee",
      }}
    >
      <Skeleton variant="circular" width={"35px"} height={"35px"} />

      <Box sx={{ width: "calc(100% - 45px)" }}>
        <Skeleton animation="wave" width={"60%"} height={"22.5px"} />
        <Skeleton animation="wave" width={"90%"} height={"24px"} />
        <Skeleton
          animation="wave"
          width={"40%"}
          height={"16.5px"}
          sx={{ mt: "12px" }}
        />
      </Box>
    </Box>
  );
};

const alignCenter = { display: "flex", alignItems: "center" };

const options = ["all", "bookings", "deposit", "others", "promotions"];

const stepLine = { height: "1px", transition: "width 0.5s" };

const initialTab = {
  title: "all",
  deposit: true,
  agent: true,
  branch: true,
  booking: true,
};
export default Notification;
