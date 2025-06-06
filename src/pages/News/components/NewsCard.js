import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";

const NewsCard = ({ news, value, index }) => {
  return (
    <Card
      sx={{
        border: "none",
        boxShadow: "none",
        display: index === 0 && "flex",
        gap: 3,
      }}
    >
      <CardMedia
        component="img"
        alt="blogs"
        height="190"
        image={news?.image}
        sx={{ borderRadius: "7px", width: index === 0 ? "50%" : "100%" }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardContent sx={{ px: 0, py: index === 0 ? 0 : 2 }}>
          <Typography
            gutterBottom={2}
            sx={{
              bgcolor: "var(--primary-color)",
              display: "inline-block",
              px: 1.5,
              py: 0.2,
              borderRadius: "20px",
              color: "#FFF",
              fontSize: "0.9rem",
              cursor: "default",
              textTransform: "capitalize",
            }}
          >
            {value}
          </Typography>
          <Typography
            gutterBottom
            gutterTop
            sx={{
              py: 0.2,
              borderRadius: "20px",
              color: "var(--secondary-color)",
              fontWeight: 500,
              fontSize: index === 0 ? "1.5rem" : "1.2rem",
            }}
          >
            {news?.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "var(--black)",
              fontWeight: 500,
              fontSize: "0.85rem",
              lineHeight: "1rem",
            }}
          >
            {news?.description}
          </Typography>
        </CardContent>
        <CardActions sx={{ px: 0 }}>
          <Typography
            sx={{
              color: "var(--gray-8)",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {news?.date}
          </Typography>
        </CardActions>
      </Box>
    </Card>
  );
};

export default NewsCard;
