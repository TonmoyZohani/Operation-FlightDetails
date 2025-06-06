import { Box, Typography } from "@mui/material";

const VisaCheckingDetails = () => {
  return (
    <Box>
      <Box pb={2}>
        <Typography
          variant="h6"
          component="h6"
          sx={{
            fontSize: "1rem",
            fontWeight: "Bold",
            color: "#141E22",
            pb: 1,
          }}
        >
          Visa Application Form
        </Typography>
        <Typography
          variant="body1"
          // component="body4"
          sx={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--text-light)",
            pb: 2,
            lineHeight: "18px",
            textAlign: "justify",
          }}
        >
          He applicant needs to submit an original Passport that was issued
          within 10 years. The passport must have six months of validity after
          the intended date of departure. The applicantâ€™s current passport
          must have two empty/blank pages back to back. Hand-written and
          alternation are not allowed. Clear photocopy of the front page to the
          last page. If the applicant used any pages before then he/she needs to
          submit those pages clear copy also. If the applicant has an old
          passport, he/she have to include that.
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="h6"
          component="h6"
          sx={{
            fontSize: "1rem",
            fontWeight: "Bold",
            color: "#141E22",
            pb: 1,
          }}
        >
          Passport
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--text-light)",
            pb: 2,
            lineHeight: "18px",
            textAlign: "justify",
          }}
        >
          He applicant needs to submit an original Passport that was issued
          within 10 years. The passport must have six months of validity after
          the intended date of departure. The applicantâ€™s current passport
          must have two empty/blank pages back to back. Hand-written and
          alternation are not allowed. Clear photocopy of the front page to the
          last page. If the applicant used any pages before then he/she needs to
          submit those pages clear copy also. If the applicant has an old
          passport, he/she have to include that.
        </Typography>
      </Box>
    </Box>
  );
};

export default VisaCheckingDetails;
