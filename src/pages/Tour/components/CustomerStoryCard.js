import { Avatar, Box, CardMedia, Grid, Typography } from "@mui/material";
import moment from "moment";
import RatingCard from "./RatingCard";

const CustomerStoryCard = () => {
  return (
    <Box mt={3}>
      <Grid container spacing={2}>
        <Grid item xs={0.7}>
          <Avatar sx={{ bgcolor: "red", fontSize: "15px" }}>MR</Avatar>
          <CardMedia
            component="img"
            height="50"
            width="50"
            sx={{ borderRadius: "50%" }}
            // image="https://via.placeholder.com/40x40"
            image="https://picsum.photos/200"
            alt="Paella dish"
          />
        </Grid>
        <Grid item xs={11.3}>
          <Box>
            <Box mb={2}>
              <Typography
                sx={{
                  fontSize: "15px",
                  color: "var(--text-color)",
                  fontWeight: 500,
                }}
              >
                Masud Rana
              </Typography>
              <Typography
                sx={{
                  color: "var(--gray)",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                Software Engineer (Fly Far Tech)
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <RatingCard rating={4} />
                <Typography
                  sx={{
                    fontSize: "12px",
                    ml: 0.5,
                    color: "var(--primary-color)",
                    fontWeight: 500,
                  }}
                >
                  {moment(new Date()).format("Do MMMM YYYY")}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "var(--secondary-color)",
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                Travel Duration 14 March 2024 to 20 March 2024{" "}
              </Typography>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "var(--text-color)",
                  fontWeight: 400,
                  textAlign: "justify",
                  pr: 2,
                  lineHeight: "16px",
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
                blast in Europe.
              </Typography>
              <Grid
                container
                spacing={2}
                sx={{
                  mt: 2,
                  width: "100%",
                }}
              >
                <Grid item xs={2}>
                  <Box
                    sx={{
                      mb: 2,
                      bgcolor: "var(--gray)",
                      height: "80px",
                    }}
                  ></Box>
                </Grid>
                <Grid item xs={2}>
                  <Box
                    sx={{
                      mb: 2,
                      bgcolor: "var(--gray)",
                      height: "80px",
                    }}
                  ></Box>
                </Grid>
                <Grid item xs={2}>
                  <Box
                    sx={{
                      mb: 2,
                      bgcolor: "var(--gray)",
                      height: "80px",
                    }}
                  ></Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerStoryCard;
