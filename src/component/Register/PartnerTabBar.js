import { Box, Button, Grid, Typography } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { setAgentData } from "../../features/agentRegistrationSlice";
import { initialPartner } from "../../shared/common/functions";

const PartnerTabBar = ({
  step,
  currentPartner,
  setCurrentPartner,
  partners,
  handleNextPartner,
  setErrors,
}) => {
  const dispatch = useDispatch();
  const agent = useSelector((state) => state.agentRegistration.agent);
  const { ownership, agentType } = agent;

  const handleAddPartner = async () => {
    const isValidCurrentTabPartner = await handleNextPartner(
      ownership?.partnership.length - 1
    );
    if (isValidCurrentTabPartner) {
      dispatch(
        setAgentData({
          ...agent,
          ownership: {
            ...agent?.ownership,
            partnership: [...ownership?.partnership, initialPartner()],
          },
        })
      );
    } else {
      setCurrentPartner(ownership?.partnership.length - 1);
    }
  };

  const handleRemovePartner = (e, index) => {
    e.stopPropagation();
    dispatch(
      setAgentData({
        ...agent,
        ownership: {
          ...agent?.ownership,
          partnership: ownership?.partnership.filter((_, i) => i !== index),
        },
      })
    );
  };

  const handleNextTab = async (i) => {
    if (i > currentPartner) {
      const isValidCurrentTabPartner = await handleNextPartner(currentPartner);
      if (isValidCurrentTabPartner) {
        setCurrentPartner(i);
      }
    } else {
      setErrors({});
      setCurrentPartner(i);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: "10px" }}>
      <Box sx={{ width: step === 3 ? "calc( 100% - 34px)" : "100%" }}>
        <Grid container spacing={2}>
          {partners?.map((partner, i, arr) => {
            const isActive = currentPartner === i;

            return (
              <Grid
                sx={{
                  display:
                    agentType === "partnership" &&
                    step === 3 &&
                    i === 0 &&
                    "none",
                }}
                key={i}
                item
                md={step === 3 ? 12 / arr.length : 12 / arr.length}
                xs={6}
              >
                <Box>
                  <Button
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
                      if (i === currentPartner) return;
                      handleNextTab(i);
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: "500", fontSize: "13px", pl: 1 }}
                      noWrap
                    >
                      {partner?.name ? partner?.name : `Partner ${i + 1} Name`}
                    </Typography>

                    {arr.length > 2 && step === 3 && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: isActive ? "white" : "var(--primary-color)",
                          height: "22px",
                          width: "22px",
                          borderRadius: "50%",
                        }}
                        onClick={(e) => handleRemovePartner(e, i)}
                      >
                        <CloseIcon
                          sx={{
                            color: isActive ? "var(--primary-color)" : "white",
                            fontSize: "12px",
                          }}
                        />
                      </Box>
                    )}
                  </Button>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      {step === 3 && agentType === "partnership" && (
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

export default PartnerTabBar;
