import { Box, Button, Stack, Typography } from "@mui/material";
import RatingCard from "./RatingCard";
import CustomerStoryCard from "./CustomerStoryCard";

const CustomerStories = ({ rating }) => {
  return (
    <Box>
      <Box>
        <Typography
          sx={{
            fontSize: "19px",
            color: "var(--text-color)",
            fontWeight: 500,
            lineHeight: "28px",
            mb: 1,
          }}
        >
          Customer Stories
        </Typography>
        <Typography
          sx={{
            fontSize: "15px",
            color: "var(--primary-color)",
            fontWeight: 500,
          }}
        >
          Overall ratings
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 0.2,
          height: "100%",
        }}
      >
        {/* Rating Number */}
        <Typography
          sx={{
            fontSize: "24px",
            mt: 0.5,
            mr: 1.2,
            color: "var(--gray)",
          }}
        >
          {rating}
        </Typography>
        <RatingCard rating={rating} />

        <Typography
          sx={{
            fontSize: "13px",
            mt: 0.5,
            ml: 0.5,
            color: "var(--gray)",
            fontWeight: 500,
          }}
        >
          107 Review
        </Typography>
      </Box>

      <Stack spacing={0}>
        <CustomerStoryCard />
        <CustomerStoryCard />
      </Stack>

      <Box sx={{ px: 7, mb: 3 }}>
        <Button size="small" sx={{ px: 0, py: 0 }}>
          <Typography
            sx={{
              textDecoration: "underline",
              color: "var(--secondary-color)",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Read More Stories
          </Typography>
        </Button>
      </Box>
      <Box sx={{ px: 7 }}>
        <Button
          size="small"
          sx={{
            color: "var(--white)",
            bgcolor: "var(--secondary-color)",
            px: 2,
            py: 0.8,
            "&:hover": {
              bgcolor: "var(--secondary-color)",
            },
          }}
        >
          Add Your Stories
        </Button>
      </Box>
    </Box>
  );
};

export default CustomerStories;
