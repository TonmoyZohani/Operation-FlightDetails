import { Box, Button, Typography, Grid } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import PageTitle from "../common/PageTitle";

const styles = {
  root: {
    height: "calc(100vh - 250px)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  dataGrid: {
    flexGrow: 1,
  },
};

const inputStyle = {
  width: "100%",
  height: "37px",
  borderRadius: "4px",
  outline: "none",
  border: "1px solid #DEE0E4",
  paddingLeft: "15px",
};

// const buttonStyle = {
//   backgroundColor: "var(--primary-color)",
//   color: "white",
// };

const ReportDynamicTable = ({
  apiUrl,
  columns,
  title,
  tabs,
  buttons,
  bottomButtons,
}) => {
  const [userData, setUserData] = useState([]);
  // const navigate = useNavigate();

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
      });
  }, [apiUrl]);


  return (
    <Box>
      <PageTitle title={title} />

      {tabs?.length > 0 && (
        <Grid
          container
          sx={{
            bgcolor: "white",
            display: "flex",
            height: "60px",
            pt: "15px",
            justifyContent: "space-between",
            pr: "22px",
            pl: "25px",
          }}
        >
          <Grid
            container
            item
            lg={9.2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Grid item lg={3.8}>
              <Box sx={{ position: "relative" }}>
                <select
                  style={inputStyle}
                  // onChange={(e) => dispatch(setGender(e.target.value))}
                  // disabled={!phoneVerified}
                  // value={gender}
                >
                  <option value="">Select Trip Type</option>
                  <option value="oneway">Oneway</option>
                  <option value="roundway">Roundway</option>
                  <option value="multicity">Multi City</option>
                </select>
              </Box>
            </Grid>
            <Grid item lg={3.8}>
              <Box sx={{ position: "relative" }}>
                <input
                  type="text"
                  id="startdate"
                  name="startdate"
                  style={inputStyle}
                  placeholder="Start Date"
                  // onChange={(e) => dispatch(setFirstName(e.target.value))}
                  // readOnly={!phoneVerified}
                  required
                />
              </Box>
            </Grid>
            <Grid item lg={3.8}>
              <Box sx={{ position: "relative" }}>
                <input
                  type="text"
                  id="enddate"
                  name="enddate"
                  style={inputStyle}
                  placeholder="End Date"
                  // onChange={(e) => dispatch(setFirstName(e.target.value))}
                  // readOnly={!phoneVerified}
                  required
                />
              </Box>
            </Grid>
          </Grid>

          <Grid container item lg={2.8} sx={{ textAlign: "right" }}>
            {buttons.map((button, index) => (
              <Grid item lg={6} key={index}>
                <Button style={button.style} onClick={button.onClick}>
                  {button.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}

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
            borderBottom: "1px solid #EEEEEE",
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
          ".MuiDataGrid-row": {
            borderBottom: "1px solid #EEEEEE",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: "#4D4B4B",
            background: "#EFF2F5",
            fontSize: "12px",
            mb: 1.5,
          },
          ".MuiDataGrid-columnHeaderDraggableContainer .MuiSvgIcon-root": {
            color: "var(--white)",
          },
          ".MuiTablePagination-selectLabel": {
            color: "var(--white)",
          },
          ".MuiSelect-select": {
            color: "var(--white)",
          },
          ".css-levciy-MuiTablePagination-displayedRows": {
            color: "var(--white)",
          },
          ".MuiDataGrid-cellContent": {
            color: "var(--text-color)",
          },
          ".css-i4bv87-MuiSvgIcon-root": {
            display: "none !important",
          },
          bgcolor: "white",
          pt: "15px",
          px: "22px",
        }}
      >
        <DataGrid
          rows={userData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          scrollbarSize={5}
          style={styles.dataGrid}
        />

        {bottomButtons?.length > 0 && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              pb: "15px",
            }}
          >
            {bottomButtons.map((button, index) => (
              <Box key={index} sx={button.style}>
                <Typography sx={{ fontSize: "12px", color: "white" }}>
                  {button.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReportDynamicTable;
