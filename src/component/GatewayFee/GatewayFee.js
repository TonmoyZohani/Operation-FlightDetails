import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const GatewayFee = ({ data }) => {
  return (
    <Box
      sx={{
        " .MuiTableCell-root": { fontSize: "12px", px: 1, height: "30px" },
        py: 1,
      }}
    >
      <TableContainer sx={{ boxShadow: "none", borderRadius: "0px" }}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Amount</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Condition</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Gateway Fee</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            <TableRow>
              <TableCell sx={{ textTransform: "capitalize" }}>
                {data?.amount?.toLocaleString("en-IN")}
              </TableCell>
              <TableCell sx={{ textTransform: "capitalize" }}>
                Less than
              </TableCell>
              <TableCell sx={{ textTransform: "capitalize" }}>
                {data?.minGateWayCharge}%
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ textTransform: "capitalize" }}>
                {data?.amount?.toLocaleString("en-IN")}
              </TableCell>
              <TableCell sx={{ textTransform: "capitalize" }}>
                equal or greater than
              </TableCell>
              <TableCell sx={{ textTransform: "capitalize" }}>
                {data?.maxGateWayCharge}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GatewayFee;
