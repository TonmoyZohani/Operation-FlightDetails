import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import React from "react";
import { BpCheckedIcon, BpIcon } from "../../../shared/common/styles";
import moment from "moment";

const MobilePassengerCard = ({
  retriveData,
  passenger,
  selectedPassengers,
  index,
  handleCheckboxChange,
  price,
  showFileFields,
  showImage,
  setFileOpen,
  setIndex,
  flattenedPassengers,
}) => {
  return (
    <Box
      sx={{
        border: "1px solid var(--primary-color)",
        borderRadius: "3px",
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControlLabel
            sx={{ width: "20px" }}
            control={
              <Checkbox
                sx={{ width: "30px", pr: 0 }}
                disableRipple
                checked={selectedPassengers?.includes(index)}
                disabled={
                  retriveData?.paymentStatus === "partially paid" &&
                  retriveData?.status === "ticketed"
                }
                onChange={() =>
                  handleCheckboxChange(index, {
                    ...passenger,
                    baseFare: price?.baseFare,
                    tax: price?.tax,
                  })
                }
                checkedIcon={<BpCheckedIcon color={"white"} />}
                icon={<BpIcon color={"white"} />}
              />
            }
          />
          <Box sx={{ mt: 0, pt: 0 }}>
            <Typography
              sx={{ textTransform: "uppercase", fontSize: "0.80rem" }}
            >
              {passenger?.prefix} {passenger?.firstName} {passenger?.lastName}
            </Typography>
            <Typography
              sx={{ textTransform: "uppercase", fontSize: "0.80rem" }}
            >
              <span>
                {passenger?.type === "CNN" ? (
                  <>
                    {passenger?.type}{" "}
                    <span style={{ color: "var(--primary-color)" }}>
                      [{passenger?.age} yrs]
                    </span>{" "}
                  </>
                ) : (
                  passenger?.type
                )}
                ,
              </span>
              <span>
                DOB: {moment(passenger?.dateOfBirth).format("DD MMM, YYYY")},{" "}
              </span>
              <span>Nation: {passenger?.passportNation}</span>
            </Typography>
          </Box>
        </Box>
        <Typography
          sx={{
            textTransform: "uppercase",
            fontSize: "12px",
            color:
              retriveData?.paymentStatus?.toLowerCase() === "paid"
                ? "green"
                : retriveData?.paymentStatus?.toLowerCase() === "unpaid"
                  ? "var(--primary-color)"
                  : "var(--flyhub)",
          }}
        >
          {retriveData?.paymentStatus}
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            border: "1px solid var(--border)",
            borderRadius: "5px",
            p: 1,
            width: "150px",
          }}
        >
          {showFileFields && !showImage ? (
            <Typography
              sx={{
                color: "var(--primary-color)",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
              onClick={() => {
                setFileOpen(true);
                setIndex(index);
              }}
            >
              Upload
            </Typography>
          ) : (
            <Box
              sx={{
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                height: "100%",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {showFileFields && showImage ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={passenger?.passportImage}
                    alt="img"
                    style={{
                      width: "50px",
                      height: "30px",
                      borderRadius: "3px",
                    }}
                    onClick={() => {
                      setFileOpen(true);
                      setIndex(index);
                    }}
                  />
                  <Typography sx={{ fontSize: "0.75rem" }}>
                    Passport Copy
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography sx={{ fontSize: "0.85rem" }}>
                    No Passport Copy
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
        <Box
          sx={{
            border: "1px solid var(--border)",
            borderRadius: "5px",
            p: 1,
            width: "150px",
          }}
        >
          {showFileFields && !showImage ? (
            <Typography
              sx={{
                color: "var(--primary-color)",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
              onClick={() => {
                setFileOpen(true);
                setIndex(index);
              }}
            >
              Upload
            </Typography>
          ) : (
            <Box
              sx={{
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                cursor: "pointer",
              }}
            >
              {showFileFields && showImage ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={passenger?.visaImage}
                    alt="img"
                    style={{
                      width: "50px",
                      height: "30px",
                      borderRadius: "3px",
                    }}
                    onClick={() => {
                      setFileOpen(true);
                      setIndex(index);
                    }}
                  />
                  <Typography sx={{ fontSize: "0.75rem" }}>
                    Visa Copy
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography sx={{ fontSize: "0.85rem" }}>
                    No Visa Copy
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>
          Base Fare
        </Typography>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--secondary-color)",
          }}
        >
          {price?.baseFare?.toLocaleString("en-IN")} BDT
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>Tax</Typography>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--secondary-color)",
          }}
        >
          {price?.tax?.toLocaleString("en-IN")} BDT
        </Typography>
      </Box>
    </Box>
  );
};

export default MobilePassengerCard;
