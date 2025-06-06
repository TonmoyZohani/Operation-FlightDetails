import { Box, CardMedia, Container, Typography } from "@mui/material";
import React, { useEffect } from "react";
import NewsImg from "../../images/blog/blogImg.png";

const NewsDetails = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <Box
      sx={{
        mx: {
          xs: "1rem",
        },
      }}
    >
      <Container>
        <Box
          sx={{
            pb: "5rem",
            minHeight: "70vh",
          }}
        >
          <Typography sx={style.header}>
            <span style={{ fontWeight: 100 }}>FLY FAR</span> NEWS
          </Typography>
          <Typography sx={style.subHeader}>{newsData?.title}</Typography>
          <CardMedia
            component="img"
            alt="blogs"
            image={newsData?.image}
            sx={{
              borderRadius: "7px",
              width: "100%",
              height: "45vh",
              objectFit: "fill",
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
            <Typography
              gutterBottom={2}
              sx={{
                bgcolor: "var(--primary-color)",
                display: "inline-block",
                px: 1.5,
                py: 0.2,
                borderRadius: "20px",
                color: "#FFF",
                fontSize: "0.9rem",
                cursor: "default",
                textTransform: "capitalize",
              }}
            >
              Airlines
            </Typography>
            <Typography
              sx={{
                color: "var(--gray-8)",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              {newsData?.date}
            </Typography>
          </Box>

          <Typography sx={style.title}>General Terms</Typography>
          <Typography sx={style.paragraph}>
            Please be informed that, by registering on our B2B Portal of Fly Far
            Agent, you are agreeing to accept all of our terms and conditions.
            By accessing, using or booking through our portal means that you
            have agreed to the terms and conditions that we set out below. The
            information provided on our booking platform must be truthful,
            accurate and updated. Our supplier reserves the sole right to cancel
            bookings without refund when incorrect information has been
            provided. We may terminate your account anytime, with or without
            notice, if we find you to conduct any activity that is in breach of
            these Terms, and if we believe that to be harmful to our business,
            or for conduct where the use of the Service is harmful to any other
            party. Fly Far International authorities do not encourage the B2B
            agents to keep an extra amount of money in the agent's account. If
            the b2b agent keeps the more or an extra amount of money in their
            account then they will not be able to withdraw the extra amount
            which is kept in the Fly Far Agent portal. Whenever required, the
            agent can utilize the amount of money by issuing tickets or availing
            any of the services. Fly Far International authority preserves the
            right to release or hold the amount based on different situations.
            If any of our services have any additional terms specific to the
            service, those terms will be specified in the product details page,
            and you will be responsible to read them before booking. We may, in
            our sole discretion, change or modify these Terms at any time, with
            or without notice. You are responsible to read this document from
            time to time to ensure that your use of the Service remains in
            compliance with these Terms.
          </Typography>
          <CardMedia
            component="img"
            alt="blogs"
            image={newsData?.image}
            sx={{
              borderRadius: "7px",
              width: "100%",
              height: "45vh",
              objectFit: "fill",
            }}
          />
          <Typography sx={style.title}>
            Fly Far International Services
          </Typography>
          <Typography sx={style.paragraph}>
            Please be informed that, by registering on our B2B Portal of Fly Far
            Agent, you are agreeing to accept all of our terms and conditions.
            By accessing, using or booking through our portal means that you
            have agreed to the terms and conditions that we set out below. The
            information provided on our booking platform must be truthful,
            accurate and updated. Our supplier reserves the sole right to cancel
            bookings without refund when incorrect information has been
            provided. We may terminate your account anytime, with or without
            notice, if we find you to conduct any activity that is in breach of
            these Terms, and if we believe that to be harmful to our business,
            or for conduct where the use of the Service is harmful to any other
            party. Fly Far International authorities do not encourage the B2B
            agents to keep an extra amount of money in the agent's account. If
            the b2b agent keeps the more or an extra amount of money in their
            account then they will not be able to withdraw the extra amount
            which is kept in the Fly Far Agent portal. Whenever required, the
            agent can utilize the amount of money by issuing tickets or availing
            any of the services. Fly Far International authority preserves the
            right to release or hold the amount based on different situations.
            If any of our services have any additional terms specific to the
            service, those terms will be specified in the product details page,
            and you will be responsible to read them before booking. We may, in
            our sole discretion, change or modify these Terms at any time, with
            or without notice. You are responsible to read this document from
            time to time to ensure that your use of the Service remains in
            compliance with these Terms.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

const style = {
  header: {
    fontSize: {
      xs: "2rem",
      md: "2rem",
    },
    fontWeight: 500,
    lineHeight: "3.125rem",
    mt: {
      xs: "2rem",
      md: "4rem",
    },
    color: "var(--black)",
  },
  subHeader: {
    fontSize: "2.5rem",
    fontWeight: 500,
    lineHeight: "3rem",
    color: "var(--gray-3)",
    mt: 1,
    mb: 4,
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 500,
    lineHeight: "1.5rem",
    color: "var(--secondary-color)",
    mt: 8
  },
  paragraph: {
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: "1.5rem",
    mt: "1rem",
    color: "var(--black)",
    mb: "5rem",
  },
  tab: {
    borderLeft: 3,
    textAlign: "left",
    color: "var(--gray)",
    alignItems: "start",
    fontWeight: 600,
    "&.Mui-selected": {
      color: "var(--secondary-color)",
    },
  },
};

const newsData = {
  title: "History of Biman Bangladesh Airlines",
  description:
    "Please be informed that, by registering on our B2B Portal of Fly Far Agent, you are agreeing to accept all of our terms and conditions.",
  date: "22th September 2022",
  image: NewsImg,
};

export default NewsDetails;
