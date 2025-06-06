import { Box, Typography } from "@mui/material";

const HotelDescription = () => {
  return (
    <Box>
      <Box pb={2}>
        <Typography
          variant="h6"
          component="h6"
          sx={{
            fontSize: "13px",
            fontWeight: "Bold",
            color: "var(--primary-color)",
            pb: 1,
          }}
        >
          Location
        </Typography>
        <Typography
          variant="body1"
          // component="body4"
          sx={{
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--text-light)",
            pb: 2,
            lineHeight: "18px",
            textAlign: "justify",
          }}
        >
          Luxury five-star hotel “TITANIC Gendarmenmarkt Berlin” is situated in
          Berlin. It boasts a convenient location in the city center.
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="h6"
          component="h6"
          sx={{
            fontSize: "13px",
            fontWeight: "Bold",
            color: "var(--primary-color)",
            pb: 1,
          }}
        >
          Hotel features
        </Typography>
        <Typography
          variant="body1"
          // component="body4"
          sx={{
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--text-light)",
            lineHeight: "18px",
            textAlign: "justify",
          }}
        >
          Savour local and international dishes in the sumptuous on-site
          restaurant. The elegant hotel bar is the perfect place to enjoy a
          refreshing drink and unwind after an eventful day. Wi-Fi is available
          on all property premises. You can store your valuables in the locker.
        </Typography>
        <br />
        <Typography
          variant="body1"
          // component="body4"
          sx={{
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--text-light)",
            lineHeight: "18px",
            textAlign: "justify",
          }}
        >
          Use the hotel fitness center to keep up with your workout schedule.
          Perfect option to relax - an on-site sauna. Guests who prefer to treat
          their body well can enjoy pampering massages in the hotel spa. Parking
          is provided on site.
        </Typography>
        <br />
        <Typography
          variant="body1"
          // component="body4"
          sx={{
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--text-light)",
            pb: 1,
            lineHeight: "18px",
            textAlign: "justify",
          }}
        >
          Guests can order an airport shuttle for an additional fee. The hotel
          also features a business center. The reception works 24/7. There is a
          laundry at the hotel.
        </Typography>
      </Box>
    </Box>
  );
};

export default HotelDescription;
