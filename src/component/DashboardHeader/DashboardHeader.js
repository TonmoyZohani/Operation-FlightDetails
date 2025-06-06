import {
  Box,
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  Zoom,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./DashboardHeader.css";
import Grid from "@mui/material/Grid";
import MailIcon from "@mui/icons-material/Mail";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import MarqueeShow from "../MarqueeShow/MarqueeShow";
import { useAuth } from "../../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useOutletContext } from "react-router-dom";
import UniversalSearchBox from "../UniversalSearchBox/UniversalSearchBox";
import useToast from "../../hook/useToast";
import useUnAuthorized from "../../shared/common/useUnAuthorized";
import CustomToast from "../Alert/CustomToast";
import Notification from "../Dashboard/Notification";
import useWindowSize from "../../shared/common/useWindowSize";
import PersonIcon from "@mui/icons-material/Person";

const DashboardHeader = ({
  agentData,
  balanceInfo,
  balanceData,
  isLoading,
  refetchBalance,
}) => {
  const { jsonHeader } = useAuth();
  const navigate = useNavigate();
  const { isMobile, isMedium, isLarge } = useWindowSize();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const [dueBalance, setDueBalance] = useState(false);
  const [totalBalance, setTotalBalance] = useState(false);
  const isMoreThan1900px = useMediaQuery("(min-width:1900px)");
  const lgValue = isMoreThan1900px ? 6 : 5.5;
  const [dueBlcMouseEnter, setDueBlcMouseEnter] = useState(false);
  const [totalBlcMouseEnter, setTotalBlcMouseEnter] = useState(false);
  const [openBalancePop, setOpenBalancePop] = useState(false);
  const { checkUnAuthorized } = useUnAuthorized();

  const agentCms = agentData?.agentCms?.eligibleRangeCms ?? {};

  const { data: support } = useQuery({
    queryKey: ["support"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/v1/common/support`,
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
      setDueBalance((prev) => {
        const newState = !prev;
        if (newState) setDueBlcMouseEnter(true);
        return newState;
      });
      refetchBalance(); // Refetch API
    }

    if (type === "totalBalance") {
      setTotalBalance((prev) => {
        const newState = !prev;
        if (newState) setTotalBlcMouseEnter(true);
        return newState;
      });
      refetchBalance();
    }
  };

  const handleMouseEnter = (type) => {
    if (type === "dueBalance") {
      if (dueBalance) {
        setDueBalance(true);
        setDueBlcMouseEnter(true);
      }
      refetchBalance();
    }

    if (type === "totalBalance") {
      if (agentData?.type !== "branch") {
        setOpenBalancePop(true);
      }
      if (totalBalance) {
        setTotalBalance(true);
      }
      refetchBalance();
    }
  };

  const handleMouseLeave = (type) => {
    if (type === "dueBalance") {
      setDueBlcMouseEnter(false);
    }
    if (type === "totalBalance") {
      if (agentData?.type !== "branch") {
        setOpenBalancePop(false);
      }
      setTotalBlcMouseEnter(false);
    }
  };

  return (
    <>
      <Grid
        container
        sx={{
          bgcolor: "#fff",
          pb: "0px",
          position: "sticky",
          top: "0",
          zIndex: "10",
          borderBottom: "1px solid #E2EAF1",
          justifyContent: "space-between",
        }}
      >
        <Grid
          container
          sx={{
            height: isMoreThan1900px ? "100px" : "80px",
          }}
          item
          lg={4}
        >
          <Grid item lg={6}>
            <InformationBox
              title={agentData?.kam?.name}
              phone={agentData?.kam?.phone}
              email={agentData?.kam?.email}
              type={agentData?.type}
            />
          </Grid>

          {support?.length > 0 ? (
            support
              .filter(
                (s) =>
                  s.teamName !== "accounts-team" &&
                  s.teamName !== "reservation-team" &&
                  s.teamName !== "technical-team"
              )
              .slice(0, 1)
              .map((support, index) => (
                <Grid item lg={6} key={index}>
                  <InformationBox
                    title={support?.teamName}
                    phone={support?.contact}
                    email={support?.email}
                  />
                </Grid>
              ))
          ) : (
            <>
              <Grid item lg={6}>
                <InformationBox title={""} phone={""} email={""} />
              </Grid>
            </>
          )}
        </Grid>

        <Grid
          container
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px 0 25px",
          }}
          item
          lg={8}
        >
          <Grid item lg={5}>
            <UniversalSearchBox agentData={agentData} />
          </Grid>

          <Grid container item lg={6.8} gap={1} justifyContent={"end"}>
            <Grid
              item
              sx={{
                display: "flex",
                alignItems: "center",
                height: "38px",
                width: "140px",
              }}
            >
              {isLoading ? (
                <Skeleton
                  variant="rounded"
                  width={170}
                  height={40}
                  sx={{ borderRadius: "30px" }}
                />
              ) : (
                balanceData?.totalDue > 0 && (
                  <Box
                    sx={{
                      ...capsulStyle?.container,
                      bgcolor: "var(--primary-color)",
                      height: "100%",
                    }}
                    onClick={() => handledueBalance("dueBalance")}
                    onMouseEnter={() => handleMouseEnter("dueBalance")}
                    onMouseLeave={() => handleMouseLeave("dueBalance")}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          pr: "15px",
                          color: "white",
                          textAlign: dueBalance ? "center" : "end",
                          width: "100%",
                        }}
                      >
                        {dueBalance ? (
                          <>
                            {balanceData?.totalDue
                              ? balanceData?.totalDue?.toLocaleString("en-IN")
                              : 0}{" "}
                          </>
                        ) : (
                          "Due Balance"
                        )}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        ...capsulStyle?.icon,
                        left: !dueBalance
                          ? "calc(0% + 5px)"
                          : "calc(100% - 35px)",
                      }}
                    >
                      ৳
                    </Box>
                  </Box>
                )
              )}
            </Grid>

            <Grid
              item
              sx={{
                display: "flex",
                alignItems: "center",
                height: "38px",
                width: "140px",
              }}
            >
              {isLoading ? (
                <Skeleton
                  variant="rounded"
                  width={170}
                  height={40}
                  sx={{ borderRadius: "30px" }}
                />
              ) : (
                <Box
                  sx={{
                    ...capsulStyle?.container,
                    bgcolor: "var(--secondary-color)",
                    height: "100%",
                    position: "relative",
                  }}
                  onClick={() => handledueBalance("totalBalance")}
                  onMouseEnter={() => handleMouseEnter("totalBalance")}
                  onMouseLeave={() => handleMouseLeave("totalBalance")}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        pr: "15px",
                        color: "white",
                        textAlign: totalBalance ? "center" : "end",
                        width: "100%",
                      }}
                    >
                      {totalBalance ? (
                        <>
                          {balanceData?.balance
                            ? balanceData?.balance?.toLocaleString("en-IN")
                            : 0}{" "}
                        </>
                      ) : (
                        "Total Balance"
                      )}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      ...capsulStyle?.icon,
                      left: !totalBalance
                        ? "calc(0% + 5px)"
                        : "calc(100% - 35px)",
                    }}
                  >
                    ৳
                  </Box>

                  {openBalancePop && (
                    <Zoom in={openBalancePop}>
                      <Box
                        sx={{
                          right: "-28px",
                          top: "100%",
                          position: "absolute",
                          zIndex: 15,
                          pt: "10px",
                          "& .MuiTableCell-root": {
                            py: "16px",
                            px: 0,
                            fontSize: "12px",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor: "white",
                            borderRadius: "5px",
                            boxShadow:
                              "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
                            width: "375px",
                            minHeight: "130px",
                            maxHeight: "530px",
                            overflowY: "auto",
                          }}
                        >
                          <Box
                            sx={{
                              height: "45px",
                              bgcolor: "#F2F8FF",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              px: 2,
                              borderRadius: "3px",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "var(--secondary-color)",
                                fontWeight: "500",
                              }}
                            >
                              Balance Information
                            </Typography>
                            <Tooltip title="Add Deposit">
                              <Box
                                sx={{ ...cirleIcon, bgcolor: "#222" }}
                                onClick={() =>
                                  navigate(
                                    `/dashboard/add-Deposit/${agentCms?.cashDeposit?.eligible ? "cash" : agentCms?.bankTransferDeposit?.eligible ? "bank transfer" : agentCms?.bankDeposit?.eligible ? "bank deposit" : agentCms?.chequeDeposit?.eligible ? "cheque deposit" : ""}`
                                  )
                                }
                              >
                                <AddIcon
                                  sx={{
                                    color: "var(--white)",
                                    fontSize: "22px",
                                  }}
                                />
                              </Box>
                            </Tooltip>
                          </Box>

                          <TableContainer sx={{ px: 2 }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  {[
                                    "Branch",
                                    "Due Balance",
                                    "Total Balance",
                                  ].map((head) => {
                                    return (
                                      <TableCell
                                        sx={{ color: "var(--dark-gray)" }}
                                      >
                                        {head}
                                      </TableCell>
                                    );
                                  })}
                                  <TableCell
                                    sx={{
                                      textAlign: "center",
                                      color: "var(--dark-gray)",
                                    }}
                                    Balance
                                    Information
                                  >
                                    Action
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell> Main Branch</TableCell>
                                  <TableCell
                                    sx={{ color: "var(--primary-color)" }}
                                  >
                                    {balanceInfo?.mainBranch?.totalDue.toFixed(
                                      2
                                    )}{" "}
                                    ৳
                                  </TableCell>
                                  <TableCell
                                    sx={{ color: "var(--secondary-color)" }}
                                  >
                                    {balanceInfo?.mainBranch?.balance.toFixed(
                                      2
                                    )}{" "}
                                    ৳
                                  </TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                {balanceInfo?.branchesBalance?.map(
                                  (data, i) => (
                                    <TableRow key={i}>
                                      <TableCell>
                                        {" "}
                                        {data?.branchName} Branch
                                      </TableCell>
                                      <TableCell
                                        sx={{ color: "var(--primary-color)" }}
                                      >
                                        {data?.balanceInfo?.totalDue.toFixed(2)}{" "}
                                        ৳
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          color: "var(--secondary-color)",
                                        }}
                                      >
                                        {data?.balanceInfo?.balance.toFixed(2)}{" "}
                                        ৳
                                      </TableCell>
                                      <TableCell>
                                        <Box
                                          sx={{
                                            ...cirleIcon,
                                            bgcolor: "#222",
                                            height: "24px",
                                            width: "24px",
                                            m: "0 auto",
                                          }}
                                          onClick={() =>
                                            navigate(
                                              "/dashboard/balanceTransfer/add",
                                              {
                                                state: {
                                                  district: data?.district,
                                                },
                                              }
                                            )
                                          }
                                        >
                                          <AddIcon
                                            sx={{
                                              color: "var(--white)",
                                              fontSize: "15px",
                                            }}
                                          />
                                        </Box>
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>

                          <Box sx={{ px: 2, pb: 2 }}>
                            <Button
                              sx={{
                                bgcolor: "#D6FFEA",
                                ":hover": { bgcolor: "#D6FFEA" },
                                textTransform: "capitalize",
                                width: "100%",
                                borderRadius: "35px",
                                mt: 2,
                                color: "#0E8749",
                                height: "32px",
                                fontSize: "13px",
                              }}
                              onClick={() =>
                                navigate("/dashboard/wingManagement/add-Branch")
                              }
                            >
                              Add New Branch
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Zoom>
                  )}
                </Box>
              )}
            </Grid>

            <Grid item md={1.5}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Notification />
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid item lg={12} sx={{ borderTop: "1px solid #E2EAF1" }}>
          <MarqueeShow />
        </Grid>
      </Grid>
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
        type="notification"
      />
    </>
  );
};

const InformationBox = ({ title, phone, email, type }) => {
  const isMoreThan1900px = useMediaQuery("(min-width:1900px)");

  return (
    <Box sx={{ ...infoBox(isMoreThan1900px).container, padding: "12px 30px" }}>
      {title ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {/* <Box
            sx={{
              width: "20px",
              height: "20px",
              backgroundColor: "#e6f1ff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PersonIcon
              sx={{
                fontSize: isMoreThan1900px ? "12px" : "12px",
                color: "var(--primary-color)",
              }}
            />
          </Box> */}
          <Typography noWrap sx={infoBox(isMoreThan1900px).title}>
            {title
              .split("/")
              .map((segment) =>
                segment
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
              )
              .join(" / ")}{" "}
            {type && <>({type === "agent" ? "KAM" : "Agent"})</>}
          </Typography>
        </Box>
      ) : (
        <Skeleton variant="text" width={120} height={16} />
      )}

      {phone ? (
        <a
          href={`tel:${phone}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: "20px",
                height: "20px",
                backgroundColor: "#e6f1ff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LocalPhoneIcon
                sx={{
                  fontSize: isMoreThan1900px ? "12px" : "12px",
                  color: "var(--primary-color)",
                }}
              />
            </Box>
            <Typography
              noWrap
              sx={{
                ...infoBox(isMoreThan1900px).text,
              }}
            >
              {phone}
            </Typography>
          </Box>
        </a>
      ) : (
        <Skeleton variant="text" width={120} height={16} />
      )}

      {email ? (
        <a
          href={`mailto:${email}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: "20px",
                height: "20px",
                backgroundColor: "#e6f1ff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MailIcon
                sx={{
                  fontSize: isMoreThan1900px ? "12px" : "12px",
                  color: "var(--secondary-color)",
                }}
              />
            </Box>
            <Typography
              noWrap
              sx={{
                ...infoBox(isMoreThan1900px).text,
              }}
            >
              {email}
            </Typography>
          </Box>
        </a>
      ) : (
        <Skeleton variant="text" width={120} height={16} />
      )}
    </Box>
  );
};

const infoBox = (isMoreThan1900px) => {
  return {
    container: {
      pt: isMoreThan1900px ? "14px" : "10px",
      px: 2,
      borderRight: "1px solid #E2EAF1",
      display: "flex",
      flexDirection: "column",
      gap: "5px",
      height: "100%",
    },
    title: {
      color: "#8F8F98",
      fontSize: isMoreThan1900px ? "15px" : "12px",
      width: "100%",
      textTransform: "capitalize",
    },
    text: {
      color: "#8F8F98",
      fontSize: isMoreThan1900px ? "12px" : "12px",
      display: "flex",
      alignItems: "center",
      gap: "5px",
    },
  };
};

const capsulStyle = {
  container: {
    width: "100%",
    borderRadius: "25px",
    cursor: "pointer",
    position: "relative",
    px: "5px",
  },
  icon: {
    fontSize: "12px",
    bgcolor: "white",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    position: "absolute",
    top: "4px",
    transition: "left 0.3s ease",
    pt: "2px",
  },
};

const cirleIcon = {
  bgcolor: "var(--secondary-color)",
  width: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "19px",
  height: "30px",
  cursor: "pointer",
  flexShrink: 0,
};

export default DashboardHeader;
