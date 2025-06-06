import { Box, Button, Skeleton, Tooltip, Typography } from "@mui/material";
import { FiMinus } from "react-icons/fi";
import {
  boxContainer,
  iconBox,
  labelStyle,
  titleBoxContainer,
} from "../LiveSupport";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../../../context/AuthProvider";
import NotFound from "../../../NotFound/NoFound";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import ApartmentIcon from "@mui/icons-material/Apartment";
import EmailIcon from "@mui/icons-material/Email";
import moment from "moment";

const AllMessage = ({ open, setId, setOpen, setSelectedMsj }) => {
  const { jsonHeader } = useAuth();

  const {
    data: allTicket,
    status,
    error,
  } = useQuery({
    queryKey: ["support-ticket/ticket"],
    queryFn: async () => {
      const queryParams = new URLSearchParams({ page: 1, limit: 10 });

      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/support-ticket/ticket?${queryParams}`,
        jsonHeader()
      );
      return data;
    },
    enabled: open,
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const ticketData = allTicket?.data?.data ?? [];

  return (
    <Box sx={boxContainer}>
      <Box>
        <Box sx={titleBoxContainer}>
          <Box>
            <Typography sx={labelStyle}>All Message</Typography>
            <Typography sx={{ ...labelStyle, fontSize: "12px" }}>
              Get Your Support Chat List
            </Typography>
          </Box>

          <Box onClick={() => setOpen(false)} sx={iconBox}>
            <FiMinus style={{ color: "var(--white)", fontSize: "22px" }} />
          </Box>
        </Box>
        <Box sx={{ maxHeight: "410px", overflowY: "auto", px: 2.5 }}>
          {status === "pending"
            ? [...new Array(5)].map((_, i) => <AllMessageLoader key={i} />)
            : status === "success"
              ? ticketData.map((message, i) => {
                  return (
                    <Box
                      onClick={() => setId(2)}
                      key={i}
                      borderBottom={"1px solid var(--border)"}
                      sx={{ py: 1 }}
                    >
                      <Box
                        onClick={() => {
                          setId(2);
                          setSelectedMsj(message);
                        }}
                        sx={{ cursor: "pointer", ...alignCenter, gap: 1.5 }}
                      >
                        <Box
                          sx={{
                            ...alignCenter,
                            justifyContent: "center",
                            border: "1px solid var(--border)",
                            height: "40px",
                            width: "40px",
                            borderRadius: "50%",
                          }}
                        >
                          <Tooltip
                            title={message?.subType || ""}
                            placement="left"
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              {message?.type === "Air" ? (
                                <AirplanemodeActiveIcon
                                  sx={{ fontSize: "24px", color: "#525371" }}
                                />
                              ) : message?.type === "Hotel" ? (
                                <ApartmentIcon
                                  sx={{ fontSize: "24px", color: "#525371" }}
                                />
                              ) : (
                                <EmailIcon
                                  sx={{ fontSize: "24px", color: "#525371" }}
                                />
                              )}
                            </Box>
                          </Tooltip>
                        </Box>
                        <Box sx={{ width: "calc(100% - 54px)" }}>
                          <Typography sx={{ ...labelStyle, color: "#525371" }}>
                            {message?.subject || "N/A"}
                          </Typography>

                          <Box py={1} sx={justifyBetween}>
                            <Box>
                              <Typography>
                                <span
                                  style={{
                                    ...statusBox,
                                    backgroundColor: "#18457B",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {message?.ticketStatus}
                                </span>
                                {message?.processingStatus && (
                                  <span
                                    style={{
                                      ...statusBox,
                                      backgroundColor:
                                        message?.processingStatus === "working"
                                          ? "var(--secondary-color)"
                                          : message?.processingStatus ===
                                              "unsolved"
                                            ? "red"
                                            : message?.processingStatus ===
                                                "solved"
                                              ? "#4cc57b"
                                              : "#f5a142",
                                      textTransform: "capitalize",
                                      marginLeft: "5px",
                                    }}
                                  >
                                    {message?.processingStatus}
                                  </span>
                                )}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                ...justifyBetween,
                                ...alignCenter,
                                gap: "8px",
                              }}
                            >
                              <Typography
                                textTransform={"capitalize"}
                                sx={{ color: "#888888", fontSize: "12px" }}
                              >
                                {message?.lastReplyBy}
                              </Typography>
                              <Typography
                                sx={{ color: "#888888", fontSize: "12px" }}
                              >
                                {moment(message?.updatedAt).format(
                                  "YYYY-MM-DD hh:mm"
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  );
                })
              : status === "error" && (
                  <Box sx={{ height: "400px" }}>
                    <NotFound label={error?.response?.data?.message} />
                  </Box>
                )}
        </Box>
      </Box>

      <Box sx={{ p: 2.5, width: "100%" }}>
        <Button
          onClick={() => setId(3)}
          sx={{
            textTransform: "capitalize",
            py: 1,
            bgcolor: "var(--primary-color)",
            ":hover": { bgcolor: "var(--primary-color)" },
            color: "white",
            width: "100%",
          }}
        >
          Create New Support Chat
        </Button>
      </Box>
    </Box>
  );
};

const AllMessageLoader = () => {
  return (
    <Box
      sx={{
        py: 1,
        gap: "15px",
        ...alignCenter,
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Skeleton variant="circular" width={"40px"} height={"40px"} />

      <Box sx={{ width: "calc(100% - 54px)" }}>
        <Skeleton animation="wave" width={"50%"} height={"30.5px"} />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton animation="wave" width={"60px"} height={"31px"} />
          <Skeleton animation="wave" width={"60px"} height={"31px"} />
        </Box>
      </Box>
    </Box>
  );
};

const justifyBetween = {
  display: "flex",
  justifyContent: "space-between",
};

const alignCenter = {
  display: "flex",
  alignItems: "center",
};

const statusBox = {
  backgroundColor: "var(--secondary-color)",
  color: "white",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: 500,
};

export default AllMessage;
