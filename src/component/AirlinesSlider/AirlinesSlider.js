import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import {
  setAppliedFilters,
  setFilterValue,
} from "../FlightSearchBox/flighAfterSearchSlice";
import "./AirlinesSlider.css";

const AirlinesSlider = ({ uniqueAirlines, segmentsList }) => {
  const dispatch = useDispatch();
  const { filterValue, appliedFilters } = useSelector(
    (state) => state.flightAfter
  );
  const { searchType } = useSelector((state) => state.flight);

  const airlines = uniqueAirlines;
  const airLingLng = airlines?.length;

  var settings = {
    dots: false,
    speed: 200,
    slidesToShow:
      searchType === "split" && segmentsList?.length < 3
        ? airLingLng < 3
          ? airLingLng
          : 3
        : airLingLng < 8
          ? airLingLng
          : 8,
    slidesToScroll: airLingLng < 1 ? airLingLng : 1,
    arrows: true,
    autoplay: true,
    prevArrow: <ArrowBackIosIcon />,
    nextArrow: <ArrowForwardIosIcon />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: airLingLng < 7 ? airLingLng : 6,
          slidesToScroll: airLingLng < 1 ? airLingLng : 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: airLingLng < 5 ? airLingLng : 5,
          slidesToScroll: airLingLng < 1 ? airLingLng : 1,
        },
      },
      {
        breakpoint: 426,
        settings: {
          slidesToShow: airLingLng < 3 ? airLingLng : 3,
          slidesToScroll: airLingLng < 1 ? airLingLng : 1,
        },
      },
    ],
  };

  const handleAirlinesChange = (airline) => {
    let updatedAirlines;

    if (filterValue?.airlines?.includes(airline?.carrierName)) {
      updatedAirlines = filterValue?.airlines?.filter(
        (item) => item !== airline?.carrierName
      );

      dispatch(
        setAppliedFilters(
          appliedFilters.filter((item) => item.value !== airline?.carrierName)
        )
      );
    } else {
      updatedAirlines = filterValue?.airlines
        ? [...filterValue?.airlines, airline?.carrierName]
        : [airline?.carrierName];

      dispatch(
        setAppliedFilters([
          ...appliedFilters,
          { type: "airlines", value: airline?.carrierName },
        ])
      );
    }

    const { airlines, ...rest } = filterValue;
    if (updatedAirlines?.length > 0) {
      dispatch(setFilterValue({ ...filterValue, airlines: updatedAirlines }));
    } else {
      dispatch(setFilterValue({ ...rest }));
    }
  };

  return (
    <>
      <Slider {...settings}>
        {airlines?.map((item, index) => {
          return (
            <Button
              key={index}
              onClick={() => handleAirlinesChange(item)}
              sx={{ p: "0px" }}
            >
              <Box
                sx={{
                  bgcolor: filterValue?.airlines?.includes(item.carrierName)
                    ? "#D1E9FF"
                    : "",
                  width: "100%",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "all 0.5s ease-in-out",
                  ":hover": { background: "#D1E9FF" },
                }}
              >
                <img
                  src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${item.carrier}.png`}
                  width="30px"
                  height="30px"
                  alt="flight icon"
                  style={{
                    borderRadius: "100%",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://storage.googleapis.com/erp-document-bucket/alternetFlightIcon.png";
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "start",
                  }}
                >
                  <Typography
                    marginX={2}
                    fontSize="12px"
                    color={"black"}
                    fontWeight={500}
                  >
                    {item?.carrier} •{" "}
                    <span style={{ color: "var(--gray)", fontSize: "11px" }}>
                      {item?.count}
                    </span>
                  </Typography>
                  <Typography
                    marginX={2}
                    fontSize="10px"
                    color={"gray"}
                    fontWeight={600}
                  >
                    ৳ {item?.price?.toLocaleString("en-IN")}
                  </Typography>
                </Box>
              </Box>
            </Button>
          );
        })}
      </Slider>
    </>
  );
};

export default AirlinesSlider;
