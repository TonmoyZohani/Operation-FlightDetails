import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  CircularProgress,
  Grid,
  Modal,
  styled,
  Typography,
  Zoom,
} from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { iconBox } from "../Register/RegisterPortal";

const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: 5,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#837979",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  cursor: "pointer",
}));

const Notice = ({ open, setOpen }) => {
  const { setIsShowNotice, jsonHeader } = useAuth();
  const [crrPopupIndex, setCrrPopupIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ["support/popup"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/common/support/popup`,
        jsonHeader()
      );
      // return [];
      return data?.data[0];
    },
    refetchOnWindowFocus: false,
  });

  const activePopup =
    data?.length > 0
      ? data?.filter(
          (popup) => popup?.wings === "FFI" && popup?.status === "active"
        )
      : [];

  const crrPop = activePopup[crrPopupIndex] || {};

  useEffect(() => {
    if (isLoading) return;

    const startTimer = () => {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 100 / 50;
          if (newSeconds >= 100) {
            setCrrPopupIndex((prevIndex) => {
              if (prevIndex + 1 === activePopup.length) {
                setOpen(false);
                setIsShowNotice(false);
                setElapsedSeconds(0);
                return 0;
              }
              return (prevIndex + 1) % activePopup.length;
            });
            return 1;
          }
          return newSeconds;
        });
      }, 100);
    };

    if (!hovered) startTimer();

    return () => clearInterval(intervalRef.current);
  }, [hovered, activePopup.length]);

  const handleMouseEnter = () => {
    setHovered(true);
    clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <Box>
      <Modal
        TransitionComponent={Zoom}
        open={open && data?.length > 0}
        sx={{ zIndex: "10000" }}
      >
        <Box
          sx={{
            height: "100vh",
            bgcolor: "#11111190",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            px: {
              xs: 2,
              lg: 10,
            },
            py: {
              xs: 2,
              lg: 3,
            },
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                position: "relative",
              }}
            >
              <CircularProgress size={60} sx={{ color: "white" }} />

              <Box
                onClick={() => {
                  setOpen(false);
                  setIsShowNotice(false);
                  setCrrPopupIndex(0);
                  setElapsedSeconds(0);
                }}
                sx={{
                  ...iconBox,
                  bgcolor: "white",
                  position: "absolute",
                }}
              >
                <CloseIcon
                  sx={{
                    color: "#111",
                    fontSize: "20px",
                    borderRadius: "50%",
                  }}
                />
              </Box>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <Box sx={{ width: "calc(100% - 34px)" }}>
                  <Grid container columnSpacing={"20px"}>
                    {activePopup?.map((_, i, arr) => (
                      <Grid
                        item
                        xs={12 / arr.length}
                        key={i}
                        onClick={() => {
                          setElapsedSeconds(0);
                          setCrrPopupIndex(i);
                        }}
                      >
                        <BorderLinearProgress
                          key={i}
                          variant="determinate"
                          value={
                            crrPopupIndex === i
                              ? elapsedSeconds
                              : crrPopupIndex > i
                                ? 100
                                : 0
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box
                  onClick={() => {
                    setOpen(false);
                    setIsShowNotice(false);
                    setCrrPopupIndex(0);
                    setElapsedSeconds(0);
                  }}
                  sx={{ ...iconBox, bgcolor: "white" }}
                >
                  <CloseIcon
                    sx={{
                      color: "#111",
                      fontSize: "20px",
                      borderRadius: "50%",
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box
                  sx={{
                    "@media (max-width: 1600px)": {
                      width: "508px",
                      height: "475px",
                    },
                    "@media (min-width: 1601px)": {
                      width: "638px",
                      height: "605px",
                    },
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={crrPop?.webImage}
                    alt={crrPop?.title}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Box>
              </Box>

              <Box sx={{ color: "white" }}>
                <Typography sx={{ fontSize: "1.2rem" }}>
                  {crrPop?.title}
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    fontSize: {
                      xs: "0.75rem",
                      lg: "0.875rem",
                    },
                    lineHeight: "1rem",
                  }}
                >
                  {crrPop?.paragraph}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Notice;
