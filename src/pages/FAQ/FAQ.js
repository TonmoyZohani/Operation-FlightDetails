import { Box, Collapse, Container, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NotFound from "../../component/NotFound/NoFound";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CustomTabBar from "../../component/CustomTabBar/CustomTabBar";
import parse from "html-react-parser";

const FAQ = () => {
  const [language, setLanguage] = useState(0);
  const [activeFaq, setActiveFaq] = useState(0);

  const {
    data: allFaq,
    isLoading
  } = useQuery({
    queryKey: ["allFaq", language],
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/common/faq/faq-list`, {
        params: { wings: "FFI", language: language === 0 ? "eng" : "ban" },
      });
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
            pb: {
              xs: "10rem",
              md: "5rem",
            },
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
              <span style={{ fontWeight: 100 }}>FREQUENT </span> ASK QUESTION
            </Typography>
            <Box sx={{ width: "170px" }}>
              <CustomTabBar
                allTabs={["English", "বাংলা"]}
                activeTab={language}
                setActiveTab={setLanguage}
                bgDark={"var(--primary-color)"}
              />
            </Box>
          </Box>

          {isLoading ? (
            <Box sx={{ width: "100%", height: "100%" }}>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
              <br></br>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
              <br></br>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
              <br></br>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </Box>
          ) : allFaq ? (
            allFaq?.map((faq, index) => (
              <Box key={index} sx={style.card}>
                <Box
                  sx={{
                    ...style.cardLabel,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                >
                  <ArrowDropDownIcon sx={style.icon} />
                  <Typography sx={style.subHeader}>
                    {language ? faq?.questionBan : faq?.questionEng}{" "}
                  </Typography>
                </Box>
                <Collapse in={activeFaq === index}>
                  <Box sx={{ ...style.cardContent, userSelect:"none" }}>
                    <Typography sx={style.paragraph}>
                      {language ? parse(faq?.answerBan) : parse(faq?.answerEng)}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            ))
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
  cardLabel: { display: "flex", alignItems: "center", p: 1 },
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
  icon: { color: "var(--secondary-color)", fontSize: "34px" },
  subHeader: {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "1.5rem",
    color: "var(--secondary-color)",
  },
  paragraph: {
    fontSize: "13px",
    fontWeight: 400,
    lineHeight: {
      xs: "1.3rem",
      md: "1.5rem",
    },
    color: "var(--black)",
    py: "1rem",
    textAlign: {
      xs: "justify",
      md: "start",
    },
  },
};

export default FAQ;
