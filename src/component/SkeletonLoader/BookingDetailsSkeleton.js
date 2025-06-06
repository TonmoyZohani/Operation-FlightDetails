import {
  Box,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import React from "react";

const tabItems = [1, 2, 3, 4, 5, 6];
const BookingDetailsSkeleton = () => {
  return (
    <Grid container sx={{ bgcolor: "white", p: 2, borderRadius: "4px" }}>
      <Grid item lg={12} mb={2}>
        <Skeleton
          className="skeleton"
          sx={{ borderRadius: "5px", marginBottom: "5px" }}
          variant="rectangular"
          width={"30%"}
          height={"30px"}
        />
      </Grid>
      <Grid item lg={12}>
        <Skeleton
          className="skeleton"
          sx={{ borderRadius: "5px", marginBottom: "5px" }}
          variant="rectangular"
          width={"100%"}
          height={"30px"}
        />
      </Grid>
      <Grid item xs={12}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableBody>
            {[...new Array(6)].map((_, i, arr) => {
              return (
                <TableRow
                  key={i}
                  sx={{
                    borderBottom: arr.length - 1 > arr.length && "1px solid",
                    borderColor: "var(--border)",
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  {[...new Array(2)].map((_, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        width: index === 0 ? "30%" : "70%",
                        py: 0.5,
                        px: 0,
                      }}
                    >
                      <Skeleton
                        className="skeleton"
                        sx={{ borderRadius: "2px" }}
                        variant="rectangular"
                        width={index === 0 ? "50%" : "30%"}
                        height={"25px"}
                        animation="wave"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Grid>
      <Grid item lg={12} mt={2}>
        <Skeleton
          className="skeleton"
          sx={{ borderRadius: "5px", marginBottom: "5px" }}
          variant="rectangular"
          width={"100%"}
          height={"30px"}
        />
      </Grid>
      <Grid item lg={12} mt={2}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            py: "7px",
            borderTop: "1px solid #E9E9E9",
            borderBottom: "1px solid #E9E9E9",
          }}
        >
          <Box
            sx={{
              display: "flex",
            }}
          >
            {tabItems.map((tab, index) => (
              <Box key={index} sx={{ mr: 2 }}>
                <Skeleton
                  className="skeleton"
                  sx={{ borderRadius: "2px" }}
                  variant="rectangular"
                  width={"100px"}
                  height={"30px"}
                  animation="wave"
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default BookingDetailsSkeleton;
