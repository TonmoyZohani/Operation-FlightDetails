import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import EastIcon from "@mui/icons-material/East";
import { alignCenter, underLine } from "./SplitFlightDetails";
import { useDispatch, useSelector } from "react-redux";
import { setCrrItenary } from "../../component/FlightSearchBox/flighAfterSearchSlice";

const SplitItenaryTabs = ({ selectedFlightArr }) => {
  const { crrItenary } = useSelector((state) => state.flightAfter);
  const dispatch = useDispatch();

  return (
    <Box>
      <Grid container>
        {/* <Grid container sx={{ borderBottom: "1px solid var(--border)" }}> */}
        {selectedFlightArr.map((flightData, i, arr) => {
          const cities = flightData?.cityCount?.flat();
          const firstSeg = cities[0] || {};
          const lastSeg = cities?.at(cities?.length - 1) || {};

          return (
            <Grid key={i} item md={12 / arr.length}>
              <Box
                onClick={() => dispatch(setCrrItenary(i))}
                sx={{
                  borderTop: "1px solid var(--border)",
                  borderRight: i < arr.length - 1 && "1px solid var(--border)",
                  pl: "5px",
                  py: 0.5,
                  cursor: "pointer",
                }}
              >
                <Typography sx={{ color: "var(--gray)", fontSize: "12px" }}>
                  {i === 0 ? "Onward" : "Return"}
                </Typography>

                <Typography
                  sx={{ color: "var(--mate-black)", fontWeight: "600" }}
                >
                  <span style={{ ...alignCenter, lineHeight: "2", gap: "7px" }}>
                    {firstSeg?.departureCityName}
                    <EastIcon
                      sx={{ color: i === 0 && "var(--secondary-color)" }}
                    />
                    {lastSeg?.arrivalCityName}
                  </span>
                </Typography>

                {crrItenary === i && (
                  <Box sx={{ ...underLine, bgcolor: "var(--primary-color)" }} />
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default SplitItenaryTabs;
