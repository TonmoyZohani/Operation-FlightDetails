import {
  Box,
  Container,
  FormControl,
  Grid,
  Input,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import NewsImg from "../../images/blog/blogImg.png";
import NewsCard from "./components/NewsCard";
import { Link } from "react-router-dom";
import NotFound from "../../component/NotFound/NoFound";

const News = () => {
  const [value, setValue] = useState(tabList[0].value);

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
            <span style={{ fontWeight: 100 }}>FLY FAR</span> NEWS
          </Typography>
          {!newsData ? (
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
                <Grid container spacing={5}>
                  {newsData?.map((news, index) => (
                    <Grid item xs={index === 0 ? 12 : 6}>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={"/news/details"}
                      >
                        <NewsCard value={value} news={news} index={index} />
                      </Link>
                    </Grid>
                  ))}
                </Grid>
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
    fontSize: "1.5rem",
    fontWeight: 500,
    lineHeight: "1.5rem",
    color: "var(--secondary-color)",
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

const tabList = [
  {
    label: "All Category",
    value: "allCategory",
  },
  {
    label: "Notice",
    value: "notice",
  },
  {
    label: "Achievement",
    value: "achievement",
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

const newsData = [
  {
    title: "History of Biman Bangladesh Airlines",
    description:
      "Please be informed that, by registering on our B2B Portal of Fly Far Agent, you are agreeing to accept all of our terms and conditions.",
    date: "22th September 2022",
    image: NewsImg,
  },
  {
    title: "The Future of Aviation in Bangladesh",
    description:
      "Explore the emerging trends and future prospects of aviation in Bangladesh and how it will shape the country's economy.",
    date: "10th October 2023",
    image: NewsImg,
  },
  {
    title: "The Rise of Domestic Airlines",
    description:
      "An in-depth look at how domestic airlines in Bangladesh have grown and continue to serve the increasing number of passengers.",
    date: "5th November 2023",
    image: NewsImg,
  },
];

export default News;
