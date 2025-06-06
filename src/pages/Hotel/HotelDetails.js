import { Avatar, Box, Grid, Typography } from "@mui/material";
import HotelPhotoGallery from "./components/HotelPhotoGallery";
import HotelDetailsHeader from "./components/HotelDetailsHeader";
import HotelDescription from "./components/HotelDescription";
import HotelSelectTable from "./components/HotelSelectTable";
import { ReactComponent as DropdownIcon } from "../../images/svg/dropdown.svg";
import Facilities from "../../images/demo/facilities.png";
import AmenitiesList from "./components/AmenitiesList";
import HotelPolicy from "./components/HotelPolicy";

const HotelDetails = () => {
  return (
    <Box>
        <Box p={3} mt={2} sx={{ bgcolor: "white", borderRadius: "3px" }}>
          {/* --- photo gallery start --- */}
          <Box pb={4}>
            <HotelPhotoGallery />
          </Box>
          {/* --- photo gallery end --- */}

          {/* --- hotel room details header section start --- */}
          <Box pb={3}>
            <HotelDetailsHeader />
          </Box>
          {/* --- hotel room details header section end --- */}

          {/* --- hotel room details header section start --- */}
          <Box pb={6}>
            <Typography
              sx={{
                fontSize: "18.25px",
                color: "var(--text-color)",
                fontWeight: 600,
                mb: 1,
              }}
            >
              Description of the hotel
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={10}>
                <Box pr={10}>
                  <HotelDescription />
                </Box>
              </Grid>
              <Grid item xs={2}>
                <Box>
                  <Box pb={2}>
                    <Typography
                      variant="h6"
                      component="h6"
                      sx={{
                        fontSize: "13px",
                        fontWeight: "Bold",
                        color: "var(--primary-color)",
                        pb: 1,
                      }}
                    >
                      Facts about the hotel
                    </Typography>
                    <Box>
                      <Typography
                        variant="body1"
                        // component="body4"
                        sx={{
                          fontSize: "10px",
                          fontWeight: 500,
                          color: "var(--text-light)",
                          lineHeight: "18px",
                          textAlign: "justify",
                        }}
                      >
                        Year of construction
                      </Typography>
                      <Typography
                        variant="body1"
                        // component="body4"
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "var(--text-color)",
                          pb: 2,
                          lineHeight: "18px",
                          textAlign: "justify",
                        }}
                      >
                        2015
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body1"
                        // component="body4"
                        sx={{
                          fontSize: "10px",
                          fontWeight: 500,
                          color: "var(--text-light)",
                          lineHeight: "18px",
                          textAlign: "justify",
                        }}
                      >
                        Socket
                      </Typography>
                      <Typography
                        variant="body1"
                        // component="body4"
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "var(--text-color)",
                          pb: 2,
                          lineHeight: "18px",
                          textAlign: "justify",
                        }}
                      >
                        European, 230 V / 50 Hz
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/* --- hotel room details header section end --- */}
          <Box>
            <Typography
              sx={{
                fontSize: "18.25px",
                color: "var(--text-color)",
                fontWeight: 600,
              }}
            >
              Available Rooms
            </Typography>
            <Typography
              variant="body1"
              // component="body4"
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                color: "var(--text-light)",
                lineHeight: "18px",
                textAlign: "justify",
              }}
            >
              For 8 Nights & 7 Day , 2 Adult
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: "#FFF0ED" }}>
          <Box px={3} py={2} sx={{ display: "flex", alignItems: "center" }}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Box sx={{ bgcolor: "white", px: 2, py: 0.3 }}>
                  <Typography
                    sx={{
                      fontSize: "12.77px",
                      color: "#5F6368",
                      fontWeight: 500,
                    }}
                  >
                    Bed
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12.77px",
                      color: "#D9D9D9",
                      fontWeight: 500,
                    }}
                  >
                    all options
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ bgcolor: "white", px: 2, py: 0.3 }}>
                  <Typography
                    sx={{
                      fontSize: "12.77px",
                      color: "#5F6368",
                      fontWeight: 500,
                    }}
                  >
                    Bed
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12.77px",
                      color: "#D9D9D9",
                      fontWeight: 500,
                    }}
                  >
                    all options
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ bgcolor: "white", px: 2, py: 0.3 }}>
                  <Typography
                    sx={{
                      fontSize: "12.77px",
                      color: "#5F6368",
                      fontWeight: 500,
                    }}
                  >
                    Bed
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12.77px",
                      color: "#D9D9D9",
                      fontWeight: 500,
                    }}
                  >
                    all options
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ bgcolor: "white", px: 2, py: 0.3 }}>
                  <Typography
                    sx={{
                      fontSize: "12.77px",
                      color: "#5F6368",
                      fontWeight: 500,
                    }}
                  >
                    Bed
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12.77px",
                      color: "#D9D9D9",
                      fontWeight: 500,
                    }}
                  >
                    all options
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box py={5} px={2.3} sx={{ bgcolor: "white" }}>
          <Box
            px={2.5}
            py={2}
            sx={{ border: "1px solid #F8F8F8", borderRadius: "4.56px" }}
          >
            <Box mb={2.4} sx={{ display: "flex", gap: 2 }}>
              <Avatar
                sx={{ width: "10.36rem", height: "6.6rem" }}
                variant="rounded"
              ></Avatar>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "18.25px",
                    color: "var(--text-color)",
                  }}
                >
                  Standard Double Room
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "14.25px",
                    color: "var(--primary-color)",
                    mb: 2,
                  }}
                >
                  Full Double Bed
                </Typography>
                <Box sx={{ width: "100%" }}>
                  <Avatar
                    src={Facilities}
                    sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                    variant="square"
                  />
                </Box>
              </Box>
            </Box>

            <Box>
              <HotelSelectTable />
              <Box sx={{ display: "flex", justifyContent: "end", mt: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontSize: "11px" }}>
                    Show 3 More rates
                  </Typography>
                  <DropdownIcon
                    width="11px"
                    height="7px"
                    fill="var(--secondary-color)"
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box mt={4}>
            <Typography
              sx={{
                fontSize: "18.25px",
                color: "var(--text-color)",
                fontWeight: 500,
              }}
            >
              What Others Amminites are there
            </Typography>
            <AmenitiesList />
          </Box>
          <Box pb={4} mt={4}>
            <Typography
              sx={{
                fontSize: "18.25px",
                color: "var(--text-color)",
                fontWeight: 500,
                mb: 2,
              }}
            >
              Policies
            </Typography>
            <HotelPolicy />
          </Box>
        </Box>
    </Box>
  );
};

export default HotelDetails;
