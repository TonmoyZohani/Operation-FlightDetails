import { Box, Button, Grid, Rating, Typography } from "@mui/material";
// import BookingBanner from "../../../../../../../assets/svg/bookingBanner.svg";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { useState } from "react";

const subText = {
  bgcolor: "var(--primary-color)",
  color: "var(--white)",
  px: 1.5,
  py: 0.5,
  borderRadius: "34px",
  fontSize: "12px",
  fontWeight: "400",
};

const TourDetailsBanner = ({ afterSearchData }) => {
  const isMobile = window.innerWidth <= 768;
  const language = true;
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
        flexDirection: isMobile ? "column" : "row",
        py: 4,
        px: 2.5,
      }}
    >
      <Box
        component="img"
        alt="Destination"
        src="https://via.placeholder.com/350x150"
        sx={{
          width: 707,
          height: 416,
          objectFit: "cover",
          borderRadius: 1,
        }}
      />
      <Box sx={{ px: 1, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#3D3A49",
                fontSize: language ? 21 : 18,
                fontWeight: 600,
              }}
            >
              Escape to Europe In Summer
            </Typography>
            <Typography
              sx={{
                color: "var(--secondary-color)",
                fontSize: language ? 14 : 12,
                fontWeight: 500,
              }}
            >
              Savar, Bangladesh
            </Typography>
          </Box>
          <Box>
            {!isMobile && (
              <Box
                sx={{
                  bgcolor: "var(--secondary-color)",
                  display: "flex",
                  p: 1,
                  borderRadius: "100%",
                  color: "white",
                }}
              >
                <FavoriteBorderIcon />
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <Rating
            readOnly
            name="half-rating"
            value={afterSearchData?.data?.rating}
            precision={0.5}
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#FFD700", 
              },
              "& .MuiRating-iconEmpty": {
                color: "#E0E0E0",
              },
            }}
          />
        </Box>

        <Typography
          sx={{
            fontStyle: "italic",
            color: "#3D3A49",
            fontSize: 13,
            fontWeight: 400,
          }}
        >
          Miracle Garden, Global Village, Desert Safari, Burj Khalifa,
          Underwater Zoo, Hal
          {expanded ? (
            <>
              {language
                ? "Safari, Dubai Frame, Marina Cruise, and more exciting places."
                : "সাফারি, দুবাই ফ্রেম, মেরিনা ক্রুজ, এবং আরও রোমাঞ্চকর স্থানগুলি।"}
              <span
                onClick={handleToggleExpand}
                style={{ color: "var(--primary-color)", cursor: "pointer" }}
              >
                {" "}
                See Less
              </span>
            </>
          ) : (
            <span
              onClick={handleToggleExpand}
              style={{ color: "var(--primary-color)", cursor: "pointer" }}
            >
              {" "}
              See More...
            </span>
          )}
        </Typography>
        <Box sx={{ mt: 1.5 }}>
          <Grid container spacing={1}>
            <Grid item>
              <Typography sx={{ ...subText }}>
                {language ? "7 Days 6 Night" : "৭ দিন ৬ রাত"}
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ ...subText }}>
                {language ? "0 to 65 Age" : "০ থেকে ৬৫ বছর"}
              </Typography>
            </Grid>
            {/* {afterSearchData?.package?.accommodations?.flight === true && ( */}
            <Grid item>
              <Typography sx={{ ...subText }}>
                {language ? "Flight" : "ফ্লাইট"}
              </Typography>
            </Grid>
            {/* )} */}
            {/* {afterSearchData?.package?.accommodations?.hotel === true && ( */}
            <Grid item>
              <Typography sx={{ ...subText }}>
                {language ? "Hotel" : "হোটেল"}
              </Typography>
            </Grid>
            {/* )} */}
            {/* {afterSearchData?.package?.accommodations?.meal === true && ( */}
            <Grid item>
              <Typography sx={{ ...subText }}>
                {language ? "Meal" : "খাবার"}
              </Typography>
            </Grid>
            {/* )} */}
            {/* {afterSearchData?.package?.accommodations?.hotel === true && ( */}
            <Grid item>
              <Typography sx={{ ...subText }}>
                {language ? "Transportation" : "যাতায়াত"}
              </Typography>
            </Grid>
            {/* )} */}
            {/* {afterSearchData?.package?.accommodations?.instalment === true && ( */}
            <Grid item>
              <Typography sx={{ ...subText, bgcolor: "var(--primary-color)" }}>
                {language ? "Instalment" : "ইনস্টলমেন্ট"}{" "}
              </Typography>
            </Grid>
            {/* )} */}
          </Grid>
        </Box>

        {!isMobile && (
          <Box sx={{ bgcolor: "#F6F6F6", borderRadius: 1, mt: 3, p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#3D3A49",
                  fontSize: language ? 13 : 11,
                  fontWeight: 600,
                }}
              >
                {language
                  ? "Price Starts From BDT"
                  : "মূল্য শুরু হচ্ছে BDT থেকে"}
              </Typography>
              <Box
                sx={{
                  bgcolor: "#FFE4EB",
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  px: 1,
                  borderRadius: 1,
                  py: 0.7,
                }}
              >
                <WhatshotIcon
                  fontSize="small"
                  sx={{ color: "var(--primary-color)" }}
                />
                <Typography color="#BC6277" sx={{ fontSize: 13, px: 0.6 }}>
                  FFIDOM500
                </Typography>
              </Box>
            </Box>
            <Typography
              sx={{ color: "#584660", fontSize: 40, fontWeight: 500 }}
            >
              65,000
              <span style={{ fontSize: "1rem", fontWeight: "500" }}>/BDT</span>
            </Typography>
            <Button
              // href="/MainBookProcess"
              variant="contained"
              sx={{
                // mt: 3,
                px: 3.5,
                textTransform: "none",
                backgroundColor: "var(--secondary-color)",
                color: "var(--white)",
                fontWeight: 300,
                fontSize: language ? 15 : 12,
                py: 0.7,
                "&:hover": {
                  backgroundColor: "var(--secondary-color)",
                },
              }}
            >
              {language ? "Book & Hold" : "বুক করুন ও ধরে রাখুন"}
            </Button>
            <Typography
              sx={{ mt: 1.5, color: "#837FB1", fontSize: 12, fontWeight: 500 }}
            >
              3 Instalment Option Available
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TourDetailsBanner;
