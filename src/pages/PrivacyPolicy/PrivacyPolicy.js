import { Box, Container, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import NotFound from "../../component/NotFound/NoFound";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import parse from "html-react-parser";
import { useLocation } from "react-router-dom";
import CustomTabBar from "../../component/CustomTabBar/CustomTabBar";

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
};

const PrivacyPolicy = () => {
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();

  const { data: data, isLoading } = useQuery({
    queryKey: ["getContent", activeTab, location],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/common/statics`,
        {
          params: {
            wing: "FFI",
            field: activeTab === 0 ? "privacyPolicy" : "privacyPolicy-bn",
          },
        }
      );
      return data?.data[0];
    },
  });

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
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={style.header}>
              <span style={{ fontWeight: 100 }}>PRIVACY </span> POLICY
            </Typography>
            <Box sx={{ width: "170px" }}>
              <CustomTabBar
                allTabs={["English", "বাংলা"]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                bgDark={"var(--primary-color)"}
              />
            </Box>
          </Box>

          {isLoading ? (
            <Box sx={{ width: "100%", height: "100%" }}>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </Box>
          ) : data ? (
            <Box>{parse(data?.content)}</Box>
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

export default PrivacyPolicy;
