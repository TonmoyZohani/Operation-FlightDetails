import { Box, Grid, Stack } from "@mui/material";
import HotelAfterSearchNav from "./components/HotelAfterSearchNav";
import HotelAfterFilter from "./components/HotelAfterFilter";
import HotelAfterSearchCard from "./components/HotelAfterSearchCard";

const HotelAfterSearchPage = () => {
  return (
    <Box>
      {/* --- hotel after search nav bar start --- */}
      <HotelAfterSearchNav />
      {/* --- hotel after search nav bar end --- */}

      <Box>
        <Grid container spacing={2}>
          {/* --- hotel after search side bar start --- */}
          {/* after need to change it for hotel sidebar */}
          <Grid item xs={2.6}>
            <HotelAfterFilter />
          </Grid>
          {/* --- hotel after search side bar end --- */}

          <Grid item xs={9.4}>
            <Stack spacing={2}>
              <HotelAfterSearchCard />
              <HotelAfterSearchCard />
              <HotelAfterSearchCard />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HotelAfterSearchPage;
