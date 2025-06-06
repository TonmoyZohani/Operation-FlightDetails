import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Visa Duration", 159, 6.0, 24, 4.0),
  createData("In Days", 237, 9.0, 37, 4.3),
  createData("Processing", 262, 16.0, 24, 6.0),
  createData("Embassy Fee", 305, 3.7, 67, 4.3),
  createData("Agency Fee", 356, 16.0, 49, 3.9),
  createData("Visa", 356, 16.0, 49, 3.9),
  createData("Visa Tax", 356, 16.0, 49, 3.9),
];

const VisaFeeServiceChargeTable = () => {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
            <TableCell
              sx={{
                color: "#FFFFFF",
                py: "4.8px",
                pl: 7,
                bgcolor: "var(--secondary-color)",
                width: "25%",
                fontSize: "13px",
                borderBottom: "2px solid #fff",
              }}
            >
              Visa Type
            </TableCell>
            <TableCell
              align="right"
              sx={{
                color: "#FFFFFF",
                py: "4.8px",
                textAlign: "center",
                bgcolor: "var(--light-gray)",
                fontSize: "13px",
              }}
            >
              Single
            </TableCell>
            <TableCell
              align="right"
              sx={{
                color: "#FFFFFF",
                py: "4.8px",
                textAlign: "center",
                bgcolor: "var(--light-gray)",
                fontSize: "13px",
              }}
            >
              Double
            </TableCell>
            <TableCell
              align="right"
              sx={{
                color: "#FFFFFF",
                py: "4.8px",
                textAlign: "center",
                bgcolor: "var(--light-gray)",
                fontSize: "13px",
              }}
            >
              Multiple
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{
                // "&:last-child td, &:last-child th": { border: 0 },
                py: "4.8px",
                mb: 1,
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{
                  color: "#FFFFFF",
                  bgcolor: "var(--secondary-color)",
                  py: "4.8px",
                  pl: 7,
                  width: "25%",
                  fontSize: "13px",
                  borderBottom: "2px solid #fff",
                }}
              >
                {row.name}
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: "var(--secondary-color)",
                  py: "4.8px",
                  width: "25%",
                  textAlign: "center",
                  fontSize: "13px",
                }}
              >
                {row.calories}
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: "var(--secondary-color)",
                  py: "4.8px",
                  width: "25%",
                  textAlign: "center",
                  fontSize: "13px",
                }}
              >
                {row.fat}
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: "var(--secondary-color)",
                  py: "4.8px",
                  width: "25%",
                  textAlign: "center",
                  fontSize: "13px",
                }}
              >
                {row.carbs}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              sx={{
                color: "#FFFFFF",
                py: "4.8px",
                pl: 7,
                bgcolor: "var(--light-gray)",
                width: "25%",
                fontSize: "13px",
                borderBottom: "2px solid var(--text-light)",
              }}
            >
              Total Amount
            </TableCell>
            <TableCell
              align="right"
              sx={{
                color: "var(--secondary-color)",
                py: "4.8px",
                textAlign: "center",
                fontSize: "13px",
              }}
            >
              02
            </TableCell>
            <TableCell
              align="right"
              sx={{
                color: "var(--secondary-color)",
                py: "4.8px",
                textAlign: "center",
                fontSize: "13px",
              }}
            >
              01
            </TableCell>
            <TableCell
              align="right"
              sx={{
                color: "var(--secondary-color)",
                py: "4.8px",
                textAlign: "center",
                fontSize: "13px",
              }}
            >
              05
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default VisaFeeServiceChargeTable;
