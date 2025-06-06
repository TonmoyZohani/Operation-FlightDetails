import { Box, Grid, Typography } from "@mui/material";
import { ReactComponent as BDFlagIcon } from "../../../images/svg/bdflag.svg";

const EmbassyInformation = () => {
  return (
    <Box>
      <Grid container spacing={1}>
        <Grid item xs={6}>
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
              Embassy Information
            </Typography>
            <Typography
              sx={{
                lineHeight: "21px",
                color: "#5F646C",
                textAlign: "justify",
              }}
            >
              Floor G1, South Court, Jamuna Future Park Progoti Sharani Dhaka
              Bangladesh.
              <br />
              Phone:+880 255067301-308, +880 2 55067345 <br />
              Fax:+880 2 55067361 <br />
              Email:visahelp.dhaka@mea.gov.in <br />
              Office Hours:Sunday to Thursday 9:00 AM to 5:30 PM.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: "flex", justifyContent: "end", gap: 5 }}>
            <Box>
              <Typography
                pb={1}
                variant="h6"
                component="h6"
                sx={{
                  fontSize: "17px",
                  color: "var(--text-light)",
                  fontWeight: 500,
                }}
              >
                Country Flag
              </Typography>
              <Box>
                <BDFlagIcon />
              </Box>
            </Box>
            <Box>
              <Typography
                pb={1}
                variant="h6"
                component="h6"
                sx={{
                  fontSize: "17px",
                  color: "var(--text-light)",
                  fontWeight: 500,
                }}
              >
                Capital
              </Typography>
              <Typography>Dhaka</Typography>
            </Box>
            <Box>
              <Typography
                pb={1}
                variant="h6"
                component="h6"
                sx={{
                  fontSize: "17px",
                  color: "var(--text-light)",
                  fontWeight: 500,
                }}
              >
                Currency
              </Typography>
              <Typography>Taka</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmbassyInformation;
