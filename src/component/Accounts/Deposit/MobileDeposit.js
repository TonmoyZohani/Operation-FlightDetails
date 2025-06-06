import { Box, MenuItem, Select, Skeleton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import MobileHeader from "../../MobileHeader/MobileHeader";
import { mobileAddBtn } from "../../../style/style";

const MobileDeposit = ({ id, isLoading, depositAccounts, tabs }) => {
  const navigate = useNavigate();
  const handleTypeChange = (event) => {
    navigate(`/dashboard/deposits/${event?.target?.value}`);
  };

  return (
    <Box
      sx={{
        bgcolor: "#F0F2F5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ".MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
      }}
    >
      {/* header display */}
      <MobileHeader title={"Deposit"} subTitle={id} />

      {/* menubar section */}
      <Select
        value={id || ""}
        onChange={handleTypeChange}
        displayEmpty
        inputProps={{ "aria-label": "Select Type" }}
        sx={{
          width: "92%",
          bgcolor: "var(--primary-color)",
          color: "white",
          textAlign: "left",
          height: "42px",
          mt: "-23px",
          textTransform: "uppercase",
          fontSize: "14px",
        }}
      >
        {tabs.map((tab, i) => (
          <MenuItem
            key={i}
            value={tab?.label}
            sx={{ textTransform: "capitalize" }}
          >
            {tab?.label}
          </MenuItem>
        ))}
      </Select>

      {isLoading ? (
        <>
          {[...new Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              <DepositeSkeleton />
            </React.Fragment>
          ))}
        </>
      ) : (
        <Box sx={{ width: "92%" }}>
          {depositAccounts?.map((deposit, i) => (
            <Box
              key={i}
              onClick={() =>
                navigate("/dashboard/depositDetails", {
                  state: { id: deposit?.id, depositType: deposit?.depositType },
                })
              }
              sx={{
                bgcolor: "var(--white)",
                width: "100%",
                borderRadius: "4px",
                my: "15px",
                px: "15px",
                py: "10px",
              }}
            >
              <Box sx={justifyBetween}>
                <Typography
                  sx={{ color: "#3D3A49", fontSize: "14px", fontWeight: "500" }}
                >
                  {deposit?.depositId}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "14px",
                    color:
                      deposit?.status === "approved"
                        ? "#0E8749"
                        : deposit?.status === "pending"
                          ? "var(--secondary-color)"
                          : "red",
                    fontWeight: "500",
                    textTransform: "capitalize",
                  }}
                >
                  {deposit?.status}
                </Typography>
              </Box>

              <Box sx={{ mt: "12px" }}>
                <Typography sx={{ fontSize: "17px", fontWeight: "500" }}>
                  {deposit?.depositType === "cashDeposit"
                    ? "Cash"
                    : deposit?.depositType === "bankTransferDeposit"
                      ? "Bank Transfer"
                      : deposit?.depositType === "bankDeposit"
                        ? "Bank"
                        : "Cheque"}
                </Typography>
                <Box>
                  <Typography sx={{ fontSize: "11px", pt: "5px" }}>
                    TRNX ID:4165156685,
                    <span style={{ color: "var(--primary-color)" }}>
                      {" "}
                      By Syed Afridi
                    </span>
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: "13px", ...justifyBetween }}>
                <Typography
                  sx={{ fontSize: "18px", fontWeight: "500", color: "#444542" }}
                >
                  ৳ {deposit?.amount?.toLocaleString("en-IN")}
                </Typography>
                <Typography sx={{ fontSize: "11px", color: "#888888" }}>
                  {moment(deposit?.transactionDate).format("Do MMMM YYYY")}
                </Typography>
              </Box>
            </Box>
          ))}

          <Box
            onClick={() => navigate("/dashboard/add-Deposit/cash")}
            sx={mobileAddBtn()}
          >
            <AddIcon sx={{ color: "var(--white)", fontSize: "25px" }} />
          </Box>
        </Box>
      )}
      {/* card section */}
    </Box>
  );
};

const DepositeSkeleton = () => {
  const props = {
    sx: { borderRadius: "4px" },
    variant: "rectangular",
    animation: "wave",
    height: "20px",
  };
  return (
    <Box
      sx={{
        bgcolor: "var(--white)",
        width: "92%",
        borderRadius: "4px",
        my: "15px",
        px: "15px",
        py: "10px",
        height: "140px",
      }}
    >
      <Box sx={justifyBetween}>
        <Skeleton {...props} width={"84px"} />
        <Skeleton {...props} width={"64px"} />
      </Box>

      <Box sx={{ mt: "12px" }}>
        <Skeleton {...props} width={"110px"} />
      </Box>

      <Box sx={{ mt: "12px" }}>
        <Skeleton {...props} width={"150px"} />
      </Box>
      <Box sx={{ ...justifyBetween, mt: "12px" }}>
        <Skeleton {...props} width={"44px"} />
        <Skeleton {...props} width={"100px"} />
      </Box>
    </Box>
  );
};

const justifyBetween = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export default MobileDeposit;
