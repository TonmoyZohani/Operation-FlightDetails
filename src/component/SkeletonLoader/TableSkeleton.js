import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@mui/material";
import React from "react";

const TableSkeleton = () => {
  return (
    <Box sx={{mx:"10px"}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pb: 2,
          p: "1rem",
        }}
      >
        <Box sx={{ display: "flex", gap: "15px", width: "20%" }}>
          {[...new Array(4)].map((_, index) => (
            <Skeleton
              key={index}
              className="skeleton"
              sx={{ borderRadius: "2px" }}
              variant="rectangular"
              width={"64px"}
              height={"31px"}
              animation="wave"
            />
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "15px",
            width: "20%",
            justifyContent: "end",
          }}
        >
          {[...new Array(3)].map((_, index) => (
            <Skeleton
              className="skeleton"
              key={index}
              sx={{ borderRadius: "2px" }}
              variant="rectangular"
              width={"70px"}
              height={"31px"}
              animation="wave"
            />
          ))}
        </Box>
      </Box>

      <Table sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow
            sx={{
              borderTop: "1px solid",
              borderBottom: "1px solid",
              borderColor: "var(--border)",
            }}
          >
            {[...new Array(10)].map((_, index) => (
              <TableCell
                key={index}
                sx={{ width: "100px", height: "30px", py: 1 }}
              >
                <Skeleton
                  className="skeleton"
                  sx={{ borderRadius: "2px" }}
                  variant="rectangular"
                  width={"100%"}
                  height={"30px"}
                  animation="wave"
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...new Array(9)].map((_, i, arr) => {
            return (
              <TableRow
                key={i}
                sx={{
                  borderBottom: arr.length - 1 > arr.length && "1px solid",
                  borderColor: "var(--border)",
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                {[...new Array(10)].map((_, index) => (
                  <TableCell
                    key={index}
                    sx={{ width: "100px", height: "30px", py: 1 }}
                  >
                    <Skeleton
                      className="skeleton"
                      sx={{ borderRadius: "2px" }}
                      variant="rectangular"
                      width={"100%"}
                      height={"30px"}
                      animation="wave"
                    />
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TableSkeleton;
