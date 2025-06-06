import {
  Box,
  Grid,
  LinearProgress,
  linearProgressClasses,
  styled,
  Typography,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import PetsIcon from "@mui/icons-material/Pets";
import { ReactComponent as HomeLockIcon } from "../../../images/svg/homeLock.svg";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 1,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#FFF0EC",
    ...theme.applyStyles("dark", {
      backgroundColor: "#FFF0EC",
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 1,
    backgroundColor: "var(--primary-color)",
    ...theme.applyStyles("dark", {
      backgroundColor: "var(--primary-color)",
    }),
  },
}));
const HotelPolicy = () => {
  return (
    <Box>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={2}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarMonthIcon sx={{ color: "var(--primary-color)" }} />
              <Typography sx={{ fontSize: "12.7px", color: "#888888" }}>
                Check In
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Box sx={{ width: "50%" }}>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Typography sx={{ width: "50%", color: "#888888" }}>
                12:00:00
              </Typography>
            </Box>
            <BorderLinearProgress
              sx={{ transform: "rotate(180deg)" }}
              variant="determinate"
              value={50}
            />
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarMonthIcon sx={{ color: "var(--primary-color)" }} />
              <Typography sx={{ fontSize: "12.7px", color: "#888888" }}>
                Check Out
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Box sx={{ width: "50%" }}>
            <Box sx={{ display: "flex", justifyContent: "start" }}>
              <Typography
                sx={{ width: "50%", textAlign: "end", color: "#888888" }}
              >
                12:00:00
              </Typography>
            </Box>
            <BorderLinearProgress variant="determinate" value={50} />
          </Box>
        </Grid>
        <Grid pb={4} item xs={2}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ChildCareIcon sx={{ color: "var(--primary-color)" }} />
              <Typography sx={{ fontSize: "12.7px", color: "#888888" }}>
                Child Policy
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid pb={4} item xs={10}>
          <Box>
            <Typography sx={{ fontSize: "13px", color: "#888888" }}>
              Allowed
            </Typography>
            <Typography sx={{ fontSize: "12px" }}>
              Up to 2 Children below 5 Years can stay in the same room & enjoy
              Complimentary Breakfast.Children from 5 years to 10 years will be
              charged BDT 450/= for extra breakfast.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PetsIcon sx={{ color: "var(--primary-color)" }} />
              <Typography sx={{ fontSize: "12.7px", color: "#888888" }}>
                Pet Policy
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Box>
            <Typography sx={{ fontSize: "13px", color: "#888888" }}>
              Not Allowed
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HomeLockIcon sx={{ color: "var(--primary-color)" }} />
              <Typography sx={{ fontSize: "12.7px", color: "#888888" }}>
                House Rules
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Box>
            <Typography sx={{ fontSize: "12px" }}>
              Extra Bed (If necessary): Roll-away Bed BDT 1600/- (Inclusive) or
              Mattress Bed BDT1200/- (Inclusive) Per Night With 01 complimentary
              Breakfast. Each guest has to present a copy of their valid
              NID/other forms of identification documents during check-in.
              Guests should carry their vaccination certificate during check-in.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HotelPolicy;
