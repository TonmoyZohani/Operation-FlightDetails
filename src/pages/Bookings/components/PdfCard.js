import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Modal,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import AgentInvoicePdf from "../../../component/PDFPageDesign/AgentInvoicePdf";
import PDFPageDesign from "../../../component/PDFPageDesign/PDFPageDesign";
import pdfPlaceholder from "../../../../src/assets/png/pdf.png";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const downloadSectionStyle = {
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  p: "4px 10px",
};

const buttonStyle = {
  width: "100%",
  height: "60px",
  bgcolor: "#fff",
  borderRadius: "4px",
  border: "1px solid #E2EAF1",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  px: "15px",
};

const downloadBoxStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
};

const typographyStyle = {
  fontSize: "13px",
  color: "var(--secoundary-color)",
  mt: "5px",
  fontWeight: 600,
  pt: "10px",
};

const PdfCard = ({
  singleBooking,
  flattenedPassengers,
  filteredRelations,
  markupData,
  setOpenMarkup,
  setTypeMarkup,
}) => {
  const [openPdf, setOpenPdf] = useState(false);
  const [openSubPdf, setOpenSubPdf] = useState(false);
  const [paxMarkup, setPaxMarkup] = useState(() => {
    const priceBreakdown = singleBooking?.details?.priceBreakdown || [];

    const uniquePaxData = Object.values(
      priceBreakdown.reduce((acc, pax) => {
        const {
          paxType,
          paxCount,
          markupAmount = "",
          totalMarkup = 0,
          age,
        } = pax;
        if (!acc[paxType]) {
          acc[paxType] = {
            paxType,
            paxCount: 0,
            markupAmount,
            totalMarkup,
            age,
          };
        }
        acc[paxType].paxCount += paxCount;
        return acc;
      }, {})
    );

    return uniquePaxData?.map((pax) => {
      const markup = markupData?.find((m) => m.paxType === pax.paxType);
      return {
        ...pax,
        markupAmount: markup ? markup.amount : "",
        totalMarkup: markup ? markup.amount * pax?.paxCount : 0,
      };
    });
  });
  const [openPopup, setOpenPopup] = useState(false);
  const { agentData } = useOutletContext();

  const handleClose = () => {
    setOpenPopup(false);
  };

  const togglePdf = () => {
    setOpenPdf(!openPdf);
    if (openSubPdf) {
      setOpenSubPdf(false);
    }
  };

  const result = paxMarkup?.map((pax) => {
    const matchingMarkup = markupData?.find(
      (markup) => markup?.paxType === pax?.paxType
    );
    const amount = matchingMarkup ? matchingMarkup?.amount : 0;
    return {
      ...pax,
      totalAmount: pax?.paxCount * amount,
    };
  });

  const markupTotal = result.reduce((sum, pax) => sum + pax?.totalAmount, 0);

  return (
    <>
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "3px",
          p: "0.5rem 7px",
          mb: "18px",
        }}
      >
        {/* First Level Download Pdf */}
        <Box sx={downloadSectionStyle} onClick={togglePdf}>
          <Typography
            sx={{ color: "#3C4258", fontSize: "13px", fontWeight: "500" }}
          >
            Download Pdf
          </Typography>
          <ArrowDropDownIcon
            sx={{
              bgcolor: "#F2F8FF",
              borderRadius: "50%",
              transition: "transform 0.3s",
              transform: openPdf ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </Box>

        <Accordion
          expanded={openPdf}
          style={{
            margin: "0",
            boxShadow: "none",
          }}
        >
          <AccordionSummary
            id="panel2a-header"
            style={{
              margin: "0",
              padding: "0",
              display: "none",
            }}
          ></AccordionSummary>
          <Box sx={{ padding: "8px 10px" }}>
            {singleBooking?.status?.toLowerCase() !== "ticketed" && (
              <Typography
                sx={{
                  color: "var(--secondary-color)",
                  fontSize: "14px",
                  mb: "10px",
                  cursor: "pointer",
                }}
                onClick={() => setOpenPopup(true)}
              >
                Booking Copy
              </Typography>
            )}

            {singleBooking?.status?.toLowerCase() === "ticketed" && (
              <>
                <Typography
                  sx={{
                    color: "var(--secondary-color)",
                    fontSize: "14px",
                    mb: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => setOpenPopup(true)}
                >
                  E-Ticket Copy
                </Typography>
                <DownloadLinkItem
                  document={
                    <AgentInvoicePdf
                      copy="per-pax-ticket-copy"
                      check="1"
                      singleBooking={singleBooking}
                      agentData={agentData}
                      ticket
                      passengerData={
                        singleBooking?.details?.passengerInformation
                      }
                      markupTotal={markupTotal}
                    />
                  }
                  fileName="eticketp"
                  label="Agent Invoice"
                />
              </>
            )}
          </Box>

          <Stack spacing={0.5}>
            {flattenedPassengers?.length > 1 &&
              flattenedPassengers?.map((passenger, index) => {
                const hasNoRelation = !filteredRelations.some(
                  (relation) => relation.passengerId === passenger.id
                );

                if (hasNoRelation) {
                  return (
                    <Accordion
                      key={index}
                      sx={{
                        px: 0,
                        border: "none",
                        borderTop: "none",
                        borderBottom: "none",
                        boxShadow: "none",
                        bgcolor: "#EFF7FF",
                        borderRadius: "3px",
                        "&:before": {
                          display: "none",
                          margin: 0,
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ArrowDropDownIcon
                            sx={{
                              color: "black",
                              bgcolor: "#DADCE0",
                              borderRadius: "50%",
                            }}
                          />
                        }
                        aria-controls="panel1-content"
                        id="panel1-header"
                        sx={{
                          px: 1.5,
                          my: 0,
                          borderTop: "none",
                          "&.Mui-expanded": {
                            mt: 0,
                            pt: 0,
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#3C4258",
                            fontSize: "13px",
                            fontWeight: "500",
                            py: 0,
                            textTransform: "uppercase",
                          }}
                        >
                          {`${passenger?.prefix} ${passenger?.firstName} ${passenger?.lastName}`}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 1.5, py: 0 }}>
                        {singleBooking?.status?.toLowerCase() !==
                          "ticketed" && (
                          <Typography sx={{ fontSize: "13px", mb: 1 }}>
                            <PDFDownloadLink
                              document={
                                <PDFPageDesign
                                  copy="copy"
                                  check="1"
                                  singleBooking={singleBooking}
                                  passengers={[flattenedPassengers?.[index]]}
                                  paxType={passenger?.type}
                                  agentData={agentData}
                                />
                              }
                              fileName={`eticketp`}
                              style={{
                                textDecoration: "none",
                                color: "var(--secondary-color)",
                              }}
                            >
                              {({ url, loading }) =>
                                loading ? (
                                  <Skeleton
                                    variant="text"
                                    sx={{ fontSize: "1rem" }}
                                  />
                                ) : (
                                  <Typography
                                    component="a"
                                    href={url}
                                    sx={{
                                      cursor: "pointer",
                                      color: "var(--secondary-color)",
                                      fontSize: "14px",
                                      textDecoration: "none",
                                    }}
                                    target="_blank"
                                  >
                                    Booking Copy
                                  </Typography>
                                )
                              }
                            </PDFDownloadLink>
                          </Typography>
                        )}

                        {singleBooking?.status?.toLowerCase() !==
                          "ticketed" && (
                          <Typography sx={{ fontSize: "11px", mb: 1 }}>
                            <PDFDownloadLink
                              document={
                                <PDFPageDesign
                                  copy="without-copy"
                                  check="1"
                                  singleBooking={singleBooking}
                                  passengers={flattenedPassengers}
                                  paxType={passenger?.type}
                                  agentData={agentData}
                                />
                              }
                              fileName={`eticketp`}
                              style={{
                                textDecoration: "none",
                                color: "var(--secondary-color)",
                              }}
                            >
                              {({ url, loading }) =>
                                loading ? (
                                  <Skeleton
                                    variant="text"
                                    sx={{ fontSize: "1rem" }}
                                  />
                                ) : (
                                  <Typography
                                    component="a"
                                    href={url}
                                    sx={{
                                      cursor: "pointer",
                                      color: "var(--secondary-color)",
                                      fontSize: "14px",
                                      textDecoration: "none",
                                    }}
                                    target="_blank"
                                  >
                                    Booking Copy Without Price
                                  </Typography>
                                )
                              }
                            </PDFDownloadLink>
                          </Typography>
                        )}

                        {singleBooking?.status?.toLowerCase() ===
                          "ticketed" && (
                          <>
                            <Typography sx={{ fontSize: "11px", mb: 1 }}>
                              <PDFDownloadLink
                                document={
                                  <PDFPageDesign
                                    copy="per-pax-ticket-copy"
                                    check="1"
                                    singleBooking={singleBooking}
                                    passengers={flattenedPassengers}
                                    paxType={passenger?.type}
                                    ticket={true}
                                    agentData={agentData}
                                  />
                                }
                                fileName={`eticketp`}
                                style={{
                                  textDecoration: "none",
                                  color: "var(--secondary-color)",
                                }}
                              >
                                {({ url, loading }) =>
                                  loading ? (
                                    <Skeleton
                                      variant="text"
                                      sx={{ fontSize: "1rem" }}
                                    />
                                  ) : (
                                    <Typography
                                      component="a"
                                      href={url}
                                      sx={{
                                        cursor: "pointer",
                                        color: "var(--secondary-color)",
                                        fontSize: "14px",
                                        textDecoration: "none",
                                      }}
                                      target="_blank"
                                    >
                                      E-Ticket Copy
                                    </Typography>
                                  )
                                }
                              </PDFDownloadLink>
                            </Typography>
                            <Typography sx={{ fontSize: "11px", mb: 1 }}>
                              <PDFDownloadLink
                                document={
                                  <PDFPageDesign
                                    copy="without-copy"
                                    check="1"
                                    singleBooking={singleBooking}
                                    passengers={flattenedPassengers}
                                    paxType={passenger?.type}
                                    ticket={true}
                                    agentData={agentData}
                                  />
                                }
                                fileName={`eticketp`}
                                style={{
                                  textDecoration: "none",
                                  color: "var(--secondary-color)",
                                }}
                              >
                                {({ url, loading }) =>
                                  loading ? (
                                    <Skeleton
                                      variant="text"
                                      sx={{ fontSize: "1rem" }}
                                    />
                                  ) : (
                                    <Typography
                                      component="a"
                                      href={url}
                                      sx={{
                                        cursor: "pointer",
                                        color: "var(--secondary-color)",
                                        fontSize: "14px",
                                        textDecoration: "none",
                                      }}
                                      target="_blank"
                                    >
                                      E-Ticket Copy Without Price
                                    </Typography>
                                  )
                                }
                              </PDFDownloadLink>
                            </Typography>
                            <Typography sx={{ fontSize: "11px", mb: 1 }}>
                              <PDFDownloadLink
                                document={
                                  <PDFPageDesign
                                    copy="per-pax-ticket-copy"
                                    check="1"
                                    singleBooking={singleBooking}
                                    passengers={flattenedPassengers}
                                    agentData={agentData}
                                    ticket={true}
                                  />
                                }
                                fileName={`eticketp`}
                                style={{
                                  textDecoration: "none",
                                  color: "var(--secondary-color)",
                                }}
                              >
                                {({ url, loading }) =>
                                  loading ? (
                                    <Skeleton
                                      variant="text"
                                      sx={{ fontSize: "1rem" }}
                                    />
                                  ) : (
                                    <Typography
                                      component="a"
                                      href={url}
                                      sx={{
                                        cursor: "pointer",
                                        color: "var(--secondary-color)",
                                        fontSize: "14px",
                                        textDecoration: "none",
                                      }}
                                      target="_blank"
                                    >
                                      Agent Invoice
                                    </Typography>
                                  )
                                }
                              </PDFDownloadLink>
                            </Typography>
                          </>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  );
                }
                return null;
              })}
          </Stack>
        </Accordion>
      </Box>

      <Modal open={openPopup} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "36%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              bgcolor: "white",
              width: "100%",
              p: "22px 30px",
              borderRadius: "10px",
              minHeight: "180px",
            }}
          >
            <Typography sx={{ fontSize: "18px", color: "#000" }}>
              Choose Your Preference For{" "}
              {singleBooking?.status?.toLowerCase() === "ticketed"
                ? "E-Ticket"
                : "Booking"}{" "}
              Copy
            </Typography>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                justifyContent: "space-between",
                mt: "20px",
              }}
            >
              {singleBooking?.status?.toLowerCase() !== "ticketed" ? (
                <>
                  <DownloadOption
                    label="Booking Copy"
                    copy="per-pax-ticket-copy"
                    singleBooking={singleBooking}
                    passengers={flattenedPassengers}
                    agentData={agentData}
                  />
                  <DownloadOption
                    label="Booking Copy Without Price"
                    copy="without-copy"
                    singleBooking={singleBooking}
                    passengers={flattenedPassengers}
                    agentData={agentData}
                  />
                </>
              ) : (
                <>
                  <DownloadOption
                    label="With Price"
                    copy="per-pax-ticket-copy"
                    singleBooking={singleBooking}
                    passengers={flattenedPassengers}
                    agentData={agentData}
                    ticket
                  />
                  <DownloadOption
                    label="Without Price"
                    copy="without-copy"
                    singleBooking={singleBooking}
                    passengers={flattenedPassengers}
                    agentData={agentData}
                    ticket
                  />
                </>
              )}

              {/* Price With Markup */}
              <Box
                sx={{ ...buttonStyle, cursor: "pointer" }}
                onClick={() => {
                  setOpenMarkup(true);
                  setOpenPopup(false);
                  setTypeMarkup("pdfprice");
                }}
              >
                <Box sx={downloadBoxStyle}>
                  <img
                    alt="logo"
                    src={pdfPlaceholder}
                    style={{ height: "30px" }}
                  />
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "var(--secondary-color)",
                      mt: "5px",
                      fontWeight: 600,
                    }}
                  >
                    Price With Markup
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

