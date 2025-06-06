import { Avatar, Box, Button, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";

const HotelDetailsHeader = () => {
  return (
    <Box>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: "22.5px",
          color: "var(--text-color)",
          mb: 1,
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
        <Typography
          sx={{
            color: "var(--text-light)",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          Twin Beds
        </Typography>
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
            fontSize: "11.5px",
            fontWeight: 600,
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
    </Box>
  );
};

export default HotelDetailsHeader;
