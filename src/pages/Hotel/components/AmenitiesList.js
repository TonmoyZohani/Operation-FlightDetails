import {
  Grid,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import SpaIcon from "@mui/icons-material/Spa";
import PetsIcon from "@mui/icons-material/Pets";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import TranslateIcon from "@mui/icons-material/Translate";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import CircleIcon from "@mui/icons-material/Circle";

const amenities = [
  {
    category: "Rooms",
    icon: <HotelIcon />,
    items: [
      "Cable TV",
      "Hairdryer",
      "Linens",
      "Non-smoking rooms",
      "Room service",
      "Shower/Bathtub",
      "Smoke Detector",
      "Soundproof rooms",
      "TV",
    ],
  },
  {
    category: "Services and amenities",
    icon: <RoomServiceIcon />,
    items: [
      "Concierge services",
      "Dry-cleaning (charged separately)",
      "Ironing (charged separately)",
      "Laundry (charged separately)",
      "Luggage storage",
      "Safe-deposit box",
      "Shoe shine (charged separately)",
      "Telephone",
      "Wake-up service",
    ],
  },
  {
    category: "Meals",
    icon: <LocalDiningIcon />,
    items: [
      "Bar",
      "Bottled water (at extra charge)",
      "Breakfast",
      "Breakfast in the room",
      "Buffet breakfast",
      "Cafe",
      "Diet menu (on request)",
      "Packed Lunches",
      "Restaurant",
      "Restaurant (buffet style)",
      "Snack bar",
    ],
  },
  {
    category: "Transfer",
    icon: <LocalLaundryServiceIcon />,
    items: ["Car rental (charged separately)", "Transfer (charged separately)"],
  },
  {
    category: "Languages Spoken",
    icon: <TranslateIcon />,
    items: [
      "English",
      "French",
      "German",
      "Italian",
      "Multi-language staff",
      "Spanish",
    ],
  },
  {
    category: "Parking",
    icon: <LocalParkingIcon />,
    items: ["Garage", "Parking"],
  },
  {
    category: "Sports",
    icon: <SportsBasketballIcon />,
    items: ["Fitness facilities"],
  },
  {
    category: "Beauty and wellness",
    icon: <SpaIcon />,
    items: [
      "Massage (charged separately)",
      "Sauna",
      "Spa (charged separately)",
    ],
  },
  {
    category: "Pets",
    icon: <PetsIcon />,
    items: ["Pets allowed (under 5 kg)"],
  },
  {
    category: "Health and Safety Measures",
    icon: <HealthAndSafetyIcon />,
    items: ["Extra decontamination measures"],
  },
  {
    category: "Business",
    icon: <BusinessCenterIcon />,
    items: [
      "Business center",
      "Conference Hall",
      "Fax and copy machine",
      "Meeting and presentation facilities",
    ],
  },
];

const AmenitiesList = () => {
  return (
    <Grid container spacing={2} sx={{ minWidth: "100%", margin: "0 auto" }}>
      {amenities.map((amenity, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Box>
            <Box display="flex" alignItems="center" sx={{ py: 0 }}>
              <Box sx={{ color: "black", mr: 1 }}>{amenity.icon}</Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "var(--text-color)",
                }}
              >
                {amenity.category}
              </Typography>
            </Box>
            <List sx={{ pt: 0 }}>
              {amenity.items.map((item, idx) => (
                <ListItem sx={{ py: 0, my: 0 }} key={idx}>
                  <ListItemIcon sx={{ minWidth: 12 }}>
                    <CircleIcon
                      sx={{ fontSize: "6px", color: "var(--text-light)" }}
                    />{" "}
                    {/* Bullet point icon */}
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      color: "var(-text-light)",
                    }}
                    primary={item}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default AmenitiesList;
