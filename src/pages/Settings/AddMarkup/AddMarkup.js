import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { textFieldProps } from "../../../shared/common/functions";
import { depositBtn, sharedInputStyles } from "../../../shared/common/styles";
import PageTitle from "../../../shared/common/PageTitle";
import { isMobile } from "../../../shared/StaticData/Responsive";
import MobileHeader from "../../../component/MobileHeader/MobileHeader";

const operations = ["Booking", "Refund", "Reissue", "Void"];
const destinations = ["SOTO", "SOTI", "SITI", "SITO"];
const journeyTypeAll = ["Oneway", "Roundway", "Multicity"];
const markupTypeAll = ["Amount", "Percentage"];
const markupForAll = ["Total Pax", "Per Pax"];

const tabs = [
  { id: 0, label: "flight" },
  { id: 1, label: "group fare" },
  { id: 2, label: "tour" },
  { id: 3, label: "visa" },
  { id: 4, label: "hotel" },
];

const AddMarkup = () => {
  const [barnch, setBranch] = useState("");
  const [operation, setOperation] = useState("");
  const [destination, setDestination] = useState([]);
  const [journeyType, setJourneyType] = useState([]);
  const [markupType, setMarkupType] = useState("");
  const [markupFor, setMarkupFor] = useState("");
  const [amount, setAmount] = useState("");
  const [activeTab, setactiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (state, event) => {
    const {
      target: { value },
    } = event;
    state(value);
  };

  const handleChangeMultiple = (state, event) => {
    const {
      target: { value },
    } = event;
    state(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Box sx={{ borderRadius: "10px" }}>
      {isMobile ? (
        <>
          <MobileHeader
            title={"Markup Management System"}
            subTitle={"Markup"}
            labelValue={"flight"}
            // subTitle={id}
            // labelValue={id}
            labelType={"select"}
            options={tabs.map((tab) => tab.label)}
            onChange={(e) => {
              // navigate(`/dashboard/staffManagement/${e?.target?.value}`)
            }}
          />
        </>
      ) : (
        <PageTitle title={"Markup Management System"} />
      )}

      <Box sx={{ px: { md: "0", xs: "15px" }, mt: { md: "0", xs: "15px" } }}>
        <Box
          sx={{
            px: { md: "22px", xs: "15px" },
            py: { md: "25px", xs: "15px" },
            bgcolor: "white",
            borderRadius: { md: "0 0 5px 5px", xs: "4px" },
            minHeight: "73vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            {!isMobile && (
              <Stack spacing={1} direction={"row"} sx={{ mb: 2.5 }}>
                {tabs?.map((tab, index) => (
                  <Button
                    size="small"
                    key={tab?.label}
                    varient="contained"
                    sx={{
                      fontSize: "11px",
                      p: "6px",
                      bgcolor:
                        activeTab === index
                          ? "var(--primary-color)"
                          : "transparent",
                      color:
                        activeTab === index
                          ? "var(--white)"
                          : "var(--secondary-color)",
                    }}
                    onClick={() => setactiveTab(index)}
                  >
                    {tab?.label}
                  </Button>
                ))}
              </Stack>
            )}
            <Grid container spacing={2.5}>
              {/* Select Branch */}
              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <FormControl fullWidth size="small" sx={sharedInputStyles}>
                    <InputLabel id="branch-select-label">
                      Select branch
                    </InputLabel>
                    <Select
                      labelId="branch-select-label"
                      value={barnch || ""}
                      name="branch"
                      label="Select branch"
                      onChange={(value) => handleChange(setBranch, value)}
                      MenuProps={{ disableScrollLock: true }}
                    >
                      {operations?.map((value) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              {/* Select Operations */}
              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <FormControl fullWidth size="small" sx={sharedInputStyles}>
                    <InputLabel id="operation-select-label">
                      Select operation
                    </InputLabel>
                    <Select
                      labelId="operation-select-label"
                      value={operation || ""}
                      name="operation"
                      label="Select operation"
                      onChange={(value) => handleChange(setOperation, value)}
                      MenuProps={{ disableScrollLock: true }}
                    >
                      {operations?.map((value) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2.5} mt={1.5}>
              {/* Select Destination */}
              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <FormControl fullWidth size="small" sx={sharedInputStyles}>
                    <InputLabel id="destinationType-select-label">
                      Select destination type
                    </InputLabel>
                    <Select
                      labelId="destinationType-select-label"
                      value={destination || ""}
                      name="destinationType"
                      label="Select destination type"
                      multiple
                      onChange={(value) =>
                        handleChangeMultiple(setDestination, value)
                      }
                      MenuProps={{ disableScrollLock: true }}
                    >
                      {destinations?.map((value) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              {/* Select Journey Type */}
              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <FormControl fullWidth size="small" sx={sharedInputStyles}>
                    <InputLabel id="journeyType-select-label">
                      Select journey type
                    </InputLabel>
                    <Select
                      labelId="journeyType-select-label"
                      value={journeyType || ""}
                      name="journeyType"
                      label="Select journey type"
                      multiple
                      onChange={(value) =>
                        handleChangeMultiple(setJourneyType, value)
                      }
                      MenuProps={{ disableScrollLock: true }}
                    >
                      {journeyTypeAll.map((value) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              {/* Select Markup Type */}
              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <FormControl fullWidth size="small" sx={sharedInputStyles}>
                    <InputLabel id="markupType-select-label">
                      Select Markup type
                    </InputLabel>
                    <Select
                      labelId="markupType-select-label"
                      value={markupType || ""}
                      name="markupType"
                      label="Select Markup type"
                      onChange={(value) => handleChange(setMarkupType, value)}
                      MenuProps={{ disableScrollLock: true }}
                    >
                      {markupTypeAll.map((value) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              {/* Select Markup For */}
              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <FormControl fullWidth size="small" sx={sharedInputStyles}>
                    <InputLabel id="journeyType-select-label">
                      Select Markup applicable for
                    </InputLabel>
                    <Select
                      labelId="markupFor-select-label"
                      value={markupFor || ""}
                      name="markupFor"
                      label="Select Markup applicable for"
                      onChange={(value) => handleChange(setMarkupFor, value)}
                      MenuProps={{ disableScrollLock: true }}
                    >
                      {markupForAll.map((value) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              {/* Markup Amount */}
              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    {...textFieldProps("amount", "Markup Amount")}
                    onChange={(e) => setAmount(e.target.value)}
                    sx={sharedInputStyles}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Button
            type="submit"
            disabled={isLoading}
            sx={{
              ...depositBtn,
              display: "flex",
              alignItems: "center",
              justifyContent: isLoading ? "space-between" : "flex-start",
              gap: isLoading ? "8px" : "0",
              textAlign: isLoading ? "center" : "left",
              paddingRight: isLoading ? "16px" : "0",
            }}
          >
            {isLoading ? (
              <>
                Add Markup
                <CircularProgress size={20} color="inherit" />
              </>
            ) : (
              `Add Markup`
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddMarkup;
