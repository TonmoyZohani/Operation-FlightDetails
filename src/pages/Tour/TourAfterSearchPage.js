import { Box, Grid, Stack } from "@mui/material";
import TourAfterFilter from "./components/TourAfterFilter";
import TourAfterSearchNav from "./components/TourAfterSearchNav";
import TourAfterSearchCard from "./components/TourAfterSearchCard";

const TourAfterSearchPage = () => {
  return (
    <Box>
      {/* --- Tour After Search nav bar start --- */}
      <TourAfterSearchNav />
      {/* --- Tour After Search nav bar end --- */}

      <Box>
        <Grid container spacing={2}>
          {/* --- Tour After Search filter section start --- */}
          <Grid item xs={2.6}>
            <TourAfterFilter />
          </Grid>
          {/* --- Tour After Search filter section end --- */}

          <Grid item xs={9.4}>
            <Stack spacing={2}>
              <TourAfterSearchCard />
              <TourAfterSearchCard />
              <TourAfterSearchCard />
              <TourAfterSearchCard />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TourAfterSearchPage;
