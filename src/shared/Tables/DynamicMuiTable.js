import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
} from "@mui/material";

const DynamicMuiTable = ({
  columns = [],
  rows = [],
  getCellContent,
  rowHeight = "55px",
}) => {
  const columnCount = columns.length;
  const columnWidth = `${100 / columnCount}%`;

  return (
    <>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              px: "10px",
              color: "black",
              borderBottom: "0px",
            }}
          >
            {columns.map((label, index) => (
              <TableCell
                key={index}
                sx={{
                  width: columnWidth,
                  borderTop: "1px solid #dadce0",
                  borderBottom: "1px solid #dadce0",
                  textAlign: index === columns.length - 1 ? "right" : "left",
                }}
              >
                {index === 0 ? (
                  <span
                    style={{
                      fontSize: "12px",
                      marginLeft: "15px",
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </span>
                ) : (
                  <span style={{ fontSize: "12px", fontWeight: 600 }}>
                    {label}
                  </span>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      </Table>

      <Box sx={{ maxHeight: "73vh", overflowY: "scroll", bgcolor: "#fff" }}>
        <Table>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{ borderBottom: rowIndex > rows.length - 2 && "0px" }}
              >
                {columns.map((_, colIndex) => (
                  <TableCell
                    key={colIndex}
                    sx={{
                      width: columnWidth,
                      pl: colIndex === 0 ? "9px" : 0,
                      textAlign:
                        colIndex === columns.length - 1 ? "right" : "left",
                      height: rowHeight,
                    }}
                  >
                    {getCellContent
                      ? getCellContent(row, colIndex)
                      : row[colIndex]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
};

export default DynamicMuiTable;
