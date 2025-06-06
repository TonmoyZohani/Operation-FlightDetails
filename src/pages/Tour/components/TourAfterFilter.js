import { Box } from "@mui/material";
import TimeCountDown from "../../../component/FlightAfterSearch/components/TimeCountDown";
import PriceSlider from "../../../component/FlightAfterSearch/components/FlightAfterFilter/PriceSlider";
import GroupRadioButton from "../../../component/FlightAfterSearch/components/GroupRadioButton";
import { fareTypes } from "../../../assets/data/fareTypes";
import { baggages } from "../../../assets/data/baggage";

const TourAfterFilter = () => {
  return (
    <Box>
      {/* --- page reload counter time start --- */}
      <Box
        px={2.3}
        py={2}
        mb={2}
        sx={{ bgcolor: "white", borderRadius: "4.31px" }}
      >
        <TimeCountDown label="Page reload in" />
      </Box>
      {/* --- page reload counter time end --- */}

      {/* --- price slider start --- */}
      <Box py={2} mb={2} sx={{ bgcolor: "white", borderRadius: "4.31px" }}>
        <PriceSlider label="Price Slider" />
      </Box>
      {/* --- price slider end --- */}

      {/* --- Fare type section start ---  */}
      <Box
        px={3}
        py={2}
        mb={2}
        sx={{ bgcolor: "white", borderRadius: "4.31px" }}
      >
        <GroupRadioButton
          id="fare-type"
          label="Fare Type"
          name="fareType"
          options={fareTypes}
        />
      </Box>
      {/* --- Fare type section end ---  */}

      {/* --- Baggage section start ---  */}
      <Box
        px={3}
        py={2}
        mb={2}
        sx={{ bgcolor: "white", borderRadius: "4.31px" }}
      >
        <GroupRadioButton
          id="baggage"
          label="Baggage"
          name="baggage"
          options={baggages}
        />
      </Box>
      {/* --- Baggage section end ---  */}

      {/* --- Fare type section start ---  */}
      <Box
        px={3}
        py={2}
        mb={2}
        sx={{ bgcolor: "white", borderRadius: "4.31px" }}
      >
        <GroupRadioButton
          id="fare-type"
          label="Fare Type"
          name="fareType"
          options={fareTypes}
        />
      </Box>
      {/* --- Fare type section end ---  */}
    </Box>
  );
};

export default TourAfterFilter;
