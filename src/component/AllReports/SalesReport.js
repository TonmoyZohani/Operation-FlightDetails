import React from "react";
import { useNavigate } from "react-router-dom";
import ReportDynamicTable from "../../shared/Tables/ReportDynamicTable";

const SalesReport = () => {
  const navigate = useNavigate();

  const columns = [
    { field: "accname", headerName: "Reference", width: 100 },
    { field: "bankname", headerName: "Status", width: 120 },
    { field: "branch", headerName: "Payment Status", width: 120 },
    { field: "routing", headerName: "Destination", width: 120 },
    { field: "accnamee", headerName: "Type", width: 100 },
    { field: "banknamee", headerName: "Booking Date", width: 120 },
    { field: "branche", headerName: "Flight Date", width: 120 },
    { field: "routinge", headerName: "Airlines PNR", width: 120 },
    { field: "accnameee", headerName: "Total Amount", width: 120 },
  ];

  const tabs = [
    { label: "All" },
    { label: "Paid" },
    { label: "Unsettled" },
    { label: "Void" },
    { label: "Refund" },
  ];

  const buttons = [
    {
      label: "Add Deposit",
      style: {
        backgroundColor: "var(--primary-color)",
        color: "white",
        borderRadius: "25px",
        fontSize: "11px",
        paddingLeft: "20px",
        paddingRight: "20px",
        width: "120px",
        height: "32px",
        display: "none",
      },
      onClick: () => navigate("/dashboard/add-Deposit"),
    },
    {
      label: "Search",
      style: {
        backgroundColor: "var(--secondary-color)",
        color: "#fff",
        borderRadius: "25px",
        width: "120px",
        fontSize: "11px",
        height: "32px",
      },
    },
  ];

  const bottomButtons = [
    {
      label: "Total Ticket : 45",
      style: {
        width: "32%",
        bgcolor: "#0E8749",
        borderRadius: "3px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        paddingLeft: "20px",
      },
    },
    {
      label: "Total Paid Amount : 1,48,544 BDT",
      style: {
        width: "32%",
        bgcolor: "#0E8749",
        borderRadius: "3px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        paddingLeft: "20px",
      },
    },
    {
      label: "Total Profit Amount : 10,000 BDT",
      style: {
        width: "32%",
        bgcolor: "#0E8749",
        borderRadius: "3px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        paddingLeft: "20px",
      },
    },
  ];

  return (
    <ReportDynamicTable
      apiUrl=""
      columns={columns}
      title="Sales Report"
      tabs={tabs}
      buttons={buttons}
      bottomButtons={bottomButtons}
    />
  );
};

export default SalesReport;
