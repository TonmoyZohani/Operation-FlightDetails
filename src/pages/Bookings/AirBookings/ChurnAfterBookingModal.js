import {
  Box,
  Modal,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";

export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  width: "800px",
  borderRadius: "10px",
  p: 4,
};

const textStyle = {
  fontSize: "14px",
  color: "#5F6368",
};

export const actionBtnStyle = {
  borderRadius: "3px",
  fontSize: "13px",
  color: "#fff",
  padding: "10px 20px",
};

const ChurnAfterBookingModal = ({ open, onClose, churnData }) => {
  const navigate = useNavigate();

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle, p: 3 }}>
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 600,
            color: "var(--secondary-color)",
          }}
        >
          Churn Booking & ADM Alert
        </Typography>

        <Typography sx={{ fontSize: "16px", mt: 2.5, color: "#28282B" }}>
          {churnData?.message}.
        </Typography>
        <Typography
          sx={{ fontSize: "15px", my: "10px", color: "var(--primary-color)" }}
        >
          {churnData?.carrierMessage}.
        </Typography>

        {churnData?.churns.length !== 0 && (
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#D9D9D9", height: "40px" }}>
                  <TableCell>
                    <span
                      style={{
                        fontSize: "15px",
                        color: "#5F6368",
                        fontWeight: 500,
                      }}
                    >
                      Booked Id
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        fontSize: "15px",
                        color: "#5F6368",
                        fontWeight: 500,
                      }}
                    >
                      Airlines PNR
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        fontSize: "15px",
                        color: "#5F6368",
                        fontWeight: 500,
                      }}
                    >
                      Status
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        fontSize: "15px",
                        color: "#5F6368",
                        fontWeight: 500,
                      }}
                    >
                      Booked At
                    </span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {churnData?.churns?.map((row, idx) => (
                  <TableRow key={idx} sx={{ height: "40px" }}>
                    <TableCell>
                      <Typography
                        sx={{
                          ...textStyle,
                          cursor: "pointer",
                          bgcolor: "var(--input-bg)",
                          padding: "2px 10px",
                          width: "fit-content",
                          borderRadius: "3px",
                        }}
                        onClick={() =>
                          navigate(
                            `/dashboard/booking/airtickets/all/${row?.id}`
                          )
                        }
                      >
                        {row?.bookingId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={textStyle}>{row.airlinePnr}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={textStyle}>
                        {row.status?.toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={textStyle}>
                        {moment(row?.createdA).format("DD MMM, YYYY")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {churnData?.statusCode !== 403 && (
          <Typography
            sx={{
              color: "#5F6368",
              fontSize: {
                xs: "14px",
                md: "15px",
              },

              mt: 2,
            }}
          >
            Read Our{" "}
            <Link
              target="_blank"
              to="/terms-and-conditions"
              style={{ color: "#DC143C", textDecoration: "none" }}
            >
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link
              target="_blank"
              to={churnData?.rules?.admLink}
              style={{ color: "#DC143C", textDecoration: "none" }}
            >
              {churnData?.churns?.at(0)?.carrierName} ADM Policy
            </Link>
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default ChurnAfterBookingModal;
