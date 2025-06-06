import { Box, Grid, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { setFilter } from "./filterSlice";
import { filterLabelStyle } from "../../../style/style";

const GridItem = ({ label, isSelected, onClick }) => {
  return (
    <Grid item xs={6}>
      <Box
        sx={{
          border: "1px solid #D9D9D9",
          borderRadius: "4px",
          bgcolor: isSelected ? "var(--primary-color)" : "transparent",
          color: isSelected ? "white" : "var(--secondary-color)",
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        <Typography
          sx={{
            fontSize: "12px",
            textAlign: "center",
            my: 1,
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      </Box>
    </Grid>
  );
};

const ItemsSelection = ({ title, items, selectedItem }) => {
  return (
    <Box>
      <Typography variant="h2" component="h2" mb={2} sx={filterLabelStyle}>
        {title}
      </Typography>
      <Box>
        <Grid container spacing={1.5}>
          {items?.map((item, i) => (
            <GridItem
              key={i}
              label={item.label}
              isSelected={selectedItem === item.label}
            />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ItemsSelection;
