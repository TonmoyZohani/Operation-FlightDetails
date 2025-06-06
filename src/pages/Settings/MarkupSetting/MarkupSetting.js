import { Box } from "@mui/material";
import React from "react";
import DynamicTable from "../../../shared/Tables/DynamicTable";
import { useOutletContext } from "react-router-dom";

const MarkupSetting = () => {
  const { agentData } = useOutletContext();
  const markupManagement = agentData?.userAccess?.markupManagement;

  const columns = [
    {
      field: "depositId",
      headerName: "Branch",
      width: 120,
    },
    {
      field: "markupFor",
      headerName: "Markup For",
      width: 150,
    },
    {
      field: "operation",
      headerName: "Operation",
      width: 150,
    },
    {
      field: "destinationType",
      headerName: "Destination Type",
      width: 150,
    },
    {
      field: "journeyType",
      headerName: "Journey Type",
      width: 150,
    },
    {
      field: "markupType",
      headerName: "Markup Type",
      width: 150,
    },
    {
      field: "markupApplicableFor",
      headerName: "Markup Applicable For",
      width: 180,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
    },
  ];

  return (
    <Box sx={{ borderRadius: "10px" }}>
      <DynamicTable
        route={"/dashboard/deposit"}
        data={[]}
        columns={columns}
        title="Markup Management System"
        // tabs={tabs}
        // buttons={buttons}
        // selectedTab={id}
        type="markUp"
        accessData={markupManagement?.operations}
      />
    </Box>
  );
};

export default MarkupSetting;
