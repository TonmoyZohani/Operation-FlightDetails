import { Box, Container, Grid, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import BlogImg from "../../images/blog/blogImg.png";
import BlogCard from "./components/BlogCard";
import { Link } from "react-router-dom";
import NotFound from "../../component/NotFound/NoFound";

const Blog = () => {
  const [value, setValue] = useState("airlines");

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
            <span style={{ fontWeight: 100 }}>FLY FAR</span> BLOG
          </Typography>
          <Box sx={{ width: "100%", mb: "2rem" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="wrapped label tabs example"
              TabIndicatorProps={{
                style: {
                  backgroundColor: "var(--secondary-color)",
                  color: "var(--secondary-color)",
                },
              }}
            >
              <Tab
                value="place"
                label="Place"
                sx={{ ...style.tab, pl: 0, textTransform: "capitalize" }}
              />
              <Tab
                value="airlines"
                label="Airlines"
                sx={{ ...style.tab, px: 4, textTransform: "capitalize" }}
              />
            </Tabs>
          </Box>
          {!blogData ? (
            <Grid container spacing={3}>
              {blogData.map((blog, index) => (
                <Grid key={index} item xs={12} md={4}>
                  <Link style={{ textDecoration: "none" }} to={"/blog/details"}>
                    <BlogCard value={value} blog={blog} />
                  </Link>
                </Grid>
              ))}
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
    borderBottom: 2,
    color: "var(--gray)",
    fontWeight: 600,
    "&.Mui-selected": {
      color: "var(--secondary-color)",
    },
  },
};

const blogData = [
  {
    title: "History of Biman Bangladesh Airlines",
    description:
      "Please be informed that, by registering on our B2B Portal of Fly Far Agent, you are agreeing to accept all of our terms and conditions.",
    date: "22th September 2022",
    image: BlogImg,
  },
  {
    title: "The Future of Aviation in Bangladesh",
    description:
      "Explore the emerging trends and future prospects of aviation in Bangladesh and how it will shape the country's economy.",
    date: "10th October 2023",
    image: BlogImg,
  },
  {
    title: "The Rise of Domestic Airlines",
    description:
      "An in-depth look at how domestic airlines in Bangladesh have grown and continue to serve the increasing number of passengers.",
    date: "5th November 2023",
    image: BlogImg,
  },
];

export default Blog;
