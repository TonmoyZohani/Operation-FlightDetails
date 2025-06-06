import { Box, Container } from "@mui/material";
import HomeSearchBox from "../HomeSearchBox/HomeSearchBox";
import BottomNavbar from "../Navbar/BottomNavbar/BottomNavbar";
import ExclusiveOffers from "./components/ExclusiveOffers";
import useWindowSize from "../../shared/common/useWindowSize";

const SearchPage = ({ recentSearch, isLoading, accessData }) => {
  const { isMobile } = useWindowSize();
  return (
    <Container>
      <HomeSearchBox
        accessData={accessData}
        recentSearch={recentSearch}
        isLoading={isLoading}
      />

      <Box
        mt={2}
        pb={5}
        sx={{
          width: {
            xs: "90%",
            lg: "100%",
          },
          mx: "auto",
        }}
      >
        {/* {!isMobile && <ExclusiveOffers />} */}
      </Box>
      <Box sx={{ display: { xs: "block", lg: "none" } }}>
        <BottomNavbar />
      </Box>
    </Container>
  );
};

export default SearchPage;
