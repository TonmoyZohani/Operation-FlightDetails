import {
  Box,
  Button,
  Collapse,
  Container,
  FormControl,
  Grid,
  Input,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NotFound from "../../component/NotFound/NoFound";

const Career = () => {
  const [activeFaq, setActiveFaq] = useState(0);
  const [value, setValue] = useState(tabList[0].value);
  const list = false;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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
            <span style={{ fontWeight: 100 }}>FLY FAR</span> CAREER
          </Typography>
          {list ? (
            <Grid container spacing={5}>
              <Grid item md={2.5}>
                <Box sx={{ width: "100%", mb: "2rem" }}>
                  <FormControl variant="standard" sx={{ mb: 3, width: "100%" }}>
                    <Input
                      id="search"
                      placeholder="Search News"
                      aria-describedby="standard-search-helper-text"
                      inputProps={{
                        "aria-label": "search",
                      }}
                    />
                  </FormControl>
                  <Tabs
                    orientation="vertical"
                    value={value}
                    onChange={handleChange}
                    aria-label="sidebar nav"
                    TabIndicatorProps={{
                      style: {
                        backgroundColor: "var(--secondary-color)",
                        color: "var(--secondary-color)",
                        display: "none",
                      },
                    }}
                    sx={{ justifyContent: "start" }}
                  >
                    {tabList?.map((tab, index) => (
                      <Tab
                        value={tab?.value}
                        label={tab?.label}
                        sx={{ ...style.tab, textTransform: "capitalize" }}
                      />
                    ))}
                  </Tabs>
                </Box>
              </Grid>
              <Grid item md={9.5}>
                {list?.map((faq, index) => (
                  <Box key={index} sx={style.card}>
                    <Box
                      onClick={() =>
                        setActiveFaq(activeFaq === index ? null : index)
                      }
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={style.cardLabel}>
                        <ArrowDropDownIcon sx={style.icon} />
                        <Typography sx={style.subHeader}>
                          {faq?.label}
                        </Typography>
                      </Box>
                      <Box>
                        <Button
                          size="small"
                          sx={{
                            bgcolor: "var(--secondary-color)",
                            borderRadius: "20px",
                            px: 2,
                            mr: 2,
                            color: "white",
                            ":hover": {
                              bgcolor: "var(--secondary-color)",
                            },
                          }}
                        >
                          Drop cv
                        </Button>
                      </Box>
                    </Box>
                    <Collapse in={activeFaq === index}>
                      <Box sx={style.cardContent}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            my: 2,
                          }}
                        >
                          <Typography
                            gutterBottom={2}
                            sx={{
                              bgcolor: "var(--primary-color)",
                              display: "inline-block",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: "20px",
                              color: "#FFF",
                              fontSize: "0.9rem",
                              cursor: "default",
                              textTransform: "capitalize",
                            }}
                          >
                            FLY FAR TECH
                          </Typography>
                          <Typography
                            sx={{
                              color: "var(--gray-8)",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                            }}
                          >
                            {faq?.date}
                          </Typography>
                        </Box>
                        <Typography sx={style.paragraph}>
                          {faq?.value}
                        </Typography>
                      </Box>
                    </Collapse>
                  </Box>
                ))}
              </Grid>
            </Grid>
          ) : (
            <Box
              sx={{
                minHeight: "60vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <NotFound />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

const style = {
  card: {
    border: "1px solid var(--secondary-color)",
    borderRadius: "5px",
    my: 1,
  },
  cardLabel: {
    display: "flex",
    alignItems: "center",
  },
  cardContent: {
    mx: 4.5,
    borderTop: "1px solid var(--secondary-color)",
  },
  header: {
    fontSize: {
      xs: "2rem",
      md: "3.125rem",
    },
    fontWeight: 500,

    lineHeight: "3.125rem",
    my: {
      xs: "2rem",
      md: "4rem",
    },
    color: "var(--black)",
  },
  subHeader: {
    fontSize: "1.1rem",
    fontWeight: 500,
    lineHeight: "1.5rem",
    color: "var(--secondary-color)",
  },
  paragraph: {
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: "1.5rem",
    my: "1rem",
    color: "var(--black)",
  },
  icon: { color: "var(--secondary-color)", fontSize: "34px" },
  tab: {
    borderLeft: 3,
    textAlign: "left",
    color: "var(--gray)",
    alignItems: "start",
    fontWeight: 600,
    borderColor: "var(--border-color)",
    "&.Mui-selected": {
      color: "var(--secondary-color)",
      borderColor: "var(--secondary-color)",
    },
    fontFamily: "Mukta, sans-serif",
    fontSize: "1rem",
  },
};

const tabList = [
  {
    label: "All Category",
    value: "allCategory",
  },
  {
    label: "Frontend Developer",
    value: "frontendDeveloper",
  },
  {
    label: "Reservation Officer",
    value: "reservationOfficer",
  },
  {
    label: "Travel",
    value: "travel",
  },
  {
    label: "Agent",
    value: "agent",
  },
  {
    label: "Career",
    value: "career",
  },
  {
    label: "Offers",
    value: "offers",
  },
];

// const list = [
//   {
//     label: "PHP Developer",
//     date: "20 September, 2024",
//     value:
//       "Please be informed that, by registering on our B2B Portal of Fly Far Agent, you are agreeing to accept all of our terms and conditions. By accessing, using or booking through our portal means that you have agreed to the terms and conditions that we set out below. The information provided on our booking platform must be truthful, accurate and updated. Our supplier reserves the sole right to cancel bookings without refund when incorrect information has been provided. We may terminate your account anytime, with or without notice, if we find you to conduct any activity that is in breach of these Terms, and if we believe that to be harmful to our business, or for conduct where the use of the Service is harmful to any other party. Fly Far International authorities do not encourage the B2B agents to keep an extra amount of money in the agent's account. If the b2b agent keeps the more or an extra amount of money in their account then they will not be able to withdraw the extra amount which is kept in the Fly Far Agent portal. Whenever required, the agent can utilize the amount of money by issuing tickets or availing any of the services. Fly Far International authority preserves the right to release or hold the amount based on different situations. If any of our services have any additional terms specific to the service, those terms will be specified in the product details page, and you will be responsible to read them before booking. We may, in our sole discretion, change or modify these Terms at any time, with or without notice. You are responsible to read this document from time to time to ensure that your use of the Service remains in compliance with these Terms.",
//   },
//   {
//     label: "Python Developer",
//     value:
//       "Please be informed that, by registering on our B2B Portal of Fly Far Agent, you are agreeing to accept all of our terms and conditions. By accessing, using or booking through our portal means that you have agreed to the terms and conditions that we set out below. The information provided on our booking platform must be truthful, accurate and updated. Our supplier reserves the sole right to cancel bookings without refund when incorrect information has been provided. We may terminate your account anytime, with or without notice, if we find you to conduct any activity that is in breach of these Terms, and if we believe that to be harmful to our business, or for conduct where the use of the Service is harmful to any other party. Fly Far International authorities do not encourage the B2B agents to keep an extra amount of money in the agent's account. If the b2b agent keeps the more or an extra amount of money in their account then they will not be able to withdraw the extra amount which is kept in the Fly Far Agent portal. Whenever required, the agent can utilize the amount of money by issuing tickets or availing any of the services. Fly Far International authority preserves the right to release or hold the amount based on different situations. If any of our services have any additional terms specific to the service, those terms will be specified in the product details page, and you will be responsible to read them before booking. We may, in our sole discretion, change or modify these Terms at any time, with or without notice. You are responsible to read this document from time to time to ensure that your use of the Service remains in compliance with these Terms.",
//   },
// ];

export default Career;
