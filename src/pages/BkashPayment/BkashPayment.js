import { Box, keyframes, Typography } from "@mui/material";
import Logo from "../../images/svg/logoblack.svg";
import DownArrow from "../../images/downArrow.jpg";
import { useAuth } from "../../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const bounceArrow = keyframes`
  0% { transform: translateY(0); opacity: 0.2; }
  50% { transform: translateY(15px); opacity: 1; }
  100% { transform: translateY(30px); opacity: 0.2; }
`;

const BkashPayment = () => {
  const navigate = useNavigate();
  const { jsonHeader } = useAuth();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const paymentID = queryParams.get("paymentID");
  const status = queryParams.get("status");
  const bookingId = queryParams.get("bookingId");
  const type = queryParams.get("type");

  const { data: paymentData, status: paymentApiStatus } = useQuery({
    queryKey: ["bkash-payment/execute"],
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/bkash-payment/execute`,
        { paymentID, bookingId: bookingId || null },
        jsonHeader()
      );
      return data;
    },

    retry: false,
    enabled: status === "success",
  });

  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (type === "payment") {
          navigate(`/dashboard/booking/airtickets/all/${bookingId}`);
        } else {
          navigate("/dashboard/deposits/all");
        }
      },
      status === "success" && paymentApiStatus === "success" ? 1000 : 2000
    );

    return () => clearTimeout(timer);
  }, [navigate, paymentApiStatus]);

  return (
    <Box
      sx={{
        bgcolor: "white",
        width: { xs: "90%", lg: "100%" },
        mx: "auto",
        mt: { xs: 5, lg: 0 },
        borderRadius: "0px 0px 5px 5px",
        px: { lg: "22px", xs: "0" },
        py: { lg: "25px" },
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "70px",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Typography sx={{ fontWeight: "500", pt: 3 }}>
          You are almost there!
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "100px" }}>
          <img
            src="https://storage.googleapis.com/flyfar-user-document-bucket/Group_9417.png"
            alt=""
            style={{ width: "120px" }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              animation: `${bounceArrow} 1.5s infinite ease-in-out`,
            }}
          >
            <img src={DownArrow} alt="" style={{ height: "60px" }} />
          </Box>
          <img src={Logo} alt="" style={{ width: "120px" }} />
        </Box>

        <Typography
          sx={{
            textAlign: "center",
            fontSize: "14px",
            color: "var(--mate-black)",
          }}
        >
          You Will be Redirected to{" "}
          <span style={{ fontWeight: "500" }}>Fly Far International</span>{" "}
          Platfrom <br /> where you can make your operations
        </Typography>
      </Box>
    </Box>
  );
};

export default BkashPayment;