const DownloadOption = ({
  label,
  copy,
  ticket,
  singleBooking,
  passengers,
  agentData,
}) => (
  <Box sx={buttonStyle}>
    <Box sx={downloadBoxStyle}>
      <img alt="logo" src={pdfPlaceholder} style={{ height: "30px" }} />
      <DownloadLinkItem
        document={
          <PDFPageDesign
            copy={copy}
            check="1"
            singleBooking={singleBooking}
            passengers={passengers}
            agentData={agentData}
            ticket={ticket}
          />
        }
        fileName="eticketp"
        label={<Typography sx={typographyStyle}>{label}</Typography>}
      />
    </Box>
    <DownloadLinkItem
      document={
        <PDFPageDesign
          copy={copy}
          check="1"
          singleBooking={singleBooking}
          passengers={passengers}
          agentData={agentData}
          ticket
        />
      }
      fileName="eticketp"
      label={
        <FileDownloadIcon
          sx={{ color: "#3C4258", mt: "17px", cursor: "pointer" }}
        />
      }
    />
  </Box>
);

export const DownloadLinkItem = ({ document, fileName, label }) => (
  <Typography sx={{ fontSize: "11px", mb: 1 }}>
    <PDFDownloadLink
      document={document}
      fileName={fileName}
      style={{
        textDecoration: "none",
        color: "var(--secondary-color)",
      }}
    >
      {({ url, loading }) =>
        loading ? (
          <Box sx={{ width: "100px", pt: "10px" }}>
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          </Box>
        ) : (
          <Typography
            component="a"
            href={url}
            sx={{
              cursor: "pointer",
              color: "var(--secondary-color)",
              fontSize: "14px",
              textDecoration: "none",
            }}
            target="_blank"
          >
            {label}
          </Typography>
        )
      }
    </PDFDownloadLink>
  </Typography>
);

export default PdfCard;
