import Hotel from "../../../images/demo/hotel.png";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { ReactComponent as WifiIcon } from "../../../assets/svg/wifi.svg";
import { ReactComponent as ParkingIcon } from "../../../assets/svg/parking.svg";
import { ReactComponent as BedIcon } from "../../../assets/svg/bed.svg";
import { ReactComponent as MealIcon } from "../../../assets/svg/meal.svg";
import { ReactComponent as TvdeskIcon } from "../../../assets/svg/tvdesk.svg";
import { ReactComponent as WheelchairIcon } from "../../../assets/svg/wheelchair.svg";

import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const HotelAfterSearchCard = () => {
  // navigate
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        bgcolor: "white",
        minHeight: "163px",
        borderRadius: "7.94px",
        p: 2,
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={9}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                height: "100%",
                width: "142px",
                margin: "0",
                padding: "0",
              }}
              alt="thumbnail"
              src={Hotel}
              variant="rounded"
            />
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "18.5px",
                  color: "var(--text-color)",
                  mb: 0.5,
                }}
              >
                Hotel Sea Crown
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "21px",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Button
                  sx={{
                    borderRadius: "20px",
                    py: 0,
                    px: 0.7,
                    color: "var(--secondary-color)",
                    borderColor: "var(--secondary-color)",
                    "&:hover": {
                      borderColor: "var(--secondary-color)",
                    },
                    fontSize: "11px",
                  }}
                  size="small"
                  variant="outlined"
                  startIcon={
                    <StarIcon
                      sx={{
                        color: "var(--primary-color)",
                      }}
                    />
                  }
                >
                  5 Star
                </Button>
                <Avatar
                  sx={{
                    bgcolor: "var(--error-bg-color)",
                    width: "23px",
                    height: "23px",
                  }}
                >
                  <LocationOnIcon
                    sx={{
                      color: "var(--primary-color)",
                      fontSize: "13px",
                    }}
                  />
                </Avatar>
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: "#B6B6CC",
                    lineBreak: "normal",
                    fontWeight: 500,
                  }}
                >
                  Hotel Sea Crown, Marine Drive, Kola Toli New Beach
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  mb: 2.5,
                }}
              >
                <Typography
                  sx={{
                    color: "var(--text-light)",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  Twin Beds
                </Typography>

                <Button
                  sx={{
                    borderRadius: "20px",
                    py: 0,
                    px: 1.5,
                    color: "var(--secondary-color)",
                    fontSize: "11px",
                    fontWeight: 500,
                    borderColor: "var(--primary-color)",
                    "&:hover": {
                      borderColor: "var(--primary-color)",
                    },
                  }}
                  size="small"
                  variant="outlined"
                >
                  9 Room Rmaining
                </Button>
              </Box>
              <Box
                sx={{
                  py: 0.5,
                  px: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#4AB502",
                    width: "23px",
                    height: "23px",
                    fontSize: "13px",
                  }}
                >
                  8
                </Avatar>
                <WifiIcon style={{ fill: "var(--text-color)" }} />
                <ParkingIcon />
                <BedIcon />
                <MealIcon style={{ fill: "var(--text-color)" }} />
                <TvdeskIcon />
                <WheelchairIcon />
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "end",
              height: "100%",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "18.5px",
                  color: "var(--text-color)",
                  textAlign: "end",
                }}
              >
                BDT 75,000
              </Typography>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "12px",
                  color: "var(--secondary-color)",
                  textAlign: "end",
                }}
              >
                or 8 nights for 2 guests
              </Typography>
            </Box>
            <Button
              size="small"
              sx={{
                bgcolor: "var(--primary-color)",
                borderRadius: "20px",
                px: 3,
                color: "white",
                ml: "auto",
                "&:hover": {
                  bgcolor: "var(--primary-color)",
                },
              }}
              onClick={() => navigate("/dashboard/search/hotelDetails")}
            >
              Show Rooms
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HotelAfterSearchCard;
