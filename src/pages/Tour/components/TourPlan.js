import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

const TourPlan = () => {
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box>
      {tourPlans?.map((tour, index) => (
        <Accordion
          key={tour?.index}
          sx={{
            boxShadow: "none",
            borderRadius: "5px",
            mb: 0.7,
            "&::before": {
              display: "none",
            },
          }}
          expanded={expanded === index}
          onChange={handleAccordionChange(index)}
        >
          <AccordionSummary
            sx={{
              color: "#1D2120",
              fontSize: "13px",
              fontWeight: 400,
              borderBottom: expanded !== index && "1px solid #F2ECF4",
            }}
            aria-controls={`panel1-${index}content`}
            id={`panel1-${index}conent`}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  bgcolor: "var(--primary-color)",
                  color: "var(--white)",
                  height: "50px",
                  width: "50px",
                  borderRadius: "50%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: "12px", textAlign: "center" }}>
                  Day
                </Typography>
                <Typography sx={{ fontSize: "12px", textAlign: "center" }}>
                  {tour?.question}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "17.5px",
                    color: "var(--secondary-color)",
                  }}
                >
                  Depart From Dhaka
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "10.5px",
                    color: "var(--text-light)",
                  }}
                >
                  12 September 2022
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              borderTop: "none",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "18px",
            }}
          >
            <Box>
              {timelineData?.map((tour, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    ml: "10px",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      left: 10,
                      top: "55%",
                      transform: "translateY(-50%)",
                      height: "100%",
                      borderLeft:
                        timelineData?.length !== index + 1 &&
                        "1px solid #F2ECF4",

                      // zIndex: -1,
                    }}
                  />

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box
                      sx={{
                        bgcolor: "var(--primary-color)",
                        width: "20px",
                        height: "20px",
                        borderRadius: "11.5px",
                        zIndex: 1,
                      }}
                    ></Box>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        color: "var(--primary-color)",
                        mb: 1,
                      }}
                    >
                      {tour?.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      ml: "36px",
                      borderBottom:
                        timelineData.length - 1 === index &&
                        "1px solid var(--primary-color)",
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: 400, fontSize: "13px", mb: 2 }}
                    >
                      {tour?.content}
                    </Typography>
                    <Stack direction="row" spacing={2} pb={3}>
                      <CardMedia
                        src="#"
                        sx={{
                          width: "20%",
                          height: "89px",
                          bgcolor: "#D9D9D9",
                        }}
                      />
                      <CardMedia
                        src="#"
                        sx={{
                          width: "20%",
                          height: "89px",
                          bgcolor: "#D9D9D9",
                        }}
                      />
                      <CardMedia
                        src="#"
                        sx={{
                          width: "20%",
                          height: "89px",
                          bgcolor: "#D9D9D9",
                        }}
                      />
                      <CardMedia
                        src="#"
                        sx={{
                          width: "20%",
                          height: "89px",
                          bgcolor: "#D9D9D9",
                        }}
                      />
                    </Stack>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        pb: 4,
                      }}
                    >
                      <Typography
                        sx={{
                          bgcolor: "var(--secondary-color)",
                          color: "var(--white)",
                          fontSize: "11px",
                          px: 1.7,
                          borderRadius: "20px",
                          py: 0.5,
                          fontWeight: 500,
                        }}
                      >
                        Meal
                      </Typography>
                      <Typography
                        sx={{
                          bgcolor: "var(--secondary-color)",
                          color: "var(--white)",
                          fontSize: "11px",
                          px: 1.7,
                          borderRadius: "20px",
                          py: 0.5,
                          fontWeight: 500,
                        }}
                      >
                        Transport
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

const tourPlans = [
  {
    index: 0,
    question: "01",
    answer:
      "he applicant needs to submit an original Passport that was issued within 10 years. The passport must have six months of validity after the intended date of departure. The applicantâ€™s current passport must have two empty/blank pages back to back. Hand-written and alternation are not allowed. Clear photocopy of the front page to the last page. If the applicant used any pages before then he/she needs to submit those pages clear copy also. If the applicant has an old passport, he/she have to include that.",
  },
  {
    index: 1,
    question: "02",
    answer:
      "he applicant needs to submit an original Passport that was issued within 10 years. The passport must have six months of validity after the intended date of departure. The applicantâ€™s current passport must have two empty/blank pages back to back. Hand-written and alternation are not allowed. Clear photocopy of the front page to the last page. If the applicant used any pages before then he/she needs to submit those pages clear copy also. If the applicant has an old passport, he/she have to include that.",
  },
];

const timelineData = [
  {
    id: 0,
    title: "Event 01 (Morning)",
    time: "08:00 AM",
    content:
      "Home to majestic mountain ranges and picture like islands; Europe possesses some of the most beautiful scenery on Earth. We are going to have 20 days long road trip and touch nine exceptionally exotic countries of Europe. There simply is no way not be awestruck by its scenic beauty and artistic diversity. What is great about Europe is their cultural diversity. People even speak different languages. Some of their most unique attractions are the Eiffel Tower in Paris, France; Colosseum in Rome, Italy; Parthenon in Athens, Greece; and the Leaning Tower of Pisa, Italy. They are also known for their epic cuisines; like most popular Italian cuisine, French desserts, Switzerland’s chocolate etc. We are definitely going to have a blast in Europe.",
  },
  {
    id: 1,
    title: "Event 02 (Noon)",
    time: "08:00 AM",
    content:
      "Home to majestic mountain ranges and picture like islands; Europe possesses some of the most beautiful scenery on Earth. We are going to have 20 days long road trip and touch nine exceptionally exotic countries of Europe. There simply is no way not be awestruck by its scenic beauty and artistic diversity. What is great about Europe is their cultural diversity. People even speak different languages. Some of their most unique attractions are the Eiffel Tower in Paris, France; Colosseum in Rome, Italy; Parthenon in Athens, Greece; and the Leaning Tower of Pisa, Italy. They are also known for their epic cuisines; like most popular Italian cuisine, French desserts, Switzerland’s chocolate etc. We are definitely going to have a blast in Europe.",
  },
];

export default TourPlan;
