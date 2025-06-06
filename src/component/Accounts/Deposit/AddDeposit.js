import { Box, Button } from "@mui/material";
import React from "react";
import ChequeDeposit from "./ChequeDeposit";
import BankDeposit from "./BankDeposit";
import PageTitle from "../../../shared/common/PageTitle";
import CashDeposit from "./CashDeposit";
import BankTransfer from "./BankTransfer";
import MobileBanking from "./MobileBanking";
import CardDeposit from "./CardDeposit";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import MobileHeader from "../../MobileHeader/MobileHeader";
import useWindowSize from "../../../shared/common/useWindowSize";
import BkashDeposit from "./BkashDeposit";

const buttonStyle = {
  backgroundColor: "transparent",
  color: "var(--secondary-color)",
};

const activeButton = {
  backgroundColor: "var(--primary-color)",
  color: "white",
};

const AddDeposit = () => {
  const { id } = useParams();
  const agentData = useOutletContext();
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();

  const handleid = (tab) => {
    navigate(`/dashboard/add-Deposit/${tab}`);
  };

  const eligibleRangeCms =
    agentData?.agentData?.agentCms?.eligibleRangeCms ?? {};

  const tabs = agentData?.agentData?.agentCms
    ? [
        ...(eligibleRangeCms?.cashDeposit?.eligible ? ["cash"] : []),
        ...(eligibleRangeCms?.bankTransferDeposit?.eligible
          ? ["bank transfer"]
          : []),
        ...(eligibleRangeCms?.bankDeposit?.eligible ? ["bank deposit"] : []),
        ...(eligibleRangeCms?.chequeDeposit?.eligible
          ? ["cheque deposit"]
          : []),
        ...(eligibleRangeCms?.bkashPayment?.eligible ? ["bkash deposit"] : []),
      ]
    : [];

  // console.log(eligibleRangeCms);

  return (
    <Box sx={{ borderRadius: "10px" }}>
      {isMobile ? (
        <>
          <MobileHeader
            title={"Add Deposit"}
            subTitle={id}
            labelValue={id}
            labelType={"select"}
            options={tabs.map((tab) => tab)}
            onChange={(e) =>
              navigate(`/dashboard/add-Deposit/${e?.target?.value}`)
            }
          />
        </>
      ) : (
        <>
          <PageTitle title={"Deposit Management System"} />
        </>
      )}

      <Box
        sx={{
          bgcolor: "white",
          width: { xs: "90%", lg: "100%" },
          mx: "auto",
          mt: { xs: 5, lg: 0 },
          borderRadius: "0px 0px 5px 5px",
          px: { lg: "22px", xs: "0" },
          py: { lg: "15px" },
        }}
      >
        {/* TODO:: Deposit Tab bars  */}

        {!isMobile && (
          <Box sx={{ display: "flex", gap: "15px", bgcolor: "white" }}>
            {tabs.map((tab, i) => (
              <Button
                key={i}
                onClick={() => handleid(tab)}
                style={id === tab ? activeButton : buttonStyle}
                sx={{ fontSize: { lg: "12px", xs: "11px" } }}
              >
                {tab}
              </Button>
            ))}
          </Box>
        )}

        {/* TODO:: Deposit Tab bars  */}

        <Box sx={{ minHeight: "450px" }}>
          {id === "cash" && eligibleRangeCms?.cashDeposit?.eligible ? (
            <CashDeposit />
          ) : id === "bank transfer" &&
            eligibleRangeCms?.bankTransferDeposit?.eligible ? (
            <BankTransfer />
          ) : id === "bank deposit" &&
            eligibleRangeCms?.bankDeposit?.eligible ? (
            <BankDeposit />
          ) : id === "cheque deposit" &&
            eligibleRangeCms?.chequeDeposit?.eligible ? (
            <ChequeDeposit />
          ) : id === "bkash deposit" &&
            eligibleRangeCms?.bkashPayment?.eligible ? (
            <BkashDeposit />
          ) : id === "mobile banking" ? (
            <MobileBanking />
          ) : id === "visa / master card" ? (
            <CardDeposit />
          ) : (
            ""
          )}
        </Box>
      </Box>
    </Box>
  );
};

export const labelStyle = {
  border: "2px solid #DEE0E4",
  height: "190px",
  borderRadius: "5px",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: "10px",
  cursor: "pointer",
  textAlign: "center",
};

export default AddDeposit;
