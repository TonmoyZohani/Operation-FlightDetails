import {
  Box,
  FormControlLabel,
  Typography,
  Grid,
  Checkbox,
  Skeleton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PageTitle from "../../shared/common/PageTitle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { useLocation } from "react-router-dom";
import useToast from "../../hook/useToast";
import CustomToast from "../../component/Alert/CustomToast";
import CustomAlert from "../../component/Alert/CustomAlert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomLoadingAlert from "../../component/Alert/CustomLoadingAlert";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  width: "900px",
  height: "650px",
  cellHead: {
    color: "black",
    py: "4.8px",
    pl: 1.5,
    fontSize: "13px",
    border: "1px solid #F8F8F8",
  },
  border: "none",
  borderRadius: "5px",
  outLine: "none",
};

const WingAccess = () => {
  const { jsonHeader } = useAuth();
  const location = useLocation();
  const { id, userId, branchName } = location.state;
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const [operationAccesses, setOperationAccesses] = useState([]);
  const [moduleAccesses, setModuleAccesses] = useState([]);

  const { data: accessData, status } = useQuery({
    queryKey: ["branchesModules", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/access-control/branch/${id}`,
        jsonHeader()
      );
      return data?.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: ({ url, body }) => axios.patch(url, body, jsonHeader()),
    onSuccess: (data) => {
      if (data?.data?.success) {
        showToast("success", data?.data?.message);
        queryClient.invalidateQueries(["branchesModules", id]);
      }
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onError: (err) => {
      setIsLoading(false);
      showToast("error", err?.message);
    },
  });

  const handleAction = (type, moduleData, moduleId) => {
    CustomAlert({
      success: "warning",
      message: "Are you sure you want to Change the status?",
    }).then((res) => {
      if (res.isConfirmed) {
        setIsLoading(true);

        const url =
          type === "module"
            ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/access-control/modules`
            : `${process.env.REACT_APP_BASE_URL}/api/v1/user/access-control/operations`;

        const accessValue =
          type === "module"
            ? moduleData?.userModuleAccess?.access
            : moduleData?.userOperationAccess?.access;

        const requestBody = {
          access: !accessValue,
          userId,
          ...(type === "module" ? { moduleId } : { operationId: moduleId }),
        };

        mutate({ url, body: requestBody });
      }
    });
  };

  if (status === "pending") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {[...Array(7)].map((_, index) => (
          <Skeleton key={index} variant="rounded" width={"100%"} height={70} />
        ))}
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "10px",
          minHeight: "80vh",
        }}
      >
        <PageTitle title={`Access Rights ${branchName}`} />

        <Box sx={{ p: "25px" }}>
          {accessData?.subModules?.map((fModule, index) => (
            <RecursiveModule
              key={index}
              module={fModule}
              moduleAccesses={moduleAccesses}
              operationAccesses={operationAccesses}
              setModuleAccesses={setModuleAccesses}
              setOperationAccesses={setOperationAccesses}
              handleAction={handleAction}
            />
          ))}
        </Box>
      </Box>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />

      <CustomLoadingAlert
        open={isLoading}
        text={"We Are Processing To Update Your Request."}
      />
    </>
  );
};

const RecursiveModule = ({
  module,
  level = 0,
  moduleAccesses,
  operationAccesses,
  setModuleAccesses,
  setOperationAccesses,
  handleAction,
}) => {
  const hasChildren =
    module?.subModules?.length > 0 || module?.operations?.length > 0;
  const [expanded, setExpanded] = useState(hasChildren);
  const handleAccordionChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  useEffect(() => {
    setModuleAccesses((prev) => {
      if (!prev.some((m) => m.id === module.id)) {
        return [
          ...prev,
          {
            id: module?.id,
            access: module?.userModuleAccess?.userAccess,
            modificationAccess: module?.userModuleAccess?.modificationAccess,
          },
        ];
      }
      return prev;
    });

    module?.operations?.forEach((operation) => {
      setOperationAccesses((prev) => {
        if (!prev.some((o) => o.id === operation.id)) {
          return [
            ...prev,
            {
              id: operation?.id,
              access: operation?.userOperationAccess?.userAccess,
              modificationAccess:
                operation?.userOperationAccess?.modificationAccess,
            },
          ];
        }
        return prev;
      });
    });
  }, [module, moduleAccesses, operationAccesses]);

  return (
    <Grid item lg={12} sx={{ pl: level * 1 }}>
      <Accordion
        sx={{ boxShadow: "none" }}
        expanded={expanded}
        onChange={handleAccordionChange}
      >
        <AccordionSummary
          expandIcon={hasChildren ? <ExpandMoreIcon /> : null}
          sx={{
            borderBottom: "2px solid #D9D9D9",
            p: "0px",
            mt: "0px",
          }}
        >
          <Box sx={{ display: "flex", gap: "15px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                px: "20px",
              }}
            >
              {/* Switch for Module */}

              <ActionCell
                type="module"
                moduleData={module}
                modificationAccess={
                  module?.userModuleAccess?.modificationAccess
                }
                moduleId={module.id}
                onChange={() => {
                  handleAction("module", module, module.id);
                  setExpanded(true);
                }}
                checked={module?.userModuleAccess?.userAccess}
              />

              <Typography
                sx={{
                  fontSize: `13px`,
                  color: "var(--secondary-color)",
                  pt: "1px",
                  fontWeight: "500",
                }}
              >
                {module?.name?.toUpperCase()}
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>

        {/* Accordion Details: Render SubModules and Operations */}
        <AccordionDetails sx={{ pt: 0, mt: "5px" }}>
          <Grid container direction="column">
            {/* Render SubModules */}
            {module?.subModules?.length > 0 && (
              <Grid item lg={12}>
                {module.subModules.map((subModule, subIndex) => (
                  <RecursiveModule
                    key={subIndex}
                    module={subModule}
                    level={level + 1}
                    moduleAccesses={moduleAccesses}
                    operationAccesses={operationAccesses}
                    setModuleAccesses={setModuleAccesses}
                    setOperationAccesses={setOperationAccesses}
                    handleAction={handleAction}
                  />
                ))}
              </Grid>
            )}

            {/* Render Operations */}
            {module.operations.map((operation, opIndex) => (
              <Grid
                item
                lg={12}
                sx={{ pl: (level + 1) * 1, py: "3px" }}
                key={opIndex}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  {/* Switch for Operation */}
                  <ActionCell
                    type="operation"
                    modificationAccess={
                      operation?.userOperationAccess?.modificationAccess
                    }
                    moduleData={operation}
                    moduleId={operation.id}
                    onChange={() => {
                      handleAction("operation", operation, operation.id);
                      setExpanded(true);
                    }}
                    checked={operation?.userOperationAccess?.userAccess}
                  />

                  <Typography
                    sx={{ fontSize: "11px", color: "var(--primary-color)" }}
                  >
                    {operation?.name?.toUpperCase()}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

const ActionCell = ({
  type,
  modificationAccess,
  moduleData,
  moduleId,
  onChange,
  checked,
}) => {
  return (
    <Box>
      <FormControlLabel
        sx={{ marginLeft: 0 }}
        control={
          <Checkbox
            sx={{
              m: 0,
              p: 0,
              color: checked ? "#1ba84a" : "default",
              "&.Mui-checked": { color: "#1ba84a" },
              transform: "scale(1.2)",
            }}
            size="medium"
            checked={checked}
            onChange={onChange}
            disabled={!modificationAccess}
          />
        }
        labelPlacement="start"
      />
    </Box>
  );
};

export default WingAccess;
