import { Box, Button, Grid, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAppliedFilters,
  setFilterValue,
} from "../FlightSearchBox/flighAfterSearchSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import moment from "moment";
import "../AirlinesSlider/AirlinesSlider.css";

const AirlinesDateSlider = ({
  data,
  searchDate,
  advancedFilterValue,
  setAlternateDateFilter,
}) => {
  const dispatch = useDispatch();
  const { filterValue, appliedFilters } = useSelector(
    (state) => state.flightAfter
  );


  // 1. Sort the data chronologically
  const sortedDateData =
    advancedFilterValue?.sort(
      (a, b) => new Date(a.departureDate) - new Date(b.departureDate)
    ) || [];

  // 2. Reorganize to place searchDate at 4th position while maintaining chronological order
  const getPositionedDateData = () => {
    if (sortedDateData.length === 0) return [];

    const searchDateIndex = sortedDateData.findIndex(
      (item) => item.departureDate === searchDate
    );

    // If searchDate not found, return original sorted data
    if (searchDateIndex === -1) return sortedDateData;

    // Create new array with searchDate at position 4
    const beforeDates = sortedDateData
      .filter((item) => new Date(item.departureDate) < new Date(searchDate))
      .slice(0, 3); // Take up to 3 dates before

    const afterDates = sortedDateData
      .filter((item) => new Date(item.departureDate) > new Date(searchDate))
      .slice(0, 11); // Take up to 11 dates after (to make total 15)

    return [
      ...beforeDates,
      sortedDateData[searchDateIndex],
      ...afterDates,
    ].slice(0, 15); // Ensure exactly 15 items
  };

  const dateData = getPositionedDateData();

  // 3. Find the new index of searchDate after reorganization
  const searchDatePosition = dateData.findIndex(
    (item) => item.departureDate === searchDate
  );

  const settings = {
    dots: false,
    speed: 200,
    slidesToShow: Math.min(dateData.length, 7),
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    initialSlide: searchDatePosition >= 0 ? searchDatePosition : 0,
    prevArrow: <ArrowBackIosIcon sx={{ color: "#888" }} />,
    nextArrow: <ArrowForwardIosIcon sx={{ color: "#888" }} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(dateData.length, 5),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(dateData.length, 4),
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Math.min(dateData.length, 2),
        },
      },
    ],
  };

  const handleDateFilter = (item) => {
    const otherFilters = appliedFilters.filter(
      (filter) => filter.type !== "alternateDateData"
    );

    dispatch(
      setFilterValue({
        alternateDateData: [item],
        limit: filterValue?.limit || 5,
        page: 1,
      })
    );

    setAlternateDateFilter(true);
  };

  return (
    <Slider {...settings}>
      {dateData.map((item, index) => {
        const hasAlternateDateFilter = !!filterValue?.alternateDateData?.length;

        const isSelected =
          filterValue?.alternateDateData?.[0]?.departureDate ===
            item?.departureDate ||
          (!hasAlternateDateFilter && item.departureDate === searchDate);

        const formattedDate = moment(item.departureDate).format("DD MMM YYYY");

        return (
          <Button
            key={index}
            onClick={() => {
              handleDateFilter(item);
            }}
            sx={{ p: 0, width: "100%" }}
          >
            <Box
              sx={{
                bgcolor: isSelected ? "#D1E9FF" : "",
                width: "100%",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                px: 1,
                cursor: "pointer",
                transition: "all 0.3s ease",
                ":hover": { background: "#D1E9FF" },
              }}
            >
              <img
                src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${item.carrier}.png`}
                width="30px"
                height="30px"
                alt="flight icon"
                style={{ borderRadius: "50%", marginRight: 8 }}
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
                <Typography fontSize="12px" color="black" fontWeight={500}>
                  {formattedDate}
                </Typography>
                <Typography fontSize="11px" color="gray" fontWeight={600}>
                  ৳ {item?.agentPrice?.toLocaleString("en-IN")}
                </Typography>
              </Box>
            </Box>
          </Button>
        );
      })}
    </Slider>
  );
};

export default AirlinesDateSlider;
