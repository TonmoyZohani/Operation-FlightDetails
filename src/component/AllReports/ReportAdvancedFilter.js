import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Collapse,
  TextField,
  Grid,
  ClickAwayListener,
} from "@mui/material";
import Select from "react-select";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { customInputBox, selectStyle } from "../AllBookings/AdvancedFilter";
import moment from "moment";
import CustomCalendar from "../CustomCalendar/CustomCalendar";

const DepositAdvancedFilter = ({
  filterQuery,
  setFilterQuery,
  setIsAdvanceFilter,
  handleSearchClick,
}) => {
  const [openTransactionDate, setOpenTransactionDate] = useState("");

  const handleFilterQuery = (statusTitle, selectedOption) => {
    setFilterQuery((prev) => {
      const updatedFilterQuery = { ...prev };

      // If the module is being set to "booking", reset the other options
      if (statusTitle === "module" && selectedOption.value === "booking") {
        updatedFilterQuery.booking = true;
        updatedFilterQuery.bankDeposit = false;
        updatedFilterQuery.bankTransferDeposit = false;
        updatedFilterQuery.cashDeposit = false;
        updatedFilterQuery.chequeDeposit = false;
        updatedFilterQuery.balanceTransfer = false;
      } else if (
        statusTitle === "module" &&
        selectedOption.value === "balance transfer"
      ) {
        updatedFilterQuery.booking = false;
        updatedFilterQuery.bankDeposit = false;
        updatedFilterQuery.bankTransferDeposit = false;
        updatedFilterQuery.cashDeposit = false;
        updatedFilterQuery.chequeDeposit = false;
        updatedFilterQuery.balanceTransfer = true;
      } else {
        updatedFilterQuery.booking = false;
        updatedFilterQuery.bankDeposit = true;
        updatedFilterQuery.bankTransferDeposit = true;
        updatedFilterQuery.cashDeposit = true;
        updatedFilterQuery.chequeDeposit = true;
        updatedFilterQuery.balanceTransfer = false;
      }

      // Set the selected status
      updatedFilterQuery[statusTitle] = selectedOption.value || selectedOption;

      return updatedFilterQuery;
    });
  };

  return (
    <Box
      pt={2.5}
      px={3}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        minHeight: "100vh",
        gap: "100px",
        height: "100%",
      }}
    >
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ ...labelStyle, fontSize: "18px", mt: 0, mb: 1.5 }}>
            Ledger Report Advanced Filter
          </Typography>
          <CloseIcon
            sx={{ color: "var(--primary-color)", cursor: "pointer" }}
            onClick={() => setIsAdvanceFilter(false)}
          />
        </Box>

        {/* TODO:: Selecting Transaction Module */}
        <Box
          sx={{
            ".css-1d9ye53-MuiTypography-root": {
              fontSize: "14px !important",
            },
            position: "relative",
          }}
        >
          <Typography sx={labelStyle}>Select Transaction Module</Typography>
          <Box sx={{ position: "absolute", width: "100%" }}>
            <Select
              options={allModules.map((tab) => ({
                value: tab,
                label: tab
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase()),
              }))}
              value={
                filterQuery.module
                  ? {
                      label: filterQuery.module
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase()),
                      value: filterQuery.module,
                    }
                  : null
              }
              placeholder={<Typography>Select Transaction Module</Typography>}
              onChange={(value) => handleFilterQuery("module", value)}
              components={{ DropdownIndicator: null }}
              {...selectProps}
            />
          </Box>
          <span
            onClick={() => handleFilterQuery("module", "")}
            style={{
              position: "absolute",
              color: "var(--secondary-color)",
              right: "5px",
              top: "38px",
              cursor: "pointer",
            }}
          >
            <CancelIcon nsx={{ fontSize: "25px" }} />
          </span>
        </Box>

        {/* TODO:: Selecting Transaction Type status */}
        <Box
          sx={{
            ".css-1d9ye53-MuiTypography-root": {
              fontSize: "14px !important",
            },
            position: "relative",
            mt: "60px",
          }}
        >
          <Typography sx={labelStyle}>Select Transaction Type</Typography>
          <Box sx={{ position: "absolute", width: "100%" }}>
            <Select
              options={
                filterQuery?.module === "deposit"
                  ? filterTypeOptions.filter(
                      (option) => option.value === "deposit"
                    )
                  : filterQuery?.module === "balance transfer"
                    ? filterTypeOptions.filter(
                        (option) => option.value === "transfer"
                      )
                    : filterQuery?.module === "balance transfer"
                      ? filterTypeOptions
                      : filterTypeOptions
              }
              value={
                filterQuery?.transactionType
                  ? {
                      label: filterQuery.transactionType,
                      value: filterQuery.transactionType,
                    }
                  : null
              }
              placeholder={<Typography>Transaction Type</Typography>}
              onChange={(value) => handleFilterQuery("transactionType", value)}
              components={{ DropdownIndicator: null }}
              {...selectProps}
            />
          </Box>
          <span
            onClick={() => handleFilterQuery("transactionType", "")}
            style={{
              position: "absolute",
              color: "var(--secondary-color)",
              right: "5px",
              top: "38px",
              cursor: "pointer",
            }}
          >
            <CancelIcon nsx={{ fontSize: "25px" }} />
          </span>
        </Box>

        {/* TODO:: Selecting ledger type */}
        <Box
          sx={{
            ".css-1d9ye53-MuiTypography-root": {
              fontSize: "14px !important",
            },
            position: "relative",
            mt: "60px",
          }}
        >
          <Typography sx={labelStyle}>Select Ledger Type</Typography>
          <Box sx={{ position: "absolute", width: "100%" }}>
            <Select
              options={allLedgerType.map((tab) => ({
                value: tab,
                label: tab
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase()),
              }))}
              value={
                filterQuery.ledgerType
                  ? {
                      label: filterQuery.ledgerType
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase()),
                      value: filterQuery.ledgerType,
                    }
                  : null
              }
              placeholder={<Typography>Select Ledger Type</Typography>}
              onChange={(value) => handleFilterQuery("ledgerType", value)}
              components={{ DropdownIndicator: null }}
              {...selectProps}
            />
          </Box>
          <span
            onClick={() => handleFilterQuery("ledgerType", "")}
            style={{
              position: "absolute",
              color: "var(--secondary-color)",
              right: "5px",
              top: "38px",
              cursor: "pointer",
            }}
          >
            <CancelIcon nsx={{ fontSize: "25px" }} />
          </span>
        </Box>

        {/* TODO:: Selecting by sort */}
        <Box
          sx={{
            ".css-1d9ye53-MuiTypography-root": {
              fontSize: "14px !important",
            },
            position: "relative",
            mt: "55px",
          }}
        >
          <Typography sx={labelStyle}>Sort By</Typography>
          <Box sx={{ position: "absolute", width: "100%" }}>
            <Select
              options={allSortBy.map((tab) => ({
                value: tab,
                label: tab
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase()),
              }))}
              value={
                filterQuery.sortBy
                  ? {
                      label: filterQuery.sortBy
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase()),
                      value: filterQuery.sortBy,
                    }
                  : null
              }
              placeholder={<Typography>Sort By</Typography>}
              onChange={(value) => handleFilterQuery("sortBy", value)}
              components={{ DropdownIndicator: null }}
              {...selectProps}
            />
          </Box>
          <span
            onClick={() => handleFilterQuery("sortBy", "")}
            style={{
              position: "absolute",
              color: "var(--secondary-color)",
              right: "5px",
              top: "38px",
              cursor: "pointer",
            }}
          >
            <CancelIcon nsx={{ fontSize: "25px" }} />
          </span>
        </Box>

        {/* TODO:: Selecting by sort order */}
        <Box
          sx={{
            ".css-1d9ye53-MuiTypography-root": {
              fontSize: "14px !important",
            },
            position: "relative",
            mt: "55px",
          }}
        >
          <Typography sx={labelStyle}>Sort Order</Typography>
          <Box sx={{ position: "absolute", width: "100%" }}>
            <Select
              options={allSortOrder.map((tab) => ({
                value: tab,
                label: tab
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase()),
              }))}
              value={
                filterQuery.sortOrder
                  ? {
                      label: filterQuery.sortOrder
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase()),
                      value: filterQuery.sortOrder,
                    }
                  : null
              }
              placeholder={<Typography>Sort Order</Typography>}
              onChange={(value) => handleFilterQuery("sortOrder", value)}
              components={{ DropdownIndicator: null }}
              {...selectProps}
            />
          </Box>
          <span
            onClick={() => handleFilterQuery("sortOrder", "")}
            style={{
              position: "absolute",
              color: "var(--secondary-color)",
              right: "5px",
              top: "38px",
              cursor: "pointer",
            }}
          >
            <CancelIcon nsx={{ fontSize: "25px" }} />
          </span>
        </Box>

        {/* TODO:: Maximum Minimum Amonut */}
        <Box sx={{ mt: "56px" }}>
          <Typography sx={labelStyle}>Amount Range</Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              onChange={(e) =>
                handleFilterQuery("maxAmount", { value: e.target.value })
              }
              placeholder="Maximum Amount"
              type="number"
              sx={{
                width: "49%",
                "& .MuiInputBase-root": {
                  height: "40px",
                },
              }}
            />

            <TextField
              onChange={(e) =>
                handleFilterQuery("maxAmount", { value: e.target.value })
              }
              placeholder="Minimum Amount"
              type="number"
              sx={{
                width: "49%",
                "& .MuiInputBase-root": {
                  height: "40px",
                },
              }}
            />
          </Box>
        </Box>

        {/* TODO:: Transaction Date range */}
        <Box sx={{ display: "flex", gap: "20px", position: "relative" }}>
          <Box
            onClick={() => setOpenTransactionDate("transactionFrom")}
            sx={{ width: "50%" }}
          >
            <Typography sx={labelStyle}>Transaction Start Date</Typography>
            <Box sx={customInputBox}>
              {filterQuery.transactionFrom ? (
                <Typography sx={{ fontSize: "14px", color: "#333" }}>
                  {moment(filterQuery.transactionFrom).format("DD/MM/YYYY")}
                </Typography>
              ) : (
                <Typography sx={{ fontSize: "14px", color: "#808080" }}>
                  DD/MM/YYYY
                </Typography>
              )}
            </Box>
          </Box>
          <Box
            onClick={() => setOpenTransactionDate("transactionTo")}
            sx={{ width: "50%" }}
          >
            <Typography sx={labelStyle}>Transaction End Date</Typography>
            <Box sx={customInputBox}>
              {filterQuery.transactionTo ? (
                <Typography sx={{ fontSize: "14px", color: "#333" }}>
                  {moment(filterQuery.transactionTo).format("DD/MM/YYYY")}
                </Typography>
              ) : (
                <Typography sx={{ fontSize: "14px", color: "#808080" }}>
                  DD/MM/YYYY
                </Typography>
              )}
            </Box>
          </Box>
          {!!openTransactionDate && (
            <ClickAwayListener
              onClickAway={() =>
                openTransactionDate && setOpenTransactionDate(false)
              }
            >
              <Box
                sx={{
                  position: "absolute",
                  left: "0",
                  "& .rdrDefinedRangesWrapper": { width: "0px" },
                  "& .rdrDateRangePickerWrapper": { width: "100%" },
                  "& .rdrStartEdge, .rdrInRange, .rdrEndEdge": {
                    backgroundColor: "var(--primary-color)",
                  },
                  width: "100%",
                  bottom: "52px",
                }}
              >
                <Box sx={{ display: "flex", width: "100%", bgcolor: "white" }}>
                  <CustomCalendar
                    date={filterQuery[openTransactionDate]}
                    maxDate={new Date()}
                    title={
                      openTransactionDate === "transactionFrom"
                        ? "Transaction Start Date"
                        : "Transaction End Date"
                    }
                    handleChange={(date) => {
                      const formattedDate = new Intl.DateTimeFormat("en-GB", {
                        timeZone: "Asia/Dhaka",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                        .format(date)
                        .split("/")
                        .reverse()
                        .join("-");

                      setFilterQuery({
                        ...filterQuery,
                        [openTransactionDate]: formattedDate,
                      });

                      setOpenTransactionDate(
                        openTransactionDate === "transactionFrom"
                          ? "transactionTo"
                          : ""
                      );
                    }}
                  />
                </Box>
              </Box>
            </ClickAwayListener>
          )}
        </Box>

        {/* TODO:: Necessary Checkbox */}
        {filterQuery?.module === "deposit" && (
          <Box>
            <Typography sx={labelStyle}>Deposit Type</Typography>

            <Grid container>
              <Grid item lg={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filterQuery.bankDeposit || false}
                      onChange={(e) =>
                        handleFilterQuery("bankDeposit", e.target.checked)
                      }
                    />
                  }
                  label={<span style={{ fontSize: "14px" }}>Bank Deposit</span>}
                />
              </Grid>

              <Grid item lg={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filterQuery.bankTransferDeposit || false}
                      onChange={(e) =>
                        handleFilterQuery(
                          "bankTransferDeposit",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label={
                    <span style={{ fontSize: "14px" }}>
                      Bank Transfer Deposit
                    </span>
                  }
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item lg={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filterQuery.cashDeposit || false}
                      onChange={(e) =>
                        handleFilterQuery("cashDeposit", e.target.checked)
                      }
                    />
                  }
                  label={<span style={{ fontSize: "14px" }}>Cash Deposit</span>}
                />
              </Grid>

              <Grid item lg={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filterQuery.chequeDeposit || false}
                      onChange={(e) =>
                        handleFilterQuery("chequeDeposit", e.target.checked)
                      }
                    />
                  }
                  label={
                    <span style={{ fontSize: "14px" }}>Cheque Deposit</span>
                  }
                />
              </Grid>
            </Grid>
          </Box>
        )}

        <Box sx={{ my: "30px" }}>
          <Button
            style={{ width: "100%", height: "35px" }}
            onClick={() => handleSearchClick()}
            sx={submitBtn}
          >
            Search
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const commonBtnStyle = {
  textTransform: "capitalize",
  fontSize: "12px",
  px: 2,
  py: 1,
  height: "30px",
};

const submitBtn = {
  ...commonBtnStyle,
  bgcolor: "var(--primary-color)",
  ":hover": { bgcolor: "var(--primary-color)" },
  color: "white",
};

export const labelStyle = {
  mt: 1.5,
  mb: "6px",
  fontSize: "15px",
  fontWeight: "500",
};

export const selectProps = {
  isSearchable: false,
  styles: selectStyle(),
  inputProps: { autoComplete: "off" },
};

const allTabs = [
  "deposit",
  "transfer",
  "purchase",
  "void",
  "refund",
  "reissue",
  "cash return",
  "balance add",
  "issue request",
  "partial issue request",
  "ticketed",
  "issue reject",
  "force ticketed",
  "ancillary approve",
  "ancillary reject",
  "ancillary refund",
];

const allModules = ["booking", "balance transfer", "deposit"];

const filterTypeOptions = allTabs.map((tab) => ({
  value: tab.toLowerCase(),
  label: tab,
}));

const allLedgerType = ["debit", "credit"];
const allSortBy = ["createdAt", "amount"];
const allSortOrder = ["asc", "desc"];

export default DepositAdvancedFilter;
