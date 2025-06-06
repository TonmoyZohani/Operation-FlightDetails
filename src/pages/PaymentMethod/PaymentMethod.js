import {
  Box,
  Container,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import NotFound from "../../component/NotFound/NoFound";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";

const PaymentMethod = () => {
  const { jsonHeader } = useAuth();
  // Deposit banks
  const { data, isLoading } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/admin/banks`, jsonHeader());
      return data?.data;
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <Box
      sx={{
        mx: {
          xs: "1rem",
        },
      }}
    >
      <Container>
        <Box
          sx={{
            minHeight: "50vh",
            mb: "10rem",
          }}
        >
          <Typography sx={style.header}>
            <span style={{ fontWeight: 100 }}>PAYMENTS </span> METHODS
          </Typography>

          {isLoading ? (
            <Box sx={{ width: "100%", height: "100%" }}>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </Box>
          ) : data ? (
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ borderTop: 1, borderColor: "#D3D3D3" }}>
                  <TableRow>
                    <TableCell align="left" sx={{ py: 1.2 }}>
                      Bank Name
                    </TableCell>
                    <TableCell align="left" sx={{ py: 1.2 }}>
                      Account
                    </TableCell>
                    <TableCell align="left" sx={{ py: 1.2 }}>
                      Account Number
                    </TableCell>
                    <TableCell align="left" sx={{ py: 1.2 }}>
                      Swift Code
                    </TableCell>
                    <TableCell align="left" sx={{ py: 1.2 }}>
                      Routing Number
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((bank) => (
                    <TableRow>
                      <TableCell align="left" sx={{ py: 1.2 }}>
                        {bank?.bankName}
                      </TableCell>
                      <TableCell align="left" sx={{ py: 1.2 }}>
                        {bank?.accountHolderName}
                      </TableCell>
                      <TableCell align="left" sx={{ py: 1.2 }}>
                        {bank?.accountNumber}
                      </TableCell>
                      <TableCell align="left" sx={{ py: 1.2 }}>
                        {bank?.swift}
                      </TableCell>
                      <TableCell align="left" sx={{ py: 1.2 }}>
                        {bank?.routingNumber}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {!data && (
                <Box
                  sx={{
                    minHeight: "60vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <NotFound />
                </Box>
              )}
            </TableContainer>
          ) : (
            <Box
              sx={{
                minHeight: "60vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <NotFound />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

const style = {
  card: {
    borderRadius: "10px",
    height: "180px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: {
      xs: "2rem",
      md: "3.125rem",
    },
    fontWeight: 500,
    lineHeight: "3.125rem",
    my: {
      xs: "2rem",
      md: "4rem",
    },
    color: "var(--black)",
  },
};

export default PaymentMethod;
