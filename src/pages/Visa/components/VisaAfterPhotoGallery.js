import { Box, Grid } from "@mui/material";

const VisaAfterPhotoGallery = () => {
  return (
    <Box>
      <Grid container spacing={1}>
        <Grid item xs={4.8}>
          <Box bgcolor="#D9D9D9" sx={{ height: "316px" }}></Box>
        </Grid>
        <Grid item xs={7.2}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Box bgcolor="#D9D9D9" sx={{ height: "154px" }}></Box>
            </Grid>
            <Grid item xs={4}>
              <Box bgcolor="#D9D9D9" sx={{ height: "154px" }}></Box>
            </Grid>
            <Grid item xs={4}>
              <Box bgcolor="#D9D9D9" sx={{ height: "154px" }}></Box>
            </Grid>
            <Grid item xs={4}>
              <Box bgcolor="#D9D9D9" sx={{ height: "154px" }}></Box>
            </Grid>
            <Grid item xs={4}>
              <Box bgcolor="#D9D9D9" sx={{ height: "154px" }}></Box>
            </Grid>
            <Grid item xs={4}>
              <Box bgcolor="#D9D9D9" sx={{ height: "154px" }}></Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VisaAfterPhotoGallery;
