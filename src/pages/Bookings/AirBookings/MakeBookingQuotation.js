import React, { useState } from "react";
import { Box, Button, Dialog, Typography } from "@mui/material";
import { nextStepStyle } from "../../../style/style";
import { isMobile } from "../../../shared/StaticData/Responsive";
import QuotationShare from "../../../component/FlightAfterSearch/QuotationShare";

const MakeBookingQuotation = ({
  retriveData,
  type = "",
  serviceChargeData,
}) => {
  const [openQuote, setOpenQuote] = useState(false);

  return (
    <>
      <Box sx={{ bgcolor: "white", borderRadius: "5px 5px 0 0", p: 2 }}>
        <Typography
          sx={{ color: "#3C4258", fontSize: "0.85rem", fontWeight: "500" }}
        >
          Action
        </Typography>

        <Button
          onClick={() => setOpenQuote(true)}
          sx={{
            ...nextStepStyle,
            ":hover": { bgcolor: "var(--primary-color)" },
            width: "100%",
            mt: 2,
            padding: "8px 20px",
            justifyContent: "center",
          }}
        >
          Make {type} Quotation
        </Button>
      </Box>

      <Dialog
        open={openQuote}
        onClose={() => setOpenQuote(false)}
        fullWidth
        maxWidth={isMobile ? "sm" : "md"} // or "sm", "lg", "xl" depending on your layout
        // PaperProps={{ style: { maxHeight: "100%" } }}
      >
        <QuotationShare
          flightData={{
            ...retriveData?.details,
            priceBreakdown: retriveData?.details?.passengers
              .filter((item) => item?.count > 0)
              .map((passenger) => {
                const crrPax = retriveData?.details?.priceBreakdown?.find(
                  (item) => item?.paxType === passenger?.type
                );

                return {
                  ...crrPax,
                  paxCount: passenger?.count,
                  markupAmount: "",
                  totalMarkup: 0,
                };
              }),
          }}
          bookingData={retriveData}
          type="booking"
          bookingType={type}
          serviceChargeData={serviceChargeData}
        />
      </Dialog>
    </>
  );
};

export default MakeBookingQuotation;
