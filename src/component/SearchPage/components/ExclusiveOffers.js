import { Box, Skeleton, Typography, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Image1 from "../../../assets/exclusive/airastra.webp";
import Image2 from "../../../assets/exclusive/bestDeal.webp";
import Image3 from "../../../assets/exclusive/discount.webp";
import Image4 from "../../../assets/exclusive/exploreIndia.webp";
import Image5 from "../../../assets/exclusive/kualalumpur.webp";
import { useAuth } from "../../../context/AuthProvider";
import { isMobile } from "../../../shared/StaticData/Responsive";
import "./ExclusiveOffers.css";
import { SliderBtn } from "../../ViewFare/NewViewFareCard";

const ExclusiveOffers = () => {
  const navigate = useNavigate();
  const { jsonHeader } = useAuth();

  const { data: exclusiveDeals, isLoading } = useQuery({
    queryKey: ["notice"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/common/support/notice`,
        jsonHeader()
      );
      const firstItem = data?.data[0];
      return firstItem;
    },
    refetchOnWindowFocus: false,
  });

  const settings = {
    customPaging: function (i) {
      return (
        <Box sx={{ width: "15px", height: "15px" }}>
          <Box className="custom-dot"></Box>
        </Box>
      );
    },
    prevArrow: (
      <SliderBtn
        type={"prev"}
        additionalStyle={{ bottom: "110%", left: "calc(100% - 74px)" }}
      />
    ),
    nextArrow: (
      <SliderBtn
        type={"next"}
        additionalStyle={{ bottom: "110%", left: "calc(100% - 34px)" }}
      />
    ),
    dots: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 1500,
    autoplaySpeed: 5000,
    cssEase: "linear",
    // arrows: false,
    autoplay: false,
    centerMode: false,
    centerPadding: "100px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 884,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        pl: { xs: 0, md: 0 },
        ml: { xs: "-8px", lg: "-8px" },
        width: { lg: "101%", xs: "101%" },
      }}
    >
      <Box sx={{ pt: { sm: "4rem", md: "2.5rem" } }}>
        {exclusiveDeals?.length > 0 && (
          <Typography
            sx={{
              color: "var(--black)",
              fontSize: { xs: "1rem", md: "1.2rem", lg: "1.5rem" },
              fontWeight: 500,
              pl: { xs: 2, md: 1 },
            }}
          >
            Exclusive <strong>Deals</strong>
          </Typography>
        )}
        <Box sx={{ mt: 1.5 }}>
          {isLoading ? (
            <Slider {...settings}>
              {[...new Array(isMobile ? 1 : 3)].map((_, i) => (
                <Box key={i} sx={{ height: "206px", p: 1 }}>
                  <Skeleton
                    className="skeleton"
                    sx={{ borderRadius: "4px" }}
                    variant="rectangular"
                    width={"100%"}
                    height={"100%"}
                  />
                </Box>
              ))}
            </Slider>
          ) : exclusiveDeals?.length > 3 || isMobile ? (
            <Slider {...settings}>
              {exclusiveDeals.map((deal, i) => (
                <Box key={i} sx={{ px: { xs: 1, md: 1 } }}>
                  <Box
                    sx={style.cardContainer}
                    onClick={() => {
                      navigate("/dashboard/notice-details", {
                        state: {
                          title: deal?.title,
                          paragraph: deal?.paragraph,
                          image: deal?.image,
                        },
                      });
                    }}
                  >
                    <img
                      style={style.cardImgMain}
                      src={deal?.image}
                      alt={"deal " + i}
                    />
                    <Box className="cardContent">
                      <Typography
                        sx={{ fontSize: "17px", fontWeight: "600", mb: 1 }}
                      >
                        {deal?.title}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.813rem", fontWeight: 400 }}
                      >
                        {deal?.paragraph}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Slider>
          ) : (
            <Grid container>
              {exclusiveDeals?.map((deal, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <Box key={deal?.id} sx={{ px: { xs: 1, md: 1 } }}>
                    <Box
                      sx={style.cardContainer}
                      onClick={() => {
                        navigate("/dashboard/notice-details", {
                          state: {
                            title: deal?.title,
                            paragraph: deal?.paragraph,
                            image: deal?.image,
                          },
                        });
                      }}
                    >
                      <img
                        style={style.cardImgMain}
                        src={deal?.image}
                        alt={"deal " + i}
                      />
                      <Box className="cardContent">
                        <Typography
                          sx={{ fontSize: "17px", fontWeight: "600", mb: 1 }}
                        >
                          {deal?.title}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "0.813rem", fontWeight: 400 }}
                        >
                          {deal?.paragraph}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export const exclusiveData = [
  { id: 1, image: Image1 },
  { id: 2, image: Image2 },
  { id: 3, image: Image3 },
  { id: 4, image: Image4 },
  { id: 5, image: Image5 },
];

const style = {
  cardContainer: {
    position: "relative",
    height: "190px",
    overflow: "hidden",
    borderRadius: "0.5rem",
    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
    "&:hover .cardContent": { transform: "translateY(0)", opacity: 1 },
    cursor: "pointer",
  },
  cardImgMain: {
    width: "100%",
    height: "100%",
    objectFit: "fill",
  },
  cardContent: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: "10px",
    bgcolor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    transform: "translateY(100%)",
    transition: "transform 0.3s ease, opacity 0.3s ease",
    opacity: 0,
  },
};

export default ExclusiveOffers;
