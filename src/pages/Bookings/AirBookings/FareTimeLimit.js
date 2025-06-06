import { Box, Typography } from '@mui/material';
import React from 'react';
import SessionTimer from '../../../component/SessionTimer/SessionTimer';

const FareTimeLimit = () => {
    return (
      <Box
        sx={{
          bgcolor: "#fff",
          mb: "10px",
          px: "12px",
          py: "1rem",
          borderRadius: "3px",
        }}
      >
        <Typography
          sx={{
            color: "#3C4258",
            fontSize: "0.85rem",
            fontWeight: "500",
            pb: "10px",
          }}
        >
          Booking Completion Time
        </Typography>
        <SessionTimer />
      </Box>
    );
};

export default FareTimeLimit;