import { Box, Button, Typography, Grid } from "@mui/material";
import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

const isMobile = window.innerWidth <= 768;

const styles = {
  root: {
    height: "calc(100vh - 200px)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  dataGrid: {
    flexGrow: 1,
  },
};

export const buttonStyle = {
  backgroundColor: "transparent",
  color: "var(--secondary-color)",
};

export const activeButton = {
  backgroundColor: "var(--primary-color)",
  color: "white",
};

const DynamicTable = ({
  route,
  data,
  columns,
  tabs,
  bottomButtons,
  selectedTab,
  type = "",
  SelectBtn,
  accessData,
  agentCms = {},
  tag,
  setQuery = () => {},
  handleAdvanceFilter,
  setSearchById,
}) => {
  const navigate = useNavigate();
  const { agentData } = useOutletContext();
  const availableBranch = agentData?.agentCms?.countCms?.branch;
  const usedBranch = agentData?.usedCms?.branch;
  const availableStaff = agentData?.agentCms?.countCms?.staff;
  const usedStaff = agentData?.usedCms?.staff;

  // Custom button
  function CustomToolbar() {
    const prop = {
      button: {
        variant: "darkBtn",
        startIcon: null,
        sx: {
          fontSize: "11px",
          backgroundColor: "var(--secondary-color)",
          color: "white",
          "&:hover": {
            color: "black",
          },
        },
      },
    };

    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1.5,
        }}
      >
        <Box>
          {tabs?.length > 0 && (
            <Grid container>
              <Grid container item spacing={1}>
                {tabs?.map((tab, index) => (
                  <Grid item key={index}>
                    <Button
                      style={
                        (tab?.value || tab?.label) === selectedTab
                          ? activeButton
                          : buttonStyle
                      }
                      sx={{
                        fontSize: { lg: "11px", xs: "11px" },
                        ...activeButton,
                        minWidth: "80px",
                      }}
                      onClick={() => {
                        navigate(`${route}/${tab?.value ?? tab?.label}`);
                        setSearchById("");
                        setQuery(1);
                      }}
                    >
                      {tab.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Box>

        <Box sx={{ gap: "8px", display: "flex" }}>
          {(type === "depositTable" ||
            type === "flightBookings" ||
            type === "generalLedgerTable") && (
            <Button
              style={{
                ...activeButton,
                backgroundColor: "#4bb189",
                minWidth: "120px",
              }}
              sx={{ fontSize: { lg: "11px", xs: "11px" } }}
              onClick={() => handleAdvanceFilter()}
            >
              Advanced Filter
            </Button>
          )}
          {type === "partialDueTicket" && (
            <Button
              style={{
                ...activeButton,
                backgroundColor: "#4bb189",
                minWidth: "100px",
              }}
              sx={{ fontSize: { lg: "11px", xs: "11px" } }}
              onClick={() => handleAdvanceFilter()}
            >
              Filter
            </Button>
          )}
          {type === "generalLedgerTable" && <SelectBtn />}
          <GridToolbarColumnsButton slotProps={prop} />
          <GridToolbarFilterButton slotProps={prop} />
          <GridToolbarExport slotProps={prop} />

          {type === "staffTable" &&
            accessData?.userAccess?.staffManagement?.operations
              ?.addStaffMember &&
            usedStaff < availableStaff && (
              <AddButton
                label={"Add Staff"}
                href={"/dashboard/staffManagement/add-staff"}
              />
            )}

          {type === "wingTable" && usedBranch < availableBranch && (
            <AddButton
              label={"Add Branch"}
              href={"/dashboard/wingManagement/add-Branch"}
            />
          )}

          {type === "depositTable" && accessData?.makeDepositRequest && (
            <AddButton
              label={"Add Deposit"}
              href={`/dashboard/add-Deposit/${agentCms?.cashDeposit?.eligible ? "cash" : agentCms?.bankTransferDeposit?.eligible ? "bank transfer" : agentCms?.bankDeposit?.eligible ? "bank deposit" : agentCms?.chequeDeposit?.eligible ? "cheque deposit" : ""}`}
            />
          )}

          {type === "myBankTable" && accessData?.addBankDetails && (
            <AddButton label={"Add Bank"} href={"/dashboard/addBankAccount"} />
          )}

          {type === "smtpEmailConfigure" && accessData?.addSmtpSetting && (
            <AddButton label={"Add SMTP Email"} href={"/dashboard/addSMTP"} />
          )}

          {type === "markUp" && accessData?.addMarkup && (
            <AddButton label={"Add Markup"} href={"/dashboard/addMarkup"} />
          )}

          {type === "balanceTransfer" && (
            <AddButton
              label={
                tag === "agent" ? "Add Balance Transfer" : "Return Balance"
              }
              href={"/dashboard/balanceTransfer/add"}
            />
          )}
          {type === "addClient" && (
            <AddButton
              label={"Add New Traveler"}
              href={"/dashboard/addClient"}
            />
          )}
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <>
      <Box
        sx={{
          borderRadius: "10px",
          display: isMobile ? "none" : "block",
        }}
      >
        <Box
          style={styles.root}
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              fontSize: "13px",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid var(--input-bgcolor)",
            },
            "& .MuiDataGrid-columnHeaders": {
              color: "#4D4B4B",
              fontSize: "12px",
              textTransform: "uppercase",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "var(--body-color)",
            },
            "& .MuiDataGrid-footerContainer": {
              display: "none",
            },
            "& .MuiDataGrid-toolbarContainer": {
              borderBottom: "1px solid #EEEEEE",
            },
            "& .MuiDataGrid-row": {
              borderBottom: "1px solid #EEEEEE",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: "white",
              background: "var(--secondary-color)",
              fontSize: "11px",
              padding: "6px",
            },
            "& .MuiDataGrid-columnHeaderDraggableContainer .MuiSvgIcon-root": {
              color: "var(--secondary-color)",
            },
            "& .MuiTablePagination-selectLabel": {
              color: "var(--white)",
            },
            "& .MuiSelect-select": {
              color: "var(--white)",
            },
            "& .MuiDataGrid-scrollbar--vertical": {
              display: "none",
            },
            "& .MuiTablePagination-displayedRows": {
              color: "var(--white)",
            },
            "& .MuiDataGrid-cellContent": {
              color: "var(--text-color)",
            },
            "& .MuiSvgIcon-root": {
              display: "none !important",
            },
            "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
              height: "3px",
            },
            "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
              backgroundColor: "#c1c1c1",
              borderRadius: "4px",
            },
            "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            bgcolor: "white",
            pt: "15px",
            px: "22px",
          }}
          className="dataGrid_height"
        >
          <DataGrid
            rows={data}
            columns={columns}
            scrollbarSize={5}
            style={styles.dataGrid}
            slots={{ toolbar: CustomToolbar }}
            rowHeight={60}
          />
        </Box>
        {bottomButtons?.length > 0 && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              pb: "15px",
            }}
          >
            {bottomButtons?.map((button, index) => (
              <Box key={index} sx={button.style}>
                <Typography sx={{ fontSize: "12px", color: "white" }}>
                  {button?.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

const AddButton = ({ label, href }) => {
  const navigate = useNavigate();
  return (
    <Button
      style={{ ...activeButton, minWidth: "100px" }}
      sx={{ fontSize: { lg: "11px", xs: "11px" } }}
      onClick={() => navigate(href)}
    >
      {label}
    </Button>
  );
};

export default DynamicTable;
