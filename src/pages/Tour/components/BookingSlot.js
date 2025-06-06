// External libraries
import React,{ useRef, useState } from "react";
import Slider from "react-slick";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";

// Material UI imports
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

// Custom components and icons
import {
  BpCheckedIcon,
  NormalBpOutIcon,
} from "../../../component/CustomRadio/CustomRadio";


function createData(name, amount) {
  return { name, amount };
}

const rows = [
  createData("Adult", 40000),
  createData("Child (2-5)", 40000),
  createData("Child (5-12)", 40000),
  createData("Infant", 40000),
];

const BookingSlot = () => {
  const [isSelected, setIsSelected] = useState(0);
  const sliderRef = useRef();

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: null,
    prevArrow: null,
  };

  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  return (
    <Box pb={3} sx={{ position: "relative" }}>
      <Typography
        sx={{
          fontSize: "19px",
          color: "var(--text-color)",
          fontWeight: 500,
          mb: 1.2,
        }}
      >
        Select Available Booking Slot{" "}
      </Typography>
      <Slider ref={sliderRef} {...settings}>
        {new Array(4).fill()?.map((_, index) => (
          <Box sx={{ px: 0.75, mx: "-6px" }} key={index}>
            <Box
              key={index}
              sx={{
                border: "1px solid",
                borderColor:
                  isSelected === index
                    ? "var(--primary-color)"
                    : "var(--text-light)",
                p: 1.5,
                borderRadius: "4.5px",
                cursor: "pointer",
              }}
              onClick={() => setIsSelected(index)}
            >
              {isSelected === index ? <BpCheckedIcon /> : <NormalBpOutIcon />}
              <Typography
                sx={{
                  fontSize: "13px",
                  color:
                    isSelected === index
                      ? "var(--primary-color)"
                      : "var(--text-color)",
                  fontWeight: 500,
                  mt: 0.5,
                }}
              >
                Escape Europe In Summer
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px",
                  color:
                    isSelected === index
                      ? "var(--text-light)"
                      : "var(--text-light)",
                  fontWeight: 500,
                  mt: 0.2,
                }}
              >
                18th April 2023 - 25th April 2023
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.8,
                }}
              >
                <Typography
                  sx={{
                    bgcolor:
                      isSelected === index ? "var(--primary-color)" : "#5F6368",
                    color: "var(--white)",
                    fontSize: "10px",
                    px: 1.2,
                    borderRadius: "20px",
                    py: 0.3,
                    fontWeight: 500,
                  }}
                >
                  7 Days 6 Night
                </Typography>
                <Typography
                  sx={{
                    bgcolor:
                      isSelected === index ? "var(--primary-color)" : "#5F6368",
                    color: "var(--white)",
                    fontSize: "10px",
                    px: 1.2,
                    borderRadius: "20px",
                    py: 0.3,
                    fontWeight: 500,
                  }}
                >
                  Available Seat 20
                </Typography>
              </Box>
              <TableContainer sx={{ mt: 2 }}>
                <Table sx={{ minWidth: "100%" }} aria-label="simple table">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell
                        sx={{
                          color: "#FFFFFF",
                          py: 0,
                          pl: 1.2,
                          bgcolor: "#3687B7",
                          width: "40%",
                          fontSize: "13px",
                          borderBottom: "2px solid #fff",
                          fontStyle: "italic",
                        }}
                      >
                        Pax Type
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "#fff",
                          py: 0,
                          textAlign: "right",
                          bgcolor: "var(--secondary-color)",
                          fontSize: "13px",
                          width: "60%",
                        }}
                      >
                        Amount
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          py: "4.8px",
                          mb: 1,
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            color: "#FFFFFF",
                            bgcolor: "#3687B7",
                            py: 0.2,
                            pl: 1.2,
                            width: "40%",
                            fontSize: "12px",
                            borderBottom: "2px solid #fff",
                            fontStyle: "italic",
                          }}
                        >
                          {row.name}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: "var(--secondary-color)",
                            py: 0.2,
                            width: "60%",
                            textAlign: "right",
                            fontSize: "12px",
                            borderBottom: "none",
                          }}
                        >
                          {row.amount.toLocaleString("en-BD", {
                            style: "currency",
                            currency: "BDT",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        ))}
      </Slider>
      <Box
        sx={{
          justifyContent: "center",
          height: "23.75px",
          width: "20.83px",
          cursor: "pointer",
          position: "absolute",
          right: 20,
          bottom: 20,
          transform: "translateY(-50%) rotate(-90deg)",
        }}
        onClick={handleNext}
      >
        <ArrowDropDownCircleIcon
          sx={{
            bgcolor: "var(--white)",
            borderRadius: "50%",
            border: "none",
          }}
        />
      </Box>
    </Box>
  );
};

export default BookingSlot;
