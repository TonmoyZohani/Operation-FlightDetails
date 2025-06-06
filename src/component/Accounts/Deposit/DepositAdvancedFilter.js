import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Collapse, TextField, ClickAwayListener } from "@mui/material";
import Select from "react-select";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import useToast from "../../../hook/useToast";
import CustomToast from "../../Alert/CustomToast";
import { customInputBox, selectStyle } from "../../AllBookings/AdvancedFilter";
import moment from "moment";
import CustomCalendar from "../../CustomCalendar/CustomCalendar";

const DepositAdvancedFilter = ({
  filterQuery,
  setFilterQuery,
  setIsAdvanceFilter,
  handleSearchClick,
}) => {
  const [openTransactionDate, setOpenTransactionDate] = useState("");

  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const handleFilterQuery = (statusTitle, selectedOption) => {
    setFilterQuery((prev) => ({
      ...prev,
      [statusTitle]: selectedOption.value,
    }));
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
            Deposit Advanced Filter
          </Typography>
          <CloseIcon
            sx={{ color: "var(--primary-color)", cursor: "pointer" }}
            onClick={() => setIsAdvanceFilter(false)}
          />
        </Box>
        {/* TODO:: Selecting deposit status */}
        <Box
          sx={{
            ".css-1d9ye53-MuiTypography-root": {
              fontSize: "14px !important",
            },
            position: "relative",
          }}
        >
          <Typography sx={labelStyle}>Select Deposit Status</Typography>
          <Box sx={{ position: "absolute", width: "100%" }}>
            <Select
              options={filterTypeOptions}
              value={
                filterQuery.status
                  ? { label: filterQuery.status, value: filterQuery.status }
                  : null
              }
              placeholder={<Typography>Select Status Type</Typography>}
              onChange={(value) => handleFilterQuery("status", value)}
              components={{ DropdownIndicator: null }}
              {...selectProps}
            />
          </Box>
          <span
            onClick={() => handleFilterQuery("status", "")}
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

        {/* TODO:: AgentId/Phone/Email/Agency Name */}
        <Box sx={{ mt: "60px" }}>
          <Typography sx={labelStyle}>
            Deposit ID/Bank Name/Branch Name
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              onChange={(e) =>
                handleFilterQuery("searchTerm", { value: e.target.value })
              }
              placeholder="Search By Deposit ID/Bank Name/Branch Name"
              type="text"
              sx={{
                width: "100%",
                "& .MuiInputBase-root": {
                  height: "40px",
                },
              }}
            />
          </Box>
        </Box>

        {/* TODO:: Selecting deposit type */}
        <Box
          sx={{
            ".css-1d9ye53-MuiTypography-root": {
              fontSize: "14px !important",
            },
            position: "relative",
            mt: "15px",
          }}
        >
          <Typography sx={labelStyle}>Deposit Type</Typography>
          <Box sx={{ position: "absolute", width: "100%" }}>
            <Select
              options={allDepositType.map((tab) => ({
                value: tab,
                label: tab
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase()),
              }))}
              value={
                filterQuery.depositType
                  ? {
                      label: filterQuery.depositType
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase()),
                      value: filterQuery.depositType,
                    }
                  : null
              }
              placeholder={<Typography>Select Deposit Type</Typography>}
              onChange={(value) => handleFilterQuery("depositType", value)}
              components={{ DropdownIndicator: null }}
              {...selectProps}
            />
          </Box>
          <span
            onClick={() => handleFilterQuery("depositType", "")}
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
              onClickAway={() => openTransactionDate && setOpenTransactionDate(false)}
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

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
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

const allTabs = ["all", "pending", "approved", "rejected"];

const filterTypeOptions = allTabs.map((tab) => ({
  value: tab.toLowerCase(),
  label: tab,
}));

const allDepositType = ["cashDeposit", "bankTransferDeposit", "bankDeposit"];
const allSortBy = ["createdAt", "updatedAt", "amount"];
const allSortOrder = ["asc", "desc"];

export default DepositAdvancedFilter;
