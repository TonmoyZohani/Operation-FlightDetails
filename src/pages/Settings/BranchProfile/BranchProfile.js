import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useAuth } from "../../../context/AuthProvider";
import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const BranchProfile = () => {
  const { jsonHeader } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: branchProfile,
    isLoading
  } = useQuery({
    queryKey: ["branchProfile"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/agent/branches/branch/profile`,
        jsonHeader()
      );

      return data?.data;
    },
  });

  return (
    <Box>
      {!isLoading &&
        navigate(`/dashboard/wingManagement/update-branch`, {
          state: branchProfile,
        })}
    </Box>
  );
};

export default BranchProfile;
