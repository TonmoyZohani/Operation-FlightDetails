import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";

const accordions = [
  {
    index: 0,
    question: "Question one",
    answer:
      "he applicant needs to submit an original Passport that was issued within 10 years. The passport must have six months of validity after the intended date of departure. The applicantâ€™s current passport must have two empty/blank pages back to back. Hand-written and alternation are not allowed. Clear photocopy of the front page to the last page. If the applicant used any pages before then he/she needs to submit those pages clear copy also. If the applicant has an old passport, he/she have to include that.",
  },
  {
    index: 1,
    question: "Question one",
    answer:
      "he applicant needs to submit an original Passport that was issued within 10 years. The passport must have six months of validity after the intended date of departure. The applicantâ€™s current passport must have two empty/blank pages back to back. Hand-written and alternation are not allowed. Clear photocopy of the front page to the last page. If the applicant used any pages before then he/she needs to submit those pages clear copy also. If the applicant has an old passport, he/she have to include that.",
  },
];

const VisaFrequentlyAskQuestion = () => {
  return (
    <Box>
      {accordions?.map((accordion) => (
        <Accordion
          key={accordion?.index}
          sx={{
            bgcolor: "#F6F6F6",
            boxShadow: "none",
            borderBottom: "none",
            borderRadius: "5px",
            my: 1,
            "&::before": {
              display: "none",
            },
          }}
          defaultExpanded={accordion?.index === 0}
        >
          <AccordionSummary
            sx={{
              color: "#141E22",
              fontSize: "0.85rem",
              fontWeight: 400,
            }}
            // expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id={accordion?.index}
          >
            {accordion?.question}
          </AccordionSummary>
          <AccordionDetails
            sx={{
              borderTop: "none",
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: "18px",
              color: "#141E22",
            }}
          >
            {accordion?.answer}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default VisaFrequentlyAskQuestion;
