import {
  Box,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import PageTitle from "../../shared/common/PageTitle";
import { CustomSwitch } from "../../style/style";

const StaffOperations = () => {
  const params = useParams();
  const location = useLocation();
  const [loadingId, setLoadingId] = useState(null);
  const { module, userId, type } = location?.state;

  const handleAction = (moduleData, moduleId) => {
    setLoadingId(moduleId);

    const body = {
      moduleId: moduleId,
      access: !moduleData?.access,
      userId: userId,
    };

    setLoadingId(moduleData?.id);
    // mutate(body);
  };

  const ActionCell = ({ moduleData, moduleId }) => {
    return (
      <Box>
        {loadingId === moduleData?.id ? (
          <Typography sx={{ fontSize: "14px", color: "#888888" }}>
            Please Wait..
          </Typography>
        ) : (
          <FormControlLabel
            sx={{ marginLeft: 0 }}
            onChange={() => handleAction(moduleData, moduleId)}
            control={<CustomSwitch checked={!!moduleData?.access} />}
            label={
              <Typography sx={{ fontSize: "13px", mr: 1 }}>
                {moduleData?.access ? "On" : "Off"}
              </Typography>
            }
            labelPlacement="start"
          />
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: "10px",
        minHeight: "80vh",
      }}
    >
      <PageTitle
        title={`${module?.name?.charAt(0).toUpperCase()}${module?.name?.slice(
          1
        )} ${type === "subModules" ? "- Sub Modules" : "- Opeartions"}`}
      />

      <Box>
        <TableContainer sx={{ px: 1 }}>
          <Table>
            <TableHead>
              <TableRow></TableRow>
            </TableHead>
            <TableBody>
              {module?.[type]?.map((module, index) => (
                <TableRow>
                  <TableCell>
                    <span style={{ cursor: "pointer" }}>
                      {module?.name?.charAt(0).toUpperCase() +
                        module?.name?.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {module?.subModules?.length > 0 && (
                      <span
                        style={{
                          color: "var(--secondary-color)",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        Sub Modules
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {module?.operations?.length > 0 && (
                      <span
                        style={{
                          color: "var(--primary-color)",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        Operations
                      </span>
                    )}
                  </TableCell>

                  <TableCell align="right">
                    {" "}
                    <ActionCell
                      moduleData={module?.userModuleAccess}
                      moduleId={module.id}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default StaffOperations;
