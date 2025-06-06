import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ReactComponent as SofaIcon } from "../../../images/svg/sofa.svg";

const HotelSelectTable = () => {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow
            sx={{
              bgcolor: "var(--secondary-color)",
              color: "white",
            }}
          >
            <TableCell
              sx={{
                color: "white",
                py: "4.8px",
                fontWeight: 600,
                pl: 1.5,
                width: "25%",
                fontSize: "13px",
              }}
            >
              Room
            </TableCell>
            <TableCell
              sx={{
                width: "16%",
                color: "white",
                py: "4.8px",
                fontSize: "13px",
              }}
            >
              Meal
            </TableCell>
            <TableCell
              sx={{
                width: "16%",
                color: "white",
                py: "4.8px",
                fontSize: "13px",
              }}
            >
              Cancellation
            </TableCell>
            <TableCell
              sx={{
                width: "16%",
                color: "white",
                py: "4.8px",
                fontSize: "13px",
              }}
            >
              Net Price
            </TableCell>
            <TableCell
              sx={{
                width: "16%",
                color: "white",
                py: "4.8px",
                fontSize: "13px",
              }}
            >
              Payment Type
            </TableCell>
            <TableCell
              align="center"
              sx={{
                width: "14%",
                color: "white",
                py: "4.8px",
                fontSize: "13px",
              }}
            >
              Select
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            sx={{
              mb: 1,
            }}
          >
            <TableCell
              component="th"
              scope="row"
              sx={{
                bgcolor: "white",
                py: "4.8px",
                pl: 1.5,
                width: "22%",
                fontSize: "13px",
                border: "1px solid #F8F8F8",
              }}
            >
              <Box>
                <SofaIcon />
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "var(--text-color)",
                    fontWeight: 400,
                  }}
                >
                  Deluxe Double or Twin Room (2 Twin Beds)
                </Typography>
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "var(--primary-color)",
                    fontWeight: 400,
                  }}
                >
                  Bed type not guaranteed
                </Typography>
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "var(--text-color)",
                    fontWeight: 400,
                  }}
                >
                  Non - Smoking
                </Typography>
              </Box>
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              sx={{
                bgcolor: "white",
                width: "16%",
                border: "1px solid #F8F8F8",
              }}
            >
              <Typography sx={{ fontWeight: 400, fontSize: "11px" }}>
                Meals are not Included
              </Typography>
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              sx={{
                bgcolor: "white",
                width: "16%",
                border: "1px solid #F8F8F8",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "var(--primary-color)",
                    fontWeight: 400,
                  }}
                >
                  BDT 0
                </Typography>
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "var(--text-color)",
                    fontWeight: 400,
                  }}
                >
                  until 11th April 2023
                </Typography>
              </Box>
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              sx={{
                bgcolor: "white",
                width: "16%",
                border: "1px solid #F8F8F8",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "var(--primary-color)",
                    fontWeight: 400,
                  }}
                >
                  BDT 309,267
                </Typography>
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "var(--text-color)",
                    fontWeight: 400,
                  }}
                >
                  On the spot: EUR 126
                </Typography>
              </Box>
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              sx={{
                bgcolor: "white",
                width: "16%",
                border: "1px solid #F8F8F8",
              }}
            >
              <Typography
                sx={{ fontWeight: 400, fontSize: "11px", textAlign: "center" }}
              >
                By wire transfer or by card
              </Typography>
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              align="center"
              sx={{
                bgcolor: "white",
                width: "14%",
                border: "1px solid #F8F8F8",
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text-color)",
                }}
              >
                <Button
                  sx={{
                    bgcolor: "var(--primary-color)",
                    px: 3,
                    color: "white",
                    "&:hover": {
                      bgcolor: "var(--primary-color)",
                    },
                  }}
                  size="small"
                >
                  Choose
                </Button>
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HotelSelectTable;
