import { Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
const RatingCard = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return (
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

      {/* Empty Stars */}
      {new Array(emptyStars).fill().map((_, index) => (
        <StarIcon
          key={`empty-${index}`}
          sx={{ fontSize: "16px", color: "var(--gray)" }}
        />
      ))}
    </Box>
  );
};

export default RatingCard;
