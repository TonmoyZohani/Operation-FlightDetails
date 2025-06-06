import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";

const BlogCard = ({ blog, value }) => {
  return (
    <Card sx={{ border: "none", boxShadow: "none" }}>
      <CardMedia
        component="img"
        alt="blogs"
        height="140"
        image={blog?.image}
        sx={{ borderRadius: "7px" }}
      />
      <CardContent sx={{ px: 0 }}>
        <Typography
          gutterBottom={2}
          sx={{
            bgcolor: "var(--primary-color)",
            display: "inline-block",
            px: 1.5,
            py: 0.2,
            borderRadius: "20px",
            color: "#FFF",
            fontSize: "0.85rem",
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
            fontSize: "1rem",
          }}
        >
          {blog?.title}
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
          {blog?.description}
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
          {blog?.date}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default BlogCard;
