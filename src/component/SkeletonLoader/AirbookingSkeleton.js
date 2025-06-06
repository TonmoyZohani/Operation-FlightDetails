import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import useWindowSize from "../../shared/common/useWindowSize";

const AirbookingSkeleton = () => {
  const { isMobile } = useWindowSize();
  const tabItems = isMobile ? [1, 2, 3] : [1, 2, 3, 4, 5, 6];

  return (
    <Box sx={{ py: "0.5rem", bgcolor: "white", borderRadius: "4px" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          px: "18px",
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
          {tabItems.map((_, index) => (
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
      <Box sx={{ p: "1.1rem" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          {[...new Array(4)].map((_, index) => (
            <TableContainer
              key={index}
              sx={{
                boxShadow: "none",
                borderRadius: "3px",
                border: "1px solid var(--border)",
                overflowX: "hidden",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ pl: 1 }}>
                      <Skeleton
                        className="skeleton"
                        sx={{ borderRadius: "2px" }}
                        variant="rectangular"
                        width={"60px"}
                        height={"20px"}
                        animation="wave"
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        pr: 1,
                      }}
                    >
                      <Skeleton
                        className="skeleton"
                        // sx={{ borderRadius: "2px" }}
                        variant="circular"
                        width={"20px"}
                        height={"20px"}
                        animation="wave"
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {[...new Array(10)].map((_, index) => {
                    const randomWidth =
                      Math.floor(Math.random() * (120 - 50 + 1)) + 50;

                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell sx={{ pl: 1, width: "100%" }}>
                          <Skeleton
                            className="skeleton"
                            sx={{ borderRadius: "2px" }}
                            variant="rectangular"
                            width={randomWidth}
                            height={"20px"}
                            animation="wave"
                          />
                        </TableCell>
                        <TableCell sx={{ pl: 1, width: "100%" }}></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AirbookingSkeleton;
