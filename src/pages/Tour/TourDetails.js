import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import BookingSlot from "./components/BookingSlot";
import FrequentlyAskedQuestion from "./components/FrequentlyAskedQuestion";
import TourDetailsBanner from "./components/TourDetailsBanner";
import TourObjectiveTab from "./components/TourObjectiveTab";
import TourPlan from "./components/TourPlan";
import TourPolicy from "./components/TourPolicy";

const tabs = [
  "Booking Slot",
  "Overview",
  "Highlight",
  "Tour Plan",
  "Inclusion & Exclusion",
  "Policy",
  "FAQs",
  "Client Stories",
];

const TourDetails = () => {
  const [activeTripTab, setActiveTripTab] = useState(0);

  return (
    <Box sx={{ bgcolor: "var(--white)" }}>
      <Box>
        <TourDetailsBanner />
        {/* --- Tour tab bar header section start --- */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 3,
            bgcolor: "var(--white)",
          }}
        >
          {tabs?.map((tab, index) => (
            <Typography
              key={index}
              sx={{
                bgcolor: activeTripTab === index && "var(--secondary-color)",
                color:
                  activeTripTab === index
                    ? "var(--white)"
                    : "var(--text-light)",
                px: 3,
                py: 0.5,
                borderRadius: "20px",
                fontWeight: activeTripTab === index ? 400 : 400,
                fontSize: "14px",
                cursor: "pointer",
                transition: "ease-in-out",
                transform: "all",
                transitionDuration: 1000,
              }}
              onClick={() => setActiveTripTab(index)}
            >
              {tab}
            </Typography>
          ))}
        </Box>
        {/* --- Tour tab bar header section end --- */}
      </Box>

      <Box>
        <Box p={3} sx={{ bgcolor: "var(--white)", borderRadius: "3px" }}>
          {/* --- available booking slot start --- */}
          <BookingSlot />
          {/* --- available booking slot end --- */}

          {/* --- overview section start --- */}
          <Box pb={6}>
            <Box>
              <Typography
                pb={1}
                variant="h6"
                component="h6"
                sx={{
                  fontSize: "19px",
                  color: "var(--text-color)",
                  fontWeight: 500,
                }}
              >
                Overview
              </Typography>
              <Typography
                sx={{
                  lineHeight: "18px",
                  color: "var(--text-light)",
                  textAlign: "justify",
                  fontSize: "13px",
                }}
              >
                Home to majestic mountain ranges and picture like islands;
                Europe possesses some of the most beautiful scenery on Earth. We
                are going to have 20 days long road trip and touch nine
                exceptionally exotic countries of Europe. There simply is no way
                not be awestruck by its scenic beauty and artistic diversity.
                What is great about Europe is their cultural diversity. People
                even speak different languages. Some of their most unique
                attractions are the Eiffel Tower in Paris, France; Colosseum in
                Rome, Italy; Parthenon in Athens, Greece; and the Leaning Tower
                of Pisa, Italy. They are also known for their epic cuisines;
                like most popular Italian cuisine, French desserts,
                Switzerland’s chocolate etc. We are definitely going to have a
                blast in Europe. Europe is their cultural diversity. People even
                speak different languages. Some of their most unique attractions
                are the Eiffel Tower in Paris, France; Colosseum in Rome, Italy;
                Parthenon in Athens, Greece; and the Leaning Tower of Pisa,
                Italy. They are also known for their epic cuisines; like most
                popular Italian cuisine, French desserts, Switzerland’s
                chocolate etc. We are definitely going to have a blast in
                Europe.
              </Typography>
            </Box>
          </Box>
          {/* --- overview section end --- */}

          {/* --- tour plan section start --- */}
          <Box pb={6}>
            <Box>
              <Typography
                pb={1}
                variant="h6"
                component="h6"
                sx={{
                  fontSize: "19px",
                  color: "var(--text-color)",
                  fontWeight: 500,
                }}
              >
                Tour Plan
              </Typography>
              <Box>
                <TourPlan />
              </Box>
            </Box>
          </Box>
          {/* --- tour plan section end --- */}

          {/* --- Inclusion & Exclusion section start --- */}
          <Box pb={6}>
            <Typography
              pb={2}
              variant="h6"
              component="h6"
              sx={{
                fontSize: "19px",
                color: "var(--text-color)",
                fontWeight: 500,
              }}
            >
              Inclusion & Exclusion
            </Typography>

            <Box>
              <TourObjectiveTab />
            </Box>
          </Box>
          {/* --- Inclusion & Exclusion section end --- */}

          {/* --- Tour Policy section start --- */}

          <Box pb={6}>
            <Typography
              pb={2}
              variant="h6"
              component="h6"
              sx={{
                fontSize: "19px",
                color: "var(--text-color)",
                fontWeight: 500,
              }}
            >
              Policy
            </Typography>
            <TourPolicy />
          </Box>
          {/* --- Tour Policy section end --- */}

          {/* --- frequently asked question section end --- */}
          <Box pb={3.5}>
            <Typography
              pb={2.5}
              variant="h6"
              component="h6"
              sx={{
                fontSize: "19px",
                color: "var(--text-color)",
                fontWeight: 500,
              }}
            >
              Frequently Asked Question
            </Typography>

            <FrequentlyAskedQuestion />
          </Box>
          {/* --- frequently asked question section end --- */}

          {/* --- support section end --- */}
          <Box pb={6}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                bgcolor: "var(--text-color)",
                borderRadius: "4px",
                px: 0,
                py: 0.7,
              }}
            >
              <SupportAgentIcon />
              <Box>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--white)",
                    fontWeight: 500,
                  }}
                >
                  Have a Question About this tour ?
                </Typography>
                <Typography
                  sx={{
                    fontSize: "10.5px",
                    color: "var(--ash-color)",
                    fontWeight: 500,
                  }}
                >
                  Reach out to our travel experts.
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* --- support section end --- */}

          {/* --- customer stories section start --- */}
          {/* <Box pb={6}>
            <CustomerStories rating={4.7} />
          </Box> */}
          {/* --- customer stories section end --- */}
        </Box>
      </Box>
    </Box>
  );
};

export default TourDetails;
