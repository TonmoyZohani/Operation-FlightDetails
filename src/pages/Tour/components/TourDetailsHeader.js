import { Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";

const TourDetailsHeader = () => {
  const rating = 4.5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "22px",
            color: "var(--text-color)",
          }}
        >
          Limitless With United Arab Emirates
        </Typography>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "13.5px",
            color: "var(--secondary-color)",
          }}
        >
          Savar, Bangladesh
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 0.2,
            height: "100%",
          }}
        >
          {/* Full Stars */}
          {new Array(fullStars).fill().map((_, index) => (
            <StarIcon
              key={`full-${index}`}
              sx={{ fontSize: "16px", color: "#FF5722" }}
            />
          ))}

          {/* Half Star */}
          {hasHalfStar && (
            <StarHalfIcon
              key="half-star"
              sx={{ fontSize: "16px", color: "#FF5722" }}
            />
          )}

          {/* Rating Number */}
          <Typography
            sx={{
              fontSize: "13px",
              mt: 0.5,
              ml: 1.5,
              color: "#FF5722",
            }}
          >
            {rating}
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              mt: 0.5,
              ml: 0.5,
              color: "var(--gray)",
            }}
          >
            (107)
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <AirplanemodeActiveIcon
          sx={{
            color: "#FFF",
            bgcolor: "#FF5722",
            p: "3px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            transform: "rotate(45deg)",
          }}
        />
        <AirplanemodeActiveIcon
          sx={{
            color: "#FFF",
            bgcolor: "#FF5722",
            p: "3px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            transform: "rotate(45deg)",
          }}
        />
        <AirplanemodeActiveIcon
          sx={{
            color: "#FFF",
            bgcolor: "#FF5722",
            p: "3px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            transform: "rotate(45deg)",
          }}
        />
      </Box>
    </Box>
  );
};

export default TourDetailsHeader;
