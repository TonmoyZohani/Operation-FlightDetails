import { Box, Button, Grid, Tooltip, Typography } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const PartnersTabBar = ({
  partners,
  crrIndex,
  setCrrIndex,
  handleAddPartner,
  handleRemovePartner,
  isDeleting,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: partners.length < 3 ? "10px" : "0",
        pointerEvents: isDeleting && "none",
      }}
    >
      <Box sx={{ width: partners.length < 3 ? "calc(100% - 34px)" : "100%" }}>
        <Grid container spacing={2}>
          {partners?.map((partner, i, arr) => {
            const isActive = crrIndex === i;

            return (
              <Grid key={i} item xs={arr.length > 2 ? 12 / arr.length : 6}>
                <Box>
                  <Button
                    disabled={isDeleting}
                    style={{
                      backgroundColor: isActive
                        ? "var(--primary-color)"
                        : "white",
                      color: isActive ? "white" : "var(--primary-color)",
                      width: "100%",
                      textTransform: "capitalize",
                      borderRadius: "35px",
                      border: "1px solid var(--primary-color)",
                      padding: "0 6px",
                      height: "34px",
                      justifyContent: "space-between",
                      alignItems: "center",
                      display: "flex",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (i === crrIndex) return;
                      setCrrIndex(i);
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: "500", fontSize: "13px", pl: 1 }}
                      noWrap
                    >
                      {isDeleting === partner?.id
                        ? "Please Wait..."
                        : partner?.name
                          ? partner?.name
                          : `Partner ${i + 2} Name`}
                    </Typography>

                    {arr.length > 1 && (
                      <Tooltip title={`Delete Partner ${i + 2}`}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: isActive
                              ? "white"
                              : "var(--primary-color)",
                            height: "22px",
                            width: "22px",
                            borderRadius: "50%",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePartner(i, partner?.id);
                          }}
                        >
                          <CloseIcon
                            sx={{
                              color: isActive
                                ? "var(--primary-color)"
                                : "white",
                              fontSize: "12px",
                            }}
                          />
                        </Box>
                      </Tooltip>
                    )}
                  </Button>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      {partners.length < 3 && (
        <Box
          onClick={handleAddPartner}
          sx={{
            bgcolor: "var(--secondary-color)",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <AddIcon sx={{ color: "white" }} />
        </Box>
      )}
    </Box>
  );
};

export default PartnersTabBar;
