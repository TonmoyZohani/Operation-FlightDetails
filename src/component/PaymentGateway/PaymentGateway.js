import {
  Box,
  Button,
  FormGroup,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React, { useState } from "react";
import axios from "axios";
import { Link, useOutletContext } from "react-router-dom";
import { nextStepStyle } from "../../style/style";
import { useAuth } from "../../context/AuthProvider";
import wallet from "../../images/logo/logoblack.png";
import { useQuery } from "@tanstack/react-query";
import useWindowSize from "../../shared/common/useWindowSize";

const PaymentGateway = ({
  flightData,
  handleSubmit,
  isLoading,
  label,
  paymentPrice = 0,
}) => {
  const { agentData } = useOutletContext();

  const agentCms = agentData?.agentCms?.eligibleRangeCms ?? {};

  const [type, setType] = useState("pay");
  const { isMobile } = useWindowSize();
  const [payType, setPayType] = useState("fullPay");
  const { jsonHeader } = useAuth();

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

  const handlePaymentMethod = (event) => {
    const selectedType = event.target.value;
    setType((prevType) => (prevType === selectedType ? "" : selectedType));
    if (selectedType === "pay") {
      setPayType("fullPay");
    } else {
      setPayType("");
    }
  };

  return (
    <Box
      sx={{
        mt: { xs: "15px", lg: "0px" },
        height: "90%",
        bgcolor: "white",
        borderRadius: "4px 4px 0 0",
      }}
    >
      <Box
        mb={2}
        sx={{
          py: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box
            sx={{
              px: "12px",
              pb: 2,
            }}
          >
            <FormControl>
              <RadioGroup value={type}>
                <Box>
                  <FormControlLabel
                    onChange={handlePaymentMethod}
                    control={<Radio value="pay" />}
                    label={
                      <Typography
                        sx={{
                          color: "#4C4B4B",
                          fontSize: {
                            xs: "0.85rem",
                            lg: "1rem",
                          },
                          lineHeight: {
                            xs: "1rem",
                          },
                          fontWeight: 500,
                        }}
                      >
                        Pay And Confirm Your {label} for Keep You Safe Side
                      </Typography>
                    }
                  />
                  <Typography
                    sx={{
                      color: "var(--secondary-color)",
                      fontSize: {
                        xs: "0.8rem",
                        lg: "0.85rem",
                      },
                      lineHeight: {
                        xs: "1rem",
                        lg: "2rem",
                      },
                      fontWeight: "500",
                      pl: "30px",
                      mt: {
                        xs: 0,
                        lg: "-12px",
                      },
                    }}
                  >
                    For your security and peace of mind, please proceed to pay
                    and confirm your {label}.
                  </Typography>
                </Box>
              </RadioGroup>
            </FormControl>
          </Box>

          <Box sx={{ px: "12px", pt: "3px" }}>
            <Box sx={{ pl: "30px" }}>
              <FormControl>
                <RadioGroup
                  value={payType}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControlLabel
                    onChange={(e) => setPayType(e.target.value)}
                    control={<Radio value="fullPay" />}
                    label={
                      <span style={{ color: "#8F8F98" }}>
                        {flightData?.fareDifference?.totalFare
                          ? "Will Be Decided"
                          : "Pay Full Amount"}
                      </span>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>

          <Box
            sx={{
              bgcolor: "#FFFFFF",
              borderRadius: "3px",
              py: 2,
              px: 2,
              display:
                String(
                  flightData?.fareDifference?.totalFare?.reIssuePayable
                ).toLowerCase() === "will be decided" && "none",
            }}
          >
            <Grid
              container
              lg={12}
              xs={12}
              sx={{
                borderBottom: "1px solid #dadce0",
                borderTop: "1px solid #dadce0",
              }}
            >
              <Grid
                item
                lg={2.8}
                sx={{
                  py: "10px",
                  pl: "15px",
                  display: {
                    xs: "none",
                    lg: "block",
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#3C4258",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}
                >
                  Select
                </Typography>
              </Grid>
              <Grid
                item
                lg={4.2}
                xs={4}
                sx={{
                  p: "10px",
                  display: {
                    xs: "none",
                    lg: "block",
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#3C4258",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  Gateway Name
                </Typography>
              </Grid>
              <Grid
                item
                lg={3}
                xs={4}
                sx={{
                  p: "10px",
                  display: {
                    xs: "none",
                    lg: "block",
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#3C4258",
                    fontSize: "13px",
                    fontWeight: 500,
                    display: {
                      xs: "none",
                      lg: "block",
                    },
                  }}
                >
                  Gateway Fee
                </Typography>
              </Grid>
              <Grid
                item
                lg={2}
                xs={4}
                sx={{
                  p: "10px 5px 10px 10px",
                  display: {
                    xs: "none",
                    lg: "block",
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#3C4258",
                    fontSize: "13px",
                    fontWeight: 500,
                    display: {
                      xs: "none",
                      lg: "block",
                    },
                  }}
                >
                  Payable Amount
                </Typography>
              </Grid>
            </Grid>
            {Array.from({ length: 1 }).map((_, index) => (
              <Grid
                key={index}
                container
                sx={{ borderBottom: "1px solid #dadce0" }}
              >
                <Grid
                  item
                  xs={2}
                  lg={2.8}
                  sx={{
                    py: "10px",
                    pl: {
                      lg: "15px",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FormControl
                      sx={{
                        display: {
                          xs: "none",
                          lg: "block",
                        },
                      }}
                    >
                      <RadioGroup
                        sx={{ display: "flex", flexDirection: "row" }}
                        defaultValue="female"
                      >
                        <FormControlLabel
                          value="female"
                          control={<Radio defaultChecked />}
                        />
                      </RadioGroup>
                    </FormControl>
                    <Box
                      sx={{
                        width:
                          index === 0
                            ? isMobile
                              ? "50px"
                              : "80px"
                            : index === 1
                              ? "80px"
                              : index === 2
                                ? "80px"
                                : index === 3
                                  ? "70px"
                                  : "70px",
                        height:
                          index === 0
                            ? "50px"
                            : index === 1
                              ? "60px"
                              : index === 2
                                ? "37px"
                                : index === 3
                                  ? "70px"
                                  : "70px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        alt="payment logo"
                        src={
                          index === 0
                            ? wallet
                            : index === 1
                              ? `https://cdn.worldvectorlogo.com/logos/bkash.svg`
                              : index === 2
                                ? `https://seeklogo.com/images/N/nagad-logo-AA1B37DF1B-seeklogo.com.png`
                                : index === 3
                                  ? `https://zeevector.com/wp-content/uploads/Master-Card-and-Visa-Logo-Vector.png`
                                  : `https://w7.pngwing.com/pngs/58/14/png-transparent-amex-card-credit-logo-logos-logos-and-brands-icon.png`
                        }
                        style={{
                          width: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={4}
                  lg={4.2}
                  sx={{
                    p: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#3C4258",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {index === 0
                      ? isMobile
                        ? "FFI Wallet"
                        : "Fly Far International Wallet"
                      : index === 1
                        ? "Bkash"
                        : index === 2
                          ? "Nagad"
                          : index === 3
                            ? "Visa & Master Card"
                            : "American Express"}
                  </Typography>
                  <Box
                    sx={{
                      display: index === 0 ? "flex" : "none",
                      alignItems: "center",
                      gap: { xs: "10px", lg: "20px" },
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          color: "#788694",
                          fontSize: "12px",
                          fontWeight: "500",
                          display: index === 0 ? "block" : "none",
                        }}
                      >
                        {isMobile ? "Balance" : "Available Balance"}
                      </Typography>
                      <Typography
                        sx={{
                          color:
                            paymentPrice > balanceData?.balance
                              ? "var(--primary-color)"
                              : "green",
                          fontSize: "13px",
                          fontWeight: "500",
                          pt: "2px",
                        }}
                      >
                        {balanceData?.balance?.toLocaleString("en-IN")}৳
                      </Typography>
                    </Box>
                    <Link
                      to={`/dashboard/add-Deposit/${agentCms?.cashDeposit?.eligible ? "cash" : agentCms?.bankTransferDeposit?.eligible ? "bank transfer" : agentCms?.bankDeposit?.eligible ? "bank deposit" : agentCms?.chequeDeposit?.eligible ? "cheque deposit" : ""}`}
                    >
                      <Tooltip title="Add Deposit">
                        <AddCircleIcon
                          sx={{
                            color: "var(--primary-color)",
                            fontSize: "20px",
                          }}
                        />
                      </Tooltip>
                    </Link>
                  </Box>
                </Grid>
                <Grid
                  item
                  lg={3}
                  sx={{
                    p: "10px",
                    display: {
                      xs: "none",
                      lg: "flex",
                    },
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#3C4258",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    {index === 0
                      ? "0 %"
                      : index === 1
                        ? "1.2 %"
                        : index === 2
                          ? "1.4 %"
                          : index === 3
                            ? "2 %"
                            : "2.1 %"}
                  </Typography>
                </Grid>
                <Grid
                  item
                  lg={2}
                  xs={4}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "#3C4258",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    {paymentPrice?.toLocaleString("en-IN")} ৳
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    width: "100%",
                    display: {
                      xs: "flex",
                      lg: "none",
                    },
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <RadioGroup defaultValue="fflWallet">
                      <FormControlLabel
                        value="fflWallet"
                        control={<Radio defaultChecked />}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            ))}
          </Box>
        </Box>

        <Box px={2} mt={5}>
          <FormGroup sx={{ mb: 1 }}>
            <FormControlLabel
              control={<Checkbox />}
              label={
                <Typography
                  sx={{
                    color: "#8F8F98",
                    fontSize: "13px",
                    fontWeight: "500",
                    pt: {
                      xs: "8px",
                      lg: "2px",
                    },
                  }}
                >
                  By Completing Payment Agree with our{" "}
                  <Link
                    to="#"
                    style={{
                      color: "var(--primary-color)",
                      textDecoration: "none",
                    }}
                  >
                    Terms and Conditions
                  </Link>{" "}
                  &
                  <Link
                    to="#"
                    style={{
                      color: "var(--primary-color)",
                      textDecoration: "none",
                    }}
                  >
                    {" "}
                    Privacy Policy
                  </Link>
                </Typography>
              }
            />
          </FormGroup>
          <Box
            sx={{
              display: {
                xs: "none",
                lg: "block",
              },
            }}
          >
            <Button
              disabled={isLoading}
              style={{ ...nextStepStyle, textTransform: "uppercase" }}
              onClick={handleSubmit}
            >
              {isLoading
                ? "Loading..."
                : `CLICK TO CONFIRM ${label} FOR THIS FLIGHT`}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentGateway;
