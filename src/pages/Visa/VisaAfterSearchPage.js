import { Box, Typography } from "@mui/material";
import VisaAftarSearchNav from "./components/VisaAfterSearchNav";
import VisaAfterPhotoGallery from "./components/VisaAfterPhotoGallery";
import EmbassyInformation from "./components/EmbassyInformation";
import VisaFeeServiceChargeTable from "./components/VisaFeeServiceChargeTable";
import VisaCheckingTab from "./components/VisaCheckingTab";
import VisaCheckingDetails from "./components/VisaCheckingDetails";
import VisaFrequentlyAskQuestion from "./components/VisaFrequentlyAskQuestion";

const VisaAfterSearchPage = () => {
  return (
    <Box>
      {/* --- visa after search nav bar start --- */}
      <VisaAftarSearchNav />
      {/* --- visa after search nav bar end --- */}

      <Box px={5} py={4} sx={{ bgcolor: "white", borderRadius: "3px" }}>
        {/* --- photo gallery start --- */}
        <Box pb={5}>
          <VisaAfterPhotoGallery />
        </Box>
        {/* --- photo gallery end --- */}

        {/* --- embassy information section start --- */}
        <Box pb={6}>
          <Typography
            variant="h5"
            component="h5"
            pb={2}
            sx={{ fontSize: "22px", fontWeight: 500, color: "#333333" }}
          >
            Bangladesh Business VISA From India
          </Typography>
          <Box>
            <EmbassyInformation />
          </Box>
        </Box>
        {/* --- embassy information section end --- */}

        {/* --- country overview section start --- */}
        <Box pb={6}>
          <Box>
            <Typography
              pb={1}
              variant="h6"
              component="h6"
              sx={{
                fontSize: "17px",
                color: "var(--secondary-color)",
                fontWeight: 500,
              }}
            >
              Country Overview
            </Typography>
            <Typography
              sx={{
                lineHeight: "21px",
                color: "#5F646C",
                textAlign: "justify",
              }}
            >
              Home to majestic mountain ranges and picture like islands; Europe
              possesses some of the most beautiful scenery on Earth. We are
              going to have 20 days long road trip and touch nine exceptionally
              exotic countries of Europe. There simply is no way not be
              awestruck by its scenic beauty and artistic diversity. What is
              great about Europe is their cultural diversity. People even speak
              different languages. Some of their most unique attractions are the
              Eiffel Tower in Paris, France; Colosseum in Rome, Italy; Parthenon
              in Athens, Greece; and the Leaning Tower of Pisa, Italy. They are
              also known for their epic cuisines; like most popular Italian
              cuisine, French desserts, Switzerland’s chocolate etc. We are
              definitely going to have a blast in Europe. Europe is their
              cultural diversity. People even speak different languages. Some of
              their most unique attractions are the Eiffel Tower in Paris,
              France; Colosseum in Rome, Italy; Parthenon in Athens, Greece; and
              the Leaning Tower of Pisa, Italy. They are also known for their
              epic cuisines; like most popular Italian cuisine, French desserts,
              Switzerland’s chocolate etc. We are definitely going to have a
              blast in Europe.
            </Typography>
          </Box>
        </Box>
        {/* --- country overview section end --- */}

        {/* --- visa fee and service charge section end --- */}
        <Box pb={6}>
          <Typography
            pb={1}
            variant="h6"
            component="h6"
            sx={{
              fontSize: "17px",
              color: "var(--secondary-color)",
              fontWeight: 500,
            }}
          >
            Visa Fee and Service Charge
          </Typography>

          {/* --- visa fee and service charge table start --- */}

          <VisaFeeServiceChargeTable />

          {/* --- visa fee and service charge table end --- */}
        </Box>
        {/* --- visa fee and service charge section end --- */}

        {/* --- visa checking list section start --- */}
        <Box pb={6}>
          <Typography
            pb={2}
            variant="h6"
            component="h6"
            sx={{
              fontSize: "17px",
              color: "var(--secondary-color)",
              fontWeight: 500,
            }}
          >
            Visa Checking List
          </Typography>

          {/* --- visa checking list tab start --- */}
          <Box>
            <VisaCheckingTab />
          </Box>
          {/* --- visa checking list tab end --- */}
        </Box>
        {/* --- visa checking list section end --- */}

        {/* --- visa cheking details section start --- */}

        <Box pb={6}>
          <VisaCheckingDetails />
        </Box>
        {/* --- visa cheking details section end --- */}

        {/* --- frequently asked question section end --- */}
        <Box pb={6}>
          <Typography
            pb={2.5}
            variant="h6"
            component="h6"
            sx={{
              fontSize: "17px",
              color: "var(--secondary-color)",
              fontWeight: 500,
            }}
          >
            Frequently Asked Question
          </Typography>

          <VisaFrequentlyAskQuestion />
        </Box>
        {/* --- frequently asked question section end --- */}
      </Box>
    </Box>
  );
};

export default VisaAfterSearchPage;
